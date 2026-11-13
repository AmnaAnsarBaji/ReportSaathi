import React, { useState, useEffect } from 'react';
import CarePlusNavbar from './components/careplus/CarePlusNavbar';
import CarePlusHero from './components/careplus/CarePlusHero';
import CarePlusDepartments from './components/careplus/CarePlusDepartments';
import CarePlusFeaturedServices from './components/careplus/CarePlusFeaturedServices';
import Dashboard from './components/dashboard/Dashboard';
import SampleLibrary from './components/samples/SampleLibrary';
import ReportHistory from './components/history/ReportHistory';
import AuthModal from './components/auth/AuthModal';
import DisclaimerBanner from './components/common/DisclaimerBanner';
import { api } from './services/api';
import { SAMPLE_REPORTS } from './data/sampleReports';
import {
  subscribeToAuthChanges,
  getCurrentUser,
} from './services/supabase';
import { Plus, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'samples', 'history'
  const [activeReport, setActiveReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showUploaderOnly, setShowUploaderOnly] = useState(true);

  // Authentication & Modal States
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check initial user
    getCurrentUser().then((u) => {
      if (u) setUser(u);
    });

    // Subscribe to live auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = subscribeToAuthChanges((event, sessionUser) => {
      setUser(sessionUser);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const handleUploadClick = () => {
    setCurrentView('dashboard');
    setShowUploaderOnly(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = async (sampleId) => {
    setError(null);
    setIsAnalyzing(true);
    setCurrentView('dashboard');
    setShowUploaderOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const sampleKey = sampleId.includes('lipid') ? 'lipid' : 'cbc';
      const data = await api.getSampleReport(sampleKey);
      const analysis = data.analysis || data;
      const formattedReport = {
        id: sampleId,
        title: analysis.report_type || 'Laboratory Investigation',
        category: 'Clinical Diagnostics',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        overallStatus: analysis.overall_status || 'normal',
        patientContext: analysis.patient_context_note || 'Reference Clinical Sample',
        summary: analysis.summary,
        keyFindings: analysis.key_findings || [],
        isReportClear: analysis.is_report_clear !== false && analysis.isReportClear !== false,
        clarityNote: analysis.clarity_note || analysis.clarityNote || null,
        metrics: (analysis.metrics || []).map((m) => ({
          name: m.name,
          value: m.value,
          unit: m.unit || '',
          standardRange: m.standard_range || m.standardRange || null,
          status: m.status || 'normal',
          category: m.category || 'Biomarker',
          simpleExplanation: m.simple_explanation || m.simpleExplanation,
          sourceExtractedFact: m.source_extracted_fact || m.sourceExtractedFact || `${m.name}: ${m.value} ${m.unit || ''}`.trim(),
          note: m.note || null,
        })),
        questionsForDoctor: analysis.questions_for_doctor || [],
        glossary: (analysis.glossary || []).map((g) => ({
          term: g.term,
          definition: g.definition,
        })),
        rawTextSnippet: data.extracted_text || analysis.extracted_text_snippet || '',
        extractionMethod: data.extraction_method || 'digital_pdf',
      };
      setActiveReport(formattedReport);
    } catch (err) {
      console.warn('API sample fetch notice, falling back to local sample:', err);
      const sample = SAMPLE_REPORTS.find((s) => s.id === sampleId) || SAMPLE_REPORTS[0];
      setActiveReport(sample);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewSavedReport = (savedReport) => {
    setActiveReport(savedReport);
    setCurrentView('dashboard');
    setShowUploaderOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToHome = () => {
    setCurrentView('landing');
    setActiveReport(null);
    setError(null);
    setShowUploaderOnly(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f8fa] text-[#11323c]">
      {/* Top CarePlus Navigation Bar */}
      <CarePlusNavbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onUploadClick={handleUploadClick}
        onResetToHome={handleResetToHome}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Prominent Educational Notice Banner */}
      <DisclaimerBanner />

      {/* Main Body */}
      <main className="flex-1 w-full pb-16">
        {currentView === 'landing' && (
          <div className="space-y-4">
            {/* 1. Hero Section matching CarePlus template */}
            <CarePlusHero
              onSelectSample={handleSelectSample}
              onUploadClick={handleUploadClick}
            />

            {/* 2. Our Departments Section */}
            <CarePlusDepartments
              onSelectSample={handleSelectSample}
            />

            {/* 3. Featured Services Section */}
            <CarePlusFeaturedServices
              onStartUpload={handleUploadClick}
              onSelectSample={handleSelectSample}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
            <Dashboard
              activeReport={activeReport}
              setActiveReport={setActiveReport}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              error={error}
              setError={setError}
              showUploaderOnly={showUploaderOnly}
              setShowUploaderOnly={setShowUploaderOnly}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'samples' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
            <SampleLibrary onSelectSample={handleSelectSample} />
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
            <ReportHistory
              user={user}
              onSelectReport={handleViewSavedReport}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)}
      />

      {/* Footer matching CarePlus clean medical aesthetic */}
      <footer className="border-t border-[#def1f5] bg-white py-10 text-xs text-[#558694] no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#189ab4] flex items-center justify-center text-white">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-extrabold text-sm uppercase text-[#175362] tracking-wider">
                CarePlus Medical • ReportSaathi
              </span>
            </div>

            <div className="flex items-center gap-5 text-[11px] font-semibold text-[#558694]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#189ab4]" />
                <span>Zero File Storage Privacy Policy</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Non-Diagnostic Educational Tool</span>
              </span>
            </div>
          </div>

          <div className="border-t border-[#def1f5]/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <p>
              © 2026 ReportSaathi. All medical educational content is provided for health literacy purposes only.
            </p>
            <p className="text-[#189ab4] font-medium">
              Powered by Google Gemini 3.5 & FastAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
