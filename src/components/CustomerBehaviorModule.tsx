import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, RefreshCw } from 'lucide-react';

interface CustomerBehaviorModuleProps {
  clickPath: string[];
  dwellTimes: Record<string, string>;
  bounceRate: string;
  behaviorReport: any;
  onUpdateReport: (newReport: any) => void;
}

export const CustomerBehaviorModule: React.FC<CustomerBehaviorModuleProps> = ({
  clickPath,
  dwellTimes,
  bounceRate,
  behaviorReport,
  onUpdateReport,
}) => {
  const [isAnalyzingBehavior, setIsAnalyzingBehavior] = useState(false);

  const handleRunBehaviorAnalysis = async () => {
    setIsAnalyzingBehavior(true);
    try {
      const res = await fetch('/api/ai/behavior-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickPath,
          dwellTimes,
          bounceRate,
          userContext: 'تحلیل رفتار زنده مشتریان در فروشگاه کامواوب'
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        onUpdateReport(data.analysis);
      }
    } catch (err: any) {
      console.error('Behavior analysis error:', err);
    } finally {
      setIsAnalyzingBehavior(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              هوش مصنوعی رفتارشناسی فعال
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-time Visitor Metrics</span>
          </div>
          <h3 className="text-xl font-black text-white">گزارش تخصصی تحلیل رفتار مشتری و بهینه‌سازی فروش</h3>
          <p className="text-xs text-slate-300 mt-1">
            بررسی مسیر کلیک‌ها، مدت زمان توقف روی محصولات، نرخ پرش و ارائه راهکارهای خودکار هوش مصنوعی برای افزایش فروش و تبدیل.
          </p>
        </div>

        <button
          onClick={handleRunBehaviorAnalysis}
          disabled={isAnalyzingBehavior}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isAnalyzingBehavior ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>در حال تحلیل رفتار با هوش مصنوعی...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>اجرای تحلیل زنده رفتار و دریافت گزارش CRO</span>
            </>
          )}
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 block">نرخ پرش (Bounce Rate)</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{bounceRate}</span>
          <span className="text-[10px] text-emerald-400 block">۲.۴٪ بهبود نسبت به هفته گذشته</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 block">امتیاز نرخ تبدیل (CRO Score)</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{behaviorReport.croScore || 86} / 100</span>
          <span className="text-[10px] text-indigo-300 block">وضعیت: عالی و آماده رشد</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 block">مسیرهای کلیک بررسی شده</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">{clickPath.length} مرحله کلیدی</span>
          <span className="text-[10px] text-slate-400 block">ثبت‌شده در دیتابیس پایدار</span>
        </div>
      </div>

      {/* Detailed Behavior Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Click Path & Dwell Times */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>مسیر کلیک‌های مخاطب (User Click Path)</span>
            </h4>
            <div className="space-y-2">
              {clickPath.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>مدت زمان توقف روی محصولات (Product Dwell Times)</span>
            </h4>
            <div className="space-y-2">
              {Object.entries(dwellTimes).map(([prod, time], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-900 border border-slate-800/80 p-3 rounded-xl">
                  <span className="text-slate-200 font-medium">{prod}</span>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analytical Report & Sales Optimization Recommendations */}
        <div className="space-y-4">
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>گزارش تحلیلی هوش مصنوعی برای بهینه‌سازی فروش</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">AI Active</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 block font-bold">خلاصه تحلیل رفتار:</span>
                <p>{behaviorReport.behaviorSummary || behaviorReport.analysisText || 'داده‌های رفتار مخاطب ارزیابی شد.'}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-[11px] text-amber-400 block font-bold">تحلیل نرخ پرش و خروج:</span>
                <p>{behaviorReport.bounceRateAnalysis || 'نرخ پرش تحت کنترل است.'}</p>
              </div>

              {behaviorReport.actionableRecommendations && behaviorReport.actionableRecommendations.length > 0 && (
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-3.5 rounded-xl space-y-2">
                  <span className="text-[11px] text-indigo-300 block font-bold">پیشنهادات عملیاتی هوش مصنوعی:</span>
                  <ul className="space-y-1 list-disc list-inside text-slate-200">
                    {behaviorReport.actionableRecommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {behaviorReport.personalizedOffer && (
                <div className="bg-emerald-950/35 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-300 block">پیشنهاد ویژه فردی‌سازی شده:</span>
                    <span className="font-bold text-white text-xs">{behaviorReport.personalizedOffer}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-mono text-xs font-bold">فعال</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
