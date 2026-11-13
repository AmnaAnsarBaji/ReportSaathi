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
  Activity,
  ShieldAlert,
} from 'lucide-react';

export default function ReportResults({ report, onReset }) {
  const [metricFilter, setMetricFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  if (!report) return null;

  const filteredMetrics = (report.metrics || []).filter((m) => {
    if (metricFilter === 'abnormal') return m.status !== 'normal';
    if (metricFilter === 'normal') return m.status === 'normal';
    return true;
  });

  const getTriageInfo = (status) => {
    switch (status) {
      case 'normal':
        return {
          label: 'Within Reference Limits',
          subtext: 'Your key test markers appear to fall within standard healthy intervals.',
          badgeClass: 'bg-[#def1f5] text-[#146578] border-[#8ecfde]',
          icon: CheckCircle2,
          iconColor: 'text-[#189ab4]',
        };
      case 'attention_needed':
        return {
          label: 'Points for Discussion',
          subtext: 'Some markers differ mildly from standard reference targets. Worth discussing during your next consultation.',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'consult_doctor':
        return {
          label: 'Physician Review Advised',
          subtext: 'Notable parameter variations detected that warrant prompt consultation with your healthcare provider.',
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-300',
          icon: Stethoscope,
          iconColor: 'text-rose-600',
        };
      default:
        return {
          label: 'Informational Breakdown',
          subtext: 'Extracted results prepared for educational literacy.',
          badgeClass: 'bg-slate-50 text-slate-900 border-slate-300',
          icon: HelpCircle,
          iconColor: 'text-slate-600',
        };
    }
  };

  const getMetricBadge = (status) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#def1f5] text-[#146578] border border-[#8ecfde]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#189ab4]"></span>
            Normal
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Elevated
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            Below Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Recorded
          </span>
        );
    }
  };

  const copyQuestions = () => {
    if (report.questionsForDoctor?.length) {
      const text = report.questionsForDoctor
        .map((q, idx) => `${idx + 1}. ${q}`)
        .join('\n');
      navigator.clipboard.writeText(
        `Questions for my doctor regarding my ${report.title}:\n\n` + text
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const triage = getTriageInfo(report.overallStatus);
  const TriageIcon = triage.icon;

  const filteredGlossary = (report.glossary || []).filter(
    (g) =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header Actions (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#def1f5] shadow-sm no-print">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#558694]">
            Diagnostic Report
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-sm font-bold text-[#11323c]">{report.title}</span>
          <span className="text-xs text-[#558694] hidden sm:inline">({report.date})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#175362] bg-[#def1f5]/60 hover:bg-[#def1f5] border border-[#bee3ec] rounded-full transition"
            title="Print this plain language summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#189ab4] hover:bg-[#137d94] rounded-full transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another</span>
          </button>
        </div>
      </div>

      {/* Prominent Educational Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs sm:text-sm">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-amber-900">Health Literacy Disclaimer:</strong> This explanation is created for educational clarity to help you understand your laboratory printout. It does not replace a clinical consultation or physician diagnosis.
        </p>
      </div>

      {/* Overall Health Status & Empathetic Summary Card */}
      <div className="bg-white rounded-[32px] border border-[#def1f5] p-6 sm:p-8 shadow-sm print-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#def1f5]/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-bold text-[#146578] bg-[#def1f5] px-2.5 py-0.5 rounded-full">
                {report.category}
              </span>
              {report.extractionMethod && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs uppercase font-bold text-[#189ab4] bg-[#e6f4f7] px-2.5 py-0.5 rounded-full">
                    {report.extractionMethod === 'digital_pdf' ? 'Digital PDF Extracted' : 'Tesseract OCR Extracted'}
                  </span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span className="text-xs text-[#558694] font-medium">
                {report.patientContext}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11323c] tracking-tight">
              {report.title}
            </h1>
          </div>

          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${triage.badgeClass} self-start sm:self-auto`}
          >
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#558694] mb-2.5">
            Plain-Language Summary
          </h2>
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-[#f4fafc] p-5 sm:p-6 rounded-2xl border border-[#def1f5]">
            {report.summary}
          </div>
        </div>

        {/* Key Highlights / Takeaways */}
        {report.keyFindings && report.keyFindings.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#def1f5]/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#558694] mb-3">
              Key Findings at a Glance
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {report.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-[#184653]">
                  <CheckCircle2 className="w-4 h-4 text-[#189ab4] shrink-0 mt-0.5" />
                  <span className="leading-snug">{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extracted Values & Plain Language Parameter Explanations */}
      <div className="bg-white rounded-[32px] border border-[#def1f5] p-6 sm:p-8 shadow-sm print-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#11323c] tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#189ab4]" />
              <span>Extracted Values & Parameter Breakdown</span>
            </h2>
            <p className="text-xs text-[#558694] mt-1">
              Biomarkers extracted from your lab results with simple plain-English explanations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#def1f5]/50 p-1 rounded-full text-xs font-semibold text-[#558694] self-start sm:self-auto no-print">
            <button
              onClick={() => setMetricFilter('all')}
              className={`px-3 py-1 rounded-full transition ${
                metricFilter === 'all'
                  ? 'bg-white text-[#189ab4] shadow-xs'
                  : 'hover:text-[#184653]'
              }`}
            >
              All ({report.metrics?.length || 0})
            </button>
            <button
              onClick={() => setMetricFilter('abnormal')}
              className={`px-3 py-1 rounded-full transition ${
                metricFilter === 'abnormal'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'hover:text-[#184653]'
              }`}
            >
              Flagged ({report.metrics?.filter((m) => m.status !== 'normal').length || 0})
            </button>
            <button
              onClick={() => setMetricFilter('normal')}
              className={`px-3 py-1 rounded-full transition ${
                metricFilter === 'normal'
                  ? 'bg-white text-[#189ab4] shadow-xs'
                  : 'hover:text-[#184653]'
              }`}
            >
              Normal ({report.metrics?.filter((m) => m.status === 'normal').length || 0})
            </button>
          </div>
        </div>

        {/* Metrics Cards List */}
        <div className="space-y-4">
          {filteredMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#def1f5] bg-[#f8fcfe] hover:bg-white hover:border-[#8ecfde] hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#55b5cc] block mb-0.5">
                    {metric.category || 'Biomarker'}
                  </span>
                  <h3 className="font-bold text-[#11323c] text-base">
                    {metric.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#11323c]">
                      {metric.value}
                    </span>{' '}
                    <span className="text-xs font-semibold text-[#558694]">
                      {metric.unit}
                    </span>
                  </div>
                  {getMetricBadge(metric.status)}
                </div>
              </div>

              {metric.standardRange && (
                <div className="text-xs text-[#558694] mb-2.5">
                  <span className="font-semibold text-[#184653]">Standard Target Range:</span>{' '}
                  {metric.standardRange} {metric.unit}
                </div>
              )}

              <div className="bg-white p-3.5 rounded-xl border border-[#def1f5]/80 text-xs sm:text-sm text-[#42717f] leading-relaxed">
                <strong className="font-semibold text-[#175362]">What it means: </strong>
                {metric.simpleExplanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Ask Your Doctor */}
      {report.questionsForDoctor && report.questionsForDoctor.length > 0 && (
        <div className="bg-gradient-to-br from-[#dcf0f5] to-[#edf7fa] rounded-[32px] border border-[#bee3ec] p-6 sm:p-8 shadow-sm print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#189ab4] text-white flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#11323c]">
                  Questions to Ask Your Doctor
                </h2>
                <p className="text-xs text-[#558694]">
                  Bring these practical, doctor-aligned discussion points to your next appointment.
                </p>
              </div>
            </div>

            <button
              onClick={copyQuestions}
              className="no-print inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#175362] bg-white hover:bg-[#def1f5] border border-[#bee3ec] rounded-full shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#189ab4]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#189ab4]" />
                  <span>Copy Questions</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {report.questionsForDoctor.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/95 border border-[#def1f5] text-sm text-[#184653] shadow-xs"
              >
                <span className="w-6 h-6 rounded-full bg-[#def1f5] text-[#189ab4] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
        <div className="bg-white rounded-[32px] border border-[#def1f5] p-6 sm:p-8 shadow-sm print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#189ab4]" />
              <div>
                <h2 className="text-lg font-bold text-[#11323c]">
                  Medical Terminology Glossary
                </h2>
                <p className="text-xs text-[#558694]">
                  Everyday definitions for technical phrases found in this report.
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Filter terms..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="no-print text-xs px-3.5 py-1.5 border border-[#def1f5] rounded-full w-full sm:w-48 focus:outline-none focus:border-[#189ab4] bg-[#f8fcfe]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#f8fcfe] border border-[#def1f5]">
                <h3 className="font-bold text-[#11323c] text-xs mb-1">
                  {item.term}
                </h3>
                <p className="text-xs text-[#558694] leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw OCR / Extracted Snippet Drawer (Collapsible) */}
      {report.rawTextSnippet && (
        <div className="bg-white rounded-2xl border border-[#def1f5] p-4 shadow-xs no-print">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#558694] hover:text-[#184653]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#189ab4]" />
              <span>Simulated Raw Extraction View (Transparency Preview)</span>
            </span>
            {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRawText && (
            <div className="mt-3 p-3.5 bg-[#f8fcfe] rounded-xl text-xs font-mono text-[#184653] whitespace-pre-wrap max-h-48 overflow-y-auto border border-[#def1f5]">
              {report.rawTextSnippet}
            </div>
          )}
        </div>
      )}

      {/* Bottom Medical Disclaimer & Reset Button */}
      <div className="text-center pt-4 space-y-4 no-print">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#189ab4] hover:bg-[#137d94] text-white font-semibold text-xs sm:text-sm rounded-full shadow-md shadow-[#189ab4]/25 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Upload or Select Another Lab Report</span>
        </button>

        <p className="text-[11px] text-[#558694] max-w-lg mx-auto">
          CarePlus ReportSaathi • Educational health literacy platform.
        </p>
      </div>
    </div>
  );
}
