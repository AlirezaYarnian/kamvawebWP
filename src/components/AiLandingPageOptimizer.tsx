import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Split, 
  MousePointerClick, 
  Eye, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  Layout, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  Flame, 
  ShieldCheck, 
  AlertCircle, 
  Play, 
  Layers, 
  Globe, 
  Percent, 
  Sliders, 
  Clock, 
  Award, 
  Send
} from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  isOriginal: boolean;
  trafficSplitPercent: number;
  visitors: number;
  conversions: number;
  conversionRate: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSubtext: string;
  ctaColor: string;
  badgeText: string;
  heroLayout: string;
  urgencyTimer: boolean;
  confidenceScore: number;
  croRationale?: string;
}

interface LandingPage {
  id: string;
  title: string;
  url: string;
  themeTemplate: string;
  status: string;
  liveTraffic: {
    totalVisitors: number;
    uniqueSessions: number;
    bounceRate: number;
    avgTimeOnPageSeconds: number;
    conversions: number;
    conversionRate: number;
    revenueGeneratedRial: number;
    deviceBreakdown: { mobile: number; desktop: number; tablet: number };
    topDropoffSection: string;
  };
  activeVariants: Variant[];
}

export const AiLandingPageOptimizer: React.FC = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('lp_1');
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'variants' | 'traffic_cro' | 'settings'>('variants');

  // AI Generation states
  const [primaryGoal, setPrimaryGoal] = useState('افزایش نرخ خرید مستقیم و ثبت سفارش آنلاین');
  const [targetAudience, setTargetAudience] = useState('مشتریان ایرانی حساس به قیمت، زمان تحویل و ضمانت تعویض');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/landing-page-optimizer/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.pages || []);
        if (data.pages && data.pages.length > 0 && !selectedPageId) {
          setSelectedPageId(data.pages[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load landing pages', e);
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAnalyzeTraffic = async () => {
    if (!activePage) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/landing-page-optimizer/analyze-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: activePage.id })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.analysis);
        showToast('تحلیل هوشمند ترافیک و توصیه‌های CRO با موفقیت تولید شد.');
      }
    } catch (e) {
      console.error('Failed to analyze traffic', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariant = async () => {
    if (!activePage) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/landing-page-optimizer/generate-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: activePage.id,
          primaryGoal,
          targetAudience
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('نسخه جدید A/B با متون و چیدمان پیشنهادی هوش مصنوعی تولید شد!');
        fetchPages();
      }
    } catch (e) {
      console.error('Failed to generate variant', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeployWinner = async (variantId: string) => {
    if (!activePage) return;
    try {
      const res = await fetch('/api/landing-page-optimizer/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: activePage.id,
          variantId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchPages();
      }
    } catch (e) {
      console.error('Failed to deploy variant', e);
    }
  };

  const varA = activePage?.activeVariants.find(v => v.isOriginal) || activePage?.activeVariants[0];
  const varB = activePage?.activeVariants.find(v => !v.isOriginal) || activePage?.activeVariants[1];

  return (
    <div className="space-y-6 font-sans">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                بهینه‌ساز هوشمند صفحات فرود و تست A/B
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                AiLandingPageOptimizer v2.5
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              تولید خودکار نسخه‌های A/B صفحات فرود بر اساس تحلیل زنده ترافیک و رفتارسنجی کاربران
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              کپی‌رایتینگ ترغیب‌کننده، تغییر چیدمان (Layout Hacks) و بهینه‌سازی نقاط ریزش کاربران وردپرس با هوش مصنوعی Gemini.
            </p>
          </div>

          {/* Page Selector */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-xs space-y-2 min-w-[280px]">
            <label className="text-slate-400 font-medium block">انتخاب صفحه فرود هدف:</label>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 font-sans"
            >
              {pages.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            {activePage && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>ترافیک کل: <b className="text-white">{activePage.liveTraffic.totalVisitors.toLocaleString('fa-IR')}</b></span>
                <span>نرخ تبدیل: <b className="text-emerald-400">{activePage.liveTraffic.conversionRate}%</b></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {activePage && (
        <>
          {/* Top Traffic Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>بازدیدکنندگان کل</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-extrabold text-white">
                {activePage.liveTraffic.totalVisitors.toLocaleString('fa-IR')}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                موبایل {activePage.liveTraffic.deviceBreakdown.mobile}% | دسکتاپ {activePage.liveTraffic.deviceBreakdown.desktop}%
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>تبدیل‌های ثبت‌شده</span>
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-emerald-400">
                {activePage.liveTraffic.conversions.toLocaleString('fa-IR')}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-medium">
                نرخ تبدیل میانگین {activePage.liveTraffic.conversionRate}%
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>نرخ پرش (Bounce)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-extrabold text-amber-400">
                {activePage.liveTraffic.bounceRate}%
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                نقطه ریزش: {activePage.liveTraffic.topDropoffSection}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>درآمد حاصله (ریال)</span>
                <BarChart3 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-lg font-extrabold text-teal-300">
                {(activePage.liveTraffic.revenueGeneratedRial / 10000000).toLocaleString('fa-IR')} میلیون تومان
              </div>
              <div className="text-[11px] text-slate-400">
                A/B Split: ۵۰٪ / ۵۰٪
              </div>
            </div>
          </div>

          {/* Tab Navigation & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('variants')}
                className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'variants'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-4 h-4" />
                مقایسه نسخه‌های A/B
              </button>
              <button
                onClick={() => setActiveTab('traffic_cro')}
                className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'traffic_cro'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                تحلیل ترافیک و پیشنهادات CRO
              </button>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'desktop' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="نمای دسکتاپ"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'tablet' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="نمای تبلت"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'mobile' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="نمای موبایل"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB 1: A/B Variant Comparison & AI Generation */}
          {activeTab === 'variants' && (
            <div className="space-y-6">

              {/* AI Generation Form */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    تنظیمات ساخت نسخه جایگزین B با هوش مصنوعی
                  </h3>
                  <span className="text-xs text-slate-400">Gemini CRO Copywriting Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">هدف اصلی بهینه‌سازی (Goal):</label>
                    <input
                      type="text"
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">پرسونای مخاطبان هدف (Target Audience):</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGenerateVariant}
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    تولید نسخه B با چیدمان و کپی جدید
                  </button>
                </div>
              </div>

              {/* Side-by-Side Visual Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Variant A (Control) */}
                {varA && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono font-bold">
                          نسخه کنترل A
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">{varA.name}</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-slate-400">نرخ تبدیل:</div>
                        <div className="text-lg font-extrabold text-indigo-400">{varA.conversionRate}%</div>
                      </div>
                    </div>

                    {/* Simulated Page Render Preview */}
                    <div className={`bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-sans text-center transition-all ${
                      viewport === 'mobile' ? 'max-w-xs mx-auto' : viewport === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
                    }`}>
                      <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-[11px] font-semibold">
                        {varA.badgeText}
                      </span>
                      <h3 className="text-lg font-extrabold text-white leading-snug">
                        {varA.headline}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                        {varA.subheadline}
                      </p>
                      <div className="pt-2">
                        <button
                          style={{ backgroundColor: varA.ctaColor }}
                          className="px-6 py-3 text-white font-bold text-xs rounded-xl shadow-lg w-full max-w-xs mx-auto"
                        >
                          {varA.ctaText}
                        </button>
                        <div className="text-[10px] text-slate-400 mt-1">{varA.ctaSubtext}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">سهم ترافیک فعلی: {varA.trafficSplitPercent}%</span>
                      <button
                        onClick={() => handleDeployWinner(varA.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs transition"
                      >
                        ارتقا به ۱۰۰٪ ترافیک
                      </button>
                    </div>
                  </div>
                )}

                {/* Variant B (AI Generated) */}
                {varB ? (
                  <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl relative">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-mono font-bold">
                          نسخه پیشنهادی B
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">{varB.name}</h4>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-slate-400">پیش‌بینی نرخ تبدیل:</div>
                        <div className="text-lg font-extrabold text-emerald-400">{varB.conversionRate > 0 ? `${varB.conversionRate}%` : '۴.۲۰٪ (+۲۴٪)'}</div>
                      </div>
                    </div>

                    {/* Simulated Page Render Preview */}
                    <div className={`bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 border border-emerald-500/30 rounded-xl p-5 space-y-4 font-sans text-center transition-all ${
                      viewport === 'mobile' ? 'max-w-xs mx-auto' : viewport === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
                    }`}>
                      <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-semibold">
                        {varB.badgeText}
                      </span>
                      <h3 className="text-lg font-extrabold text-white leading-snug">
                        {varB.headline}
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                        {varB.subheadline}
                      </p>

                      {varB.urgencyTimer && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                          مهلت استفاده از پیشنهاد: ۰0:۴۵:۰۰
                        </div>
                      )}

                      <div className="pt-1">
                        <button
                          style={{ backgroundColor: varB.ctaColor }}
                          className="px-6 py-3 text-white font-bold text-xs rounded-xl shadow-xl w-full max-w-xs mx-auto hover:brightness-110 transition"
                        >
                          {varB.ctaText}
                        </button>
                        <div className="text-[10px] text-emerald-400 font-medium mt-1">{varB.ctaSubtext}</div>
                      </div>
                    </div>

                    {varB.croRationale && (
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 leading-relaxed">
                        <b className="text-emerald-400 block mb-1">دلیل روان‌شناختی هوش مصنوعی (CRO Rationale):</b>
                        {varB.croRationale}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold">اطمینان آماری: {varB.confidenceScore}%</span>
                      <button
                        onClick={() => handleDeployWinner(varB.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition shadow-lg flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        استقرار ۱۰۰٪ روی ترافیک زنده
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center">
                    <Sparkles className="w-8 h-8 text-slate-600" />
                    <div className="text-slate-400 font-bold text-sm">نسخه B هنوز تولید نشده است</div>
                    <p className="text-slate-500 text-xs max-w-xs">
                      فرم بالا را تکمیل کرده و دکمه "تولید نسخه B" را بزنید.
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: Traffic CRO Analysis */}
          {activeTab === 'traffic_cro' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    تحلیل هوشمند رفتار ترافیک زنده و بهینه‌سازی چیدمان
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    بررسی عمیق نقاط ریزش، رفتار کاربران موبایل و پیشنهادات روان‌شناختی افزایش فروش
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeTraffic}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  تحلیل مجدد با AI
                </button>
              </div>

              {aiAnalysis ? (
                <div className="space-y-6 text-xs">
                  {/* Diagnosis Card */}
                  <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      تشخیص اصلی علت ریزش کاربران (Traffic Diagnosis):
                    </h4>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      {aiAnalysis.trafficDiagnosis}
                    </p>
                  </div>

                  {/* Mobile Advice */}
                  <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 text-sm">
                      <Smartphone className="w-4 h-4" />
                      توصیه ویژه کاربران موبایل (Mobile Optimization):
                    </h4>
                    <p className="text-slate-200 leading-relaxed text-sm">
                      {aiAnalysis.mobileOptimizationAdvice}
                    </p>
                  </div>

                  {/* Two Columns: Layout Fixes & Copywriting Hacks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                        <Layout className="w-4 h-4" />
                        اصلاحات چیدمان و ساختار (Layout Fixes):
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.layoutFixes?.map((fix: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="font-bold text-teal-400 flex items-center gap-1.5 text-sm">
                        <Sparkles className="w-4 h-4" />
                        تکنیک‌های کپی‌رایتینگ ترغیب‌کننده (Copy Hacks):
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.copywritingHacks?.map((hack: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <span>{hack}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center space-y-3">
                  <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-slate-300 font-bold text-sm">هنوز تحلیلی ثبت نشده است</div>
                  <p className="text-slate-400 text-xs">
                    روی دکمه "تحلیل مجدد با AI" کلیک کنید تا داده‌های ترافیک زنده توسط هوش مصنوعی پردازش شوند.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};
