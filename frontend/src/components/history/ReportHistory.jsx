import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Database,
  Calendar,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchUserReports,
  deleteReportFromHistory,
} from '../../services/supabase';

export default function ReportHistory({ user, onSelectReport, onOpenAuth }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadReports = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await fetchUserReports(user.id);
      setReports(result.reports || []);
    } catch (err) {
      console.error('Failed to load user reports:', err);
      setErrorMsg(err.message || 'Could not fetch saved reports.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (!isSupabaseConfigured || !user) {
      return;
    }

    fetchUserReports(user.id)
      .then((result) => {
        if (isMounted) {
          setReports(result.reports || []);
          setErrorMsg(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Could not fetch saved reports.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (reportId) => {
    if (!user) return;
    setDeletingId(reportId);
    try {
      await deleteReportFromHistory(reportId, user.id);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Failed to delete report:', err);
      setErrorMsg(err.message || 'Could not delete report.');
    } finally {
      setDeletingId(null);
    }
  };

  const getTriageBadge = (status) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#def1f5] text-[#146578] border border-[#8ecfde]">
            <CheckCircle2 className="w-3 h-3 text-[#189ab4]" />
            Normal Limits
          </span>
        );
      case 'attention_needed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Points for Discussion
          </span>
        );
      case 'consult_doctor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <Stethoscope className="w-3 h-3 text-rose-600" />
            Review Advised
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Informational
          </span>
        );
    }
  };

  // Convert a DB saved_report row into the formatted report shape expected by ReportResults
  const handleViewReport = (saved) => {
    const formatted = {
      id: saved.id,
      title: saved.title,
      category: saved.report_type || 'Clinical Diagnostics',
      date: new Date(saved.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      overallStatus: saved.overall_status || 'normal',
      patientContext: `Saved in Cloud • ${new Date(saved.created_at).toLocaleDateString()}`,
      summary: saved.summary,
      keyFindings: saved.key_findings || [],
      isReportClear: true,
      clarityNote: null,
      metrics: (saved.metrics || []).map((m) => ({
        name: m.name,
        value: m.value,
        unit: m.unit || '',
        standardRange: m.standardRange || null,
        status: m.status || 'normal',
        category: m.category || 'Biomarker',
        simpleExplanation: m.simpleExplanation || '',
        sourceExtractedFact: m.sourceExtractedFact || null,
        note: m.note || null,
      })),
      questionsForDoctor: saved.questions_for_doctor || [],
      glossary: saved.glossary || [],
      isSavedRecord: true,
      savedRecordId: saved.id,
    };
    onSelectReport(formatted);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-[32px] border border-[#def1f5] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#def1f5] text-[#189ab4] flex items-center justify-center shadow-xs">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#11323c]">Saved Report History</h1>
              <p className="text-xs text-[#558694] mt-0.5">
                Opt-in personal health records secured with Row Level Security.
              </p>
            </div>
          </div>

          {!user && isSupabaseConfigured && (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full bg-[#189ab4] hover:bg-[#137d94] text-white text-xs font-bold transition shadow-xs"
            >
              Sign In to View History
            </button>
          )}
        </div>

        {/* Privacy Notice Card */}
        <div className="mt-6 p-4 rounded-2xl bg-[#edf7fa] border border-[#bee3ec] text-xs text-[#175362] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#189ab4] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-[#146578]">Privacy First Guarantee: </strong>
            ReportSaathi stores only the educational summary and structured biomarker breakdown in your database.
            Original files (PDFs, images) and raw extracted OCR texts are <strong>never stored</strong> in the database.
          </div>
        </div>

        {/* Demo Mode Notice */}
        {!isSupabaseConfigured && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Demo Mode Active:</strong> Supabase credentials are not currently configured in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">frontend/.env</code>.
              <p className="text-[11px] text-amber-800 mt-1">
                The application runs fully in local mode. Reports are processed and rendered on your screen in real time, but cloud history persistence is disabled until credentials are added.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={loadReports}
            className="text-xs font-bold text-rose-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-[#def1f5] animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded-full w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded-full w-2/3"></div>
              <div className="h-3 bg-slate-100 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Unauthenticated State */}
      {!loading && !user && isSupabaseConfigured && (
        <div className="text-center py-12 px-4 bg-white rounded-[32px] border border-[#def1f5] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f1f8fa] flex items-center justify-center mx-auto text-[#189ab4]">
            <History className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-lg font-bold text-[#11323c]">Sign In to View Your History</h2>
          <p className="text-xs text-[#558694] max-w-md mx-auto">
            Your saved reports are protected with Supabase Row Level Security. Sign in with your account to access your personal laboratory summaries.
          </p>
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#189ab4] hover:bg-[#137d94] text-white text-xs font-bold shadow-md shadow-[#189ab4]/25 transition"
          >
            Sign In or Register
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && (user || !isSupabaseConfigured) && reports.length === 0 && (
        <div className="text-center py-12 px-4 bg-white rounded-[32px] border border-[#def1f5] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f1f8fa] flex items-center justify-center mx-auto text-[#558694]">
            <FileCheck2 className="w-8 h-8 opacity-50" />
          </div>
          <h2 className="text-lg font-bold text-[#11323c]">No Saved Reports Found</h2>
          <p className="text-xs text-[#558694] max-w-md mx-auto">
            You haven't saved any report analyses yet. When reviewing an uploaded lab report, click the <strong>"Save to My History"</strong> action to keep an educational copy.
          </p>
        </div>
      )}

      {/* Reports List */}
      {!loading && reports.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#558694] px-2">
            Your Saved Summaries ({reports.length})
          </div>

          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl border border-[#def1f5] p-5 sm:p-6 shadow-xs hover:border-[#8ecfde] hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-[#146578] bg-[#def1f5] px-2.5 py-0.5 rounded-full">
                    {report.report_type}
                  </span>
                  {getTriageBadge(report.overall_status)}
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-[#558694] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(report.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#11323c]">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.summary}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#558694]">
                  <span>{report.metrics?.length || 0} biomarkers</span>
                  <span>•</span>
                  <span>{report.key_findings?.length || 0} key takeaways</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleViewReport(report)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#189ab4] bg-[#def1f5]/70 hover:bg-[#def1f5] rounded-full transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Summary</span>
                </button>

                {confirmDeleteId === report.id ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-full border border-rose-200">
                    <button
                      onClick={() => handleDelete(report.id)}
                      disabled={deletingId === report.id}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition disabled:opacity-50"
                    >
                      {deletingId === report.id ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(report.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
                    title="Delete saved report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
