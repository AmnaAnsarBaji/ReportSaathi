import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  X,
  FileCheck2,
  Bug
} from 'lucide-react';
import { SAMPLE_REPORTS } from '../../data/sampleReports';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

export default function UploadZone({ onProcessFile, onSimulateError, onSelectSample }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setValidationError(null);
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isExtensionValid = ALLOWED_EXTENSIONS.includes(ext);
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';

    if (!isExtensionValid && !isMimeValid) {
      setValidationError(
        `Unsupported file type (${ext}). Please select a PDF, JPG, or PNG document.`
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(
        `File is too large (${sizeMb} MB). Maximum permitted file size is 15 MB.`
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartProcessing = () => {
    if (!selectedFile) return;
    onProcessFile(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(0) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11323c] tracking-tight">
          Upload Your Medical Report
        </h2>
        <p className="text-xs sm:text-sm text-[#558694] mt-1 max-w-md mx-auto">
          We accept digital PDFs or clear mobile photos of laboratory results (PDF, JPG, PNG up to 15MB).
        </p>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs sm:text-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">Validation Alert</strong>
            <span>{validationError}</span>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-rose-500 hover:text-rose-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dropzone Area with CarePlus rounded styling */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-[32px] p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-[#189ab4] bg-[#def1f5]/50 scale-[1.01]'
            : 'border-[#bee3ec] bg-white hover:border-[#189ab4] hover:bg-[#f4fafc] shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={(e) => validateAndSetFile(e.target.files[0])}
          className="hidden"
          id="report-file-input"
        />

        {!selectedFile ? (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-[#def1f5] text-[#189ab4] flex items-center justify-center mx-auto mb-4 border border-[#bee3ec] shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#175362] mb-1">
              Drag & drop report here, or browse files
            </h3>

            <p className="text-xs text-[#558694] mb-6 max-w-sm mx-auto">
              Supported formats: <strong className="font-semibold text-[#184653]">PDF, JPG, PNG</strong> (Max file size: 15MB)
            </p>

            <label
              htmlFor="report-file-input"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#189ab4] hover:bg-[#137d94] active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-full shadow-md shadow-[#189ab4]/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Select File</span>
            </label>
          </div>
        ) : (
          <div className="text-left bg-[#f4fafc] border border-[#def1f5] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#bee3ec] flex items-center justify-center text-[#175362] shrink-0 shadow-xs">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon className="w-6 h-6 text-[#189ab4]" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#146578]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#11323c] text-sm truncate">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#558694] mt-0.5">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] bg-[#def1f5] text-[#175362] px-1.5 py-0.2 rounded font-semibold">
                      {selectedFile.name.split('.').pop()}
                    </span>
                    <span>•</span>
                    <span className="text-[#189ab4] font-medium">Valid Format</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewUrl && (
              <div className="mb-4 max-h-44 overflow-hidden rounded-xl border border-[#bee3ec] bg-white flex justify-center p-2">
                <img
                  src={previewUrl}
                  alt="Upload Preview"
                  className="object-contain max-h-40 rounded"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#def1f5]">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-[#558694] hover:text-[#184653] order-2 sm:order-1"
              >
                Choose another file
              </button>

              <button
                type="button"
                onClick={handleStartProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#189ab4] hover:bg-[#137d94] active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-full shadow-md shadow-[#189ab4]/25 transition-all order-1 sm:order-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explain Report (Demo Process)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Realistic Demo Helpers & Sample Selector */}
      <div className="bg-white border border-[#def1f5] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#558694]">
            Instant Sample Panels:
          </span>
          <button
            onClick={onSimulateError}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
            title="Demonstrates error handling for blurry or corrupted scans"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Simulate Unreadable Scan (Error State)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_REPORTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              className="p-3.5 rounded-2xl border border-[#def1f5] hover:border-[#8ecfde] hover:bg-[#def1f5]/30 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-[#55b5cc] block uppercase">
                  {sample.category}
                </span>
                <span className="text-xs font-semibold text-[#184653] group-hover:text-[#189ab4]">
                  {sample.title}
                </span>
              </div>
              <FileCheck2 className="w-4 h-4 text-[#8ecfde] group-hover:text-[#189ab4] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
