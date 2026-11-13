import React from 'react';
import { CTScannerArt, ModernSuiteArt, ConsultationDeskArt } from './MedicalIllustrations';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CarePlusFeaturedServices({ onStartUpload, onSelectSample }) {
  const services = [
    {
      title: 'Advanced Diagnostics',
      category: 'Dual Extraction Technology',
      description: 'Accurately reads scanned diagnostic sheets, mobile photos, and digital PDFs via Tesseract OCR.',
      art: CTScannerArt,
      actionText: 'Try Uploading a Scan',
      action: onStartUpload,
    },
    {
      title: 'Specialized Explanations',
      category: 'Plain-Language Intelligence',
      description: 'Translates intimidating lab jargon and biomarkers into compassionate, easily readable explanations.',
      art: ModernSuiteArt,
      actionText: 'View Sample Analysis',
      action: () => onSelectSample('cbc-routine'),
    },
    {
      title: 'Doctor Discussion Guide',
      category: 'Collaborative Care',
      description: 'Generates intelligent, practical questions you can bring directly to your healthcare provider.',
      art: ConsultationDeskArt,
      actionText: 'Explore Questions Guide',
      action: () => onSelectSample('lipid-profile'),
    },
  ];

  return (
    <section id="services-section" className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11323c] tracking-tight">
          Featured Services
        </h2>
        <p className="text-xs sm:text-sm text-[#558694] mt-1 max-w-md mx-auto">
          Comprehensive health literacy tools designed to empower you during medical consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const ArtComponent = service.art;
          return (
            <div
              key={idx}
              className="bg-white rounded-[28px] border border-[#def1f5] overflow-hidden shadow-[0_8px_25px_rgba(24,154,180,0.06)] hover:shadow-[0_16px_35px_rgba(24,154,180,0.12)] hover:border-[#8ecfde] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Illustration Frame directly matching the screenshot */}
                <div className="w-full h-44 overflow-hidden border-b border-[#def1f5]/60 bg-[#f4fafc]">
                  <ArtComponent className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#55b5cc] block mb-1">
                    {service.category}
                  </span>

                  <h3 className="text-lg font-bold text-[#175362] mb-2 group-hover:text-[#189ab4] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#558694] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={service.action}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#def1f5]/60 hover:bg-[#189ab4] hover:text-white text-[#189ab4] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
