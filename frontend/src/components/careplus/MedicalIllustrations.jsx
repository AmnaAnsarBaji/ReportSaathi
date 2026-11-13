import React from 'react';

// Hero illustration of doctor consultation in clean CarePlus medical aesthetic
export function DoctorConsultationArt({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bgGlow" x1="260" y1="0" x2="260" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bfe4ed" stopOpacity="0.6" />
          <stop stopColor="#e5f5f8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop stopColor="#E2F0F4" />
        </linearGradient>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#189ab4" />
          <stop stopColor="#137d94" />
        </linearGradient>
        <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#55b5cc" />
          <stop stopColor="#358e9f" />
        </linearGradient>
      </defs>

      {/* Ambient medical glow circle */}
      <circle cx="280" cy="210" r="190" fill="url(#bgGlow)" />

      {/* Hospital Clinic Background elements */}
      <rect x="70" y="90" width="130" height="90" rx="14" fill="#ffffff" fillOpacity="0.7" stroke="#bee3ec" strokeWidth="2" />
      <line x1="85" y1="120" x2="135" y2="120" stroke="#8ecfde" strokeWidth="3" strokeLinecap="round" />
      <line x1="85" y1="135" x2="170" y2="135" stroke="#bee3ec" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="85" y1="150" x2="150" y2="150" stroke="#bee3ec" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="170" cy="115" r="10" fill="#def1f5" />
      <path d="M167 115H173M170 112V118" stroke="#189ab4" strokeWidth="2" strokeLinecap="round" />

      {/* Diagnostic Monitor screen */}
      <rect x="220" y="60" width="100" height="70" rx="10" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
      <rect x="228" y="68" width="84" height="46" rx="6" fill="#175362" />
      <path d="M234 92H246L251 83L256 100L261 88L265 92H304" stroke="#42b0c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="265" y="130" width="10" height="20" fill="#bee3ec" />
      <rect x="255" y="148" width="30" height="4" rx="2" fill="#bee3ec" />

      {/* Doctor (Left/Center) */}
      <g transform="translate(140, 100)">
        {/* Head & Hair */}
        <ellipse cx="90" cy="65" rx="26" ry="30" fill="#FCD5B5" />
        <path d="M64 62C64 42 75 35 90 35C106 35 116 42 116 62C116 52 111 44 102 42C95 40 85 41 78 45C72 49 65 55 64 62Z" fill="#5A6B74" />
        {/* Ears */}
        <circle cx="64" cy="68" r="6" fill="#F5C09B" />
        <circle cx="116" cy="68" r="6" fill="#F5C09B" />
        {/* Face features */}
        <circle cx="82" cy="64" r="3" fill="#3D4B52" />
        <circle cx="98" cy="64" r="3" fill="#3D4B52" />
        <path d="M86 76C88 78 92 78 94 76" stroke="#C27D56" strokeWidth="2" strokeLinecap="round" />
        {/* Neck */}
        <rect x="83" y="90" width="14" height="16" fill="#FCD5B5" />
        {/* Shirt & Blue Tie */}
        <path d="M78 104L90 120L102 104H78Z" fill="#E2F0F4" />
        <path d="M88 106L87 145L90 152L93 145L92 106H88Z" fill="#189ab4" />
        {/* Doctor Coat */}
        <path d="M50 115C60 102 78 104 78 104L88 175H52C42 175 40 145 50 115Z" fill="url(#coatGrad)" stroke="#bee3ec" strokeWidth="1.5" />
        <path d="M130 115C120 102 102 104 102 104L92 175H128C138 175 140 145 130 115Z" fill="url(#coatGrad)" stroke="#bee3ec" strokeWidth="1.5" />
        <path d="M68 112L88 175L92 175L112 112L102 104L90 125L78 104L68 112Z" fill="#ffffff" />
        {/* Stethoscope */}
        <path d="M76 112C76 135 84 150 90 150C96 150 104 135 104 112" stroke="#486581" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="90" cy="155" r="6" fill="#189ab4" stroke="#ffffff" strokeWidth="2" />
        {/* ID Badge */}
        <rect x="62" y="132" width="14" height="20" rx="3" fill="#ffffff" stroke="#bee3ec" />
        <rect x="65" y="136" width="8" height="6" fill="#189ab4" />
      </g>

      {/* Patient (Right side, listening) */}
      <g transform="translate(260, 120)">
        {/* Head & Hair */}
        <ellipse cx="90" cy="65" rx="24" ry="28" fill="#F8CBA6" />
        <path d="M66 65C66 40 76 30 90 30C104 30 114 40 114 65C114 55 110 44 100 42C92 40 82 43 76 47C70 51 67 58 66 65Z" fill="#713F12" />
        <circle cx="66" cy="67" r="5" fill="#E8B084" />
        {/* Hair Bun / Ponytail */}
        <ellipse cx="114" cy="58" rx="8" ry="12" fill="#713F12" />
        {/* Face */}
        <circle cx="82" cy="64" r="2.5" fill="#451A03" />
        <path d="M84 75C87 77 91 77 93 75" stroke="#C27D56" strokeWidth="1.8" strokeLinecap="round" />
        {/* Neck */}
        <rect x="84" y="90" width="12" height="14" fill="#F8CBA6" />
        {/* Patient Garment / Soft teal scrub */}
        <path d="M60 104C70 98 84 100 84 100L96 100C96 100 110 98 120 104C128 112 130 140 126 170H54C50 140 52 112 60 104Z" fill="url(#patientGrad)" />
      </g>

      {/* Floating Trust Card Badge 1 (Left bottom) */}
      <g transform="translate(35, 270)">
        <rect width="170" height="56" rx="16" fill="#ffffff" filter="drop-shadow(0 10px 20px rgba(24,154,180,0.12))" />
        <circle cx="28" cy="28" r="16" fill="#def1f5" />
        <path d="M22 28L26 32L34 24" stroke="#189ab4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="52" y="24" fill="#184653" fontSize="11" fontWeight="700" fontFamily="sans-serif">99% Clarity</text>
        <text x="52" y="38" fill="#627D98" fontSize="9.5" fontFamily="sans-serif">Jargon-Free Explanations</text>
      </g>

      {/* Floating Trust Card Badge 2 (Right bottom) */}
      <g transform="translate(320, 260)">
        <rect width="165" height="56" rx="16" fill="#ffffff" filter="drop-shadow(0 10px 20px rgba(24,154,180,0.12))" />
        <circle cx="28" cy="28" r="16" fill="#def1f5" />
        <path d="M28 20V36M20 28H36" stroke="#189ab4" strokeWidth="2.5" strokeLinecap="round" />
        <text x="52" y="24" fill="#184653" fontSize="11" fontWeight="700" fontFamily="sans-serif">Doctor-Ready</text>
        <text x="52" y="38" fill="#627D98" fontSize="9.5" fontFamily="sans-serif">Practical Questions</text>
      </g>
    </svg>
  );
}

// CT / MRI Diagnostic Scanner Illustration for Featured Services
export function CTScannerArt({ className = "w-full h-44 object-cover" }) {
  return (
    <div className={`bg-gradient-to-br from-[#e0f3f7] to-[#bee3ec] flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 300 180" fill="none" className="w-full h-full max-h-40">
        {/* Modern Medical Imaging Room */}
        <circle cx="120" cy="90" r="65" stroke="#ffffff" strokeWidth="16" fill="#def1f5" />
        <circle cx="120" cy="90" r="45" fill="#175362" stroke="#189ab4" strokeWidth="3" />
        <circle cx="120" cy="90" r="32" fill="#0e3742" />
        <path d="M120 70A20 20 0 0 1 140 90" stroke="#42b0c3" strokeWidth="3" strokeLinecap="round" />

        {/* Patient Sliding Bed Table */}
        <rect x="90" y="85" width="170" height="14" rx="7" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <rect x="180" y="99" width="45" height="40" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <rect x="160" y="139" width="85" height="8" rx="4" fill="#8ecfde" />

        {/* Control Console / Glass Pane */}
        <rect x="235" y="35" width="55" height="70" rx="8" fill="#ffffff" fillOpacity="0.85" stroke="#bee3ec" />
        <rect x="242" y="42" width="41" height="30" rx="4" fill="#175362" />
        <line x1="246" y1="56" x2="278" y2="56" stroke="#42b0c3" strokeWidth="1.5" />
        <circle cx="250" cy="85" r="3" fill="#189ab4" />
        <circle cx="260" cy="85" r="3" fill="#55b5cc" />
        <circle cx="270" cy="85" r="3" fill="#8ecfde" />
      </svg>
    </div>
  );
}

// Modern Laboratory / Surgical Suite with Diagnostic Screens
export function ModernSuiteArt({ className = "w-full h-44 object-cover" }) {
  return (
    <div className={`bg-gradient-to-br from-[#def1f5] to-[#c7e9f1] flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 300 180" fill="none" className="w-full h-full max-h-40">
        {/* Surgical / Diagnostic Bed */}
        <rect x="80" y="100" width="140" height="16" rx="6" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <rect x="135" y="116" width="30" height="30" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <rect x="110" y="146" width="80" height="8" rx="4" fill="#8ecfde" />

        {/* Overhead Surgical Lamp */}
        <path d="M150 20V50" stroke="#8ecfde" strokeWidth="4" />
        <ellipse cx="150" cy="55" rx="35" ry="12" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <ellipse cx="150" cy="57" rx="20" ry="6" fill="#def1f5" />
        <polygon points="120,65 180,65 210,110 90,110" fill="#ffffff" fillOpacity="0.15" />

        {/* Diagnostic Monitor 1 */}
        <rect x="25" y="40" width="45" height="50" rx="6" fill="#ffffff" stroke="#bee3ec" strokeWidth="1.5" />
        <rect x="29" y="44" width="37" height="28" rx="3" fill="#175362" />
        <path d="M33 58L39 52L44 63L49 55L54 58H62" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />

        {/* Diagnostic Monitor 2 */}
        <rect x="225" y="35" width="55" height="65" rx="6" fill="#ffffff" stroke="#bee3ec" strokeWidth="1.5" />
        <rect x="230" y="40" width="45" height="35" rx="3" fill="#184653" />
        <line x1="235" y1="50" x2="265" y2="50" stroke="#42b0c3" strokeWidth="2" strokeLinecap="round" />
        <line x1="235" y1="58" x2="255" y2="58" stroke="#8ecfde" strokeWidth="2" strokeLinecap="round" />
        <line x1="235" y1="66" x2="268" y2="66" stroke="#bee3ec" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Preventative Consultation & Lab Paperwork Desk
export function ConsultationDeskArt({ className = "w-full h-44 object-cover" }) {
  return (
    <div className={`bg-gradient-to-br from-[#e0f3f6] to-[#b9e5ec] flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 300 180" fill="none" className="w-full h-full max-h-40">
        {/* Physician Desk */}
        <rect x="40" y="110" width="220" height="12" rx="4" fill="#ffffff" stroke="#bee3ec" strokeWidth="2" />
        <rect x="60" y="122" width="16" height="35" fill="#def1f5" />
        <rect x="224" y="122" width="16" height="35" fill="#def1f5" />

        {/* Lab Report Paper */}
        <rect x="75" y="65" width="60" height="45" rx="4" fill="#ffffff" stroke="#bee3ec" strokeWidth="1.5" />
        <rect x="83" y="73" width="20" height="4" rx="2" fill="#189ab4" />
        <line x1="83" y1="83" x2="125" y2="83" stroke="#bee3ec" strokeWidth="2" strokeLinecap="round" />
        <line x1="83" y1="91" x2="120" y2="91" stroke="#bee3ec" strokeWidth="2" strokeLinecap="round" />
        <line x1="83" y1="99" x2="110" y2="99" stroke="#bee3ec" strokeWidth="2" strokeLinecap="round" />

        {/* Stethoscope on Desk */}
        <path d="M150 75C150 95 160 105 175 105C190 105 198 95 198 75" stroke="#184653" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="175" cy="105" r="7" fill="#189ab4" stroke="#ffffff" strokeWidth="2" />

        {/* Medical Cross Clipboard Badge */}
        <rect x="210" y="60" width="40" height="50" rx="6" fill="#ffffff" stroke="#bee3ec" />
        <path d="M226 80H234M230 76V84" stroke="#189ab4" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
