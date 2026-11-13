import json
from app.services.gemini_service import gemini_service

unclear_text = """
REPORT SLIP (TORN)
Dr. Clinic
Patient: Unknown
Hb: 10.2
Plate... [torn page]
SGOT: 85 (Ref: ???)
Glucose:
"""

result = gemini_service.analyze_report(unclear_text)
print("=== UNCLEAR REPORT TEST ===")
print("is_report_clear:", result.is_report_clear)
print("clarity_note:", result.clarity_note)
for m in result.metrics:
    print(f"- {m.name}: val={m.value}, unit={m.unit}, range={m.standard_range}, note={m.note}")
print("===========================")
