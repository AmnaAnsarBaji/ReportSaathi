from typing import Optional, List, Dict, Any
from app.core.config import settings

class SupabaseService:
    def __init__(self):
        self.client = None
        self._initialize()

    def _initialize(self):
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-supabase" not in settings.SUPABASE_URL:
            try:
                from supabase import create_client
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[SupabaseService] Initialization warning: {e}")
                self.client = None
        else:
            self.client = None

    def is_configured(self) -> bool:
        """Returns True only if Supabase credentials are validly populated."""
        return self.client is not None

    async def save_report(
        self,
        user_id: str,
        title: str,
        report_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Saves an opt-in structured report to `saved_reports`.
        PRIVACY NOTICE: Uploaded files and raw extracted medical text are NEVER stored.
        """
        if not self.is_configured():
            return None
        try:
            record = {
                "user_id": user_id,
                "title": title or report_data.get("report_type", "Lab Report"),
                "report_type": report_data.get("report_type", "General Lab Report"),
                "overall_status": report_data.get("overall_status", "normal"),
                "summary": report_data.get("summary", ""),
                "key_findings": report_data.get("key_findings", []),
                "metrics": report_data.get("metrics", []),
                "questions_for_doctor": report_data.get("questions_for_doctor", []),
                "glossary": report_data.get("glossary", [])
            }
            res = self.client.table("saved_reports").insert(record).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
            return None
        except Exception as e:
            print(f"[SupabaseService] save_report error: {e}")
            raise e

    async def get_user_reports(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve historical reports strictly belonging to user_id."""
        if not self.is_configured():
            return []
        try:
            res = (
                self.client.table("saved_reports")
                .select("id, title, report_type, overall_status, summary, key_findings, metrics, questions_for_doctor, glossary, created_at")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return res.data or []
        except (OSError, ConnectionError, ConnectionResetError) as e:
            print(f"[SupabaseService] get_user_reports network error (non-fatal): {e}")
            raise ConnectionError(str(e))
        except Exception as e:
            print(f"[SupabaseService] get_user_reports error: {e}")
            raise e

    async def delete_report(self, user_id: str, report_id: str) -> bool:
        """Deletes a saved report ensuring user_id matches."""
        if not self.is_configured():
            return False
        try:
            res = (
                self.client.table("saved_reports")
                .delete()
                .eq("id", report_id)
                .eq("user_id", user_id)
                .execute()
            )
            return len(res.data) > 0 if res.data else True
        except Exception as e:
            print(f"[SupabaseService] delete_report error: {e}")
            raise e

supabase_service = SupabaseService()
