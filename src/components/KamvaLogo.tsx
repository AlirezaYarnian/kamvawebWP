import React from 'react';

interface KamvaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export const KamvaLogo: React.FC<KamvaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  subtitle,
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official CamwaWeb Logo Vector (Half Globe in Navy + Half Yarn Strands in Warm Coral) */}
      <div className={`relative ${currentSize.icon} shrink-0 group flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(240,80,35,0.25)] transition-transform duration-300 group-hover:scale-105"
        >
          {/* LEFT HALF: Navy Blue Globe with Latitude & Longitude Grid */}
          <g stroke="#2b3a67" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer Half Circle Arc */}
            <path d="M 50 10 A 40 40 0 0 0 50 90" />
            {/* Vertical Center Axis */}
            <line x1="50" y1="10" x2="50" y2="90" />
            {/* Longitude Inner Arc */}
            <path d="M 50 10 C 26 10, 26 90, 50 90" />
            {/* Horizontal Equator Line */}
            <line x1="10" y1="50" x2="50" y2="50" />
            {/* Upper Latitude Parallel */}
            <path d="M 18 30 C 28 35, 40 35, 50 35" />
            {/* Lower Latitude Parallel */}
            <path d="M 18 70 C 28 65, 40 65, 50 65" />
          </g>

          {/* RIGHT HALF: Stylized Camwa Yarn Strands in Warm Coral/Orange */}
          <g stroke="#f05023" strokeWidth="5.5" strokeLinecap="round" fill="none">
            {/* Top Arcs looping inwards into the yarn ball */}
            <path d="M 50 10 C 65 8, 80 20, 88 35" />
            <path d="M 50 25 C 68 22, 85 38, 92 50" />
            <path d="M 50 40 C 70 38, 88 56, 94 65" />
            {/* Central weave crossing strands */}
            <path d="M 50 55 C 65 52, 82 72, 86 82" />
            <path d="M 50 70 C 60 70, 75 82, 78 88" />
            {/* Outer bottom sweeping strand */}
            <path d="M 45 92 C 60 95, 80 85, 90 70" strokeWidth="5" />
          </g>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-right leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-extrabold tracking-normal text-xl" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
              <span className="text-[#f05023]">Camwa</span> <span className="text-[#647bb5]">Web</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#f05023]/20 text-[#ff7854] border border-[#f05023]/30">
              PRO
            </span>
          </div>
          {subtitle ? (
            <span className={`text-slate-400 font-medium mt-0.5 ${currentSize.sub}`}>
              {subtitle}
            </span>
          ) : (
            <span className={`text-slate-400 font-medium mt-0.5 ${currentSize.sub}`}>
              پلتفرم جامع وردپرس و موتور کاموا استور
            </span>
          )}
        </div>
      )}
    </div>
  );
};
