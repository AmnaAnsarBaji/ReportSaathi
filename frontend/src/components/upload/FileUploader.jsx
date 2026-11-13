import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, AlertCircle, X } from 'lucide-react';

export default function FileUploader({ onFileSelected, onSampleSelected, isAnalyzing, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|png|jpg|jpeg|webp)$/i)) {
      alert('Please upload a PDF or an image file (PNG, JPG, WEBP).');
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Understand Your Lab Reports in <span className="text-emerald-600">Plain Language</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          Upload your blood test, lipid profile, or pathology report. We extract the parameters, break down medical jargon, and provide clear questions for your doctor.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="font-semibold">Analysis Notice:</strong> {error}
          </div>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/40 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
          id="file-upload-input"
        />

        {!selectedFile ? (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Drag & drop your lab report here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              Supports scanned PDFs, digital PDFs, or mobile photos (PNG, JPG) up to 20MB
            </p>

            <label
              htmlFor="file-upload-input"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Browse File</span>
            </label>
          </div>
        ) : (
          <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearSelectedFile}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewUrl && (
              <div className="mb-4 max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-white flex justify-center">
                <img src={previewUrl} alt="Preview" className="object-contain h-48 w-full" />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={clearSelectedFile}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Choose Another
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explain This Report</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick sample testing cards */}
      <div className="mt-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Don't have a report handy? Test with one click:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onSampleSelected('cbc')}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200/80 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sample Complete Blood Count (CBC)</span>
          </button>
          <button
            onClick={() => onSampleSelected('lipid')}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-teal-800 bg-white hover:bg-teal-50 border border-teal-200/80 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Sample Lipid / Cholesterol Panel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
