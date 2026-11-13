import React from 'react';
import { Activity, UploadCloud, BookOpen, Sparkles, Home, FileText } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, onUploadClick, onResetToHome }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={onResetToHome}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Report<span className="text-emerald-600">Saathi</span>
              </span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                रिपोर्ट साथी
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Medical Lab Reports Explained in Simple Language
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'landing'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>About</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'dashboard' || currentView === 'results'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('samples')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'samples'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sample Library</span>
            <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full text-[10px]">
              4
            </span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Demo Frontend (Sample Data)
          </span>

          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
