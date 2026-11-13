import os
import tempfile
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.core.config import settings
from app.schemas.report import ReportAnalysis, AnalyzeReportResponse, SaveReportRequest, SavedReportItem
from app.services.ocr_service import ocr_service
from app.services.pdf_service import pdf_service
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}

@router.post("/analyze", response_model=AnalyzeReportResponse)
async def analyze_report(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    """
    POST /api/reports/analyze:
    Accepts PDF, JPG, or PNG uploads.
    Validates file format and size (<15MB), executes safe temporary file handling,
    extracts text via direct PDF parsing or Tesseract OCR, and returns grounded structured JSON.
    """
    filename = file.filename or "uploaded_report"
    ext = os.path.splitext(filename)[1].lower()

    # 1. Format validation
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. ReportSaathi accepts PDF, JPG, and PNG files only."
        )

    # 2. Read bytes & validate size
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty. Please upload a valid document."
        )

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        size_mb = len(file_bytes) / (1024 * 1024)
        raise HTTPException(
            status_code=getattr(status, "HTTP_413_CONTENT_TOO_LARGE", 413),
            detail=f"File size ({size_mb:.1f} MB) exceeds maximum permitted limit of {settings.MAX_FILE_SIZE_MB} MB."
        )

    extracted_text = ""
    extraction_method = "digital_pdf"
    page_count = 1

    # 3. Safe temporary file handling for OCR or PDF extraction
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_path = temp_file.name

    try:
        temp_file.write(file_bytes)
        temp_file.flush()
        temp_file.close()

        if ext == ".pdf":
            extracted_text, extraction_method, page_count = pdf_service.extract_text_from_pdf(file_bytes)
        else:
            extracted_text = ocr_service.extract_text_from_image(temp_path)
            extraction_method = "ocr_image"

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error processing document: {str(e)}"
        )
    finally:
        # Guarantee temporary file cleanup
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                pass

    # 4. Check for empty or unreadable OCR / text output
    cleaned_check = "".join(ch for ch in extracted_text if ch.isalnum())
    if len(cleaned_check) < 15:
        raise HTTPException(
            status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
            detail=(
                "Could not extract readable text from this document. "
                "The image may be blank, out of focus, or heavily shadowed. "
                "Please upload a clear, well-lit photo or digital PDF."
            )
        )

    # 5. Grounded analysis via Gemini
    analysis = gemini_service.analyze_report(extracted_text)

    # Note: Privacy-first design: Uploaded files and raw medical text are NEVER
    # saved automatically to any database. Users choose explicitly whether to save.

    return AnalyzeReportResponse(
        status="success",
        filename=filename,
        file_type=ext.lstrip("."),
        file_size_bytes=len(file_bytes),
        extraction_method=extraction_method,
        page_count=page_count,
        character_count=len(extracted_text),
        extracted_text=extracted_text,
        analysis=analysis
    )

@router.get("/sample", response_model=AnalyzeReportResponse)
async def get_sample_report(report_type: str = "cbc"):
    """Provides instant structured sample data for rapid testing."""
    sample_text = (
        "COMPLETE BLOOD COUNT (CBC) REPORT\n"
        "Patient ID: REF-49102\n"
        "Hemoglobin: 13.8 g/dL (Reference: 13.0 - 17.0)\n"
        "Packed Cell Volume (Hematocrit): 42.5 % (Reference: 38.0 - 50.0)\n"
        "WBC Count: 7,200 /mcL (Reference: 4,500 - 11,000)\n"
        "Platelet Count: 240,000 /mcL (Reference: 150,000 - 450,000)\n"
        "Neutrophils: 60 % (Reference: 40 - 70)\n"
        "Lymphocytes: 30 % (Reference: 20 - 40)\n"
    )
    if report_type.lower() == "lipid":
        sample_text = (
            "LIPID PANEL / CHOLESTEROL TEST\n"
            "Total Cholesterol: 218 mg/dL (Desirable: < 200)\n"
            "Triglycerides: 120 mg/dL (Normal: < 150)\n"
            "HDL Cholesterol: 52 mg/dL (Optimal: > 40)\n"
            "LDL Cholesterol: 142 mg/dL (Optimal: < 100)\n"
        )

    analysis = gemini_service.analyze_report(sample_text)
    return AnalyzeReportResponse(
        status="success",
        filename=f"sample_{report_type}.pdf",
        file_type="pdf",
        file_size_bytes=len(sample_text.encode('utf-8')),
        extraction_method="digital_pdf",
        page_count=1,
        character_count=len(sample_text),
        extracted_text=sample_text,
        analysis=analysis
    )

@router.post("/save")
async def save_report(payload: SaveReportRequest):
    """
    Opt-in save endpoint for authenticated users.
    PRIVACY RULES:
    - Never stores raw file bytes or raw medical text.
    - Stores only the structured educational analysis and findings.
    - If Supabase is unconfigured, returns 503 so the app cleanly falls back to Demo Mode.
    """
    if not supabase_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase credentials are not configured. ReportSaathi is running in local Demo Mode."
        )

    try:
        saved_record = await supabase_service.save_report(
            user_id=payload.user_id,
            title=payload.title,
            report_data=payload.report_data
        )
        if not saved_record:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save report record in database."
            )
        return {
            "status": "success",
            "message": "Report analysis saved to your private history.",
            "record": saved_record
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving report: {str(e)}"
        )

@router.get("/history")
async def get_report_history(user_id: str):
    """
    Retrieves saved educational report summaries for the specified authenticated user.
    """
    if not supabase_service.is_configured():
        return {
            "configured": False,
            "demo_mode": True,
            "reports": [],
            "message": "Supabase credentials are not configured. Running in Demo Mode without cloud persistence."
        }

    try:
        reports = await supabase_service.get_user_reports(user_id)
        return {
            "configured": True,
            "demo_mode": False,
            "reports": reports
        }
    except Exception as e:
        # Degrade gracefully for any DB error (network, UUID validation, RLS, etc.)
        # Never return 500 for history — an empty list is always a safe response.
        error_msg = str(e)
        print(f"[history] Non-fatal error fetching reports for user={user_id}: {error_msg}")
        return {
            "configured": True,
            "demo_mode": False,
            "reports": [],
            "error": "Could not retrieve history at this time. Please try again shortly."
        }

@router.delete("/history/{report_id}")
async def delete_saved_report(report_id: str, user_id: str):
    """
    Permanently deletes a saved report record from the user's history.
    """
    if not supabase_service.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase credentials are not configured."
        )

    try:
        success = await supabase_service.delete_report(user_id=user_id, report_id=report_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found or not authorized to delete."
            )
        return {"status": "success", "message": "Report deleted permanently."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting report: {str(e)}"
        )
