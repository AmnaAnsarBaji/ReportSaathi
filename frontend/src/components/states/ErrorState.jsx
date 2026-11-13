import React from 'react';
import { AlertCircle, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

export default function ErrorState({ error, onRetry, onLoadSample }) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-rose-200 p-8 sm:p-10 shadow-sm text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-100">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Unable to Interpret Document
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        {error || 'The document could not be processed. Please check file format and image clarity.'}
      </p>

      {/* Helpful Tips Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Tips for a Clear Scan:
        </h4>
        <ul className="text-xs text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Ensure the entire page is visible with test names and numerical values in focus.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Avoid strong shadows, glare, or skewed camera angles.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Use standard formats: PDF, JPG, or PNG (maximum size 15 MB).</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm rounded-xl transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Upload Another File</span>
        </button>

        <button
          onClick={onLoadSample}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium text-xs sm:text-sm rounded-xl transition"
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Load Safe Demo Sample</span>
        </button>
      </div>
    </div>
  );
}
