# ReportSaathi 🩺

> **Medical Disclaimer:** ReportSaathi is an educational tool only. It does not diagnose, treat, or replace professional medical advice. Always consult a qualified healthcare provider for clinical interpretation of your reports.

A privacy-first web application that converts medical lab reports (PDF / JPG / PNG) into plain-language educational summaries. Powered by Google Gemini AI + Tesseract OCR, with optional Supabase history and Telegram bot.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Environment Variables](#environment-variables)
5. [Running the App](#running-the-app)
6. [Test Commands](#test-commands)
7. [Architecture](#architecture)
8. [Database Schema](#database-schema)
9. [Telegram Bot](#telegram-bot)
10. [Troubleshooting](#troubleshooting)
11. [Known Limitations](#known-limitations)
12. [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, Lucide Icons |
| Backend | FastAPI (Python 3.11+), Uvicorn |
| OCR | Tesseract OCR (via pytesseract), PyMuPDF (PDF parsing) |
| AI Analysis | Google Gemini 3.5 Flash (grounded, hallucination-resistant) |
| Auth & DB | Supabase (optional — app runs in Demo Mode without it) |
| Messaging | Telegram Bot API (optional) |

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Python | 3.11+ | [python.org](https://www.python.org) |
| Tesseract OCR | 5.x | [Installation guide ↓](#tesseract-installation) |
| Gemini API Key | — | [Get one free](https://aistudio.google.com/app/apikey) |

### Tesseract Installation

**Windows:**
```powershell
# Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
# Default install path: C:\Program Files\Tesseract-OCR\tesseract.exe
# After install, set TESSERACT_CMD in backend/.env (see below)
```

**macOS:**
```bash
brew install tesseract
```

**Linux / Render:**
```bash
apt-get install -y tesseract-ocr
# Binary at: /usr/bin/tesseract
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/reportsaathi.git
cd reportsaathi
```

### 2. Backend setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy the example env file and fill in your values
cp .env.example .env
# Edit .env — at minimum set GEMINI_API_KEY (others are optional)
```

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL (default: http://127.0.0.1:8000)
```

---

## Environment Variables

> **Security rule:** Never commit real API keys. Use `.env` files (git-ignored). The `.env.example` files contain placeholder values only.

### Backend (`backend/.env`)

| Variable | Required | Description | Example placeholder |
|----------|----------|-------------|---------------------|
| `GEMINI_API_KEY` | ✅ Required | Google Gemini API key for AI analysis | `your_gemini_api_key_here` |
| `GEMINI_MODEL` | Optional | Gemini model name | `gemini-2.0-flash` |
| `TESSERACT_CMD` | Optional | Full path to Tesseract binary | `C:\Program Files\Tesseract-OCR\tesseract.exe` |
| `MAX_FILE_SIZE_MB` | Optional | Upload size limit (default: 15) | `15` |
| `ALLOWED_ORIGINS` | Optional | CORS origins (comma-separated) | `http://localhost:5173,https://your-app.pages.dev` |
| `SUPABASE_URL` | Optional | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | Optional | Supabase service role key | `your_supabase_service_role_key` |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot token from @BotFather | `123456789:ABCdef...` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example placeholder |
|----------|----------|-------------|---------------------|
| `VITE_API_URL` | ✅ Required | Backend API base URL | `http://127.0.0.1:8000` |
| `VITE_SUPABASE_URL` | Optional | Supabase project URL (same as backend) | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anonymous/public key | `your_supabase_anon_key` |

> **Note:** `VITE_` variables are embedded at build time by Vite. If you change `VITE_API_URL` after building, you must rebuild the frontend.

---

## Running the App

### Start the backend

```powershell
# Windows PowerShell — from the repo root
Set-Location backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

```bash
# macOS / Linux
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend runs at: **http://127.0.0.1:8000**
API docs (Swagger): **http://127.0.0.1:8000/docs**
Health check: **http://127.0.0.1:8000/api/health**

### Start the frontend

```powershell
# Windows PowerShell — if `node` is not on PATH
$env:Path = "C:\Program Files\nodejs;" + $env:Path
Set-Location frontend
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173
```

```bash
# macOS / Linux
cd frontend
npm run dev
```

Frontend runs at: **http://127.0.0.1:5173**

> The app works in **Demo Mode** when Supabase credentials are absent — uploads are analyzed but no history is saved. This is the default for new setups.

---

## Test Commands

### Backend QA suite (11 automated tests)

```powershell
# Windows PowerShell
Set-Location backend
python test_qa_suite.py
```

Expected output: `Ran 11 tests ... OK`

The suite covers:
- Health check and service availability
- Upload format validation (PDF / JPG / PNG only)
- Empty file rejection (HTTP 400)
- Oversized file rejection (HTTP 413)
- Blank image OCR failure (HTTP 422)
- Sample report endpoint schema validation
- Torn/unclear report detection (`is_report_clear: false`)
- Chat grounding (supported question → uses report data)
- Chat grounding (unsupported question → redirects to clinician)
- Chat refusal to diagnose or prescribe
- Supabase demo mode and RLS access control safety

### Frontend lint (zero warnings required)

```powershell
Set-Location frontend
npx oxlint
```

Expected: `Found 0 warnings and 0 errors.`

### Frontend production build

```powershell
Set-Location frontend
node node_modules/vite/bin/vite.js build
```

Expected: `✓ built in <Xs>` with no errors.

### Telegram bot

```powershell
Set-Location backend
python telegram_bot.py
```

The bot uses long-polling. Set `TELEGRAM_BOT_TOKEN` in `backend/.env` before running.

---

## Architecture

```
reportsaathi/
├── frontend/               # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # AuthModal (Supabase auth)
│   │   │   ├── careplus/   # CarePlus Medical design system
│   │   │   ├── chat/       # ReportChat (report-grounded Q&A)
│   │   │   ├── common/     # Navbar, Footer
│   │   │   ├── dashboard/  # Main app dashboard
│   │   │   ├── history/    # ReportHistory (saved reports)
│   │   │   ├── landing/    # LandingPage
│   │   │   ├── report/     # ReportResults viewer
│   │   │   ├── samples/    # SampleLibrary
│   │   │   └── states/     # Empty / Error states
│   │   └── services/
│   │       └── supabase.js # Supabase client (optional)
│   └── public/
│       └── _redirects      # SPA routing for Cloudflare Pages
│
├── backend/                # FastAPI + Python
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── health.py   # GET /api/health
│   │   │   ├── reports.py  # POST /api/reports/analyze, /save, /history
│   │   │   └── chat.py     # POST /api/chat/ask
│   │   ├── services/
│   │   │   ├── gemini_service.py   # Gemini AI analysis + fallback
│   │   │   ├── ocr_service.py      # Tesseract OCR
│   │   │   ├── pdf_service.py      # PyMuPDF text extraction
│   │   │   └── supabase_service.py # Optional DB operations
│   │   ├── schemas/
│   │   │   ├── report.py   # Pydantic models for reports
│   │   │   └── chat.py     # Pydantic models for chat
│   │   └── core/
│   │       └── config.py   # Settings from environment variables
│   ├── supabase_schema.sql # Database schema (apply in Supabase)
│   ├── telegram_bot.py     # Optional Telegram bot
│   ├── test_qa_suite.py    # Automated QA test suite
│   ├── render-build.sh     # Render.com build script (installs Tesseract)
│   ├── .env.example        # Template — copy to .env and fill in values
│   └── requirements.txt
│
└── README.md
```

**Request flow:**
```
User uploads PDF/JPG/PNG
  → Frontend (React)
  → POST /api/reports/analyze (FastAPI)
  → OCR Service (Tesseract / PyMuPDF)
  → Gemini Service (Gemini AI → grounded JSON)
  → Response with AnalyzeReportResponse
  → Frontend renders ReportResults + ReportChat
  → (Optional) POST /api/reports/save → Supabase
```

---

## Database Schema

Apply the schema in your Supabase SQL Editor (`backend/supabase_schema.sql`):

1. Go to [supabase.com](https://supabase.com) → your project → SQL Editor
2. Open `backend/supabase_schema.sql` and paste its contents
3. Click **Run**

The schema creates:
- `user_profiles` — display name and preferences per authenticated user
- `saved_reports` — structured educational analysis (never raw files or extracted text)

Row Level Security (RLS) is enforced: each user can only access their own rows.

> **Privacy rule:** Raw uploaded files and OCR-extracted medical text are **never** stored in the database. Only the structured educational analysis (report type, plain-language summary, metric names/values) is stored, and only when the user explicitly opts in.

---

## Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot: `/newbot` → follow prompts → copy the token
3. Add `TELEGRAM_BOT_TOKEN=<your_token>` to `backend/.env`
4. Start the bot: `python backend/telegram_bot.py`

**Supported commands:**
- `/start` — Welcome message and instructions
- `/help` — Usage guide
- Send a PDF, JPG, or PNG → receive an educational summary with medical disclaimer

**Safety rules (same as web app):**
- Accepts only PDF, JPG, PNG (max 15 MB)
- Applies identical validation and Gemini analysis
- Returns short educational summary with medical disclaimer
- Never diagnoses or recommends treatment
- Bot token is kept server-side only (never logged or exposed)
- Report contents are never logged

---

## Troubleshooting

### `node: command not found` (Windows)

```powershell
# Prefix every npm/node command with:
$env:Path = "C:\Program Files\nodejs;" + $env:Path
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173
```

### `venv` creation blocked

If `python -m venv` is blocked by Windows AppControl policy, install packages to system Python directly:

```powershell
pip install -r requirements.txt
```

### Gemini 503 UNAVAILABLE

The backend automatically falls back to a **grounded regex-based analysis** (no AI hallucination). Results are less detailed but still grounded in the extracted report text. The 503 error is transient — retry after a few seconds.

### Tesseract not found

Set the full path in `backend/.env`:

```env
# Windows example
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe

# macOS (Homebrew)
TESSERACT_CMD=/usr/local/bin/tesseract

# Linux / Render
TESSERACT_CMD=/usr/bin/tesseract
```

### Supabase `WinError 10054` (connection forcibly closed)

This means Supabase is configured in `.env` but the host is unreachable from your network. The app degrades gracefully — history returns an empty list with an error message. No data is lost. Check your internet connection or Supabase project status.

### Frontend shows stale API URL

`VITE_` variables are baked into the build. After changing `VITE_API_URL`, rebuild:

```bash
node node_modules/vite/bin/vite.js build
```

---

## Known Limitations

| # | Limitation | Impact |
|---|-----------|--------|
| 1 | Tesseract OCR on Render requires a build script (`render-build.sh`) — not standard on default Python instances | Deployment extra step |
| 2 | Gemini AI has ~28s latency per analysis in some regions | Upload + analyze can take up to 40s |
| 3 | Gemini 503 UNAVAILABLE during peak demand triggers grounded fallback (less detailed) | Reduced analysis quality |
| 4 | No background job queue — large uploads block the request thread | Single request at a time per worker |
| 5 | Telegram bot uses long-polling — not suitable for high traffic | Use webhooks for production scale |
| 6 | Mobile layout is CSS-tested but not device-tested | Minor layout edge cases possible |
| 7 | No rate limiting on backend endpoints | Could be abused without a reverse proxy (e.g. Cloudflare) |
| 8 | `VITE_` env vars embedded at build time | Changing API URL requires rebuild and redeploy |
| 9 | Supabase Telegram bot integration is not implemented — bot uses analysis only, no history saved from bot | Bot is stateless |

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions for:
- **Frontend** → Cloudflare Pages
- **Backend** → Render

> **Important:** As of this writing, cloud deployment has **not** been completed. The instructions in DEPLOYMENT.md describe the correct configuration steps. Actual deployment requires a connected GitHub repository and valid credentials.
