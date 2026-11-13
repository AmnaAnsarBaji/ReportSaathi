import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  HelpCircle,
  BookOpen,
  Printer,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity
} from 'lucide-react';

export default function ReportDashboard({ report, onReset }) {
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const getTriageInfo = (status) => {
    switch (status) {
      case 'normal':
        return {
          label: 'Generally Normal',
          subtext: 'Your key test markers appear to align with standard healthy reference intervals.',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
        };
      case 'attention_needed':
        return {
          label: 'Points for Discussion',
          subtext: 'Some markers differ mildly from standard ranges. Review these with your doctor during your next visit.',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'consult_doctor':
        return {
          label: 'Consult Physician',
          subtext: 'Notable variations detected that warrant prompt consultation with your healthcare provider.',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: Stethoscope,
          iconColor: 'text-rose-600',
        };
      default:
        return {
          label: 'Inconclusive / Informational',
          subtext: 'Overview generated from available text snippet.',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: HelpCircle,
          iconColor: 'text-slate-600',
        };
    }
  };

  const getMetricBadge = (metricStatus) => {
    switch (metricStatus) {
      case 'normal':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Normal</span>;
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Elevated (High)</span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">Below Normal (Low)</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Checked</span>;
    }
  };

  const copyQuestions = () => {
    if (report?.questions_for_doctor?.length) {
      const text = report.questions_for_doctor.map((q, idx) => `${idx + 1}. ${q}`).join('\n');
      navigator.clipboard.writeText(`Questions for my Doctor regarding my ${report.report_type}:\n\n` + text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const triage = getTriageInfo(report?.overall_status);
  const TriageIcon = triage.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Analysis Result</span>
          <span className="text-slate-300">•</span>
          <span className="text-sm font-semibold text-slate-800">{report.report_type}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Analyze Another
          </button>
        </div>
      </div>

      {/* Main Triage & Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm print-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {report.report_type}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Plain-language breakdown prepared by ReportSaathi
            </p>
          </div>

          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${triage.badgeClass} self-start sm:self-auto`}>
            <TriageIcon className={`w-5 h-5 ${triage.iconColor} shrink-0`} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {triage.label}
              </span>
            </div>
          </div>
        </div>

        {/* Empathetic Summary */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            What This Report Means
          </h3>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
            {report.summary}
          </p>
          {report.patient_context_note && (
            <p className="text-xs text-slate-400 italic mt-2">
              Note: {report.patient_context_note}
            </p>
          )}
        </div>

        {/* Key Findings */}
        {report.key_findings && report.key_findings.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Key Highlights
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {report.key_findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parameter Breakdown */}
      {report.metrics && report.metrics.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm print-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Test Parameter Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Values extracted from your lab results with simple everyday explanations
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {report.metrics.length} {report.metrics.length === 1 ? 'Metric' : 'Metrics'}
            </span>
          </div>

          <div className="space-y-4">
            {report.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-emerald-300 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">
                    {metric.name}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-slate-800">
                      {metric.value} {metric.unit ? <span className="font-normal text-xs text-slate-500">{metric.unit}</span> : null}
                    </div>
                    {getMetricBadge(metric.status)}
                  </div>
                </div>

                {metric.standard_range && (
                  <div className="text-xs text-slate-500 mb-2">
                    <span className="font-medium text-slate-600">Standard Target Range:</span> {metric.standard_range} {metric.unit || ''}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                  {metric.simple_explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Doctor */}
      {report.questions_for_doctor && report.questions_for_doctor.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-sm print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Questions to Ask Your Doctor
                </h3>
                <p className="text-xs text-slate-600">
                  Take these smart discussion points to your next healthcare appointment
                </p>
              </div>
            </div>

            <button
              onClick={copyQuestions}
              className="no-print inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100/80 border border-emerald-300 rounded-xl shadow-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Questions'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {report.questions_for_doctor.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-emerald-100 text-sm text-slate-800"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Glossary */}
      {report.glossary && report.glossary.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm print-card">
          <div className="flex items-center gap-2.5 mb-6">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Medical Glossary & Definitions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.glossary.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-semibold text-slate-800 text-sm mb-1">
                  {item.term}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Extracted Snippet Drawer (Collapsible) */}
      {report.extracted_text_snippet && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs no-print">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Raw OCR / Extracted Text Preview
            </span>
            {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showRawText && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-200">
              {report.extracted_text_snippet}
            </div>
          )}
        </div>
      )}

      {/* Medical Disclaimer Footer Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
        <strong>Important Medical Notice:</strong> {report.disclaimer}
      </div>
    </div>
  );
}
