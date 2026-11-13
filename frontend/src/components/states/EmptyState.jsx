import React from 'react';
import { FileUp, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { SAMPLE_REPORTS } from '../../data/sampleReports';

export default function EmptyState({ onUploadClick, onSelectSample }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
        <FileUp className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No Lab Report Loaded Yet
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        Upload your laboratory report (PDF, JPG, PNG up to 15MB) or choose from our pre-configured realistic medical panels to explore how ReportSaathi explains clinical results.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <button
          onClick={onUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Or instant test with sample data:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {SAMPLE_REPORTS.slice(0, 2).map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between text-left group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {sample.category}
                </span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                  {sample.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
