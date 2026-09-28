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
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Neural Weave Glowing Icon */}
      <div className={`relative ${currentSize.icon} rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-600/30 shrink-0 group`}>
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Animated Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* SVG Neural Weave / Kamva Threads */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            {/* Neural Interconnected Weave Paths (تارهای عصبی کامواوب) */}
            <path
              d="M8 20 C 14 10, 26 30, 32 20"
              stroke="url(#kamva-grad-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M10 28 C 16 16, 24 16, 30 28"
              stroke="url(#kamva-grad-2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 1"
            />
            <path
              d="M20 8 C 12 18, 28 22, 20 32"
              stroke="url(#kamva-grad-3)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            
            {/* Neural Synaptic Nodes */}
            <circle cx="8" cy="20" r="2.5" fill="#818cf8" />
            <circle cx="20" cy="8" r="2.2" fill="#34d399" />
            <circle cx="32" cy="20" r="2.5" fill="#c084fc" />
            <circle cx="20" cy="32" r="2.2" fill="#60a5fa" />
            <circle cx="20" cy="20" r="3.2" fill="#ffffff" />

            <defs>
              <linearGradient id="kamva-grad-1" x1="8" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="0.5" stopColor="#a855f7" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="kamva-grad-2" x1="10" y1="28" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="kamva-grad-3" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#ffffff" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-right leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white ${currentSize.text} bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent`}>
              کامواوب
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
              PRO
            </span>
          </div>
          {subtitle ? (
            <span className={`text-slate-400 font-medium mt-1 ${currentSize.sub}`}>
              {subtitle}
            </span>
          ) : (
            <span className={`text-slate-400 font-medium mt-1 ${currentSize.sub}`}>
              هسته عصبی و سیستم یکپارچه وردپرس
            </span>
          )}
        </div>
      )}
    </div>
  );
};
