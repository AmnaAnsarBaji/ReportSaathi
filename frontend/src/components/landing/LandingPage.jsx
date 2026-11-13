import React from 'react';
import {
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_REPORTS } from '../../data/sampleReports';

export default function LandingPage({ onStartDashboard, onSelectSample }) {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Health Literacy Prototype</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-6">
          Demystify Medical Lab Reports in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Plain Language
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          ReportSaathi translates complex laboratory numbers and medical jargon into clear, everyday explanations—helping you understand your test results before your doctor appointment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Open Report Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectSample(SAMPLE_REPORTS[0].id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Try Sample CBC Report</span>
          </button>
        </div>

        {/* Safe Educational Notice Callout */}
        <div className="mt-8 max-w-xl mx-auto p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Educational guidance only • Zero patient tracking • Safe & private</span>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            How ReportSaathi Empowers You
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Transforming intimidating medical paperwork into actionable understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5 border border-emerald-100">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Upload Any Lab Document
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drop in your digital PDF report, scanned diagnostic sheet, or a clear mobile photo (PNG, JPG).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg mb-5 border border-teal-100">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Extract Values & Ranges
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Biomarkers, units, and clinical reference targets are extracted and classified as Normal, High, or Low.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5 border border-emerald-100">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Learn What It Means
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Read empathetic summaries, parameter meanings, and practical questions ready to discuss with your doctor.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sample Reports Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Explore Realistic Sample Reports
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any pre-configured medical report to preview the explanation engine instantly.
            </p>
          </div>
          <button
            onClick={onStartDashboard}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Or upload your own file</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_REPORTS.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectSample(report.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {report.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      report.overallStatus === 'normal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.overallStatus === 'attention_needed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {report.overallStatus === 'normal'
                      ? 'Normal'
                      : report.overallStatus === 'attention_needed'
                      ? 'Mild Attention'
                      : 'Doctor Review'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {report.summary.slice(0, 110)}...
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Purpose & Ethics Callout */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 text-emerald-300" />
              <span>Patient Empowerment Mission</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bridging the Gap Between Lab Values & Everyday Language
            </h3>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              Medical reports are frequently confusing and stressful to read. ReportSaathi was created to remove medical jargon, reduce anxiety, and equip patients with the right questions to have high-value, informed conversations with their doctors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-800/60">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strictly Educational & Non-Diagnostic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Doctor-Ready Discussion Lists</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Personal Health Data Kept</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
