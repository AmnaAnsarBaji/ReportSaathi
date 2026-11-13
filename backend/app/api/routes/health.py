import datetime
import tempfile
from fastapi import APIRouter
from app.core.config import settings
from app.services.ocr_service import ocr_service
from app.services.supabase_service import supabase_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "services": {
            "ocr_tesseract": {
                "available": ocr_service.is_available(),
                "version": ocr_service.get_version(),
                "binary_path": settings.TESSERACT_CMD
            },
            "gemini_ai": {
                "configured": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip()),
                "model": settings.GEMINI_MODEL
            },
            "supabase": {
                "configured": supabase_service.is_configured()
            }
        },
        "limits": {
            "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
            "allowed_formats": [".pdf", ".jpg", ".jpeg", ".png"]
        },
        "system": {
            "safe_temp_dir": tempfile.gettempdir()
        }
    }
