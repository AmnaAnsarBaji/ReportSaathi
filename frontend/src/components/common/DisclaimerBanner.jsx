import React from 'react';
import { ShieldAlert, HeartPulse } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200/90 text-amber-950 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-snug">
            <strong className="font-semibold text-amber-900">Educational Purpose Only:</strong>{' '}
            ReportSaathi explains medical terminology to help you have informed conversations with your doctor. It does not provide medical diagnosis or treatment.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 shrink-0 self-end sm:self-auto">
          <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
          <span>Always consult your healthcare provider</span>
        </div>
      </div>
    </div>
  );
}
