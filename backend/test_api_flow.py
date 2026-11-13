import os
import io
import httpx
from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfWriter

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("==================================================")
    print("Testing ReportSaathi API POST /api/reports/analyze")
    print("==================================================")
    client = httpx.Client(timeout=60.0)

    # 1. Health check
    print("\n[1] Testing GET /api/health...")
    r = client.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("   -> Health check PASSED:", r.json()["status"], "| OCR version:", r.json()["services"]["ocr_tesseract"]["version"])

    # 2. Unsupported format (.txt)
    print("\n[2] Testing Unsupported Format (.txt)...")
    files = {"file": ("notes.txt", b"Random notes not medical", "text/plain")}
    r = client.post(f"{BASE_URL}/reports/analyze", files=files)
    print("   -> Status code:", r.status_code)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
    print("   -> Detail message:", r.json().get("detail"))

    # 3. Empty file
    print("\n[3] Testing Empty File...")
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    r = client.post(f"{BASE_URL}/reports/analyze", files=files)
    print("   -> Status code:", r.status_code)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}"
    print("   -> Detail message:", r.json().get("detail"))

    # 4. Blank / unreadable image
    print("\n[4] Testing Blank / Unreadable Image...")
    blank_img = Image.new("RGB", (300, 300), color=(255, 255, 255))
    buf = io.BytesIO()
    blank_img.save(buf, format="PNG")
    files = {"file": ("blank.png", buf.getvalue(), "image/png")}
    r = client.post(f"{BASE_URL}/reports/analyze", files=files)
    print("   -> Status code:", r.status_code)
    assert r.status_code == 422, f"Expected 422, got {r.status_code}"
    print("   -> Detail message:", r.json().get("detail"))

    # 5. Valid image with lab report text (Tesseract OCR extraction)
    print("\n[5] Testing Valid Image Lab Report (Tesseract OCR)...")
    valid_img = Image.new("RGB", (800, 400), color=(255, 255, 255))
    draw = ImageDraw.Draw(valid_img)
    # Write synthetic lab report lines
    draw.text((30, 30), "CAREPLUS DIAGNOSTIC LABORATORY - HEMATOLOGY", fill=(0, 0, 0))
    draw.text((30, 80), "Test Name                    Observed Value    Reference Interval", fill=(0, 0, 0))
    draw.text((30, 130), "Hemoglobin (Hb)              14.2 g/dL         13.0 - 17.0 g/dL", fill=(0, 0, 0))
    draw.text((30, 180), "Total WBC Count              6800 /mcL         4500 - 11000 /mcL", fill=(0, 0, 0))
    draw.text((30, 230), "Platelet Count               250000 /mcL       150000 - 450000 /mcL", fill=(0, 0, 0))
    draw.text((30, 280), "Hematocrit (PCV)             43.0 %            38.0 - 50.0 %", fill=(0, 0, 0))
    draw.text((30, 330), "Impression: Normal blood cell counts within standard limits.", fill=(0, 0, 0))
    
    img_buf = io.BytesIO()
    valid_img.save(img_buf, format="PNG")
    files = {"file": ("cbc_scan.png", img_buf.getvalue(), "image/png")}
    r = client.post(f"{BASE_URL}/reports/analyze", files=files)
    print("   -> Status code:", r.status_code)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    res_data = r.json()
    print("   -> Status:", res_data["status"])
    print("   -> Method:", res_data["extraction_method"])
    print("   -> Chars extracted:", res_data["character_count"])
    print("   -> Report type:", res_data["analysis"]["report_type"])
    print("   -> Overall status:", res_data["analysis"]["overall_status"])
    print("   -> Metrics extracted count:", len(res_data["analysis"]["metrics"]))
    for m in res_data["analysis"]["metrics"]:
        print(f"      - {m['name']}: {m['value']} {m.get('unit') or ''} (Ref: {m.get('standard_range')}) [{m['status']}]")

    # 6. Valid PDF document (Digital text extraction)
    print("\n[6] Testing Valid PDF Lab Report (Digital PDF extraction)...")
    # Generate simple digital PDF using pypdf
    from pypdf import PageObject
    writer = PdfWriter()
    # Add a page with text
    page = writer.add_blank_page(width=612, height=792)
    pdf_text_content = (
        "LIPID PROFILE / CHOLESTEROL INVESTIGATION\n"
        "Patient ID: REF-8819\n"
        "Total Cholesterol: 218 mg/dL (Reference: < 200 mg/dL)\n"
        "Triglycerides: 120 mg/dL (Reference: < 150 mg/dL)\n"
        "HDL Cholesterol: 52 mg/dL (Reference: > 40 mg/dL)\n"
        "LDL Cholesterol: 142 mg/dL (Reference: < 100 mg/dL)\n"
        "Impression: Mild Hypercholesterolemia with optimal protective HDL."
    )
    # pypdf can write annotation or create pdf with canvas or fpdf
    # For a genuine test, we can use a small PDF buffer
    import zlib
    # Write a simple compliant PDF string directly
    pdf_bytes = (
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
        b"3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n"
        b"4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n"
        b"5 0 obj<</Length 320>>stream\n"
        b"BT\n/F1 12 Tf\n50 700 Td\n(LIPID PROFILE / CHOLESTEROL REPORT) Tj\n"
        b"0 -20 Td\n(Total Cholesterol: 218 mg/dL Reference: < 200 mg/dL) Tj\n"
        b"0 -20 Td\n(HDL Cholesterol: 52 mg/dL Reference: > 40 mg/dL) Tj\n"
        b"0 -20 Td\n(LDL Cholesterol: 142 mg/dL Reference: < 100 mg/dL) Tj\n"
        b"0 -20 Td\n(Triglycerides: 120 mg/dL Reference: < 150 mg/dL) Tj\n"
        b"ET\nendstream\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \n0000000281 00000 n \n"
        b"trailer<</Size 6/Root 1 0 R>>\nstartxref\n650\n%%EOF\n"
    )

    files = {"file": ("lipid_report.pdf", pdf_bytes, "application/pdf")}
    r = client.post(f"{BASE_URL}/reports/analyze", files=files)
    print("   -> Status code:", r.status_code)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    pdf_res = r.json()
    print("   -> Status:", pdf_res["status"])
    print("   -> Method:", pdf_res["extraction_method"])
    print("   -> Report type:", pdf_res["analysis"]["report_type"])
    print("   -> Metrics count:", len(pdf_res["analysis"]["metrics"]))
    print("\nALL 6 TEST CASES PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
