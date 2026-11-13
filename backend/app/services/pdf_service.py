import io
from typing import Tuple
from pypdf import PdfReader
from PIL import Image
from app.services.ocr_service import ocr_service

class PDFService:
    @classmethod
    def extract_text_from_pdf(cls, file_bytes: bytes) -> Tuple[str, str, int]:
        """
        Attempts direct digital PDF text extraction first.
        If extracted text is negligible (indicating a scanned document),
        it falls back to extracting images and running OCR.
        
        Returns:
            Tuple[extracted_text, method_used, page_count]
        """
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            page_count = len(reader.pages)
            extracted_pages = []

            # 1. Try digital text extraction
            for page in reader.pages:
                text = page.extract_text() or ""
                if text.strip():
                    extracted_pages.append(text.strip())

            direct_text = "\n\n".join(extracted_pages).strip()

            # If substantial text was found, use digital extraction
            if len(direct_text) >= 60:
                return direct_text, "digital_pdf", page_count

            # 2. Scanned PDF fallback: Extract images from pages and OCR them
            ocr_pages = []
            for page_idx, page in enumerate(reader.pages):
                for img_file in page.images:
                    try:
                        pil_img = Image.open(io.BytesIO(img_file.data))
                        page_ocr_text = ocr_service.extract_text_from_pil(pil_img)
                        if page_ocr_text:
                            ocr_pages.append(page_ocr_text)
                    except Exception:
                        continue

            if ocr_pages:
                return "\n\n".join(ocr_pages).strip(), "ocr_pdf", page_count

            # If nothing worked, return whatever minimal direct text was found
            return direct_text, "digital_pdf", page_count

        except Exception as e:
            raise RuntimeError(f"Failed to process PDF: {str(e)}") from e

pdf_service = PDFService()
