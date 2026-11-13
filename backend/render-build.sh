#!/usr/bin/env bash
# Render build script for ReportSaathi backend.
# Installs Tesseract OCR (required for image-based report scanning)
# then installs Python dependencies.
set -e

echo "==> Installing Tesseract OCR..."
apt-get update -y && apt-get install -y tesseract-ocr

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Build complete."
