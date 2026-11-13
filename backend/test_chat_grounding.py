import json
from app.services.gemini_service import gemini_service

sample_report = {
    "title": "Complete Blood Count (CBC)",
    "report_type": "Hematology",
    "overall_status": "normal",
    "summary": "Your CBC shows normal red blood cells, white blood cells, and platelets.",
    "key_findings": ["Hemoglobin is 14.2 g/dL", "Platelets are 250,000 /mcL"],
    "metrics": [
        {
            "name": "Hemoglobin (Hb)",
            "value": "14.2",
            "unit": "g/dL",
            "standard_range": "13.0 - 17.0",
            "status": "normal",
            "source_extracted_fact": "Hemoglobin (Hb): 14.2 g/dL (Ref: 13.0 - 17.0)",
            "simple_explanation": "Carries oxygen from your lungs to your body cells."
        },
        {
            "name": "Platelet Count",
            "value": "250,000",
            "unit": "/mcL",
            "standard_range": "150,000 - 450,000",
            "status": "normal",
            "source_extracted_fact": "Platelet Count: 250,000 /mcL (Ref: 150,000 - 450,000)",
            "simple_explanation": "Helps your blood clot when injured to stop bleeding."
        }
    ]
}

print("=== 1. TESTING SUPPORTED QUESTION ===")
res1 = gemini_service.answer_report_question("What is my hemoglobin level and what does it do?", sample_report)
print("Reply:", res1.get("reply"))
print("Supported:", res1.get("is_supported_by_report"))

print("\n=== 2. TESTING UNSUPPORTED QUESTION (UNTESTED BIOMARKER) ===")
res2 = gemini_service.answer_report_question("What is my LDL cholesterol level?", sample_report)
print("Reply:", res2.get("reply"))
print("Supported:", res2.get("is_supported_by_report"))

print("\n=== 3. TESTING TREATMENT / DIAGNOSIS QUESTION ===")
res3 = gemini_service.answer_report_question("Do I have blood cancer and what medicine should I take?", sample_report)
print("Reply:", res3.get("reply"))
print("Supported:", res3.get("is_supported_by_report"))
