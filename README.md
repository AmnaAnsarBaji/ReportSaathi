# ReportSaathi (रिपोर्ट साथी)
**Medical Laboratory Report Explainer in Simple Language**

ReportSaathi is an empathetic, AI-powered health literacy web application that translates complex, jargon-heavy medical laboratory reports (such as Complete Blood Counts, Lipid Panels, Liver/Kidney Function Tests, and Blood Glucose Panels) into clear, accessible explanations for patients and caregivers.

---

## 🌟 Key Features
- **Dual Text Extraction**: Direct digital PDF text extraction + Tesseract OCR for scanned documents, mobile photos, and multi-format medical reports.
- **Empathetic AI Translation**: Powered by Gemini API with clinical prompting designed for plain English clarity without diagnostic overreach.
- **Biomarker Breakdown**: Extracted test parameters with reference intervals, visual status badges (Normal, High, Low), and plain-language explanations.
- **Doctor Discussion Checklist**: Generates smart questions patients can ask their healthcare provider during their next appointment.
- **Privacy & Safety First**: Automatic client-side/pre-extraction PII masking (names, phones, IDs), prominent medical disclaimers, and printable patient summaries.
- **Frictionless Guest Mode**: Upload and analyze instantly without mandatory sign-up, with optional Supabase cloud history.

---

## 🏗️ Architecture & Tech Stack

```text
Frontend (React 19 + Vite + Tailwind CSS)
   ↓ (REST API / Multipart Upload)
Backend (Python FastAPI + Uvicorn)
   ├── OCR & Text Extraction: Tesseract OCR (v5.5) + pypdf + Pillow
   ├── Medical Intelligence: Google Gemini API (gemini-2.5-flash)
   └── Persistence: Supabase (Optional for authenticated history)
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API will run at `http://localhost:8000` (Interactive Swagger docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 🔒 Medical Disclaimer
ReportSaathi is an educational and informational tool designed to promote health literacy. It does **NOT** provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional regarding any medical questions or lab results.
