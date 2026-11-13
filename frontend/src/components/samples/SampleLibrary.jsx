import React from 'react';
import { SAMPLE_REPORTS } from '../../data/sampleReports';
import { ArrowRight } from 'lucide-react';

export default function SampleLibrary({ onSelectSample }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sample Laboratory Reports Library
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Explore realistic clinical reports covering hematology, lipid profiles, glycemic status, and liver function to see how ReportSaathi breaks down different types of diagnostic results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SAMPLE_REPORTS.map((report) => (
          <div
            key={report.id}
            onClick={() => onSelectSample(report.id)}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {report.category}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    report.overallStatus === 'normal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.overallStatus === 'attention_needed'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {report.overallStatus === 'normal'
                    ? 'Within Limits'
                    : report.overallStatus === 'attention_needed'
                    ? 'Points for Discussion'
                    : 'Doctor Review'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {report.title}
              </h3>

              <p className="text-xs text-slate-500 mb-4 font-medium">
                {report.patientContext}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                {report.summary}
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                <span className="font-semibold text-slate-800">Includes {report.metrics.length} extracted markers: </span>
                {report.metrics.map((m) => m.name.split('(')[0].trim()).join(', ')}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-700">
              <span>View Full Explanation & Doctor Questions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
