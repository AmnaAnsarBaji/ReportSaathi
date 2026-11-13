import React, { useState, useEffect } from 'react';
import { Loader2, FileSearch, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Scanning document format and verifying resolution', icon: FileSearch },
  { label: 'Extracting biomedical parameters and reference ranges', icon: Brain },
  { label: 'Synthesizing plain-language explanations & triage status', icon: Sparkles },
  { label: 'Compiling personalized questions for your physician', icon: CheckCircle2 }
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 650);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 350);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="bg-white rounded-[32px] border border-[#def1f5] p-8 sm:p-12 shadow-[0_10px_35px_rgba(24,154,180,0.08)] max-w-xl mx-auto text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-[#def1f5] animate-ping opacity-60"></div>
        <div className="relative w-20 h-20 rounded-full bg-[#def1f5]/70 border-2 border-[#189ab4] flex items-center justify-center text-[#189ab4] shadow-inner">
          <Loader2 className="w-9 h-9 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#11323c] mb-1">
        Analyzing Lab Report
      </h3>
      <p className="text-xs sm:text-sm text-[#558694] mb-6">
        Interpreting parameters and preparing plain-language patient explanations...
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-[#def1f5]/60 rounded-full h-2.5 mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#189ab4] to-[#42b0c3] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#def1f5]/60 border border-[#8ecfde] text-[#146578] font-semibold'
                  : isDone
                  ? 'text-[#558694] bg-[#f4fafc]'
                  : 'text-slate-400 opacity-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-[#189ab4] text-white shadow-xs'
                    : isDone
                    ? 'bg-[#def1f5] text-[#189ab4]'
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
              <span className="text-xs sm:text-sm leading-snug">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
