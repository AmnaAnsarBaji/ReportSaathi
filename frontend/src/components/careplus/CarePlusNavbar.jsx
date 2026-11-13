import React from 'react';
import { Plus, UploadCloud, Activity } from 'lucide-react';

export default function CarePlusNavbar({ currentView, setCurrentView, onUploadClick, onResetToHome }) {
  return (
    <header className="sticky top-0 z-50 bg-[#f1f8fa]/90 backdrop-blur-md border-b border-[#def1f5] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* CarePlus Brand Logo */}
        <div
          onClick={onResetToHome}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#189ab4] to-[#42b0c3] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#175362] leading-none uppercase">
              CarePlus <span className="text-[#189ab4]">Medical</span>
            </span>
            <span className="text-[10px] font-semibold text-[#55b5cc] tracking-wider uppercase mt-0.5">
              ReportSaathi • Health Literacy
            </span>
          </div>
        </div>

        {/* Navigation Links (Matching Screenshot: Home, Services, Departments, Sample Library, Contact) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#558694]">
          <button
            onClick={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors hover:text-[#189ab4] ${
              currentView === 'landing' ? 'text-[#189ab4] font-bold' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-[#189ab4]"
          >
            Services
          </button>

          <button
            onClick={() => {
              setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('departments-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-[#189ab4]"
          >
            Departments
          </button>

          <button
            onClick={() => setCurrentView('samples')}
            className={`transition-colors hover:text-[#189ab4] flex items-center gap-1 ${
              currentView === 'samples' ? 'text-[#189ab4] font-bold' : ''
            }`}
          >
            <span>Sample Reports</span>
            <span className="px-1.5 py-0.2 bg-[#def1f5] text-[#146578] rounded-full text-[10px]">
              4
            </span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`transition-colors hover:text-[#189ab4] ${
              currentView === 'dashboard' ? 'text-[#189ab4] font-bold' : ''
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Right CTA Button (Pill shaped Book Appointment / Upload Report) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#189ab4] hover:bg-[#137d94] active:scale-95 text-white font-semibold text-xs shadow-md shadow-[#189ab4]/25 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
