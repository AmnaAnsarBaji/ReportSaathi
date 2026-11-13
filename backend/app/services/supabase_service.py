from typing import Optional, List, Dict, Any
from app.core.config import settings

class SupabaseService:
    def __init__(self):
        self.client = None
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception:
                self.client = None

    def is_configured(self) -> bool:
        return self.client is not None

    async def save_report(self, user_id: Optional[str], filename: str, report_data: Dict[str, Any]) -> Optional[str]:
        """Save report analysis to Supabase if configured."""
        if not self.client:
            return None
        try:
            record = {
                "user_id": user_id,
                "filename": filename,
                "report_type": report_data.get("report_type"),
                "overall_status": report_data.get("overall_status"),
                "summary": report_data.get("summary"),
                "payload": report_data,
            }
            res = self.client.table("reports").insert(record).execute()
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
            return None
        except Exception:
            return None

    async def get_user_reports(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve historical reports for a logged in user."""
        if not self.client:
            return []
        try:
            res = self.client.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return res.data or []
        except Exception:
            return []

supabase_service = SupabaseService()
