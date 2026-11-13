import React, { useState } from 'react';
import CarePlusNavbar from './components/careplus/CarePlusNavbar';
import CarePlusHero from './components/careplus/CarePlusHero';
import CarePlusDepartments from './components/careplus/CarePlusDepartments';
import CarePlusFeaturedServices from './components/careplus/CarePlusFeaturedServices';
import Dashboard from './components/dashboard/Dashboard';
import SampleLibrary from './components/samples/SampleLibrary';
import DisclaimerBanner from './components/common/DisclaimerBanner';
import { SAMPLE_REPORTS } from './data/sampleReports';
import { Plus, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'samples'
  const [activeReport, setActiveReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showUploaderOnly, setShowUploaderOnly] = useState(true);

  const handleUploadClick = () => {
    setCurrentView('dashboard');
    setShowUploaderOnly(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sampleId) => {
    setError(null);
    setIsAnalyzing(true);
    setCurrentView('dashboard');
    setShowUploaderOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsAnalyzing(false);
      const sample = SAMPLE_REPORTS.find((s) => s.id === sampleId) || SAMPLE_REPORTS[0];
      setActiveReport(sample);
    }, 700);
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
            />
          </div>
        )}

        {currentView === 'samples' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
            <SampleLibrary onSelectSample={handleSelectSample} />
          </div>
        )}
      </main>

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
                Zero PII Storage
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#189ab4]" />
                Educational Non-Diagnostic Purpose
              </span>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#81aab5] border-t border-[#f0f9fa] pt-6 leading-relaxed max-w-2xl mx-auto">
            CarePlus Medical ReportSaathi is an educational health literacy platform designed to explain medical laboratory printouts in accessible language for constructive doctor-patient dialogues. Always consult your qualified healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}
