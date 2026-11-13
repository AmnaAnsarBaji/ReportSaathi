from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ReportChatRequest, ReportChatResponse
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/ask", response_model=ReportChatResponse)
async def ask_report_question(payload: ReportChatRequest):
    """
    POST /api/chat/ask
    Answers questions strictly grounded in the currently selected report's extracted information.
    Rules:
    - Never diagnoses or prescribes treatments.
    - If question is not supported by report, responds that the info is unavailable
      and advises consulting a qualified healthcare professional.
    - Strictly educational.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question message cannot be empty."
        )

    if not payload.report_context:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid report context must be provided to ask questions."
        )

    try:
        history_list = [h.model_dump() for h in payload.history] if payload.history else []
        result = gemini_service.answer_report_question(
            question=payload.message.strip(),
            report_context=payload.report_context,
            history=history_list
        )
        return ReportChatResponse(
            reply=result.get("reply", "Information unavailable in report. Please consult a qualified clinician."),
            is_supported_by_report=bool(result.get("is_supported_by_report", True))
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating response: {str(e)}"
        )
