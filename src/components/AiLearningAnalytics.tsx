import React, { useState } from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  Zap, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  RefreshCw,
  Award,
  ChevronRight,
  Database,
  Users,
  Flame,
  MousePointer,
  Eye,
  Layers,
  ArrowDown,
  Target,
  Compass,
  Play,
  Activity,
  Sliders,
  Split,
  Tag,
  FileText,
  Check,
  Percent,
  BarChart2,
  Trophy,
  Sparkle
} from 'lucide-react';

interface MetricTimelinePoint {
  day: string;
  epoch: number;
  conversionRate: number;
  pageSpeedScore: number;
  avgResponseMs: number;
  learnedKeywords: number;
  blockedThreats: number;
}

interface HeatmapHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  clickCount: number;
  intensity: 'hot' | 'warm' | 'medium' | 'cold';
  conversionImpact: string;
}

interface AbVariant {
  id: string;
  name: string;
  title: string;
  description: string;
  trafficShare: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  isWinner?: boolean;
  confidenceScore: number;
  badgeText: string;
}

export const AiLearningAnalytics: React.FC = () => {
  // Navigation Section Switcher: 'behavior-heatmaps' | 'ab-testing' | 'learning-growth'
  const [activeSection, setActiveSection] = useState<'behavior-heatmaps' | 'ab-testing' | 'learning-growth'>('ab-testing');

  // AI Learning State
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'conversion' | 'speed' | 'learning'>('conversion');
  const [isSimulatingLearning, setIsSimulatingLearning] = useState(false);
  const [autoLearnBonus, setAutoLearnBonus] = useState(0);

  // User Behavior & Heatmaps State
  const [selectedPage, setSelectedPage] = useState<'product' | 'home' | 'cart'>('product');
  const [heatmapType, setHeatmapType] = useState<'click' | 'hover' | 'scroll'>('click');
  const [isSimulatingClicks, setIsSimulatingClicks] = useState(false);
  const [simulatedClicksCount, setSimulatedClicksCount] = useState(1420);

  // A/B Testing Studio State
  const [selectedAbProduct, setSelectedAbProduct] = useState<'x15' | 'anc' | 'watch'>('x15');
  const [isGeneratingAbVariants, setIsGeneratingAbVariants] = useState(false);
  const [isSimulatingAbTraffic, setIsSimulatingAbTraffic] = useState(false);
  const [promotedWinnerId, setPromotedWinnerId] = useState<string | null>('v2');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Initial A/B Test Variants data
  const [abVariants, setAbVariants] = useState<AbVariant[]>([
    {
      id: 'v1',
      name: 'واریانت A (اصلی / کنترل)',
      title: 'اولترابوک مهندسی KamvaBook X15',
      description: 'لپ‌تاپ قدرتمند با پردازنده نسل جدید و ۱۶ گیگابایت رم مناسب برنامه‌نویسی و رندرینگ.',
      trafficShare: 33,
      impressions: 1240,
      clicks: 186,
      conversions: 32,
      conversionRate: 2.58,
      confidenceScore: 84.0,
      badgeText: 'Control Baseline',
    },
    {
      id: 'v2',
      name: 'واریانت B (تولید هوش مصنوعی - تمرکز بر ارزش و تخفیف)',
      title: '⚡ اولترابوک مهندسی KamvaBook X15 + کیف چرمی اهدایی و ۷٪ تخفیف آنی',
      description: 'شاهکار مهندسی با سرعت فوق‌العاده، شارژدهی ۱۲ ساعته، ارسال رایگان و گارانتی اصالت ۷ روزه بدون قید و شرط.',
      trafficShare: 33,
      impressions: 1280,
      clicks: 345,
      conversions: 78,
      conversionRate: 6.09,
      isWinner: true,
      confidenceScore: 98.6,
      badgeText: 'Top Performer (+136% Lift)',
    },
    {
      id: 'v3',
      name: 'واریانت C (تولید هوش مصنوعی - عنوان فوری و هیجانی)',
      title: '🔥 خرید مستقیم لپ‌تاپ کامواوب X15 با ارسال فوری ۲۴ ساعته',
      description: 'تعداد محدود در انبار! مجهز به نمایشگر 4K و پردازنده فوق‌سریع همراه با تخفیف خریداران اول.',
      trafficShare: 34,
      impressions: 1210,
      clicks: 260,
      conversions: 51,
      conversionRate: 4.21,
      confidenceScore: 92.4,
      badgeText: 'High Engagement (+63% Lift)',
    },
  ]);

  const handleGenerateAiVariants = () => {
    setIsGeneratingAbVariants(true);
    setTimeout(() => {
      setIsGeneratingAbVariants(false);
      setToastNotice('واریانت‌های جدید عنوان و توضیحات محصول با الگوریتم‌های روانشناسی فروش AI تولید و به تست فعال اضافه شدند!');
      setTimeout(() => setToastNotice(null), 4000);
    }, 1200);
  };

  const handleRunAbTrafficSimulation = () => {
    setIsSimulatingAbTraffic(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAbVariants((prev) =>
        prev.map((v) => {
          const addImp = Math.floor(Math.random() * 40 + 20);
          const addClicks = Math.floor(addImp * (v.conversionRate / 100) * 1.8);
          const addConv = Math.floor(addClicks * 0.25);
          const newImp = v.impressions + addImp;
          const newConv = v.conversions + addConv;
          const newRate = Number(((newConv / newImp) * 100).toFixed(2));
          return {
            ...v,
            impressions: newImp,
            clicks: v.clicks + addClicks,
            conversions: newConv,
            conversionRate: newRate,
          };
        })
      );

      if (step >= 8) {
        clearInterval(interval);
        setIsSimulatingAbTraffic(false);
        setToastNotice('تست A/B با ۵۰۰ بازدیدکننده فرضی شبیه‌سازی شد و آمار نرخ تبدیل به روز گردید!');
        setTimeout(() => setToastNotice(null), 4000);
      }
    }, 250);
  };

  const handlePromoteWinner = (variantId: string) => {
    setPromotedWinnerId(variantId);
    setAbVariants((prev) =>
      prev.map((v) => ({
        ...v,
        trafficShare: v.id === variantId ? 100 : 0,
      }))
    );
    setToastNotice(`واریانت برنده (${variantId}) به سهم ۱۰۰٪ ترافیک فروشگاه ارتقا یافت و روی محصول اعمال شد!`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Heatmap hotspots data per page
  const pageHotspots: Record<string, HeatmapHotspot[]> = {
    product: [
      { id: 'h1', x: 72, y: 38, label: 'دکمه اصلی افزودن به سبد خرید', clickCount: 680, intensity: 'hot', conversionImpact: '+۳۴٪ نهایی‌سازی خرید' },
      { id: 'h2', x: 88, y: 82, label: 'ویجت چت‌بات مشاور هوشمند (شناور)', clickCount: 420, intensity: 'hot', conversionImpact: '+۲۸٪ پاسخ به سوالات خریدار' },
      { id: 'h3', x: 28, y: 24, label: 'تصویر گالری محصول KamvaBook X15', clickCount: 310, intensity: 'warm', conversionImpact: '+۱۸٪ افزایش زمان توقف (Dwell)' },
      { id: 'h4', x: 62, y: 22, label: 'بج تخفیف ۷٪ آنی خریداران', clickCount: 240, intensity: 'warm', conversionImpact: '+۱۵٪ جلب توجه فوری' },
      { id: 'h5', x: 45, y: 65, label: 'تب مشخصات فنی و گارانتی', clickCount: 190, intensity: 'medium', conversionImpact: '+۱۰٪ اعتمادسازی فنی' },
    ],
    home: [
      { id: 'h6', x: 50, y: 28, label: 'دکمه CTA بنر اصلی (خرید با تخفیف ویژه)', clickCount: 890, intensity: 'hot', conversionImpact: '+۴۲٪ ورود به کتگوری' },
      { id: 'h7', x: 85, y: 88, label: 'چت‌بات هوشمند فرانت‌اند', clickCount: 510, intensity: 'hot', conversionImpact: '+۲۲٪ راهنمایی سریع' },
      { id: 'h8', x: 22, y: 55, label: 'کارت محصول لپ‌تاپ پرچمدار', clickCount: 380, intensity: 'warm', conversionImpact: '+۱۹٪ بازدید جزئیات' },
      { id: 'h9', x: 75, y: 12, label: 'منوی جستجوی هوشمند سربرگ', clickCount: 290, intensity: 'medium', conversionImpact: '+۱۲٪ سرچ مستقیم' },
    ],
    cart: [
      { id: 'h10', x: 65, y: 78, label: 'دکمه نهایی‌سازی و پرداخت سریع', clickCount: 940, intensity: 'hot', conversionImpact: '+۵۵٪ تبدیل مستقیم به فروش' },
      { id: 'h11', x: 35, y: 45, label: 'کادر اعمال کد تخفیف KAMVA-CRO', clickCount: 620, intensity: 'hot', conversionImpact: '+۳۰٪ کاهش انصراف از خرید' },
      { id: 'h12', x: 80, y: 30, label: 'نمایش ضمانت بازگشت ۷ روزه', clickCount: 210, intensity: 'medium', conversionImpact: '+۱۴٪ رفع تردید لحظه نهایی' },
    ],
  };

  const currentHotspots = pageHotspots[selectedPage] || pageHotspots.product;

  const handleSimulateUserClicks = () => {
    setIsSimulatingClicks(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSimulatedClicksCount((prev) => prev + Math.floor(Math.random() * 12 + 5));
      if (count >= 10) {
        clearInterval(interval);
        setIsSimulatingClicks(false);
      }
    }, 200);
  };

  // Timeline data for AI Learning section
  const timelineData: MetricTimelinePoint[] = [
    { day: 'روز ۱ (راه‌اندازی)', epoch: 1, conversionRate: 1.8, pageSpeedScore: 52, avgResponseMs: 380, learnedKeywords: 64, blockedThreats: 12 },
    { day: 'روز ۵ (کراول کاتالوگ)', epoch: 5, conversionRate: 2.3, pageSpeedScore: 68, avgResponseMs: 190, learnedKeywords: 210, blockedThreats: 48 },
    { day: 'روز ۱۰ (تحلیل رفتار کاربران)', epoch: 10, conversionRate: 3.1, pageSpeedScore: 84, avgResponseMs: 95, learnedKeywords: 540, blockedThreats: 110 },
    { day: 'روز ۱۵ (فعال‌سازی تریگرهای المنتور)', epoch: 15, conversionRate: 4.2, pageSpeedScore: 92, avgResponseMs: 45, learnedKeywords: 890, blockedThreats: 195 },
    { day: 'روز ۲۰ (بهینه‌سازی برداری پرسش‌ها)', epoch: 20, conversionRate: 4.9, pageSpeedScore: 96, avgResponseMs: 28, learnedKeywords: 1180, blockedThreats: 320 },
    { day: 'روز ۲۵ (تطبیق استراتژی قیمت رقبا)', epoch: 25, conversionRate: 5.6, pageSpeedScore: 98, avgResponseMs: 22, learnedKeywords: 1390, blockedThreats: 410 },
    { day: 'امروز (بلوغ کامل مغز هوش مصنوعی)', epoch: 30, conversionRate: Number((6.4 + autoLearnBonus).toFixed(1)), pageSpeedScore: 99, avgResponseMs: 16, learnedKeywords: 1620 + Math.round(autoLearnBonus * 100), blockedThreats: 538 },
  ];

  const handleTriggerLearningCycle = () => {
    setIsSimulatingLearning(true);
    setTimeout(() => {
      setAutoLearnBonus((prev) => prev + 0.3);
      setIsSimulatingLearning(false);
    }, 1200);
  };

  const maxConv = 7.5;
  const maxSpeed = 100;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Navigation Section Switcher Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('ab-testing')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'ab-testing'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg shadow-indigo-900/40 border border-indigo-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <Split className="w-4 h-4 text-indigo-300" />
            <span>استودیوی تست A/B عناوین و توضیحات (AI A/B Testing Studio)</span>
          </button>

          <button
            onClick={() => setActiveSection('behavior-heatmaps')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'behavior-heatmaps'
                ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 text-white shadow-lg shadow-rose-900/40 border border-rose-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>نقشه‌های حرارتی و پایش رفتار (Heatmaps & Behavior)</span>
          </button>

          <button
            onClick={() => setActiveSection('learning-growth')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'learning-growth'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>رشد و تکامل هوش مصنوعی (AI Learning & Conversion)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono px-3">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>AI CRO Optimizer Active</span>
        </div>
      </div>

      {toastNotice && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* SECTION 1: AI A/B TESTING STUDIO (NEW FEATURE) */}
      {activeSection === 'ab-testing' && (
        <div className="space-y-6">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                    <Split className="w-3.5 h-3.5 text-indigo-400" />
                    استودیوی هوشمند تست A/B خودکار محصولات (AI A/B Testing Studio)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    افزایش نرخ تبدیل تا +۱۳۶٪
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  تولید، توزیع ترافیک و ارتقای خودکار بهترین عنوان و توضیحات محصولات
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  هوش مصنوعی به صورت خودکار واریانت‌های مختلفی از عناوین و توضیحات محصول تولید کرده، آن‌ها را بین بازدیدکنندگان تقسیم می‌کند و پس از رسیدن به اطمینان آماری، بهترین واریانت را روی ۱۰۰٪ ترافیک اعمال می‌نماید.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handleGenerateAiVariants}
                  disabled={isGeneratingAbVariants}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isGeneratingAbVariants ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAbVariants ? 'در حال تولید واریانت‌های AI...' : 'تولید خودکار واریانت‌های جدید توسط AI'}</span>
                </button>

                <button
                  onClick={handleRunAbTrafficSimulation}
                  disabled={isSimulatingAbTraffic}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 fill-current ${isSimulatingAbTraffic ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingAbTraffic ? 'در حال شبیه‌سازی ترافیک...' : 'شبیه‌سازی ۵۰۰ بازدیدکننده فرضی'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Selector Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">محصول تحت تست A/B:</span>
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setSelectedAbProduct('x15')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedAbProduct === 'x15'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KamvaBook X15 (اولترابوک مهندسی)
                </button>
                <button
                  onClick={() => setSelectedAbProduct('anc')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedAbProduct === 'anc'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kamva Pro Sound ANC (هدفون مانیتورینگ)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>اطمینان آماری: ۹۸.۶٪ (Statistical Significance Reached)</span>
            </div>
          </div>

          {/* VARIANTS COMPARISON CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {abVariants.map((variant) => {
              const isPromoted = promotedWinnerId === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`bg-slate-900/90 rounded-3xl p-6 space-y-5 shadow-xl transition-all relative border ${
                    isPromoted
                      ? 'border-emerald-500 shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                      : variant.isWinner
                      ? 'border-indigo-500/60 shadow-indigo-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono ${
                      variant.isWinner
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {variant.badgeText}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-400">
                      سهم ترافیک: {variant.trafficShare}٪
                    </span>
                  </div>

                  {/* Title & Description Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {variant.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 line-clamp-3">
                      {variant.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">نمایش / کلیک</span>
                      <span className="text-xs font-bold text-white font-mono mt-0.5 block">
                        {variant.impressions} / {variant.clicks}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">تعداد فروش (Conv)</span>
                      <span className="text-xs font-bold text-indigo-300 font-mono mt-0.5 block">
                        {variant.conversions} خرید
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-2">
                      <span className="text-[10px] text-slate-400 block">نرخ تبدیل (Conversion Rate)</span>
                      <span className={`text-lg font-black font-mono mt-0.5 block ${
                        variant.isWinner ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {variant.conversionRate}٪
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isPromoted ? (
                    <div className="py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>فعال روی ۱۰۰٪ ترافیک کل فروشگاه</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePromoteWinner(variant.id)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>ارتقا به ۱۰۰٪ ترافیک اصلی</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI A/B Test Strategy Insights Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">تحلیل روانشناسی روان‌شناختی AI روی واریانت برنده</h3>
                  <p className="text-[11px] text-slate-400">علت جهش ۱۳۶ درصدی نرخ تبدیل در واریانت B</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">۱. ذکر هدیه جانبی (کیف چرمی اهدایی)</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  افزودن هدیه فیزیکی محسوس در عنوان اصلی حس ارزش خرید بیشتر (Perceived Value) را تا ۴۸٪ در ذهن خریدار افزایش داده است.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-300 block">۲. تریگر تخفیف ۷٪ آنی خریداران</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  وجود درصد شفاف تخفیف در ابتدای تیتر، نرخ کلیک مستقیم از نتایج گوگل و دسته‌بندی را به ۶.۰۹٪ رسانده است.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-300 block">۳. رفع تردید با ضمانت ۷ روزه</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  اشاره به گارانتی اصالت بی‌قید و شرط در توضیحات کوتاه، درصد انصراف در مرحله سبد خرید را تا ۳۲٪ کاهش داده است.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: USER BEHAVIOR TRACKING & AI HEATMAPS */}
      {activeSection === 'behavior-heatmaps' && (
        <div className="space-y-6">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    ماژول هوشمند پایش تعامل و کلیک‌نگار (AI Heatmap Engine)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    {simulatedClicksCount.toLocaleString('fa-IR')} کلیک ثبت‌شده
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  نقشه‌های حرارتی تعاملی، ردیابی تمرکز ماوس و تحلیل مسیرهای پیمایش
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  شناسایی نقاط داغ (Hotspots) پرکلیک، تحلیل عمق اسکرول و ارائه پیشنهادهای بهینه‌سازی خودکار هوش مصنوعی برای انتقال المان‌های کلیدی به نقاط پربازدید.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleSimulateUserClicks}
                  disabled={isSimulatingClicks}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 fill-current ${isSimulatingClicks ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingClicks ? 'در حال ثبت کلیک‌های زنده...' : 'شبیه‌سازی کلیک‌های زنده (Live Session Clicks)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Page Selector & Heatmap Layer Switcher Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            
            {/* Target Page Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">صفحه مورد بررسی:</span>
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setSelectedPage('product')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPage === 'product'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  برگه محصول (KamvaBook X15)
                </button>
                <button
                  onClick={() => setSelectedPage('home')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPage === 'home'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  صفحه اصلی فروشگاه
                </button>
                <button
                  onClick={() => setSelectedPage('cart')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedPage === 'cart'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  سبد خرید کشویی
                </button>
              </div>
            </div>

            {/* Heatmap Overlay Type Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">لایه آنالیز:</span>
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setHeatmapType('click')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    heatmapType === 'click'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MousePointer className="w-3.5 h-3.5" />
                  <span>نقشه کلیک (Click Map)</span>
                </button>
                <button
                  onClick={() => setHeatmapType('hover')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    heatmapType === 'hover'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>تمرکز ماوس (Attention Map)</span>
                </button>
                <button
                  onClick={() => setHeatmapType('scroll')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    heatmapType === 'scroll'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>عمق اسکرول (Scroll Map)</span>
                </button>
              </div>
            </div>

          </div>

          {/* MAIN VISUAL HEATMAP DISPLAY & HOTSPOT DETAILS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Screen Replica Canvas with Heatmap Overlay */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  نمای زنده شبیه‌سازی‌شده صفحه و نقاط حرارتی (Live Heatmap Preview)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  بر اساس {simulatedClicksCount} سشن کاربر
                </span>
              </div>

              {/* Simulated Screen Viewport Container */}
              <div className="relative w-full h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner group">
                
                {/* Visual Wireframe Mock of Store Page */}
                <div className="absolute inset-0 p-6 space-y-4 opacity-30 select-none pointer-events-none">
                  {/* Header bar mock */}
                  <div className="h-8 bg-slate-800 rounded-xl flex items-center justify-between px-4">
                    <div className="w-20 h-3 bg-slate-700 rounded" />
                    <div className="flex gap-2">
                      <div className="w-12 h-3 bg-slate-700 rounded" />
                      <div className="w-12 h-3 bg-slate-700 rounded" />
                    </div>
                  </div>

                  {/* Body content mock depending on selected page */}
                  {selectedPage === 'product' && (
                    <div className="grid grid-cols-12 gap-4 h-[300px]">
                      <div className="col-span-5 bg-slate-800/80 rounded-2xl flex items-center justify-center">
                        <span className="text-xs text-slate-500 font-mono">[تصویر KamvaBook X15]</span>
                      </div>
                      <div className="col-span-7 space-y-3 pt-2">
                        <div className="w-3/4 h-6 bg-indigo-500/40 rounded-lg" />
                        <div className="w-1/2 h-4 bg-emerald-500/40 rounded-lg" />
                        <div className="w-full h-16 bg-slate-800/60 rounded-xl" />
                        <div className="w-2/3 h-10 bg-indigo-600/60 rounded-xl" />
                      </div>
                    </div>
                  )}

                  {selectedPage === 'home' && (
                    <div className="space-y-4">
                      <div className="h-32 bg-gradient-to-r from-indigo-900/40 to-slate-800 rounded-2xl flex items-center justify-center">
                        <span className="text-xs text-slate-500 font-mono">[بنر اصلی پیشنهادات ویژه]</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 h-28">
                        <div className="bg-slate-800/60 rounded-xl" />
                        <div className="bg-slate-800/60 rounded-xl" />
                        <div className="bg-slate-800/60 rounded-xl" />
                      </div>
                    </div>
                  )}

                  {selectedPage === 'cart' && (
                    <div className="flex justify-end h-full">
                      <div className="w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="w-2/3 h-4 bg-slate-700 rounded" />
                        <div className="w-full h-12 bg-slate-800 rounded-xl" />
                        <div className="w-full h-10 bg-emerald-600/60 rounded-xl" />
                      </div>
                    </div>
                  )}
                </div>

                {/* SCROLL MAP OVERLAY (If Scroll mode is selected) */}
                {heatmapType === 'scroll' && (
                  <div className="absolute inset-0 flex flex-col pointer-events-none">
                    <div className="h-1/4 bg-rose-500/20 border-b border-rose-500/40 flex items-center justify-between px-4 text-xs font-bold text-rose-300">
                      <span>۱۰۰٪ کاربران (بالای برگه)</span>
                      <span className="font-mono">100% Reach</span>
                    </div>
                    <div className="h-1/4 bg-amber-500/20 border-b border-amber-500/40 flex items-center justify-between px-4 text-xs font-bold text-amber-300">
                      <span>۸۲٪ کاربران (بخش مشخصات و قیمت)</span>
                      <span className="font-mono">82% Reach</span>
                    </div>
                    <div className="h-1/4 bg-cyan-500/15 border-b border-cyan-500/40 flex items-center justify-between px-4 text-xs font-bold text-cyan-300">
                      <span>۴۸٪ کاربران (نظرات و خریداران)</span>
                      <span className="font-mono">48% Reach</span>
                    </div>
                    <div className="h-1/4 bg-slate-800/20 flex items-center justify-between px-4 text-xs font-bold text-slate-400">
                      <span>۲۲٪ کاربران (پاورقی و اطلاعات تکمیلی)</span>
                      <span className="font-mono">22% Reach</span>
                    </div>
                  </div>
                )}

                {/* CLICK & HOVER HOTSPOT OVERLAYS */}
                {heatmapType !== 'scroll' && currentHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-10"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  >
                    {/* Pulsing Thermal Heat Glow */}
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute inline-flex h-16 w-16 rounded-full opacity-75 animate-ping ${
                        hs.intensity === 'hot' 
                          ? 'bg-rose-500' 
                          : hs.intensity === 'warm' 
                          ? 'bg-amber-400' 
                          : 'bg-cyan-400'
                      }`} />
                      <div className={`w-10 h-10 rounded-full border-2 border-white/80 shadow-2xl flex items-center justify-center font-bold font-mono text-xs text-white ${
                        hs.intensity === 'hot' 
                          ? 'bg-rose-600 shadow-rose-500/80' 
                          : hs.intensity === 'warm' 
                          ? 'bg-amber-500 shadow-amber-500/80' 
                          : 'bg-cyan-500 shadow-cyan-500/80'
                      }`}>
                        {hs.clickCount}
                      </div>
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/95 border border-slate-700 text-white p-2.5 rounded-xl text-[11px] shadow-2xl whitespace-nowrap hidden group-hover:block z-20 pointer-events-none">
                      <div className="font-bold text-amber-300">{hs.label}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">تعداد کلیک: {hs.clickCount} مورد</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{hs.conversionImpact}</div>
                    </div>
                  </div>
                ))}

              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>راهنمای شدت تراکم کلیک‌ها:</span>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-3 h-3 rounded-full bg-rose-600" /> نقطه داغ (تراکم بالا)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-3 h-3 rounded-full bg-amber-500" /> نقطه گرم (تراکم متوسط)
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <span className="w-3 h-3 rounded-full bg-cyan-500" /> نقطه خنک (کلیک کم)
                  </span>
                </div>
              </div>

            </div>

            {/* AI Behavioral Insights & Hotspots Breakdown */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">تحلیل الگوریتمی رفتار خریداران</h3>
                    <p className="text-[11px] text-slate-400">گزارش هوش مصنوعی بر اساس نقاط کلیک</p>
                  </div>
                </div>
              </div>

              {/* AI Auto CRO Suggestion Box */}
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  پیشنهاد هوشمند افزایش فروش (AI CRO Advice):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  بررسی نقشه کلیک نشان می‌دهد **۷۸٪ کاربران** پس از مشاهده مشخصات فنی لپ‌تاپ به سمت **ویجت چت‌بات مشاور** هدایت می‌شوند. پیشنهاد می‌شود دکمه «خرید اقساطی فوری» در کنار چت‌بات جانمایی شود.
                </p>
              </div>

              {/* List of Registered Hotspots */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">نقاط داغ شناسایی‌شده ({currentHotspots.length}):</span>
                {currentHotspots.map((hs) => (
                  <div key={hs.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white leading-snug">{hs.label}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        hs.intensity === 'hot' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {hs.clickCount} کلیک
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>موقعیت دکمه: ({hs.x}٪, {hs.y}٪)</span>
                      <span className="text-emerald-400 font-bold">{hs.conversionImpact}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: AI LEARNING & CONVERSION GROWTH (EXISTING METRICS) */}
      {activeSection === 'learning-growth' && (
        <div className="space-y-6">
          
          {/* Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    هسته خودآموز هوش مصنوعی قالب (Autonomous Self-Learning Neural Loop)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    روند صعودی نرخ تبدیل و لود زیر ۰.۷ ثانیه
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  نمودار بصری یادگیری، بهبود مستمر عملکرد و نرخ تبدیل (CRO)
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  هوش مصنوعی داخلی قالب با هر تعامل کاربر، الگوهای تصمیم‌گیری خریداران را تحلیل کرده و بدون سربار سرور، سرعت پاسخ‌دهی و نرخ نهایی شدن سبد خرید را ارتقا می‌دهد.
                </p>
              </div>

              <button
                onClick={handleTriggerLearningCycle}
                disabled={isSimulatingLearning}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSimulatingLearning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>در حال تحلیل و بهبود وزن‌های برداری...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>شبیه‌سازی چرخه یادگیری جدید (Epoch +1)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KPI Highlight Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4.5 space-y-2.5 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">جهش نرخ تبدیل (Conversion Rate)</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  {(6.4 + autoLearnBonus).toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  +۲۵۵٪ افزایش
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>نرخ اولیه روز اول: ۱.۸٪</span>
                <span className="text-indigo-400 font-mono">CRO High</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4.5 space-y-2.5 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">امتیاز سرعت لایت‌هاوس (PageSpeed)</span>
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  ۹۹ <span className="text-sm font-normal text-slate-400">/ ۱۰۰</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  +۴۷ امتیاز
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>لود کل صفحه: ۰.۶۵ ثانیه</span>
                <span className="text-emerald-400 font-mono">Core Web Vitals A+</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4.5 space-y-2.5 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">سرعت پاسخگویی مغز محلی</span>
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  ۱۶ <span className="text-xs font-normal text-slate-400">میلی‌ثانیه</span>
                </span>
                <span className="text-xs font-bold text-cyan-400">
                  ۹۵٪ بهینه‌تر
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>حافظه فعال: ۰.۸٪ RAM</span>
                <span className="text-cyan-400 font-mono">Instant Cache</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4.5 space-y-2.5 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">مفاهیم و کلیدواژه‌های یادگرفته‌شده</span>
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Database className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  {(1620 + Math.round(autoLearnBonus * 100)).toLocaleString('fa-IR')}
                </span>
                <span className="text-xs font-bold text-purple-400">
                  تطبیق ۹۹.۲٪
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>حملات مسدودشده WAF: ۵۳۸</span>
                <span className="text-purple-400 font-mono">Zero Threat</span>
              </div>
            </div>

          </div>

          {/* Main Interactive Visual Chart Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            
            {/* Chart Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  روند تکاملی هوش مصنوعی بر حسب چرخه‌های یادگیری (Learning Epochs)
                </h3>
                <span className="text-xs text-slate-400">
                  مشاهده مقایسه‌ای پیشرفت نرخ تبدیل، امتیاز سرعت و کاهش مصرف منابع
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
                  <button
                    onClick={() => setActiveMetric('conversion')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeMetric === 'conversion'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    نرخ تبدیل فروش (CRO)
                  </button>
                  <button
                    onClick={() => setActiveMetric('speed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeMetric === 'speed'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    امتیاز لایت‌هاوس گوگل
                  </button>
                  <button
                    onClick={() => setActiveMetric('learning')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeMetric === 'learning'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    پایگاه دانش و مفاهیم
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Interactive Visual Chart */}
            <div className="relative w-full h-72 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
              
              {/* Subtle Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-10">
                <div className="w-full border-b border-slate-400" />
                <div className="w-full border-b border-slate-400" />
                <div className="w-full border-b border-slate-400" />
                <div className="w-full border-b border-slate-400" />
              </div>

              {/* SVG Vector Path Render */}
              <div className="relative w-full h-48">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="convGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="speedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area Under Curve */}
                  {activeMetric === 'conversion' && (
                    <>
                      <polygon
                        points={`
                          0,180
                          0,${180 - (timelineData[0].conversionRate / maxConv) * 160}
                          116,${180 - (timelineData[1].conversionRate / maxConv) * 160}
                          233,${180 - (timelineData[2].conversionRate / maxConv) * 160}
                          350,${180 - (timelineData[3].conversionRate / maxConv) * 160}
                          466,${180 - (timelineData[4].conversionRate / maxConv) * 160}
                          583,${180 - (timelineData[5].conversionRate / maxConv) * 160}
                          700,${180 - (timelineData[6].conversionRate / maxConv) * 160}
                          700,180
                        `}
                        fill="url(#convGradient)"
                      />
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={`
                          0,${180 - (timelineData[0].conversionRate / maxConv) * 160}
                          116,${180 - (timelineData[1].conversionRate / maxConv) * 160}
                          233,${180 - (timelineData[2].conversionRate / maxConv) * 160}
                          350,${180 - (timelineData[3].conversionRate / maxConv) * 160}
                          466,${180 - (timelineData[4].conversionRate / maxConv) * 160}
                          583,${180 - (timelineData[5].conversionRate / maxConv) * 160}
                          700,${180 - (timelineData[6].conversionRate / maxConv) * 160}
                        `}
                      />
                    </>
                  )}

                  {activeMetric === 'speed' && (
                    <>
                      <polygon
                        points={`
                          0,180
                          0,${180 - (timelineData[0].pageSpeedScore / maxSpeed) * 160}
                          116,${180 - (timelineData[1].pageSpeedScore / maxSpeed) * 160}
                          233,${180 - (timelineData[2].pageSpeedScore / maxSpeed) * 160}
                          350,${180 - (timelineData[3].pageSpeedScore / maxSpeed) * 160}
                          466,${180 - (timelineData[4].pageSpeedScore / maxSpeed) * 160}
                          583,${180 - (timelineData[5].pageSpeedScore / maxSpeed) * 160}
                          700,${180 - (timelineData[6].pageSpeedScore / maxSpeed) * 160}
                          700,180
                        `}
                        fill="url(#speedGradient)"
                      />
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={`
                          0,${180 - (timelineData[0].pageSpeedScore / maxSpeed) * 160}
                          116,${180 - (timelineData[1].pageSpeedScore / maxSpeed) * 160}
                          233,${180 - (timelineData[2].pageSpeedScore / maxSpeed) * 160}
                          350,${180 - (timelineData[3].pageSpeedScore / maxSpeed) * 160}
                          466,${180 - (timelineData[4].pageSpeedScore / maxSpeed) * 160}
                          583,${180 - (timelineData[5].pageSpeedScore / maxSpeed) * 160}
                          700,${180 - (timelineData[6].pageSpeedScore / maxSpeed) * 160}
                        `}
                      />
                    </>
                  )}

                  {activeMetric === 'learning' && (
                    <>
                      <polygon
                        points={`
                          0,180
                          0,${180 - (timelineData[0].learnedKeywords / 2000) * 160}
                          116,${180 - (timelineData[1].learnedKeywords / 2000) * 160}
                          233,${180 - (timelineData[2].learnedKeywords / 2000) * 160}
                          350,${180 - (timelineData[3].learnedKeywords / 2000) * 160}
                          466,${180 - (timelineData[4].learnedKeywords / 2000) * 160}
                          583,${180 - (timelineData[5].learnedKeywords / 2000) * 160}
                          700,${180 - (timelineData[6].learnedKeywords / 2000) * 160}
                          700,180
                        `}
                        fill="url(#purpleGradient)"
                      />
                      <polyline
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={`
                          0,${180 - (timelineData[0].learnedKeywords / 2000) * 160}
                          116,${180 - (timelineData[1].learnedKeywords / 2000) * 160}
                          233,${180 - (timelineData[2].learnedKeywords / 2000) * 160}
                          350,${180 - (timelineData[3].learnedKeywords / 2000) * 160}
                          466,${180 - (timelineData[4].learnedKeywords / 2000) * 160}
                          583,${180 - (timelineData[5].learnedKeywords / 2000) * 160}
                          700,${180 - (timelineData[6].learnedKeywords / 2000) * 160}
                        `}
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* X-Axis Data Point Badges */}
              <div className="grid grid-cols-7 gap-1 pt-2 border-t border-slate-800 text-center">
                {timelineData.map((pt, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block truncate font-medium">
                      {pt.day.split(' ')[0]} {pt.day.split(' ')[1]}
                    </span>
                    <span className="text-xs font-mono font-bold text-white block">
                      {activeMetric === 'conversion' && `${pt.conversionRate}%`}
                      {activeMetric === 'speed' && `${pt.pageSpeedScore}/100`}
                      {activeMetric === 'learning' && `${pt.learnedKeywords}`}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
