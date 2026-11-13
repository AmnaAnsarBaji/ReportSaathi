import os
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import pytesseract
from app.core.config import settings

# Configure tesseract executable location if it exists
if os.path.exists(settings.TESSERACT_CMD):
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

class OCRService:
    @staticmethod
    def is_available() -> bool:
        """Check if Tesseract binary is accessible."""
        try:
            return os.path.exists(settings.TESSERACT_CMD) or pytesseract.get_tesseract_version() is not None
        except Exception:
            return False

    @staticmethod
    def get_version() -> str:
        """Return the installed Tesseract version."""
        try:
            ver = pytesseract.get_tesseract_version()
            return str(ver)
        except Exception:
            return "unknown"

    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        """
        Enhance image contrast, clarity, and orientation for better OCR recognition of printed lab reports.
        """
        try:
            # Auto-orient based on EXIF if available
            try:
                image = ImageOps.exif_transpose(image)
            except Exception:
                pass

            # Convert to grayscale
            gray = image.convert("L")
            # Increase contrast
            enhancer = ImageEnhance.Contrast(gray)
            enhanced = enhancer.enhance(1.8)
            # Apply slight sharpness enhancement
            sharpener = ImageEnhance.Sharpness(enhanced)
            sharp = sharpener.enhance(1.5)
            return sharp
        except Exception:
            return image

    @classmethod
    def extract_text_from_image(cls, image_path: str) -> str:
        """Extract text from an image file using Tesseract with preprocessing."""
        try:
            with Image.open(image_path) as img:
                processed_img = cls.preprocess_image(img)
                custom_config = r'--oem 3 --psm 3'
                text = pytesseract.image_to_string(processed_img, config=custom_config)
                return text.strip()
        except Exception as e:
            try:
                with Image.open(image_path) as img:
                    return pytesseract.image_to_string(img).strip()
            except Exception as inner_e:
                raise RuntimeError(f"OCR processing failed: {str(inner_e)}") from e

    @classmethod
    def extract_text_from_pil(cls, img: Image.Image) -> str:
        """Extract text directly from a PIL image object."""
        try:
            processed_img = cls.preprocess_image(img)
            return pytesseract.image_to_string(processed_img, config=r'--oem 3 --psm 3').strip()
        except Exception:
            return pytesseract.image_to_string(img).strip()

ocr_service = OCRService()
