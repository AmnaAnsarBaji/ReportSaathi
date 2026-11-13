from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class LabMetric(BaseModel):
    name: str = Field(..., description="Name of the test or biomarker, e.g. Hemoglobin, Fasting Blood Glucose")
    value: str = Field(..., description="The observed result value as reported in the document")
    unit: Optional[str] = Field(None, description="Unit of measurement, e.g. mg/dL, %, g/dL. None if omitted in report.")
    standard_range: Optional[str] = Field(None, description="Normal reference interval ONLY if explicitly printed in report, else null.")
    status: Literal["normal", "high", "low", "abnormal", "inconclusive"] = Field(
        "normal", description="Clinical status flag relative to the standard range"
    )
    source_extracted_fact: str = Field(
        ..., description="Verbatim raw text line from the report representing the ground truth fact before AI explanation."
    )
    simple_explanation: str = Field(
        ..., description="Educational AI plain-language explanation of what this parameter measures in the human body."
    )
    note: Optional[str] = Field(
        None, description="Note when information or reference range is missing, ambiguous, or unclear."
    )

class GlossaryTerm(BaseModel):
    term: str = Field(..., description="Medical or lab term")
    definition: str = Field(..., description="Plain-language definition for non-medical readers")

class ReportAnalysis(BaseModel):
    report_type: str = Field(..., description="Identified report type, e.g. Complete Blood Count (CBC), Lipid Panel, Metabolic Panel")
    is_report_clear: bool = Field(True, description="Indicates if the document text is legible and coherent. False if blurry, truncated or ambiguous.")
    clarity_note: Optional[str] = Field(None, description="Explanation of any legibility issues with explicit advice to consult a clinician.")
    summary: str = Field(
        ..., description="An empathetic, accessible, plain-language educational summary. Never diagnoses or asserts certainty."
    )
    overall_status: Literal["normal", "attention_needed", "consult_doctor", "inconclusive"] = Field(
        ..., description="General triage categorization for user guidance."
    )
    key_findings: List[str] = Field(
        default_factory=list, description="Top 3 to 5 crucial takeaways the patient should know."
    )
    metrics: List[LabMetric] = Field(
        default_factory=list, description="List of individual tests/biomarkers extracted. Strictly contains only metrics present in the text."
    )
    questions_for_doctor: List[str] = Field(
        default_factory=list, description="Smart, practical questions the patient can bring to their physician."
    )
    glossary: List[GlossaryTerm] = Field(
        default_factory=list, description="Clarifications for technical medical terms found in the report."
    )
    disclaimer: str = Field(
        "ReportSaathi is an educational and informational tool designed to help you understand medical terminology. It does NOT provide medical advice, diagnosis, or treatment. Always discuss your lab results with a qualified healthcare provider.",
        description="Standard medical disclaimer."
    )
    extracted_text_snippet: Optional[str] = Field(
        None, description="Short snippet of raw text extracted from the report for transparency."
    )

class AnalyzeReportResponse(BaseModel):
    status: Literal["success", "partial", "error"] = "success"
    filename: str
    file_type: str
    file_size_bytes: int
    extraction_method: Literal["digital_pdf", "ocr_image", "ocr_pdf", "fallback"]
    page_count: int = 1
    character_count: int
    extracted_text: str
    analysis: ReportAnalysis

class SaveReportRequest(BaseModel):
    user_id: str = Field(..., description="Authenticated user UUID")
    title: str = Field(..., description="Readable title e.g. Complete Blood Count (CBC)")
    report_data: dict = Field(..., description="Structured report analysis object without raw files")

class SavedReportItem(BaseModel):
    id: str
    user_id: str
    title: str
    report_type: str
    overall_status: str
    summary: str
    key_findings: List[str] = []
    metrics: List[dict] = []
    questions_for_doctor: List[str] = []
    glossary: List[dict] = []
    created_at: str
