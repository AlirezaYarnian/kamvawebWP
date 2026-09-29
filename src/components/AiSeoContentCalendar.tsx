import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Layers, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AiSeoContentCalendar: React.FC = () => {
  const [niche, setNiche] = useState('فروشگاه سخت‌افزار و تجهیزات مهندسی');
  const [mainKeyword, setMainKeyword] = useState('اولترابوک برنامه‌نویسی و گیمینگ');
  const [targetAudience, setTargetAudience] = useState('توسعه‌دهندگان نرم‌افزار، مهندسان و گیمرهای حرفه‌ای');

  const [isLoading, setIsLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState<any>(null);
  const [expandedQuarter, setExpandedQuarter] = useState<number | null>(0);

  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/seo/annual-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, mainKeyword, targetAudience }),
      });
      const data = await res.json();
      if (data.success && data.strategy) {
        setStrategyResult(data.strategy);
      }
    } catch (e) {
      console.error('Failed to generate SEO strategy', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateStrategy();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                استراتژی سئو و محتوای سالانه
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                AiSeoContentCalendar
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              تقویم و استراتژی سئو سالانه مبتنی بر هوش مصنوعی
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تولید نقشه راه سئو ۱۲ ماهه (فصول Q1 تا Q4) بر اساس حوزه تخصصی، خوشه‌بندی کلمات کلیدی و اهداف جستجوی گوگل.
            </p>
          </div>

          <button
            onClick={handleGenerateStrategy}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 ring-1 ring-indigo-400/50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'در حال تحلیل سئو...' : 'بازتولید استراتژی سالانه'}</span>
          </button>
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">حوزه فعالیت (Niche):</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">کلمه کلیدی اصلی (Focus Keyword):</label>
          <input
            type="text"
            value={mainKeyword}
            onChange={(e) => setMainKeyword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">مخاطبان هدف (Audience):</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Strategy Overview & Quarters */}
      {strategyResult && (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-lg font-extrabold text-white">{strategyResult.strategyTitle}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{strategyResult.overview}</p>
          </div>

          <div className="space-y-4">
            {strategyResult.quarters?.map((q: any, qIdx: number) => {
              const isExpanded = expandedQuarter === qIdx;
              return (
                <div key={qIdx} className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
                  <button
                    onClick={() => setExpandedQuarter(isExpanded ? null : qIdx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-right bg-slate-950/60 hover:bg-slate-800/60 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs">
                        Q{qIdx + 1}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">{q.quarter}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{q.focus}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-6 space-y-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {q.articles?.map((art: any, artIdx: number) => (
                        <div key={artIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold font-mono">
                              {art.month}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                              {art.searchIntent || 'معاملاتی'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                              کلمه کلیدی: {art.targetKeyword}
                            </span>
                            <h5 className="font-extrabold text-white text-base leading-snug">{art.title}</h5>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                            <span>تخمین ترافیک: <strong className="text-emerald-400">{art.estimatedTraffic}</strong></span>
                            {art.estimatedCtr && <span>CTR: <strong className="text-indigo-300">{art.estimatedCtr}</strong></span>}
                          </div>

                          {art.outline && art.outline.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                              <span className="text-[11px] font-bold text-slate-300 block">سرفصل‌های پیشنهادی مقاله (Outline):</span>
                              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 font-sans">
                                {art.outline.map((heading: string, hIdx: number) => (
                                  <li key={hIdx}>{heading}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
