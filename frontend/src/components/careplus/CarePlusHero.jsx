import React, { useState } from 'react';
import { DoctorConsultationArt } from './MedicalIllustrations';
import { Sparkles, ChevronDown, FileText, ArrowRight } from 'lucide-react';

export default function CarePlusHero({ onSelectSample, onUploadClick }) {
  const [selectedDept, setSelectedDept] = useState('cbc-routine');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const handleBarSubmit = (e) => {
    e.preventDefault();
    onSelectSample(selectedDept);
  };

  return (
    <section className="max-w-6xl mx-auto pt-4 pb-12 px-4 sm:px-6">
      {/* Big Rounded Hero Card (Directly replicating the screenshot layout) */}
      <div className="rounded-[36px] bg-gradient-to-br from-[#d7edf4] via-[#e6f4f8] to-[#edf7fa] border border-[#bee3ec]/70 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Tagline */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white text-[#146578] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#189ab4]" />
              <span>Demystifying Laboratory Reports for Everyone</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#11323c] tracking-tight leading-[1.12]">
                Your Health,<br />
                Our Priority
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#42717f] max-w-lg">
                Compassionate Care for You and Your Family
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#558694] max-w-md leading-relaxed">
              Medical lab results can feel intimidating and confusing. ReportSaathi breaks down diagnostic metrics into clear, plain language with doctor-aligned discussion points.
            </p>

            {/* Floating Glassmorphic Quick Bar (Matching the exact floating bar from screenshot) */}
            <div className="pt-2">
              <form
                onSubmit={handleBarSubmit}
                className="glass-pill rounded-2xl p-3.5 sm:p-4 shadow-lg shadow-[#146578]/5 border border-white/90 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                {/* Field 1: Department */}
                <div>
                  <label className="block text-[11px] font-bold text-[#175362] uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full text-xs font-medium text-[#184653] bg-white/90 border border-[#bee3ec] rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-[#189ab4]"
                    >
                      <option value="cbc-routine">Complete Blood Count (CBC)</option>
                      <option value="lipid-profile">Lipid & Cardiology Panel</option>
                      <option value="glucose-diabetes">Glycemic & Diabetes (HbA1c)</option>
                      <option value="lft-hepatic">Liver Function Test (LFT)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#55b5cc] absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Field 2: Format */}
                <div>
                  <label className="block text-[11px] font-bold text-[#175362] uppercase tracking-wider mb-1">
                    Report Format
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="w-full text-xs font-medium text-[#184653] bg-white/90 border border-[#bee3ec] rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-[#189ab4]"
                    >
                      <option value="all">Any Format (PDF/JPG)</option>
                      <option value="pdf">Digital PDF</option>
                      <option value="scan">Photo Scan (PNG/JPG)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#55b5cc] absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Field 3: Date / Choose Sample or Upload */}
                <div>
                  <label className="block text-[11px] font-bold text-[#175362] uppercase tracking-wider mb-1">
                    Input Source
                  </label>
                  <button
                    type="button"
                    onClick={onUploadClick}
                    className="w-full text-left text-xs font-medium text-[#184653] bg-white/90 border border-[#bee3ec] hover:border-[#189ab4] rounded-xl px-3 py-2 flex items-center justify-between"
                  >
                    <span className="truncate">Upload My File...</span>
                    <FileText className="w-3.5 h-3.5 text-[#189ab4] shrink-0 ml-1" />
                  </button>
                </div>

                {/* Field 4: Action Button (Book Now / Explain Now) */}
                <div>
                  <button
                    type="submit"
                    className="w-full h-[38px] rounded-xl bg-[#189ab4] hover:bg-[#137d94] active:scale-95 text-white font-bold text-xs shadow-md shadow-[#189ab4]/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Explain Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Doctor Consultation Artwork */}
          <div className="lg:col-span-5 flex justify-center relative">
            <DoctorConsultationArt className="w-full max-w-md lg:max-w-none drop-shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
