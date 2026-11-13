import React, { useState, useEffect } from 'react';
import { Loader2, FileSearch, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Uploading & scanning document format', icon: FileSearch },
  { label: 'Running OCR & extracting biomedical values', icon: Brain },
  { label: 'Consulting Gemini Clinical Language Model', icon: Sparkles },
  { label: 'Formatting plain-English explanations & doctor questions', icon: CheckCircle2 },
];

export default function ProcessingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-xl mx-auto text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-60"></div>
        <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
          <Loader2 className="w-9 h-9 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Analyzing Your Lab Report
      </h3>
      <p className="text-sm text-slate-500 mb-8">
        Please wait a moment while our dual OCR and AI pipeline interprets your results.
      </p>

      <div className="space-y-3.5 text-left max-w-sm mx-auto">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : isDone
                  ? 'text-slate-700 bg-slate-50'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
