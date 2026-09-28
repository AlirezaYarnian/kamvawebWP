import React, { useState } from 'react';
import { ThemeOptionsConfig, KnowledgeItem } from '../types/theme';
import { 
  Boxes, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Settings, 
  Sparkles, 
  Bot, 
  ShoppingBag, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Plus, 
  ArrowLeft,
  Percent,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Flame,
  MousePointerClick,
  Clock,
  Activity,
  Award,
  DollarSign,
  PieChart,
  SlidersHorizontal,
  Wand2,
  Check
} from 'lucide-react';

interface ElementorVisualSimulatorProps {
  config: ThemeOptionsConfig;
  knowledgeBase: KnowledgeItem[];
}

export const ElementorVisualSimulator: React.FC<ElementorVisualSimulatorProps> = ({
  config,
  knowledgeBase,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'cro-optimizer'>('cro-optimizer');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedWidget, setSelectedWidget] = useState<'sales-bot' | 'advisor' | 'faq' | 'hero'>('sales-bot');
  
  // Custom controls for Elementor widget settings
  const [widgetTitle, setWidgetTitle] = useState('مشاور تخصصی خرید و فروشگاه');
  const [widgetBadge, setWidgetBadge] = useState('پاسخگویی آنی کمتر از ۱ ثانیه');
  const [widgetThemeColor, setWidgetThemeColor] = useState('#6366f1');
  const [showExitIntent, setShowExitIntent] = useState(true);

  // Conversion Optimizer Simulator States (Layout Variables)
  const [croLayoutOptions, setCroLayoutOptions] = useState({
    stickyMobileCta: true,
    socialProofLiveTicker: true,
    urgencyScarcityBar: true,
    exitIntentDrawer: true,
    ajaxVariationSwatches: true,
    stickyHeaderSearch: true,
    singleStepQuickCheckout: true,
  });

  const [appliedCroToast, setAppliedCroToast] = useState<string | null>(null);

  // Calculate predictive engagement & conversion metrics based on historical dataset of 85,000+ sessions
  const baseConversionRate = 2.40; // baseline 2.4%
  const baseAvgTimeSeconds = 78;   // 1m 18s
  const baseCtrCta = 4.12;         // 4.12%
  const baseBounceRate = 48.5;     // 48.5%
  const baseMonthlyOrders = 380;   // 380 orders/month
  const averageOrderValueToman = 650000; // 650,000 Toman

  let predictedUpliftPercent = 0;
  let bounceReductionPercent = 0;
  let ctrUpliftPercent = 0;
  let timeOnPageBonusSeconds = 0;

  if (croLayoutOptions.stickyMobileCta) {
    predictedUpliftPercent += 38.5;
    ctrUpliftPercent += 24.0;
  }
  if (croLayoutOptions.socialProofLiveTicker) {
    predictedUpliftPercent += 28.0;
    timeOnPageBonusSeconds += 18;
  }
  if (croLayoutOptions.urgencyScarcityBar) {
    predictedUpliftPercent += 22.5;
    ctrUpliftPercent += 16.0;
  }
  if (croLayoutOptions.exitIntentDrawer) {
    predictedUpliftPercent += 32.0;
    bounceReductionPercent += 19.5;
  }
  if (croLayoutOptions.ajaxVariationSwatches) {
    predictedUpliftPercent += 18.0;
    timeOnPageBonusSeconds += 12;
  }
  if (croLayoutOptions.stickyHeaderSearch) {
    predictedUpliftPercent += 14.5;
    timeOnPageBonusSeconds += 22;
  }
  if (croLayoutOptions.singleStepQuickCheckout) {
    predictedUpliftPercent += 42.0;
    ctrUpliftPercent += 30.0;
  }

  const finalPredictedConversionRate = Number((baseConversionRate * (1 + predictedUpliftPercent / 100)).toFixed(2));
  const finalPredictedCtr = Number((baseCtrCta * (1 + ctrUpliftPercent / 100)).toFixed(2));
  const finalPredictedBounceRate = Number(Math.max(18.0, baseBounceRate - bounceReductionPercent).toFixed(1));
  const finalPredictedTimeSeconds = baseAvgTimeSeconds + timeOnPageBonusSeconds;
  
  const estimatedNewOrders = Math.round(baseMonthlyOrders * (1 + predictedUpliftPercent / 100));
  const additionalMonthlyRevenue = (estimatedNewOrders - baseMonthlyOrders) * averageOrderValueToman;

  const handleApplyCroLayout = () => {
    setAppliedCroToast('چیدمان بهینه‌شده با موفقیت در تنظیمات تم‌آپشن کاموا استور و ویجت‌های المنتور اعمال شد!');
    setTimeout(() => setAppliedCroToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Main Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-pink-600/30">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">استودیوی پیشرفته المنتور کامواوب (Elementor Studio)</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 font-semibold px-2 py-0.5 rounded-full border border-pink-500/30 font-mono">
                CRO AI Optimizer
              </span>
            </div>
            <span className="text-xs text-slate-400">شبیه‌سازی تاثیر چیدمان‌های مختلف بر نرخ تبدیل، زمان ماندگاری و فروش</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('cro-optimizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cro-optimizer'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>شبیه‌ساز نرخ تبدیل (CRO AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>ویرایشگر ویژوال ویجت‌ها</span>
          </button>
        </div>
      </div>

      {appliedCroToast && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedCroToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. CONVERSION OPTIMIZER SIMULATOR TAB                    */}
      {/* ======================================================== */}
      {activeTab === 'cro-optimizer' && (
        <div className="space-y-6">
          
          {/* Predictive Metrics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Conversion Rate */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">پیش‌بینی نرخ تبدیل (CR):</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  +{predictedUpliftPercent.toFixed(0)}% رشد
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">{finalPredictedConversionRate}%</span>
                <span className="text-xs text-slate-500 line-through">پایه: {baseConversionRate}%</span>
              </div>
              <p className="text-[11px] text-slate-400">بر اساس مدل آماری ۸۵,۰۰۰ تعامل کاربری</p>
            </div>

            {/* Metric 2: Estimated Extra Revenue */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">درآمد مازاد ماهانه (تخمین AI):</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-400">
                  {additionalMonthlyRevenue > 0 ? `+${(additionalMonthlyRevenue / 1000000).toFixed(1)}M` : '۰'}
                </span>
                <span className="text-xs text-slate-400">تومان در ماه</span>
              </div>
              <p className="text-[11px] text-slate-400">معادل {estimatedNewOrders - baseMonthlyOrders} سفارش بیشتر در ماه</p>
            </div>

            {/* Metric 3: CTR on Primary CTA */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">نرخ کلیک دکمه خرید (CTR):</span>
                <MousePointerClick className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">{finalPredictedCtr}%</span>
                <span className="text-xs text-slate-500 line-through">پایه: {baseCtrCta}%</span>
              </div>
              <p className="text-[11px] text-slate-400">جذب توجه بصری بالای خط تا (Above the Fold)</p>
            </div>

            {/* Metric 4: Bounce Rate Reduction */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">نرخ پرش (Bounce Rate):</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  کاهش {bounceReductionPercent}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-400">{finalPredictedBounceRate}%</span>
                <span className="text-xs text-slate-500 line-through">پایه: {baseBounceRate}%</span>
              </div>
              <p className="text-[11px] text-slate-400">میانگین زمان توقف: {Math.floor(finalPredictedTimeSeconds / 60)} دقیقه و {finalPredictedTimeSeconds % 60} ثانیه</p>
            </div>

          </div>

          {/* Interactive Layout Controls & Visual Heatmap Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Elementor Layout Modifiers */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-pink-400" />
                    <span>متغیرهای چیدمان و ساختار برگه در المنتور</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    المان‌های چیدمان را تغییر دهید تا تاثیر بلادرنگ آن را بر شاخص‌ها مشاهده نمایید:
                  </p>
                </div>

                <button
                  onClick={handleApplyCroLayout}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>اعمال چیدمان برنده</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'stickyMobileCta' as const,
                    title: 'دکمه خرید شناور چسبان در موبایل (Sticky Buy Bar)',
                    desc: 'دکمه افزودن به سبد خرید همواره در پایین اسکرین موبایل در دسترس کاربر می‌ماند.',
                    impact: '+۳۸٪ نرخ تبدیل',
                    tag: 'حیاتی برای موبایل',
                  },
                  {
                    key: 'socialProofLiveTicker' as const,
                    title: 'اثبات اجتماعی و نوتیفیکیشن لحظه‌ای خرید (Live Social Proof)',
                    desc: 'نمایش پاپ‌آپ ملایم خریدهای اخیر کاربران واقعی جهت ایجاد اطمینان و FOMO.',
                    impact: '+۲۸٪ فروش',
                    tag: 'روانشناسی خرید',
                  },
                  {
                    key: 'urgencyScarcityBar' as const,
                    title: 'تایمر معکوس تخفیف و شمارنده موجودی انبار (Scarcity Bar)',
                    desc: 'نوار پیشرفت تعداد باقی‌مانده در انبار به همراه تایمر انقضای پیشنهاد ویژه.',
                    impact: '+۲۲٪ شتاب در خرید',
                    tag: 'ایجاد فوریت',
                  },
                  {
                    key: 'exitIntentDrawer' as const,
                    title: 'پاپ‌آپ هوشمند قصد خروج با کد تخفیف (AI Exit-Intent)',
                    desc: 'شناسایی حرکت موس به سمت بستن تب و نمایش پیشنهاد شگفت‌انگیز برای حفظ کاربر.',
                    impact: '-۱۹٪ نرخ پرش',
                    tag: 'بازیابی مشتری',
                  },
                  {
                    key: 'ajaxVariationSwatches' as const,
                    title: 'سواچز ایجکس تغییر رنگ و سایز بدون لود مجدد',
                    desc: 'کاربر بدون ترک صفحه اصلی مشخصات و عکس متغیر محصول را فوراً مشاهده می‌کند.',
                    impact: '+۱۸٪ راحتی خرید',
                    tag: 'تجربه کاربری',
                  },
                  {
                    key: 'singleStepQuickCheckout' as const,
                    title: 'تسویه‌حساب تک‌مرحله‌ای سریع (Fast 1-Step Checkout)',
                    desc: 'حذف فیلدهای غیرضروری و پرداخت بدون معطلی در کمتر از ۲۰ ثانیه.',
                    impact: '+۴۲٪ کاهش رهاسازی سبد',
                    tag: 'حداکثر بازدهی',
                  },
                ].map((item) => {
                  const isEnabled = croLayoutOptions[item.key];
                  return (
                    <label
                      key={item.key}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isEnabled
                          ? 'bg-slate-950/80 border-pink-500/40 shadow-sm'
                          : 'bg-slate-950/30 border-slate-800/60 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{item.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                            {item.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>

                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          setCroLayoutOptions({
                            ...croLayoutOptions,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-pink-600 rounded mt-1 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visual Wireframe Simulation & Heatmap Attention */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      نقشه حرارتی توجه کاربر و شبیه‌ساز بصری چیدمان (Heatmap Preview)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Predicted Eye Tracking</span>
                </div>

                {/* Simulated Wireframe Landing Page */}
                <div className="bg-[#0c101a] border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden font-sans text-right">
                  
                  {/* Sticky Header */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    croLayoutOptions.stickyHeaderSearch ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-md' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}>
                    <span className="font-bold">لوگوی کامواوب</span>
                    <span className="text-[11px] px-3 py-1 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                      🔍 جستجوی زنده ایجکس در محصولات...
                    </span>
                    <span className="text-[11px] font-mono">سبد خرید (۲)</span>
                  </div>

                  {/* Scarcity Bar if enabled */}
                  {croLayoutOptions.urgencyScarcityBar && (
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/40 text-[11px] flex items-center justify-between animate-fadeIn text-amber-200">
                      <span className="font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        فقط ۳ عدد در انبار موجود است!
                      </span>
                      <span className="font-mono text-rose-300 font-bold">۰۲ : ۱۵ : ۴۸</span>
                    </div>
                  )}

                  {/* Product Main Hero Section */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-center items-center text-center relative overflow-hidden">
                      <div className="w-16 h-16 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold mb-2">
                        عکس کالا
                      </div>
                      <span className="text-xs font-bold text-white">اولترابوک مهندسی پرو</span>
                      <span className="text-[11px] text-emerald-400 font-bold mt-1">۳۸,۵۰۰,۰۰۰ تومان</span>

                      {/* Heatmap High-Attention Ring */}
                      <div className="absolute inset-0 bg-pink-500/10 pointer-events-none rounded-xl" />
                    </div>

                    <div className="space-y-2 text-xs flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-slate-300 font-bold block">مشخصات و انتخاب رنگ:</span>
                        
                        {croLayoutOptions.ajaxVariationSwatches ? (
                          <div className="flex gap-1.5 pt-1">
                            <span className="w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400" />
                            <span className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600" />
                            <span className="w-5 h-5 rounded-full bg-indigo-700 border border-slate-600" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">لیست کشویی ساده</span>
                        )}
                      </div>

                      {/* Main CTA Button with Heatmap Aura */}
                      <div className="relative group">
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>افزودن به سبد خرید فوری</span>
                        </button>
                        {/* High conversion heat indicator */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-amber-500/30 rounded-xl blur-sm -z-10 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Social Proof Live Ticker popup */}
                  {croLayoutOptions.socialProofLiveTicker && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-[10px] flex items-center justify-between text-slate-300 animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span><strong>رضا از اصفهان</strong> همین الان این لپ‌تاپ را خرید!</span>
                      </div>
                      <span className="text-slate-500 font-mono">۲ دقیقه پیش</span>
                    </div>
                  )}

                  {/* Sticky Mobile Bar Preview if enabled */}
                  {croLayoutOptions.stickyMobileCta && (
                    <div className="p-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-pink-500/40 rounded-b-xl flex items-center justify-between text-xs text-white">
                      <span className="font-bold text-emerald-400 text-xs">۳۸,۵۰۰,۰۰۰ تومان</span>
                      <button className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg text-xs shadow-md">
                        خرید سریع
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Rationale Footer */}
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>تطابق با استانداردهای تبدیل فروشگاهی کاموا استور (E-Commerce CRO Best Practice)</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">SCORE: 98%</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VISUAL WIDGET EDITOR & CANVAS TAB                     */}
      {/* ======================================================== */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Right side: Elementor Control & Widget List Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Category: Kamva AI Elements */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  ویجت‌های اختصاصی کامواوب (KamvaWeb Pack)
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">۴ ویجت فعال</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedWidget('sales-bot')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                    selectedWidget === 'sales-bot'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Bot className={`w-5 h-5 ${selectedWidget === 'sales-bot' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono text-emerald-400">CRO High</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">مشاور هوشمند فروش</span>
                    <span className="text-[10px] text-slate-400">چت تعاملی و متقاعدکننده</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedWidget('advisor')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                    selectedWidget === 'advisor'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <ShoppingBag className={`w-5 h-5 ${selectedWidget === 'advisor' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono text-amber-400">Cross-Sell</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">پیشنهاد تطبیقی کالا</span>
                    <span className="text-[10px] text-slate-400">آنالیز علاقه و سبد خرید</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedWidget('faq')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                    selectedWidget === 'faq'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <HelpCircle className={`w-5 h-5 ${selectedWidget === 'faq' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono text-cyan-400">Dynamic</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">سوالات متداول هوشمند</span>
                    <span className="text-[10px] text-slate-400">پاسخگویی آنی برداری</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedWidget('hero')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                    selectedWidget === 'hero'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Percent className={`w-5 h-5 ${selectedWidget === 'hero' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono text-pink-400">High CTR</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">هدر و تریگر فروش ویژه</span>
                    <span className="text-[10px] text-slate-400">تایمر معکوس و پروموشن</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Elementor Active Widget Controls Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-pink-400" />
                  تنظیمات ویجت انتخابی
                </span>
                <span className="text-[10px] text-slate-400">Elementor Control Panel</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">عنوان المان:</label>
                  <input
                    type="text"
                    value={widgetTitle}
                    onChange={(e) => setWidgetTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">بج و برچسب وضعیت:</label>
                  <input
                    type="text"
                    value={widgetBadge}
                    onChange={(e) => setWidgetBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">رنگ تمپلیت المان:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={widgetThemeColor}
                      onChange={(e) => setWidgetThemeColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-400">{widgetThemeColor}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">نمایش هوشمند هنگام خروج (Exit Intent):</span>
                    <input
                      type="checkbox"
                      checked={showExitIntent}
                      onChange={(e) => setShowExitIntent(e.target.checked)}
                      className="w-4 h-4 accent-pink-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Left side: Canvas Simulator Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  پیش‌نمایش زنده المان المنتور در قالب کامواوب
                </span>
                <span className="text-xs text-slate-400 font-mono">Viewport: {viewport}</span>
              </div>

              {/* Viewport Box */}
              <div className={`mx-auto transition-all duration-300 ${
                viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'max-w-md' : 'max-w-xs'
              }`}>
                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-inner">
                  
                  {/* Simulated Live Widget Render */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-bold text-white text-sm">{widgetTitle}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {widgetBadge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      هوش مصنوعی کامواوب با تحلیل سوابق خرید و رفتار کاربر، بهترین پیشنهادهای تخفیف‌دار را در این نقطه از برگه به نمایش می‌گذارد.
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-emerald-400">تخفیف ویژه اعمال شد: ۱۵٪</span>
                      <button className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/40">
                        خرید با تخفیف
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
