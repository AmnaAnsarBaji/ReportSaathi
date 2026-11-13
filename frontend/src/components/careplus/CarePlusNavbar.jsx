import React, { useState } from 'react';
import {
  Plus,
  UploadCloud,
  History,
  User,
  LogOut,
  Database,
  ChevronDown,
} from 'lucide-react';
import { isSupabaseConfigured, signOutUser } from '../../services/supabase';

export default function CarePlusNavbar({
  currentView,
  setCurrentView,
  onUploadClick,
  onResetToHome,
  user,
  onOpenAuth,
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#558694]">
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
            Upload
          </button>

          <button
            onClick={() => {
              setCurrentView('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors hover:text-[#189ab4] flex items-center gap-1.5 ${
              currentView === 'history' ? 'text-[#189ab4] font-bold' : ''
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Saved History</span>
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode / Supabase Status Pill */}
          {!isSupabaseConfigured ? (
            <span
              title="Supabase credentials absent. Running in Demo Mode with local simulation."
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100/80 text-amber-900 border border-amber-300"
            >
              <Database className="w-3 h-3 text-amber-600" />
              <span>Demo Mode</span>
            </span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#def1f5] text-xs font-semibold text-[#175362] hover:border-[#8ecfde] transition shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#189ab4] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#def1f5] shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-[#def1f5]/60 text-[11px] text-[#558694] truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setCurrentView('history');
                    }}
                    className="w-full text-left px-3 py-2 text-[#175362] hover:bg-[#def1f5]/50 flex items-center gap-2"
                  >
                    <History className="w-3.5 h-3.5 text-[#189ab4]" />
                    <span>My Saved Reports</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#def1f5] text-xs font-bold text-[#146578] hover:bg-[#def1f5]/50 transition shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#189ab4]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary Upload CTA Button */}
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#189ab4] hover:bg-[#137d94] active:scale-95 text-white font-semibold text-xs shadow-md shadow-[#189ab4]/25 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Report</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
}
