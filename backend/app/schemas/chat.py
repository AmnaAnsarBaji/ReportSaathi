from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")

class ReportChatRequest(BaseModel):
    message: str = Field(..., description="User's question about the report")
    report_context: Dict[str, Any] = Field(..., description="Currently selected report analysis data")
    history: List[ChatMessage] = Field(default_factory=list, description="Prior conversation history")

class ReportChatResponse(BaseModel):
    reply: str = Field(..., description="Assistant answer strictly grounded in report")
    is_supported_by_report: bool = Field(True, description="False if question asks about info not in report")
    disclaimer: str = Field(
        "ReportSaathi provides educational explanations only. It does not provide medical diagnoses or treatment recommendations. Always consult a qualified healthcare professional.",
        description="Standard educational disclaimer"
    )
