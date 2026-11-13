"""
ReportSaathi Telegram Bot
Provides educational medical report explanations via the Telegram Bot API.

SAFETY & PRIVACY CONSTRAINTS:
1. Token stored on backend in environment variable (TELEGRAM_BOT_TOKEN).
2. Never logs sensitive report contents, user documents, or full bot tokens.
3. Accepts ONLY supported file types (.pdf, .jpg, .jpeg, .png).
4. Strictly applies the same 15 MB size limit and validation as the web app.
5. Returns plain-language educational summaries with the mandatory medical disclaimer.
6. Zero diagnosis, zero treatment prescriptions.
"""

import os
import sys
import asyncio
import tempfile
import httpx
from typing import Optional

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.config import settings
from app.services.pdf_service import pdf_service
from app.services.ocr_service import ocr_service
from app.services.gemini_service import gemini_service

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024

DISCLAIMER_TEXT = (
    "\n\n━━━━━━━━━━━━━━━━━━━━━━\n"
    "⚠️ *EDUCATIONAL USE ONLY*\n"
    "ReportSaathi explains medical terminology to help you understand your results. "
    "It does NOT provide medical diagnosis or treatment advice. "
    "Always consult a qualified healthcare professional regarding your health."
)

def mask_token(token: str) -> str:
    """Masks bot token for safe logging without exposing credentials."""
    if not token or len(token) < 8:
        return "[UNSET]"
    return f"{token[:4]}...{token[-4:]}"

async def send_telegram_message(client: httpx.AsyncClient, token: str, chat_id: int, text: str, reply_to: Optional[int] = None):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
    }
    if reply_to:
        payload["reply_to_message_id"] = reply_to
    try:
        await client.post(url, json=payload, timeout=20.0)
    except Exception as e:
        print(f"[TelegramBot] Error sending message to chat {chat_id}: {type(e).__name__}")

async def process_document_or_photo(client: httpx.AsyncClient, token: str, chat_id: int, message_id: int, file_id: str, file_name: str, file_size: int):
    # 1. Format validation
    ext = os.path.splitext(file_name)[1].lower() if file_name else ""
    if ext not in ALLOWED_EXTENSIONS:
        await send_telegram_message(
            client, token, chat_id,
            f"❌ *Unsupported Format*: `{ext or 'unknown'}`\n\n"
            f"ReportSaathi accepts only *PDF, JPG, and PNG* medical laboratory documents.\n"
            f"Please upload a clear photo or digital PDF of your report.",
            reply_to=message_id
        )
        return

    # 2. File size validation
    if file_size and file_size > MAX_FILE_BYTES:
        size_mb = file_size / (1024 * 1024)
        await send_telegram_message(
            client, token, chat_id,
            f"❌ *File Too Large*: ({size_mb:.1f} MB)\n\n"
            f"The maximum allowed file size is {settings.MAX_FILE_SIZE_MB} MB. Please upload a smaller or compressed file.",
            reply_to=message_id
        )
        return

    # Notify user that extraction has started
    await send_telegram_message(
        client, token, chat_id,
        "🔍 *Reading and extracting your lab report...*\nPlease give me a moment to analyze your document.",
        reply_to=message_id
    )

    temp_path = None
    try:
        # Get file download URL from Telegram
        file_info_resp = await client.get(f"https://api.telegram.org/bot{token}/getFile?file_id={file_id}", timeout=25.0)
        file_info = file_info_resp.json()
        if not file_info.get("ok"):
            await send_telegram_message(client, token, chat_id, "❌ Could not retrieve file from Telegram servers. Please re-upload.", reply_to=message_id)
            return

        file_path_tg = file_info["result"]["file_path"]
        download_url = f"https://api.telegram.org/file/bot{token}/{file_path_tg}"

        # Download into safe temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        temp_path = temp_file.name
        temp_file.close()

        file_content_resp = await client.get(download_url, timeout=60.0)
        with open(temp_path, "wb") as f:
            f.write(file_content_resp.content)

        # 3. Extract text (PDF or OCR)
        extracted_text = ""
        if ext == ".pdf":
            extracted_text, _ = pdf_service.extract_text(temp_path)
            if not extracted_text.strip():
                extracted_text = pdf_service.ocr_scanned_pdf(temp_path)
        else:
            extracted_text = ocr_service.extract_text(temp_path)

        if not extracted_text.strip():
            await send_telegram_message(
                client, token, chat_id,
                "⚠️ *Unreadable Document*\n\n"
                "Could not extract readable text from this document. "
                "The image may be blank, blurry, or heavily shadowed. "
                "Please take a clear, well-lit photo or upload a digital PDF." + DISCLAIMER_TEXT,
                reply_to=message_id
            )
            return

        # 4. Analyze with Gemini
        analysis = gemini_service.analyze_report(extracted_text)

        # Format concise Telegram response
        status_emoji = "🟢" if analysis.overall_status == "normal" else "🟡"
        lines = [
            f"📋 *{analysis.report_type}*",
            f"{status_emoji} *Status*: {analysis.overall_status.replace('_', ' ').capitalize()}",
            "",
            f"*Summary*:\n{analysis.summary}",
            "",
            "🔬 *Key Biomarkers Extracted*:"
        ]

        for m in analysis.metrics[:6]:
            ref = f" (Ref: {m.standard_range})" if m.standard_range else ""
            lines.append(f"• *{m.name}*: `{m.value} {m.unit or ''}`{ref}")

        if analysis.is_report_clear is False:
            lines.append(f"\n⚠️ *Note*: {analysis.clarity_note or 'Document appears incomplete. Consult a clinician.'}")

        lines.append(DISCLAIMER_TEXT)
        final_message = "\n".join(lines)

        await send_telegram_message(client, token, chat_id, final_message, reply_to=message_id)

        # Safe logging: NO report contents or patient data logged
        print(f"[TelegramBot] Successfully processed report for chat_id={chat_id}, format={ext}")

    except Exception as e:
        print(f"[TelegramBot] Error processing file: {type(e).__name__}")
        await send_telegram_message(
            client, token, chat_id,
            "❌ An error occurred while analyzing this document. Please try again or visit the ReportSaathi web application." + DISCLAIMER_TEXT,
            reply_to=message_id
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass

async def handle_update(client: httpx.AsyncClient, token: str, update: dict):
    message = update.get("message")
    if not message:
        return

    chat_id = message["chat"]["id"]
    message_id = message["message_id"]

    # Text commands
    text = message.get("text", "").strip()
    if text.startswith("/start") or text.startswith("/help"):
        welcome = (
            "👋 *Welcome to ReportSaathi Bot!*\n\n"
            "I help you understand technical medical lab reports in simple, clear language.\n\n"
            "📤 *How to use*:\n"
            "Simply send me a photo (`.jpg`, `.png`) or a document (`.pdf`) of your laboratory results.\n\n"
            "🔒 *Privacy Guarantee*:\n"
            "Your files are processed securely in temporary volatile memory and never permanently stored."
            + DISCLAIMER_TEXT
        )
        await send_telegram_message(client, token, chat_id, welcome, reply_to=message_id)
        return

    # Check for document upload
    if "document" in message:
        doc = message["document"]
        file_id = doc["file_id"]
        file_name = doc.get("file_name", "document.pdf")
        file_size = doc.get("file_size", 0)
        await process_document_or_photo(client, token, chat_id, message_id, file_id, file_name, file_size)
        return

    # Check for photo upload (Telegram sends multiple sizes, pick highest resolution)
    if "photo" in message:
        photos = message["photo"]
        largest_photo = photos[-1]
        file_id = largest_photo["file_id"]
        file_size = largest_photo.get("file_size", 0)
        await process_document_or_photo(client, token, chat_id, message_id, file_id, "report_photo.jpg", file_size)
        return

    # Fallback text reply
    await send_telegram_message(
        client, token, chat_id,
        "Please send a medical lab report document (PDF) or photo (JPG/PNG) to receive an educational explanation." + DISCLAIMER_TEXT,
        reply_to=message_id
    )

async def run_bot():
    token = settings.TELEGRAM_BOT_TOKEN
    if not token or token.strip() == "" or token == "your-telegram-bot-token":
        print("[TelegramBot] TELEGRAM_BOT_TOKEN is not configured in backend/.env.")
        print("[TelegramBot] To run the bot: create a bot with @BotFather, add TELEGRAM_BOT_TOKEN=<token> to backend/.env, and run this script.")
        return

    print(f"[TelegramBot] Starting polling with token {mask_token(token)}...")
    offset = 0

    async with httpx.AsyncClient() as client:
        # Check bot identity
        try:
            me_resp = await client.get(f"https://api.telegram.org/bot{token}/getMe", timeout=15.0)
            me_data = me_resp.json()
            if not me_data.get("ok"):
                print(f"[TelegramBot] Authentication failed: {me_data.get('description')}")
                return
            bot_username = me_data["result"]["username"]
            print(f"[TelegramBot] Logged in as @{bot_username}. Ready to receive reports.")
        except Exception as e:
            print(f"[TelegramBot] Connection failed: {e}")
            return

        while True:
            try:
                updates_resp = await client.get(
                    f"https://api.telegram.org/bot{token}/getUpdates",
                    params={"offset": offset, "timeout": 20},
                    timeout=30.0
                )
                updates = updates_resp.json()
                if updates.get("ok"):
                    for update in updates.get("result", []):
                        offset = update["update_id"] + 1
                        asyncio.create_task(handle_update(client, token, update))
            except (httpx.TimeoutException, httpx.NetworkError):
                await asyncio.sleep(2)
            except Exception as e:
                print(f"[TelegramBot] Polling loop exception: {type(e).__name__}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    try:
        asyncio.run(run_bot())
    except KeyboardInterrupt:
        print("[TelegramBot] Stopped by user.")
