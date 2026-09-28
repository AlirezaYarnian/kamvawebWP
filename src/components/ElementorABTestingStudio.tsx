import React, { useState, useEffect } from 'react';
import { 
  ABExperiment, 
  ABSectionVariant, 
  ABSectionType,
  ThemeOptionsConfig 
} from '../types/theme';
import { 
  Sparkles, 
  TrendingUp, 
  Split, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  MousePointerClick, 
  ShoppingBag, 
  Eye, 
  ShieldCheck, 
  Sliders, 
  Copy, 
  Check, 
  Zap, 
  BrainCircuit, 
  Award, 
  ArrowRight, 
  DollarSign, 
  Layers, 
  Code2, 
  Wand2, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
  BarChart3,
  Percent,
  Compass
} from 'lucide-react';

interface ElementorABTestingStudioProps {
  config: ThemeOptionsConfig;
  onApplyWinningVariant?: (variantData: ABSectionVariant) => void;
}

export const ElementorABTestingStudio: React.FC<ElementorABTestingStudioProps> = ({
  config,
  onApplyWinningVariant,
}) => {
  const [experiments, setExperiments] = useState<ABExperiment[]>([]);
  const [activeExperimentId, setActiveExperimentId] = useState<string>('');
  const [activeExperiment, setActiveExperiment] = useState<ABExperiment | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedVariantTab, setSelectedVariantTab] = useState<'split' | 'A' | 'B'>('split');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState<boolean>(false);
  const [trafficBatchAmount, setTrafficBatchAmount] = useState<number>(500);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedShortcode, setCopiedShortcode] = useState<boolean>(false);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newExpTitle, setNewExpTitle] = useState<string>('');
  const [newExpType, setNewExpType] = useState<ABSectionType>('hero_section');

  // Load experiments from backend
  const loadExperiments = async () => {
    try {
      const res = await fetch('/api/ab-testing/experiments');
      if (res.ok) {
        const data = await res.json();
        if (data.experiments && data.experiments.length > 0) {
          setExperiments(data.experiments);
          if (!activeExperimentId || !data.experiments.some((e: any) => e.id === activeExperimentId)) {
            setActiveExperimentId(data.experiments[0].id);
            setActiveExperiment(data.experiments[0]);
          } else {
            const current = data.experiments.find((e: any) => e.id === activeExperimentId);
            if (current) setActiveExperiment(current);
          }
        }
      }
    } catch (e) {
      console.error('Error loading A/B experiments:', e);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  useEffect(() => {
    if (activeExperimentId && experiments.length > 0) {
      const target = experiments.find((e) => e.id === activeExperimentId);
      if (target) setActiveExperiment(target);
    }
  }, [activeExperimentId, experiments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simulate Visitor Traffic Batch
  const handleSimulateBatch = async (batchCount: number) => {
    if (!activeExperiment) return;
    setIsSimulatingTraffic(true);
    try {
      const res = await fetch('/api/ab-testing/simulate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId: activeExperiment.id,
          batchSize: batchCount,
          customSplit: activeExperiment.trafficSplitRatio,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.experiment) {
          setActiveExperiment(data.experiment);
          setExperiments((prev) =>
            prev.map((e) => (e.id === data.experiment.id ? data.experiment : e))
          );
          showToast(`⚡ ${batchCount} کاربر شبیه‌سازی‌شده وارد آزمایش شدند و شاخص‌های آماری بلادرنگ بروزرسانی شدند.`);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('خطا در ارسال ترافیک شبیه‌سازی‌شده');
    } finally {
      setIsSimulatingTraffic(false);
    }
  };

  // Auto-traffic interval simulator
  useEffect(() => {
    let interval: any = null;
    if (isSimulatingTraffic) {
      interval = setInterval(() => {
        if (activeExperiment) {
          handleSimulateBatch(100);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingTraffic, activeExperiment]);

  // AI Generation of Variant B
  const handleAiGenerateVariantB = async () => {
    if (!activeExperiment) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ab-testing/ai-generate-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantA: activeExperiment.variantA,
          sectionType: activeExperiment.sectionType,
          optimizationGoal: 'حداکثر کلیک خرید و فروش قطعی',
          audienceContext: 'خریداران حرفه‌ای وب و کالای باکیفیت',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.variantB) {
          const updated: ABExperiment = {
            ...activeExperiment,
            variantB: data.variantB,
            updatedAt: new Date().toISOString(),
          };
          setActiveExperiment(updated);
          await handleSaveExperiment(updated);
          showToast('✨ نسخه B با هوش مصنوعی بر اساس متدهای روانشناسی خرید بازنویسی شد!');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('خطا در تولید هوشمند نسخه B');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Deep Analysis
  const handleAiDeepAnalyze = async () => {
    if (!activeExperiment) return;
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/ab-testing/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId: activeExperiment.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          const updated: ABExperiment = {
            ...activeExperiment,
            aiCoreAnalysis: data.analysis,
          };
          setActiveExperiment(updated);
          setExperiments((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e))
          );
          showToast('🧠 گزارش تحلیل عمیق هسته هوش مصنوعی استخراج و بروزرسانی شد.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Save changes
  const handleSaveExperiment = async (expToSave?: ABExperiment) => {
    const target = expToSave || activeExperiment;
    if (!target) return;

    try {
      const res = await fetch('/api/ab-testing/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });
      if (res.ok) {
        setExperiments((prev) =>
          prev.map((e) => (e.id === target.id ? target : e))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Apply winning variant
  const handleApplyWinner = async (variantCode: 'A' | 'B') => {
    if (!activeExperiment) return;
    try {
      const res = await fetch('/api/ab-testing/apply-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId: activeExperiment.id,
          variantToApply: variantCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const winningData = variantCode === 'B' ? activeExperiment.variantB : activeExperiment.variantA;
        if (onApplyWinningVariant) {
          onApplyWinningVariant(winningData);
        }
        await loadExperiments();
        showToast(`🏆 نسخه برنده (${variantCode}) با موفقیت به عنوان سکشن فعال در هسته المنتور و فروشگاه اعمال شد.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Shortcode
  const handleCopyShortcode = () => {
    if (!activeExperiment) return;
    const shortcode = `[kamva_ab_section id="${activeExperiment.id}"]`;
    navigator.clipboard.writeText(shortcode);
    setCopiedShortcode(true);
    showToast('شورت‌کد المنتور در کلیپ‌بورد کپی شد!');
    setTimeout(() => setCopiedShortcode(false), 3000);
  };

  // Update variant field in-place
  const handleUpdateVariantField = (
    variantId: 'A' | 'B',
    field: keyof ABSectionVariant,
    value: any
  ) => {
    if (!activeExperiment) return;
    const isA = variantId === 'A';
    const targetVariant = isA ? activeExperiment.variantA : activeExperiment.variantB;

    const updatedVariant: ABSectionVariant = {
      ...targetVariant,
      [field]: value,
    };

    const updatedExp: ABExperiment = {
      ...activeExperiment,
      variantA: isA ? updatedVariant : activeExperiment.variantA,
      variantB: !isA ? updatedVariant : activeExperiment.variantB,
      updatedAt: new Date().toISOString(),
    };

    setActiveExperiment(updatedExp);
    setExperiments((prev) =>
      prev.map((e) => (e.id === updatedExp.id ? updatedExp : e))
    );
  };

  // Create New Experiment
  const handleCreateNewExperiment = async () => {
    if (!newExpTitle.trim()) return;

    const newId = `ab-exp-${Date.now()}`;
    const newExp: ABExperiment = {
      id: newId,
      title: newExpTitle.trim(),
      sectionType: newExpType,
      status: 'running',
      trafficSplitRatio: 50,
      autoPromoteWinner: true,
      minConfidenceThreshold: 95,
      variantA: {
        id: 'A',
        name: 'نسخه A (کنترل)',
        headline: 'عنوان پیشنهادی سکشن لندینگ شما',
        subheadline: 'توضیحات معرفی خدمات یا ویژگی‌های کلیدی محصول را در این بخش قرار دهید.',
        badgeText: 'ویژه کاربران کامواوب',
        badgeColor: '#6366f1',
        ctaText: 'شروع کنید و خرید آنلاین انجام دهید',
        ctaSubtext: 'پشتیبانی ۲۴ ساعته و ارسال فوری',
        ctaColor: '#4f46e5',
        ctaBgGradient: 'from-indigo-600 to-blue-600',
        secondaryCtaText: 'مشاهده جزئیات بیشتر',
        priceTag: '۲,۵۰۰,۰۰۰ تومان',
        discountTag: '۱۰٪ تخفیف',
        urgencyText: 'ظرفیت محدود',
        urgencyTimerMinutes: 60,
        socialProofText: 'بیش از ۵۰۰ خریدار راضی در هفته گذشته',
        guaranteeBadgeText: '۷ روز ضمانت بازگشت وجه',
        bulletPoints: ['سرعت و راندمان بالا', 'پشتیبانی اختصاصی VIP', 'نصب و راه‌اندازی آسان'],
        visualStyle: 'gradient_dark',
        mediaPlaceholderText: 'بنر گرافیکی و پیش‌نمایش محصول',
        mediaBadge: 'کیفیت بالا',
      },
      variantB: {
        id: 'B',
        name: 'نسخه B (واریانت بهینه‌شده با محرک‌های روانی)',
        headline: 'راهکاری مطمئن برای دوبرابر کردن سرعت و افزایش فروش',
        subheadline: 'بدون ریسک و با گارانتی ۱۰۰٪ بازگشت وجه، از امروز فروشگاه خود را متحول کنید.',
        badgeText: '🔥 پیشنهاد طلایی با ارسال رایگان',
        badgeColor: '#10b981',
        ctaText: 'سفارش فوری با کد تخفیف ویژه 🚀',
        ctaSubtext: 'تضمین بهترین قیمت و اصالت کالا',
        ctaColor: '#059669',
        ctaBgGradient: 'from-emerald-500 to-teal-700',
        secondaryCtaText: 'مشاوره رایگان تلفنی',
        priceTag: '۲,۲۵۰,۰۰۰ تومان',
        discountTag: '۲۵۰,۰۰۰ تومان تخفیف آنی',
        urgencyText: '⚡ فقط ۵ عدد با این قیمت موجود است!',
        urgencyTimerMinutes: 30,
        socialProofText: 'رضا و ۳۲ کاربر دیگر در حال خرید این مورد هستند',
        guaranteeBadgeText: 'ضمانت بی قید و شرط بازگشت وجه',
        bulletPoints: ['کاهش هزینه‌ها و افزایش فروش', 'تحویل فوری کمتر از ۲۴ ساعت', 'آموزش و مشاوره فنی رایگان'],
        visualStyle: 'vibrant_warm',
        mediaPlaceholderText: 'بنر تعاملی با المان‌های جلب توجه',
        mediaBadge: 'محبوب‌ترین انتخاب',
      },
      metricsA: {
        impressions: 120,
        clicks: 8,
        conversions: 2,
        bounceCount: 52,
        totalTimeSeconds: 7800,
        revenueToman: 5000000,
        ctr: 6.67,
        conversionRate: 1.67,
        bounceRate: 43.33,
        avgTimeSeconds: 65,
      },
      metricsB: {
        impressions: 125,
        clicks: 18,
        conversions: 6,
        bounceCount: 30,
        totalTimeSeconds: 13750,
        revenueToman: 13500000,
        ctr: 14.40,
        conversionRate: 4.80,
        bounceRate: 24.0,
        avgTimeSeconds: 110,
      },
      winnerVariant: null,
      confidenceLevel: 88.5,
      upliftPercentage: 187.4,
      pValue: 0.115,
      aiCoreAnalysis: {
        summaryFa: 'آزمایش به تازگی آغاز شده است. نسخه B در جذب اولیه کلیک و کاهش پرش عملکرد بهتری نشان می‌دهد.',
        winningFactors: ['تمرکز بر مزیت ملموس به جای خصوصیات فنی', 'دکمه CTA زمردی پرانرژی'],
        psychologicalTriggersA: ['معرفی ساده'],
        psychologicalTriggersB: ['کاهش ریسک', 'اثبات اجتماعی زنده'],
        recommendations: ['اجازه دهید حداقل ۱,۰۰۰ بازدیدکننده در هر نسخه ثبت شود تا ضریب اطمینان به ۹۵٪ برسد.'],
        heatDistribution: {
          headlineAttention: { A: 60, B: 88 },
          ctaAttention: { A: 50, B: 92 },
          socialProofAttention: { A: 40, B: 80 },
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await handleSaveExperiment(newExp);
    setExperiments([newExp, ...experiments]);
    setActiveExperimentId(newId);
    setActiveExperiment(newExp);
    setIsCreatingNew(false);
    setNewExpTitle('');
    showToast('آزمایش جدید با موفقیت ایجاد شد.');
  };

  if (!activeExperiment) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
        <Split className="w-12 h-12 mx-auto text-pink-500 mb-3 animate-pulse" />
        <p className="font-bold text-white">در حال بارگذاری استودیوی تست A/B المنتور...</p>
      </div>
    );
  }

  const { variantA, variantB, metricsA, metricsB } = activeExperiment;
  const isWinnerB = activeExperiment.winnerVariant === 'B';
  const isWinnerA = activeExperiment.winnerVariant === 'A';
  const hasHighConfidence = activeExperiment.confidenceLevel >= (activeExperiment.minConfidenceThreshold || 95);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Experiment Picker */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
              <Split className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-white">
                  استودیوی تست محتوایی A/B سکشن‌های المنتور (A/B Content Testing)
                </h2>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-0.5 rounded-full border border-pink-500/30 font-mono">
                  AI Core Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مقایسه هوشمند دو نسخه از سکشن‌های لندینگ پیج، شبیه‌سازی ترافیک و ردیابی خودکار نرخ تبدیل با هوش مصنوعی
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-pink-400" />
              <span>آزمایش جدید</span>
            </button>

            <button
              onClick={handleCopyShortcode}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-700/50 transition-all cursor-pointer"
              title="کپی شورت‌کد برای استفاده در برگه و قالب وردپرس"
            >
              {copiedShortcode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="font-mono text-[11px]">[kamva_ab_section]</span>
            </button>

            <button
              onClick={() => handleSaveExperiment()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ذخیره تغییرات</span>
            </button>
          </div>
        </div>

        {/* Create New Experiment Form Modal Drawer */}
        {isCreatingNew && (
          <div className="p-4 bg-slate-950 border border-pink-500/30 rounded-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                تعریف تست A/B جدید برای سکشن المنتور
              </span>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[11px] text-slate-300 font-medium block mb-1">عنوان و هدف آزمایش:</label>
                <input
                  type="text"
                  placeholder="مثال: تست بنر تخفیف ویژه صفحه اصلی و دکمه خرید سریع"
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">نوع سکشن:</label>
                <select
                  value={newExpType}
                  onChange={(e) => setNewExpType(e.target.value as ABSectionType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="hero_section">سکشن هیرو (Hero Section)</option>
                  <option value="product_spotlight">اسپات‌لایت محصول (Product Spotlight)</option>
                  <option value="lead_capture">فرم جذب لید و مشاوره (Lead Gen)</option>
                  <option value="pricing_matrix">جدول تعرفه و قیمت‌گذاری (Pricing)</option>
                  <option value="cta_banner">بنر اقدام به خرید فوری (CTA Banner)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleCreateNewExperiment}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                ایجاد و بارگذاری در استودیو
              </button>
            </div>
          </div>
        )}

        {/* Experiment Selector Carousel / Pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 whitespace-nowrap pl-2 font-bold">آزمایش‌های فعال:</span>
          {experiments.map((exp) => {
            const isCurrent = exp.id === activeExperimentId;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveExperimentId(exp.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isCurrent
                    ? 'bg-slate-800 border-pink-500/70 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${exp.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{exp.title}</span>
                {exp.winnerVariant && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    برنده: {exp.winnerVariant}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. REAL-TIME AI CONVERSION METRICS & SIGNIFICANCE HEADER */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1: Conversion Rate Split (CR %) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              نرخ تبدیل به خرید (CR):
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              metricsB.conversionRate > metricsA.conversionRate
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-400'
            }`}>
              +{activeExperiment.upliftPercentage > 0 ? activeExperiment.upliftPercentage.toFixed(1) : '۰'}% رشد در B
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400">نسخه A (کنترل):</span>
              <p className="text-xl font-black text-slate-200">{metricsA.conversionRate}%</p>
              <span className="text-[10px] text-slate-500">{metricsA.conversions} خرید از {metricsA.impressions}</span>
            </div>

            <div className="space-y-0.5 border-r border-slate-800 pr-2">
              <span className="text-[10px] text-pink-400 font-bold">نسخه B (واریانت AI):</span>
              <p className="text-xl font-black text-emerald-400">{metricsB.conversionRate}%</p>
              <span className="text-[10px] text-emerald-400/80">{metricsB.conversions} خرید از {metricsB.impressions}</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Click-Through Rate (CTR %) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <MousePointerClick className="w-4 h-4 text-cyan-400" />
              نرخ کلیک دکمه CTA:
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
              CTR Comparison
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400">نسخه A:</span>
              <p className="text-xl font-black text-slate-200">{metricsA.ctr}%</p>
              <span className="text-[10px] text-slate-500">{metricsA.clicks} کلیک</span>
            </div>

            <div className="space-y-0.5 border-r border-slate-800 pr-2">
              <span className="text-[10px] text-cyan-400 font-bold">نسخه B:</span>
              <p className="text-xl font-black text-cyan-400">{metricsB.ctr}%</p>
              <span className="text-[10px] text-cyan-400/80">{metricsB.clicks} کلیک</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Revenue Generated */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              ارزش ریالی فروش (Revenue):
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              تومان
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400">نسخه A:</span>
              <p className="text-sm font-black text-slate-200">
                {(metricsA.revenueToman / 1000000).toLocaleString('fa-IR')} M
              </p>
              <span className="text-[10px] text-slate-500">میانگین توقف: {metricsA.avgTimeSeconds}s</span>
            </div>

            <div className="space-y-0.5 border-r border-slate-800 pr-2">
              <span className="text-[10px] text-amber-400 font-bold">نسخه B:</span>
              <p className="text-sm font-black text-amber-400">
                {(metricsB.revenueToman / 1000000).toLocaleString('fa-IR')} M
              </p>
              <span className="text-[10px] text-amber-400/80">میانگین توقف: {metricsB.avgTimeSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Metric Card 4: Statistical Significance & Confidence */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              ضریب اطمینان آماری (Confidence):
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              hasHighConfidence ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {hasHighConfidence ? 'نتیجه معتبر (p < 0.05)' : 'در حال جمع‌آوری داده'}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-800 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-300">{activeExperiment.confidenceLevel}%</span>
              <span className="text-[10px] font-mono text-slate-400">p-value: {activeExperiment.pValue}</span>
            </div>

            {/* Progress bar to 95% threshold */}
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  hasHighConfidence
                    ? 'bg-gradient-to-r from-purple-500 to-emerald-400'
                    : 'bg-gradient-to-r from-amber-500 to-purple-500'
                }`}
                style={{ width: `${Math.min(100, activeExperiment.confidenceLevel)}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-400">
              {hasHighConfidence
                ? `با ضریب اطمینان ${activeExperiment.confidenceLevel}٪، نسخه ${activeExperiment.winnerVariant || 'B'} برنده قطعی است.`
                : 'برای دستیابی به نتیجه ۱۰۰٪ علمی به نمونه‌های بیشتری نیاز است.'}
            </p>
          </div>
        </div>

      </div>

      {/* Traffic Control & Simulation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-white">توزیع ترافیک (Split Ratio):</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-300">نسخه A: {activeExperiment.trafficSplitRatio}%</span>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={activeExperiment.trafficSplitRatio}
              onChange={(e) => {
                const ratio = parseInt(e.target.value);
                const updated = { ...activeExperiment, trafficSplitRatio: ratio };
                setActiveExperiment(updated);
                handleSaveExperiment(updated);
              }}
              className="w-28 accent-pink-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-pink-400">نسخه B: {100 - activeExperiment.trafficSplitRatio}%</span>
          </div>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSimulateBatch(100)}
            disabled={isSimulatingTraffic}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>+۱۰۰ کاربر</span>
          </button>

          <button
            onClick={() => handleSimulateBatch(500)}
            disabled={isSimulatingTraffic}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            <span>+۵۰۰ کاربر</span>
          </button>

          <button
            onClick={() => handleSimulateBatch(2500)}
            disabled={isSimulatingTraffic}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>+۲,۵۰۰ کاربر</span>
          </button>

          <button
            onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isSimulatingTraffic
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-pink-600 hover:bg-pink-500 text-white'
            }`}
          >
            {isSimulatingTraffic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulatingTraffic ? 'توقف تزریق ترافیک' : 'شبیه‌سازی زنده ترافیک'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SIDE-BY-SIDE SPLIT CANVAS & EDITABLE CONTROLS        */}
      {/* ======================================================== */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Viewport & View Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              پیش‌نمایش بصری و مقایسه زنده سکشن‌ها در المنتور
            </span>

            {/* Heatmap Overlay Toggle */}
            <label className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-3.5 h-3.5 accent-pink-600 rounded"
              />
              <span className="text-[11px] font-bold">نقشه حرارتی توجه (AI Eye Tracking)</span>
            </label>
          </div>

          {/* Viewport and View Tab Switchers */}
          <div className="flex items-center gap-3">
            
            {/* View Mode */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedVariantTab('split')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedVariantTab === 'split' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                مقایسه دو نسخه (Split)
              </button>
              <button
                onClick={() => setSelectedVariantTab('A')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedVariantTab === 'A' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                نسخه A
              </button>
              <button
                onClick={() => setSelectedVariantTab('B')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedVariantTab === 'B' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                نسخه B
              </button>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewport === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="دسکتاپ"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewport === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="تبلت"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewport === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="موبایل"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* The Split Screen Sections Container */}
        <div className={`grid gap-6 ${
          selectedVariantTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}>

          {/* ======================================================== */}
          {/* VARIANT A (CONTROL) CARD                                 */}
          {/* ======================================================== */}
          {(selectedVariantTab === 'split' || selectedVariantTab === 'A') && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Header of Variant A */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-black text-xs">
                      A
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">{variantA.name}</span>
                      <span className="text-[10px] text-slate-400">ترافیک اختصاص‌یافته: {activeExperiment.trafficSplitRatio}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold">CR: {metricsA.conversionRate}%</span>
                    {hasHighConfidence && isWinnerA && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        برنده قطعی
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Visual Render of Variant A */}
                <div className={`mx-auto transition-all ${viewport === 'mobile' ? 'max-w-xs' : viewport === 'tablet' ? 'max-w-md' : 'w-full'}`}>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner relative overflow-hidden text-right">
                    
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold border"
                        style={{
                          backgroundColor: `${variantA.badgeColor}15`,
                          color: variantA.badgeColor,
                          borderColor: `${variantA.badgeColor}40`,
                        }}
                      >
                        {variantA.badgeText}
                      </span>

                      {variantA.discountTag && (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {variantA.discountTag}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <div className="relative">
                      <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                        {variantA.headline}
                      </h3>
                      {showHeatmap && (
                        <div
                          className="absolute -inset-1 rounded-lg pointer-events-none -z-10"
                          style={{
                            background: `radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)`,
                          }}
                        />
                      )}
                    </div>

                    {/* Subheadline */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {variantA.subheadline}
                    </p>

                    {/* Bullet points */}
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {variantA.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Actions */}
                    <div className="pt-2 space-y-2">
                      <div className="relative group">
                        <button
                          className="w-full py-2.5 rounded-xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                          style={{ backgroundColor: variantA.ctaColor }}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{variantA.ctaText}</span>
                        </button>
                        {showHeatmap && (
                          <div
                            className="absolute -inset-1 rounded-xl blur-sm -z-10"
                            style={{
                              background: `radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 80%)`,
                            }}
                          />
                        )}
                      </div>

                      {variantA.ctaSubtext && (
                        <p className="text-center text-[10px] text-slate-400">{variantA.ctaSubtext}</p>
                      )}
                    </div>

                    {/* Social proof & Guarantee */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {variantA.socialProofText}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Inline Quick Editors for Variant A */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 block">ویرایشگر سریع محتوای نسخه A:</span>
                  <div>
                    <input
                      type="text"
                      value={variantA.headline}
                      onChange={(e) => handleUpdateVariantField('A', 'headline', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="تیتر اصلی نسخه A"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={variantA.ctaText}
                      onChange={(e) => handleUpdateVariantField('A', 'ctaText', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="متن دکمه CTA"
                    />
                  </div>
                </div>

              </div>

              {/* Footer Button to Apply Variant A */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleApplyWinner('A')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>اعمال نسخه A به عنوان محتوای قطعی سکشن</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* VARIANT B (CHALLENGER / AI) CARD                          */}
          {/* ======================================================== */}
          {(selectedVariantTab === 'split' || selectedVariantTab === 'B') && (
            <div className="bg-slate-950/90 border border-pink-500/40 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
              
              {/* Highlight Ribbon */}
              <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-bold px-4 py-0.5 rounded-br-2xl shadow-md">
                واریانت بهینه‌شده با هوش مصنوعی
              </div>

              <div className="space-y-4 pt-1">
                {/* Header of Variant B */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-pink-600/30 border border-pink-500/60 flex items-center justify-center text-pink-300 font-black text-xs">
                      B
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">{variantB.name}</span>
                      <span className="text-[10px] text-slate-400">ترافیک اختصاص‌یافته: {100 - activeExperiment.trafficSplitRatio}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">CR: {metricsB.conversionRate}%</span>
                    <button
                      onClick={handleAiGenerateVariantB}
                      disabled={isAiGenerating}
                      className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-[10px] font-bold rounded-lg shadow-md cursor-pointer transition-all"
                      title="بازنویسی هوشمند نسخه B با الگوریتم‌های شناختی و کپی‌رایتینگ متقاعدکننده"
                    >
                      <Wand2 className={`w-3 h-3 ${isAiGenerating ? 'animate-spin' : ''}`} />
                      <span>{isAiGenerating ? 'در حال نگارش AI...' : 'تولید خودکار AI'}</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Visual Render of Variant B */}
                <div className={`mx-auto transition-all ${viewport === 'mobile' ? 'max-w-xs' : viewport === 'tablet' ? 'max-w-md' : 'w-full'}`}>
                  <div className="bg-gradient-to-br from-[#120d1c] via-slate-950 to-[#0d161a] border border-pink-500/30 rounded-2xl p-5 space-y-4 shadow-inner relative overflow-hidden text-right">
                    
                    {/* Badge & Urgency Tag */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm"
                        style={{
                          backgroundColor: `${variantB.badgeColor}22`,
                          color: variantB.badgeColor,
                          borderColor: `${variantB.badgeColor}55`,
                        }}
                      >
                        {variantB.badgeText}
                      </span>

                      {variantB.urgencyText && (
                        <span className="text-[11px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
                          {variantB.urgencyText}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <div className="relative">
                      <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                        {variantB.headline}
                      </h3>
                      {showHeatmap && (
                        <div
                          className="absolute -inset-2 rounded-xl pointer-events-none -z-10 animate-pulse"
                          style={{
                            background: `radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, rgba(244, 63, 94, 0) 75%)`,
                          }}
                        />
                      )}
                    </div>

                    {/* Subheadline */}
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {variantB.subheadline}
                    </p>

                    {/* Bullet points */}
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {variantB.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price & Guarantee Callout */}
                    {(variantB.priceTag || variantB.discountTag) && (
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{variantB.priceTag}</span>
                        <span className="font-bold text-emerald-400 font-mono">{variantB.discountTag}</span>
                      </div>
                    )}

                    {/* CTA Actions */}
                    <div className="pt-2 space-y-2">
                      <div className="relative group">
                        <button
                          className="w-full py-3 rounded-xl font-black text-xs text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
                          style={{ backgroundColor: variantB.ctaColor }}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{variantB.ctaText}</span>
                        </button>
                        {showHeatmap && (
                          <div
                            className="absolute -inset-1.5 rounded-xl blur-md -z-10 animate-pulse"
                            style={{
                              background: `radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 80%)`,
                            }}
                          />
                        )}
                      </div>

                      {variantB.ctaSubtext && (
                        <p className="text-center text-[10px] text-emerald-300 font-medium">{variantB.ctaSubtext}</p>
                      )}
                    </div>

                    {/* Social proof & Guarantee */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 flex-wrap gap-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {variantB.socialProofText}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Inline Quick Editors for Variant B */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 block">ویرایشگر سریع محتوای نسخه B:</span>
                  <div>
                    <input
                      type="text"
                      value={variantB.headline}
                      onChange={(e) => handleUpdateVariantField('B', 'headline', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
                      placeholder="تیتر اصلی نسخه B"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={variantB.ctaText}
                      onChange={(e) => handleUpdateVariantField('B', 'ctaText', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
                      placeholder="متن دکمه CTA"
                    />
                  </div>
                </div>

              </div>

              {/* Footer Button to Apply Variant B */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleApplyWinner('B')}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-white" />
                  <span>اعمال نسخه برنده B در المنتور و فروشگاه (+{activeExperiment.upliftPercentage.toFixed(0)}% رشد)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. AI CORE DIAGNOSTIC REPORT & PSYCHOLOGICAL DRIVERS     */}
      {/* ======================================================== */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white">
                گزارش تحلیل روانشناسی تبدیل هسته هوش مصنوعی (AI Core CRO Intelligence)
              </h3>
              <p className="text-xs text-slate-400">
                علت‌های رفتاری تفاوت عملکرد دو نسخه بر اساس اصول روانشناسی خرید و داده‌های تعاملی
              </p>
            </div>
          </div>

          <button
            onClick={handleAiDeepAnalyze}
            disabled={isAiAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-600/50 text-purple-300 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAiAnalyzing ? 'در حال تحلیل عمیق...' : 'تحلیل مجدد هوش مصنوعی'}</span>
          </button>
        </div>

        {/* AI Summary Banner */}
        {activeExperiment.aiCoreAnalysis?.summaryFa && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-200 text-xs leading-relaxed flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">جمع‌بندی هوش مصنوعی:</span>
              <p>{activeExperiment.aiCoreAnalysis.summaryFa}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Winning Factors */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              عوامل کلیدی پیروزی نسخه برنده:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {activeExperiment.aiCoreAnalysis?.winningFactors?.map((wf, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{wf}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: Psychological Triggers Comparison */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              محرک‌های روانشناسی فعال:
            </span>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold">نسخه A:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeExperiment.aiCoreAnalysis?.psychologicalTriggersA?.map((trig, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-pink-400 font-bold">نسخه B:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeExperiment.aiCoreAnalysis?.psychologicalTriggersB?.map((trig, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-bold">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Recommendations */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              توصیه‌های اقدام بعدی در فروشگاه:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {activeExperiment.aiCoreAnalysis?.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. WORDPRESS & ELEMENTOR EXPORT / SHORTCODE GUIDE       */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 shadow-xl">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">یکپارچگی خودکار با هسته قالب کامواوب و المنتور وردپرس:</span>
            <span className="text-slate-400 text-[11px]">
              شورت‌کد اختصاصی <code className="text-pink-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">[kamva_ab_section id="{activeExperiment.id}"]</code> ترافیک واقعی بازدیدکنندگان را بدون ایجاد پرش (CLS 0.0) با کوکی ماندگار تقسیم می‌کند.
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyShortcode}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>کپی شورت‌کد برای المنتور</span>
        </button>
      </div>

    </div>
  );
};
