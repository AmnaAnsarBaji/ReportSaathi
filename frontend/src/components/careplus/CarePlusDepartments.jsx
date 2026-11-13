import React from 'react';
import { Truck, Heart, Baby, Stethoscope, ArrowRight } from 'lucide-react';

export default function CarePlusDepartments({ onSelectSample }) {
  const departments = [
    {
      id: 'cbc-routine',
      title: 'Emergency Care',
      category: 'Hematology & CBC',
      description: 'Complete blood count, red cell indices, platelets, and acute infection markers.',
      icon: Truck, // Ambulance style
      tag: 'CBC Panel'
    },
    {
      id: 'glucose-diabetes',
      title: 'Pediatric Department',
      category: 'Routine & Metabolic',
      description: 'Pediatric and general wellness panels, glucose metabolism, and baseline vitals.',
      icon: Baby, // Teddy bear style
      tag: 'Metabolic & Sugar'
    },
    {
      id: 'lipid-profile',
      title: 'Cardiology',
      category: 'Lipid & Heart Health',
      description: 'Total cholesterol, HDL, LDL, triglycerides, and cardiovascular risk ratios.',
      icon: Heart, // Cardiology heart
      tag: 'Lipid Profile'
    },
    {
      id: 'lft-hepatic',
      title: 'Organ & Hepatic',
      category: 'Liver Function Panel',
      description: 'ALT, AST, Bilirubin, and protein synthesis indicators for organ health.',
      icon: Stethoscope, // Clinical diagnostics
      tag: 'Hepatic (LFT)'
    }
  ];

  return (
    <section id="departments-section" className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11323c] tracking-tight">
          Our Departments
        </h2>
        <p className="text-xs sm:text-sm text-[#558694] mt-1 max-w-md mx-auto">
          Tailored plain-language explanations across all standard medical laboratory disciplines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <div
              key={dept.id}
              onClick={() => onSelectSample(dept.id)}
              className="bg-white rounded-[28px] border border-[#def1f5] p-7 text-center shadow-[0_8px_25px_rgba(24,154,180,0.06)] hover:shadow-[0_16px_35px_rgba(24,154,180,0.12)] hover:border-[#8ecfde] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Soft aqua squircle icon container directly replicating screenshot */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#def1f5]/70 text-[#189ab4] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#189ab4] group-hover:text-white transition-all shadow-inner">
                  <IconComponent className="w-8 h-8 stroke-[2.2]" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#55b5cc] block mb-1">
                  {dept.category}
                </span>

                <h3 className="text-lg font-bold text-[#175362] mb-2 group-hover:text-[#189ab4] transition-colors">
                  {dept.title}
                </h3>

                <p className="text-xs text-[#558694] leading-relaxed line-clamp-3">
                  {dept.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#f0f9fa] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#189ab4]">
                <span>View Sample Explanation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
