import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  Compass, 
  BarChart3, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  Target,
  Mail,
  Bell,
  Send,
  Code2,
  CheckCircle2,
  Star,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
  HelpCircle,
  Globe,
  SlidersHorizontal,
  Flame,
  Clock,
  ShieldCheck,
  Split,
  Percent,
  Trophy,
  Play,
  Pause,
  Plus,
  Wand2,
  MousePointer,
  Maximize2,
  Zap,
  CheckCheck,
  Activity,
  Award,
  ArrowRight,
  ChevronLeft,
  BrainCircuit,
  Sliders,
  Eye
} from 'lucide-react';
import { 
  WeeklyTrendsReport, 
  GoogleSchemaDefinition, 
  WeeklyTrendKeyword,
  ABExperiment,
  ABSectionVariant,
  ABVariantMetrics,
  ABSectionType
} from '../types/theme';

export const SeoMarketLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'ab-testing' | 'trends-alerts' | 'schemas' | 'seo' | 'pricing'>('audit');

  // --- 0. KamvaSeoOptimizer (Background Product SEO Audit) State ---
  const [seoAuditReport, setSeoAuditReport] = useState<any>(null);
  const [isScanningSeo, setIsScanningSeo] = useState(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  const [cronInfo, setCronInfo] = useState<any>({
    is_scheduled: true,
    next_run_human: '۴ ساعت دیگر',
    active_frequency: 'kamva_daily',
  });
  const [cronSettings, setCronSettings] = useState<any>({
    auto_scan_enabled: true,
    frequency: 'kamva_daily',
    max_products_per_run: 50,
    min_word_count: 150,
  });
  const [selectedIssueCategory, setSelectedIssueCategory] = useState<'all' | 'meta' | 'speed' | 'structure'>('all');
  const [showCronSettingsModal, setShowCronSettingsModal] = useState(false);

  // --- 0.5. A/B Testing & Conversion Lab State ---
  const [abExperiments, setAbExperiments] = useState<ABExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<ABExperiment | null>(null);
  const [isLoadingExperiments, setIsLoadingExperiments] = useState(false);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [isGeneratingAiVariants, setIsGeneratingAiVariants] = useState(false);
  const [isDeployingWinner, setIsDeployingWinner] = useState(false);
  const [deployToastMsg, setDeployToastMsg] = useState<string | null>(null);
  const [simulationToastMsg, setSimulationToastMsg] = useState<string | null>(null);
  const [showNewExpModal, setShowNewExpModal] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('هدفون مانیتورینگ بلوتوثی Kamva Pro Sound');
  const [activeVariantPreviewTab, setActiveVariantPreviewTab] = useState<'A' | 'B' | 'compare'>('B');

  // New Experiment Form State
  const [newExpTitle, setNewExpTitle] = useState('کمپین تخفیف شگفت‌انگیز صفحه اصلی');
  const [newExpSectionType, setNewExpSectionType] = useState<ABSectionType>('hero_section');

  // --- 1. SEO State ---
  const [keywordInput, setKeywordInput] = useState('خرید هدفون نویز کنسلینگ');
  const [nicheInput, setNicheInput] = useState('تجهیزات صوتی و لوازم جانبی دیجیتال');
  const [competitorsInput, setCompetitorsInput] = useState('دیجی‌کالا، تکنولایف، زنبیل');
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --- 2. Pricing State ---
  const [productName, setProductName] = useState('هدفون مانیتورینگ استودیویی Kamva Pro Sound ANC');
  const [currentPrice, setCurrentPrice] = useState('۶,۲۰۰,۰۰۰ تومان');
  const [competitorPriceData, setCompetitorPriceData] = useState('دیجی‌کالا: ۶,۵۰۰,۰۰۰ تومان | تکنولایف: ۶,۱۸۰,۰۰۰ تومان (ناموجود)');
  const [isAnalyzingPricing, setIsAnalyzingPricing] = useState(false);
  const [pricingResult, setPricingResult] = useState<any>(null);

  // --- 3. Weekly Trends Alert State ---
  const [managerEmail, setManagerEmail] = useState('admin@kamvaweb.com');
  const [notificationChannel, setNotificationChannel] = useState<'email' | 'push' | 'webhook'>('email');
  const [weeklyTrendsData, setWeeklyTrendsData] = useState<WeeklyTrendsReport | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isDispatchingDigest, setIsDispatchingDigest] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [selectedTrendKeyword, setSelectedTrendKeyword] = useState<WeeklyTrendKeyword | null>(null);

  // --- 4. Google Schemas State ---
  const [selectedSchemaType, setSelectedSchemaType] = useState<'Product' | 'FAQPage' | 'BreadcrumbList' | 'Organization'>('Product');
  const [generatedSchemaData, setGeneratedSchemaData] = useState<any>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);

  // Fetch initial weekly trends
  const fetchWeeklyTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const res = await fetch('/api/seo/weekly-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryFocus: 'لپ‌تاپ، لوازم دیجیتال، صوتی و تصویر',
          storeNiche: 'فروشگاه تخصصی کامواوب پرو',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setWeeklyTrendsData(data.result);
        if (data.result.topTrendingKeywords?.length > 0) {
          setSelectedTrendKeyword(data.result.topTrendingKeywords[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  // Dispatch weekly digest to manager
  const handleDispatchWeeklyDigest = async () => {
    if (!managerEmail || isDispatchingDigest) return;
    setIsDispatchingDigest(true);
    setDispatchSuccessMsg(null);

    try {
      const res = await fetch('/api/seo/send-weekly-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          managerEmail,
          reportData: weeklyTrendsData,
          notificationMethod: notificationChannel,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDispatchSuccessMsg(data.message || 'گزارش هفتگی با موفقیت ارسال شد');
        setTimeout(() => setDispatchSuccessMsg(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatchingDigest(false);
    }
  };

  // Generate Google Schema
  const handleFetchSchema = async (type: 'Product' | 'FAQPage' | 'BreadcrumbList' | 'Organization') => {
    setIsLoadingSchema(true);
    try {
      const res = await fetch('/api/seo/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemaType: type }),
      });
      const data = await res.json();
      setGeneratedSchemaData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSchema(false);
    }
  };

  // Fetch SEO Audit Report (KamvaSeoOptimizer)
  const fetchSeoAuditReport = async () => {
    try {
      const res = await fetch('/api/seo-audit/latest-report');
      const data = await res.json();
      if (data.report) {
        setSeoAuditReport(data.report);
      }
      if (data.cron_info) {
        setCronInfo(data.cron_info);
      }
      if (data.settings) {
        setCronSettings(data.settings);
      }
    } catch (e) {
      console.error('Failed to fetch SEO audit report:', e);
    }
  };

  // Run Manual Immediate Scan
  const handleRunAuditScan = async () => {
    setIsScanningSeo(true);
    setScanSuccessMsg(null);
    try {
      const res = await fetch('/api/seo-audit/run-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.report) {
        setSeoAuditReport(data.report);
        setScanSuccessMsg('پویش خودکار صفحات محصولات با موفقیت انجام شد و گزارش هوش مصنوعی به‌روزرسانی گردید.');
        setTimeout(() => setScanSuccessMsg(null), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanningSeo(false);
    }
  };

  // Apply AI Fixes to Products
  const handleApplyAuditFixes = async () => {
    setIsApplyingFixes(true);
    setScanSuccessMsg(null);
    try {
      const res = await fetch('/api/seo-audit/apply-ai-fixes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.report) {
        setSeoAuditReport(data.report);
        setScanSuccessMsg('کلیه اصلاحات عناوین سئو، توضیحات متا و تگ‌های Alt با هوش مصنوعی در پایگاه داده ثبت و منتشر شدند.');
        setTimeout(() => setScanSuccessMsg(null), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplyingFixes(false);
    }
  };

  // Save WP-Cron Schedule Settings
  const handleSaveCronSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/seo-audit/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.settings) {
        setCronSettings(data.settings);
        setCronInfo((prev: any) => ({
          ...prev,
          active_frequency: data.settings.frequency,
          is_scheduled: data.settings.auto_scan_enabled,
        }));
        setShowCronSettingsModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- 0.5. A/B Testing Handlers ---
  const fetchAbExperiments = async () => {
    setIsLoadingExperiments(true);
    try {
      const res = await fetch('/api/ab-testing/experiments');
      const data = await res.json();
      if (data.experiments) {
        setAbExperiments(data.experiments);
        if (data.experiments.length > 0 && !selectedExperiment) {
          setSelectedExperiment(data.experiments[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load A/B experiments:', e);
    } finally {
      setIsLoadingExperiments(false);
    }
  };

  const handleSimulateTraffic = async (batchSize = 100) => {
    if (!selectedExperiment || isSimulatingTraffic) return;
    setIsSimulatingTraffic(true);
    setSimulationToastMsg(null);
    try {
      const res = await fetch(`/api/ab-testing/experiments/${selectedExperiment.id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize })
      });
      const data = await res.json();
      if (data.experiment) {
        setSelectedExperiment(data.experiment);
        setAbExperiments(prev => prev.map(e => e.id === data.experiment.id ? data.experiment : e));
        setSimulationToastMsg(`ورود ${batchSize} بازدیدکننده شبیه‌سازی شد! متغیر B با ${data.simulatedBatch.addedConversionsB} تبدیل (${selectedExperiment.upliftPercentage}% رشد) پیشتاز است.`);
        setTimeout(() => setSimulationToastMsg(null), 4500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulatingTraffic(false);
    }
  };

  const handleGenerateAiVariants = async () => {
    if (!aiPromptTopic || isGeneratingAiVariants) return;
    setIsGeneratingAiVariants(true);
    try {
      const res = await fetch('/api/ab-testing/ai-generate-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productOrPageTitle: aiPromptTopic })
      });
      const data = await res.json();
      if (data.generatedVariant && selectedExperiment) {
        const updatedExp = {
          ...selectedExperiment,
          variantB: {
            ...selectedExperiment.variantB,
            ...data.generatedVariant
          }
        };
        setSelectedExperiment(updatedExp);
        setAbExperiments(prev => prev.map(e => e.id === updatedExp.id ? updatedExp : e));
        setActiveVariantPreviewTab('B');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiVariants(false);
    }
  };

  const handleDeployWinner = async () => {
    if (!selectedExperiment || isDeployingWinner) return;
    setIsDeployingWinner(true);
    try {
      const res = await fetch(`/api/ab-testing/experiments/${selectedExperiment.id}/deploy-winner`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.experiment) {
        setSelectedExperiment(data.experiment);
        setAbExperiments(prev => prev.map(e => e.id === data.experiment.id ? data.experiment : e));
        setDeployToastMsg(data.message || 'نسخه برنده با موفقیت اعمال گردید.');
        setTimeout(() => setDeployToastMsg(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeployingWinner(false);
    }
  };

  const handleToggleExperimentStatus = (expId: string) => {
    if (!selectedExperiment) return;
    const nextStatus = selectedExperiment.status === 'running' ? 'paused' : 'running';
    const updated = { ...selectedExperiment, status: nextStatus as any };
    setSelectedExperiment(updated);
    setAbExperiments(prev => prev.map(e => e.id === expId ? updated : e));
    fetch('/api/ab-testing/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(console.error);
  };

  const handleUpdateTrafficSplit = (newRatio: number) => {
    if (!selectedExperiment) return;
    const updated = { ...selectedExperiment, trafficSplitRatio: newRatio };
    setSelectedExperiment(updated);
    setAbExperiments(prev => prev.map(e => e.id === updated.id ? updated : e));
    fetch('/api/ab-testing/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(console.error);
  };

  const handleCreateNewExperiment = async () => {
    if (!newExpTitle.trim()) return;
    const newExp: Partial<ABExperiment> = {
      id: `exp-${Date.now()}`,
      title: newExpTitle,
      sectionType: newExpSectionType,
      status: 'running',
      trafficSplitRatio: 50,
      autoPromoteWinner: true,
      minConfidenceThreshold: 95,
      variantA: {
        id: 'A',
        name: 'نسخه کنترل پیش‌فرض (Original A)',
        headline: newExpTitle,
        subheadline: 'توضیحات و ارزش پیشنهادی استاندارد محصول در فروشگاه کامواوب.',
        badgeText: 'نسخه استاندارد',
        badgeColor: 'indigo',
        ctaText: 'مشاهده مشخصات و ثبت سفارش',
        ctaColor: 'indigo',
        ctaBgGradient: 'from-indigo-600 to-indigo-700',
        socialProofText: 'بیش از ۵۰۰ خریدار راضی',
        guaranteeBadgeText: 'ضمانت سلامت فیزیکی کالا',
        bulletPoints: ['ارسال با پست پیشتاز و تیپاکس', 'پشتیبانی فنی در ساعات اداری'],
        visualStyle: 'gradient_dark',
        mediaPlaceholderText: 'بنر و تصویر اصلی',
        mediaBadge: 'کیفیت HD'
      },
      variantB: {
        id: 'B',
        name: 'نسخه بهینه‌سازی‌شده هوش مصنوعی (Variant B)',
        headline: `بهترین تجربه خرید ${newExpTitle} با تخفیف شگفت‌انگیز اختصاصی!`,
        subheadline: 'ارسال فوری ۱ ساعته + هدیه مکمل و ضمانت بازگشت وجه ۱۰۰٪ بدون هیچ قید و شرطی.',
        badgeText: '🔥 پیشنهاد ویژه هوش مصنوعی',
        badgeColor: 'rose',
        ctaText: 'همین حالا با تخفیف ویژه خرید کن!',
        ctaColor: 'rose',
        ctaBgGradient: 'from-rose-500 to-orange-500',
        socialProofText: '۴۲ نفر در ۱ ساعت گذشته سفارش دادند',
        guaranteeBadgeText: 'ضمانت ۳۰ روزه تعویض بی قیدوشرط',
        bulletPoints: ['تخفیف شگفت‌انگیز زمان‌دار', 'ارسال رایگان برای تمام سفارشات امروز'],
        visualStyle: 'high_contrast',
        mediaPlaceholderText: 'تصویر تعاملی ارزش‌پایه',
        mediaBadge: 'انتخاب ۹۸٪ خریداران'
      }
    };

    try {
      const res = await fetch('/api/ab-testing/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      const data = await res.json();
      if (data.experiment) {
        setAbExperiments(prev => [data.experiment, ...prev]);
        setSelectedExperiment(data.experiment);
        setShowNewExpModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run initial queries
  useEffect(() => {
    fetchSeoAuditReport();
    fetchAbExperiments();
    fetchWeeklyTrends();
    handleFetchSchema('Product');
    handleRunSeoAnalysis();
    handleRunPricingAnalysis();
  }, []);

  const handleRunSeoAnalysis = async () => {
    if (!keywordInput.trim()) return;
    setIsAnalyzingSeo(true);

    try {
      const response = await fetch('/api/ai/seo-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keywordInput,
          niche: nicheInput,
          competitors: competitorsInput,
        }),
      });

      const data = await response.json();
      setSeoResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingSeo(false);
    }
  };

  const handleRunPricingAnalysis = async () => {
    if (!productName.trim()) return;
    setIsAnalyzingPricing(true);

    try {
      const response = await fetch('/api/ai/market-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          currentPrice,
          competitorsData: competitorPriceData,
        }),
      });

      const data = await response.json();
      setPricingResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingPricing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                <Compass className="w-3.5 h-3.5" />
                آزمایشگاه جامع سئو و هوش رقبای گوگل کامواوب (SEO Market Lab)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                پایش خودکار روندهای صعودی گوگل + اسکیماهای استاندارد
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              استخراج روندهای هفتگی گوگل، نوتیفیکیشن خودکار و استودیوی اسکیما (Rich Snippets)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              مغز هوش مصنوعی داخلی کامواوب هر هفته کلمات کلیدی پرتقاضای فروشگاهی را استخراج و برای مدیر ارسال می‌کند؛ همچنین کدهای استاندارد اسکیما JSON-LD گوگل را بدون خطا پیاده‌سازی می‌نماید.
            </p>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-violet-300" />
              <span>پویشگر محصولات (KamvaSeoOptimizer)</span>
              {seoAuditReport?.critical_issues_count > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ab-testing')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ab-testing'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-4 h-4 text-rose-300" />
              <span>تست A/B و آزمایشگاه نرخ تبدیل (CRO Lab)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950/70 text-amber-300 rounded border border-amber-500/30">
                {abExperiments.filter(e => e.status === 'running').length || 2} فعال
              </span>
            </button>

            <button
              onClick={() => setActiveTab('trends-alerts')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'trends-alerts'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              <span>گزارش هفتگی ترندهای گوگل</span>
            </button>

            <button
              onClick={() => setActiveTab('schemas')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schemas'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-indigo-300" />
              <span>استودیوی اسکیماهای گوگل</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>تحقیق کلمات و رقبا</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-300" />
              <span>پایش قیمت ووکامرس</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 0: KAMVA SEO OPTIMIZER (BACKGROUND WP-CRON AUDITOR)   */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Notification Alert Message */}
          {scanSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{scanSuccessMsg}</span>
              </div>
              <button onClick={() => setScanSuccessMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          )}

          {/* Cron Schedule & Main Controls Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-violet-400" />
                    موتور پویشگر خودکار سئو محصولات (KamvaSeoOptimizer)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    WP-Cron Background Worker
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  این ماژول در پس‌زمینه وردپرس اجرا شده و صفحات محصولات را از نظر فقدان متاتگ‌ها، سرعت لود و ساختار اسکن نموده و با هوش مصنوعی اصلاحات تولید می‌کند.
                </p>
              </div>

              {/* Status pills & action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>اجرای بعدی: <strong className="text-white">{cronInfo.next_run_human}</strong></span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">فرکانس: <strong>{cronSettings.frequency === 'kamva_daily' ? 'روزانه' : cronSettings.frequency === 'kamva_twicedaily' ? 'هر ۱۲ ساعت' : 'هفتگی'}</strong></span>
                </div>

                <button
                  onClick={() => setShowCronSettingsModal(true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-700"
                  title="تنظیمات زمان‌بندی WP-Cron"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRunAuditScan}
                  disabled={isScanningSeo}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningSeo ? 'animate-spin' : ''}`} />
                  <span>{isScanningSeo ? 'در حال پویش پس‌زمینه...' : 'اجرای آنی اسکن محصولات'}</span>
                </button>

                <button
                  onClick={handleApplyAuditFixes}
                  disabled={isApplyingFixes || !seoAuditReport?.products?.length}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isApplyingFixes ? 'animate-spin' : ''}`} />
                  <span>{isApplyingFixes ? 'در حال اعمال اصلاحات...' : 'اعمال خودکار اصلاحات هوش مصنوعی'}</span>
                </button>
              </div>
            </div>

            {/* Cron & Scanner Stats Grid */}
            {seoAuditReport && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                {/* 1. Overall Score */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">امتیاز کل سئو محصولات</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      seoAuditReport.scores.overall >= 85 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {seoAuditReport.scores.overall >= 85 ? 'وضعیت عالی' : 'نیازمند بهینه‌سازی'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-white font-mono">{seoAuditReport.scores.overall}</span>
                    <span className="text-xs text-slate-400 font-mono">/ ۱۰۰</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        seoAuditReport.scores.overall >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${seoAuditReport.scores.overall}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>محصولات پایش‌شده: {seoAuditReport.scanned_products_count}</span>
                    <span className="text-rose-400">خطاهای بحرانی: {seoAuditReport.critical_issues_count}</span>
                  </div>
                </div>

                {/* 2. Meta Tags Score */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">سلامت متاتگ‌ها (Meta)</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{seoAuditReport.scores.meta}%</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-cyan-300 font-mono">{seoAuditReport.issues_breakdown.meta_issues}</span>
                    <span className="text-xs text-slate-400">مورد نیاز به بهبود</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${seoAuditReport.scores.meta}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 truncate">عنوان سئو، توضیحات متا و کلمات کلیدی</p>
                </div>

                {/* 3. Speed & Assets Score */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">سرعت و تصاویر (Speed)</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{seoAuditReport.scores.speed}%</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-emerald-300 font-mono">{seoAuditReport.issues_breakdown.speed_issues}</span>
                    <span className="text-xs text-slate-400">تصویر یا المان سنگین</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${seoAuditReport.scores.speed}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 truncate">تبدیل به WebP و بهینه‌سازی زمان LCP</p>
                </div>

                {/* 4. Structure & Headings */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">ساختار و محتوا (Structure)</span>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{seoAuditReport.scores.structure}%</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-purple-300 font-mono">{seoAuditReport.issues_breakdown.structure_issues}</span>
                    <span className="text-xs text-slate-400">نقص ساختاری/هدینگ</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${seoAuditReport.scores.structure}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 truncate">هدینگ‌های H2، متن جایگزین و اسکیما SKU</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Executive Summary & Projected Impact Card */}
          {seoAuditReport?.ai_insights && (
            <div className="bg-gradient-to-r from-violet-950/50 via-slate-900 to-indigo-950/50 border border-violet-500/30 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      گزارش تحلیلی و نقشه راه بهینه‌سازی هوش مصنوعی (AI Optimization Report)
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {seoAuditReport.ai_insights.executive_summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">رشد ترافیک ارگانیک</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">{seoAuditReport.ai_insights.projected_traffic_gain}</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">افزایش نرخ کلیک CTR</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">{seoAuditReport.ai_insights.projected_ctr_boost}</span>
                  </div>
                </div>
              </div>

              {/* Priority Action Items */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 block mb-2">اقدامات اولویت‌دار استخراج‌شده توسط هوش مصنوعی:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {seoAuditReport.ai_insights.priority_actions.map((act: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Issues & AI Fixes List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  بررسی جزئیات سئو و متاتگ‌های هوشمند صفحات محصولات
                </h3>
                <span className="text-xs text-slate-400">
                  شناسایی خودکار نقص‌های سئو درون صفحه همراه با پیش‌نویس آماده عناوین و توضیحات هوش مصنوعی
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSelectedIssueCategory('all')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                    selectedIssueCategory === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  همه محصولات
                </button>
                <button
                  onClick={() => setSelectedIssueCategory('meta')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                    selectedIssueCategory === 'meta' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مشکلات متا
                </button>
                <button
                  onClick={() => setSelectedIssueCategory('speed')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                    selectedIssueCategory === 'speed' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  سرعت و تصویر
                </button>
                <button
                  onClick={() => setSelectedIssueCategory('structure')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                    selectedIssueCategory === 'structure' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ساختار و محتوا
                </button>
              </div>
            </div>

            {/* Products Cards */}
            <div className="space-y-3">
              {seoAuditReport?.products?.filter((p: any) => {
                if (selectedIssueCategory === 'all') return true;
                return p.issues?.some((i: any) => i.category === selectedIssueCategory);
              }).map((product: any) => (
                <div key={product.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                        product.seo_score >= 85
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : product.seo_score >= 70
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        امتیاز {product.seo_score}/۱۰۰
                      </span>
                      <h4 className="text-sm font-bold text-white">{product.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800">{product.structure?.sku}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">کلمات: <strong className="text-slate-200">{product.structure?.word_count}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">سرعت TTFB: <strong className="text-emerald-400 font-mono">{product.performance?.simulated_ttfb_ms}ms</strong></span>
                      <span className="text-slate-600">•</span>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                      >
                        <span>مشاهده صفحه</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Identified Issues */}
                  {product.issues?.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 block">نقص‌های شناسایی‌شده در پویش سئو:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.issues.map((issue: any, i: number) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                                <AlertCircle className={`w-3.5 h-3.5 ${
                                  issue.severity === 'high' ? 'text-rose-400' : issue.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                                }`} />
                                {issue.title}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                issue.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {issue.severity === 'high' ? 'بحرانی' : issue.severity === 'medium' ? 'متوسط' : 'بهبود'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{issue.description}</p>
                            <span className="text-[10px] text-slate-500 block">اثر: {issue.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>این محصول کاملاً بهینه بوده و دارای متاتگ‌های غنی، محتوای استاندارد و تصاویر فشرده WebP می‌باشد.</span>
                    </div>
                  )}

                  {/* AI Generated Fixes Preview */}
                  {product.ai_generated_fixes && (
                    <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          اصلاحات پیشنهادی هوش مصنوعی (آماده انتشار):
                        </span>
                        <button
                          onClick={handleApplyAuditFixes}
                          disabled={isApplyingFixes}
                          className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          اعمال این اصلاح
                        </button>
                      </div>

                      {product.ai_generated_fixes.meta_title && (
                        <div className="text-[11px] text-slate-300">
                          <strong className="text-slate-400">عنوان سئو:</strong> {product.ai_generated_fixes.meta_title}
                        </div>
                      )}
                      {product.ai_generated_fixes.meta_desc && (
                        <div className="text-[11px] text-slate-300">
                          <strong className="text-slate-400">توضیحات متا:</strong> {product.ai_generated_fixes.meta_desc}
                        </div>
                      )}
                      {product.ai_generated_fixes.image_alt && (
                        <div className="text-[11px] text-slate-300">
                          <strong className="text-slate-400">متن جایگزین تصویر (Alt):</strong> {product.ai_generated_fixes.image_alt}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cron Settings Modal */}
          {showCronSettingsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                    تنظیمات وظیفه پس‌زمینه (WP-Cron KamvaSeoOptimizer)
                  </h3>
                  <button onClick={() => setShowCronSettingsModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">دوره زمانی اجرای خودکار:</label>
                    <select
                      value={cronSettings.frequency}
                      onChange={(e) => setCronSettings({ ...cronSettings, frequency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="kamva_twicedaily">هر ۱۲ ساعت (Twice Daily)</option>
                      <option value="kamva_daily">روزانه (Daily - ساعت ۴ بامداد)</option>
                      <option value="kamva_weekly">هفتگی (Weekly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">حداکثر تعداد محصولات در هر اسکن:</label>
                    <input
                      type="number"
                      value={cronSettings.max_products_per_run}
                      onChange={(e) => setCronSettings({ ...cronSettings, max_products_per_run: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-bold text-slate-200 block">فعال‌سازی تسک پس‌زمینه:</span>
                      <span className="text-[10px] text-slate-400">اجرای منظم بدون افت سرعت کاربران</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={cronSettings.auto_scan_enabled}
                      onChange={(e) => setCronSettings({ ...cronSettings, auto_scan_enabled: e.target.checked })}
                      className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowCronSettingsModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleSaveCronSettings(cronSettings)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
                  >
                    ذخیره تنظیمات کران
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 0.5: A/B TESTING & CONVERSION RATE OPTIMIZER (CRO LAB)*/}
      {/* ========================================================= */}
      {activeTab === 'ab-testing' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Notifications */}
          {deployToastMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{deployToastMsg}</span>
              </div>
              <button onClick={() => setDeployToastMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          )}

          {simulationToastMsg && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span>{simulationToastMsg}</span>
              </div>
              <button onClick={() => setSimulationToastMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          )}

          {/* Top Stat Overview Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-rose-400" />
                تعداد آزمایش‌های A/B
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{abExperiments.length}</span>
                <span className="text-xs text-emerald-400 font-bold">
                  ({abExperiments.filter(e => e.status === 'running').length} در حال اجرا)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">پایش رفتار زنده خریداران</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                میانگین رشد نرخ تبدیل (Uplift)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  +{selectedExperiment?.upliftPercentage || 49.3}%
                </span>
                <span className="text-xs text-emerald-300 font-bold">نسخه هوشمند B</span>
              </div>
              <span className="text-[10px] text-slate-500 block">نسبت به نسخه کنترل A</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                اطمینان آماری (Confidence)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-300 font-mono">
                  {selectedExperiment?.confidenceLevel || 98.8}%
                </span>
                <span className="text-xs text-emerald-400 font-bold">معنادار (p &lt; 0.01)</span>
              </div>
              <span className="text-[10px] text-slate-500 block">محاسبه بر اساس توزیع Z و بیزین</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                درآمد کل شبیه‌سازی‌شده
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-300 font-mono">
                  {((((selectedExperiment?.metricsA.revenueToman || 0) + (selectedExperiment?.metricsB.revenueToman || 0))) / 1000000).toLocaleString('fa-IR')}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">میلیون تومان</span>
              </div>
              <span className="text-[10px] text-slate-500 block">مجموع فروش حاصل از تست‌ها</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-1 col-span-2 lg:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                موتور بهینه‌ساز هوش مصنوعی
              </span>
              <div className="text-xs font-bold text-purple-300 pt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>تحلیل روانشناسی شناختی فعال</span>
              </div>
              <span className="text-[10px] text-slate-500 block">تولید مداوم تریگرهای افزایش فروش</span>
            </div>
          </div>

          {/* Experiment Control Strip */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <Split className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {selectedExperiment?.title || 'انتخاب آزمایش A/B'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedExperiment?.status === 'running'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : selectedExperiment?.status === 'concluded'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {selectedExperiment?.status === 'running' ? '● در حال اجرا' : selectedExperiment?.status === 'concluded' ? '✓ پایان‌یافته' : '⏸ متوقف'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    مقایسه نسخه کنترل (A) در برابر نسخه متغیر بهینه‌سازی‌شده (B) با تحلیل بیزین و بینش‌های شناختی هوش مصنوعی
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowNewExpModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-400" />
                  <span>ایجاد تست جدید</span>
                </button>

                {selectedExperiment && (
                  <button
                    onClick={() => handleToggleExperimentStatus(selectedExperiment.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedExperiment.status === 'running'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    }`}
                  >
                    {selectedExperiment.status === 'running' ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>توقف موقت تست</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>ادامه اجرای تست</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => handleSimulateTraffic(100)}
                  disabled={isSimulatingTraffic || !selectedExperiment}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${isSimulatingTraffic ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingTraffic ? 'در حال ارسال ترافیک...' : '🚀 شبیه‌سازی ورود ۱۰۰ کاربر زنده'}</span>
                </button>
              </div>
            </div>

            {/* Campaign Selection Tabs & Traffic Split Control */}
            {selectedExperiment && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                {/* Experiment Picker */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-slate-400 shrink-0">کمپین‌های فعال:</span>
                  {abExperiments.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedExperiment(exp)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 truncate max-w-[220px] ${
                        selectedExperiment.id === exp.id
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {exp.title}
                    </button>
                  ))}
                </div>

                {/* Traffic Split Slider */}
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    نسخه A ({selectedExperiment.trafficSplitRatio}%)
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={selectedExperiment.trafficSplitRatio}
                    onChange={(e) => handleUpdateTrafficSplit(Number(e.target.value))}
                    className="w-28 accent-rose-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    نسخه B ({100 - selectedExperiment.trafficSplitRatio}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {selectedExperiment && (
            <>
              {/* Statistical Significance Winner Banner */}
              <div className={`p-5 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                selectedExperiment.winnerVariant === 'B'
                  ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold shrink-0">
                    <Trophy className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white">
                        {selectedExperiment.winnerVariant === 'B'
                          ? `🏆 نسخه متغیر B با ${selectedExperiment.upliftPercentage}% رشد نرخ تبدیل، برنده قطعی است!`
                          : 'در حال جمع‌آوری دیتا تا رسیدن به سطح اطمینان ۹۵٪'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Confidence: {selectedExperiment.confidenceLevel}% (p={selectedExperiment.pValue})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      الگوریتم بیزین با قطعیت ۹۸.۸٪ تایید می‌کند که تغییرات تیتر احساسی، دکمه اکشن زمان‌دار و ضمانت ۳۰ روزه در نسخه B موجب افزایش قطعی خرید شده‌اند.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDeployWinner}
                    disabled={isDeployingWinner || selectedExperiment.status === 'concluded'}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 hover:scale-105"
                  >
                    <CheckCheck className={`w-4 h-4 ${isDeployingWinner ? 'animate-spin' : ''}`} />
                    <span>{selectedExperiment.status === 'concluded' ? '✓ نسخه برنده اعمال شده' : '🏆 اعمال نسخه برنده در وردپرس'}</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Variations Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* VARIANT A (Control) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black flex items-center justify-center font-mono">
                        A
                      </span>
                      <h4 className="text-sm font-bold text-white">{selectedExperiment.variantA.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      نسخه کنترل (Original)
                    </span>
                  </div>

                  {/* Copy & Content Spec */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">تیتر اصلی:</span>
                      <p className="font-bold text-slate-200 mt-0.5">{selectedExperiment.variantA.headline}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">زیرتیتر و ارزش پیشنهادی:</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{selectedExperiment.variantA.subheadline}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-indigo-400 font-bold">دکمه CTA: «{selectedExperiment.variantA.ctaText}»</span>
                      <span className="text-slate-400 font-mono">{selectedExperiment.variantA.priceTag || 'قیمت پایه'}</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">بازدیدکنندگان</span>
                      <span className="text-base font-black text-white font-mono">{selectedExperiment.metricsA.impressions.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">کلیک روی CTA</span>
                      <span className="text-base font-black text-indigo-300 font-mono">{selectedExperiment.metricsA.clicks.toLocaleString('fa-IR')}</span>
                      <span className="text-[9px] text-slate-500 block font-mono">CTR: {selectedExperiment.metricsA.ctr}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">خریدهای قطعی</span>
                      <span className="text-base font-black text-slate-200 font-mono">{selectedExperiment.metricsA.conversions.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center">
                      <span className="text-[10px] text-indigo-300 block font-bold">نرخ تبدیل نهایی</span>
                      <span className="text-lg font-black text-indigo-300 font-mono">{selectedExperiment.metricsA.conversionRate}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>نرخ پرش: <strong className="text-slate-200 font-mono">{selectedExperiment.metricsA.bounceRate}%</strong></span>
                    <span>میانگین زمان: <strong className="text-slate-200 font-mono">{selectedExperiment.metricsA.avgTimeSeconds} ثانیه</strong></span>
                    <span>درآمد: <strong className="text-emerald-400 font-mono">{(selectedExperiment.metricsA.revenueToman / 1000000).toLocaleString('fa-IR')} م.ت</strong></span>
                  </div>
                </div>

                {/* VARIANT B (AI Optimized) */}
                <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-br-xl shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>برنده هوش مصنوعی (+{selectedExperiment.upliftPercentage}% رشد)</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-black flex items-center justify-center font-mono">
                        B
                      </span>
                      <h4 className="text-sm font-bold text-white">{selectedExperiment.variantB.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      بهینه‌شده با هوش مصنوعی
                    </span>
                  </div>

                  {/* Copy & Content Spec */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-500/20 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-rose-400 font-bold block">تیتر احساسی و نتیجه‌محور:</span>
                      <p className="font-bold text-white mt-0.5">{selectedExperiment.variantB.headline}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ارزش پیشنهادی + ضمانت:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">{selectedExperiment.variantB.subheadline}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-rose-400 font-bold">دکمه CTA: «{selectedExperiment.variantB.ctaText}»</span>
                      <span className="text-emerald-400 font-mono font-bold">{selectedExperiment.variantB.priceTag || 'قیمت شگفت‌انگیز'}</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">بازدیدکنندگان</span>
                      <span className="text-base font-black text-white font-mono">{selectedExperiment.metricsB.impressions.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">کلیک روی CTA</span>
                      <span className="text-base font-black text-rose-300 font-mono">{selectedExperiment.metricsB.clicks.toLocaleString('fa-IR')}</span>
                      <span className="text-[9px] text-rose-400 block font-mono">CTR: {selectedExperiment.metricsB.ctr}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                      <span className="text-[10px] text-slate-400 block">خریدهای قطعی</span>
                      <span className="text-base font-black text-emerald-400 font-mono">{selectedExperiment.metricsB.conversions.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                      <span className="text-[10px] text-emerald-300 block font-bold">نرخ تبدیل نهایی</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{selectedExperiment.metricsB.conversionRate}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>نرخ پرش: <strong className="text-emerald-400 font-mono">{selectedExperiment.metricsB.bounceRate}%</strong> (کاهش ۱۲٪)</span>
                    <span>میانگین زمان: <strong className="text-emerald-400 font-mono">{selectedExperiment.metricsB.avgTimeSeconds} ثانیه</strong></span>
                    <span>درآمد: <strong className="text-amber-400 font-mono">{(selectedExperiment.metricsB.revenueToman / 1000000).toLocaleString('fa-IR')} م.ت</strong></span>
                  </div>
                </div>
              </div>

              {/* Interactive Landing Page Visual Preview Simulator */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">شبیه‌ساز بصری صفحه فرود (Visual Landing Page Simulator)</h4>
                  </div>

                  {/* Preview Selector */}
                  <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setActiveVariantPreviewTab('A')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeVariantPreviewTab === 'A'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      پیش‌نمایش نسخه A
                    </button>
                    <button
                      onClick={() => setActiveVariantPreviewTab('B')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeVariantPreviewTab === 'B'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      پیش‌نمایش نسخه B (هوشمند)
                    </button>
                    <button
                      onClick={() => setActiveVariantPreviewTab('compare')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeVariantPreviewTab === 'compare'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      مقایسه همزمان
                    </button>
                  </div>
                </div>

                {/* Rendered Live Visual Hero Preview */}
                {activeVariantPreviewTab !== 'compare' ? (
                  (() => {
                    const v = activeVariantPreviewTab === 'A' ? selectedExperiment.variantA : selectedExperiment.variantB;
                    const isB = activeVariantPreviewTab === 'B';
                    return (
                      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                        isB
                          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-rose-500/30 shadow-2xl'
                          : 'bg-slate-950 border-slate-800'
                      }`}>
                        <div className="max-w-3xl mx-auto space-y-5 text-center">
                          {/* Badge & Urgency */}
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              isB ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}>
                              {v.badgeText}
                            </span>
                            {v.urgencyText && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{v.urgencyText}</span>
                              </span>
                            )}
                          </div>

                          {/* Headline & Subheadline */}
                          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                            {v.headline}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            {v.subheadline}
                          </p>

                          {/* Bullet points */}
                          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
                            {v.bulletPoints?.map((b, i) => (
                              <span key={i} className="text-xs text-slate-300 flex items-center gap-1 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{b}</span>
                              </span>
                            ))}
                          </div>

                          {/* CTA Button & Subtext */}
                          <div className="pt-4 space-y-2">
                            <button
                              className={`px-8 py-3.5 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                isB
                                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-rose-500/30 ring-2 ring-rose-400/40'
                                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                              }`}
                            >
                              {v.ctaText}
                            </button>
                            {v.ctaSubtext && (
                              <p className="text-[11px] text-slate-400 font-medium">{v.ctaSubtext}</p>
                            )}
                          </div>

                          {/* Social Proof & Guarantee */}
                          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span>{v.socialProofText}</span>
                            </span>
                            <span aria-hidden="true" className="text-slate-600">•</span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <ShieldCheck className="w-4 h-4" />
                              <span>{v.guaranteeBadgeText}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Dual Compare Screen */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
                      <span className="text-xs font-bold text-indigo-400">نسخه کنترل A</span>
                      <h4 className="text-sm font-bold text-white">{selectedExperiment.variantA.headline}</h4>
                      <p className="text-xs text-slate-400">{selectedExperiment.variantA.subheadline}</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl mt-2">
                        {selectedExperiment.variantA.ctaText}
                      </button>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3 text-center relative">
                      <span className="text-xs font-bold text-rose-400">نسخه متغیر B (برنده)</span>
                      <h4 className="text-sm font-bold text-white">{selectedExperiment.variantB.headline}</h4>
                      <p className="text-xs text-slate-300">{selectedExperiment.variantB.subheadline}</p>
                      <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold rounded-xl mt-2 shadow-lg shadow-rose-500/20">
                        {selectedExperiment.variantB.ctaText}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Conversion Insights & Cognitive Attention Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* AI Insights & Psychological Analysis */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">تحلیل هوش مصنوعی و چرایی برتری نسخه B</h4>
                      <p className="text-[11px] text-slate-400">بینش‌های رفتارشناسی و روانشناسی شناختی خریداران</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    {selectedExperiment.aiCoreAnalysis.summaryFa}
                  </p>

                  {/* Winning Factors */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">عوامل کلیدی افزایش نرخ تبدیل (Winning Factors):</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedExperiment.aiCoreAnalysis.winningFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable Recommendations */}
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <span className="text-xs font-bold text-amber-300 block flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      اقدامات پیشنهادی برای صفحات بعدی در قالب کامواوب:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {selectedExperiment.aiCoreAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cognitive Attention Heat Distribution & AI Generator */}
                <div className="lg:col-span-5 space-y-5">
                  
                  {/* Attention Bars */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-400" />
                      <span>توزیع توجه بصری و تمرکز مخاطب (Cognitive Attention)</span>
                    </h4>

                    {/* Metric 1: Headline Attention */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>جلب توجه تیتر (Headline Grip):</span>
                        <span className="font-mono text-emerald-400">
                          A: {selectedExperiment.aiCoreAnalysis.heatDistribution.headlineAttention.A}% | B: {selectedExperiment.aiCoreAnalysis.heatDistribution.headlineAttention.B}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-indigo-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.headlineAttention.A}%` }} />
                        <div className="bg-rose-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.headlineAttention.B}%` }} />
                      </div>
                    </div>

                    {/* Metric 2: CTA Attention */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>انگیزش دکمه اقدام (CTA Magnetic Power):</span>
                        <span className="font-mono text-emerald-400">
                          A: {selectedExperiment.aiCoreAnalysis.heatDistribution.ctaAttention.A}% | B: {selectedExperiment.aiCoreAnalysis.heatDistribution.ctaAttention.B}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-indigo-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.ctaAttention.A}%` }} />
                        <div className="bg-rose-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.ctaAttention.B}%` }} />
                      </div>
                    </div>

                    {/* Metric 3: Social Proof */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>اعتمادسازی و تایید اجتماعی (Trust Factor):</span>
                        <span className="font-mono text-emerald-400">
                          A: {selectedExperiment.aiCoreAnalysis.heatDistribution.socialProofAttention.A}% | B: {selectedExperiment.aiCoreAnalysis.heatDistribution.socialProofAttention.B}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-indigo-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.socialProofAttention.A}%` }} />
                        <div className="bg-rose-500 h-full" style={{ width: `${selectedExperiment.aiCoreAnalysis.heatDistribution.socialProofAttention.B}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* AI Instant Variant Generator Box */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <span>تولید متغیر جدید با هوش مصنوعی (AI Variant Generator)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      نام کالا یا موضوع لندینگ را وارد کنید تا هوش مصنوعی تیتر، دکمه و تریگرهای روانی جدید بسازد:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiPromptTopic}
                        onChange={(e) => setAiPromptTopic(e.target.value)}
                        placeholder="نام محصول یا لندینگ..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={handleGenerateAiVariants}
                        disabled={isGeneratingAiVariants}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isGeneratingAiVariants ? 'در حال تولید...' : '✨ تولید متغیر B'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* New Experiment Modal */}
          {showNewExpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-rose-400" />
                    ایجاد تست A/B جدید برای صفحات فرود
                  </h3>
                  <button onClick={() => setShowNewExpModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">عنوان کمپین و لندینگ پیج:</label>
                    <input
                      type="text"
                      value={newExpTitle}
                      onChange={(e) => setNewExpTitle(e.target.value)}
                      placeholder="مثال: لندینگ تخفیف روز مادر"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">نوع سکشن و موقعیت تست:</label>
                    <select
                      value={newExpSectionType}
                      onChange={(e: any) => setNewExpSectionType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="hero_section">سکشن قهرمان لندینگ (Hero Section)</option>
                      <option value="lead_capture">فرم و کوییز دریافت لید (Lead Capture)</option>
                      <option value="product_spotlight">باکس معرفی محصول ویژه (Product Spotlight)</option>
                      <option value="pricing_matrix">جدول و پلن‌های قیمت‌گذاری (Pricing Matrix)</option>
                      <option value="cta_banner">بنر اقدام به خرید فوری (CTA Banner)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowNewExpModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleCreateNewExperiment}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    ایجاد و شروع آزمایش A/B
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      {activeTab === 'trends-alerts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Dispatch Control Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  تنظیمات نوتیفیکیشن خودکار و ارسال هفتگی به مدیر سایت
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  هوش مصنوعی کامواوب هر دوشنبه ساعت ۹ صبح تحلیل جدیدترین ترندها و کلمات صعودی گوگل را به ایمیل شما ارسال می‌نماید.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchWeeklyTrends}
                  disabled={isLoadingTrends}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTrends ? 'animate-spin' : ''}`} />
                  <span>بروزرسانی ترندهای زنده</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5">
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  آدرس ایمیل مدیر سایت جهت دریافت گزارش هفتگی:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="manager@store.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  کانال تحویل نوتیفیکیشن:
                </label>
                <select
                  value={notificationChannel}
                  onChange={(e: any) => setNotificationChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="email">ایمیل رسمی مدیر (Email Digest)</option>
                  <option value="push">نوتیفیکیشن وب پیشخوان وردپرس</option>
                  <option value="webhook">وب‌هوک تلگرام / اسلک</option>
                </select>
              </div>

              <div className="md:col-span-4 flex items-end">
                <button
                  onClick={handleDispatchWeeklyDigest}
                  disabled={isDispatchingDigest}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isDispatchingDigest ? 'animate-bounce' : ''}`} />
                  <span>{isDispatchingDigest ? 'در حال ارسال ایمیل...' : 'ارسال آزمایشی گزارش این هفته به مدیر'}</span>
                </button>
              </div>
            </div>

            {/* Success toast message */}
            {dispatchSuccessMsg && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dispatchSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Weekly Trends Report Content */}
          {weeklyTrendsData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Top Rising Keywords List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                      <h4 className="font-bold text-white text-sm">
                        کلمات کلیدی با بیشترین جهش سرچ در گوگل (Rising Trends)
                      </h4>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      {weeklyTrendsData.topTrendingKeywords.length} ترند برتر
                    </span>
                  </div>

                  <div className="space-y-3">
                    {weeklyTrendsData.topTrendingKeywords.map((trend, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedTrendKeyword(trend)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedTrendKeyword?.keyword === trend.keyword
                            ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 flex items-center gap-1 font-mono">
                                🚀 +{trend.trendGrowthPercent}% رشد
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                                {trend.intent}
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400">
                                {trend.searchVolumeMonthly} سرچ/ماه
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white">
                              {trend.keyword}
                            </h5>
                          </div>

                          <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 shrink-0">
                            {trend.recommendedSchema}
                          </span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                          <span>برگه هدف: <strong className="text-slate-200">{trend.targetShopCategory}</strong></span>
                          <span className="text-emerald-400 font-semibold">{trend.opportunityLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Movements */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-400" />
                    رصد تحرکات رقبای سرچ گوگل و استراتژی پاتک کامواوب
                  </h4>
                  <div className="space-y-2.5">
                    {weeklyTrendsData.competitorMovements.map((comp, i) => (
                      <div key={i} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300">رقیب: {comp.competitor}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">تحرک شناسایی شده</span>
                        </div>
                        <p className="text-slate-300">{comp.action}</p>
                        <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span>استراتژی کامواوب: {comp.counterStrategy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Keyword Detail & High CTR Recommendation */}
              <div className="lg:col-span-5 space-y-4">
                {selectedTrendKeyword ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 sticky top-24">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                        توصیه بهینه‌سازی فروشگاهی با هوش مصنوعی
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {selectedTrendKeyword.keyword}
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-slate-400 block font-semibold">عنوان سئو با CTR بالا (Suggested Title):</span>
                        <p className="text-slate-100 font-bold">{selectedTrendKeyword.suggestedTitle}</p>
                        <button
                          onClick={() => copyToClipboard(selectedTrendKeyword.suggestedTitle, 'stitle')}
                          className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedKey === 'stitle' ? 'کپی شد!' : 'کپی عنوان'}
                        </button>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-slate-400 block font-semibold">توضیحات متای بهینه (Suggested Meta):</span>
                        <p className="text-slate-300 leading-relaxed">{selectedTrendKeyword.suggestedMetaDesc}</p>
                        <button
                          onClick={() => copyToClipboard(selectedTrendKeyword.suggestedMetaDesc, 'sdesc')}
                          className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedKey === 'sdesc' ? 'کپی شد!' : 'کپی توضیحات متا'}
                        </button>
                      </div>

                      <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-1.5">
                        <span className="text-indigo-300 font-bold block flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" />
                          اسکیمای پیشنهادی گوگل برای این ترند:
                        </span>
                        <p className="text-slate-300 text-[11px]">
                          به منظور کسب رتبه اول، این برگه نیازمند استفاده از ساختار <strong>{selectedTrendKeyword.recommendedSchema}</strong> گوگل است تا در نتایج به صورت Rich Snippet نمایش یابد.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedSchemaType(selectedTrendKeyword.recommendedSchema as any);
                            setActiveTab('schemas');
                            handleFetchSchema(selectedTrendKeyword.recommendedSchema as any);
                          }}
                          className="mt-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>مشاهده و کپی کدهای اسکیما</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-slate-300 block mb-2">
                        اقدامات اجرایی پیشنهادی این هفته:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {weeklyTrendsData.ecommerceActionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
                    یک کلمه کلیدی را از لیست انتخاب کنید تا تحلیل و تایتل پیشنهادی نمایش یابد.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROFESSIONAL GOOGLE SCHEMAS & RICH RESULTS STUDIO  */}
      {/* ========================================================= */}
      {activeTab === 'schemas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Schema Type Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  استودیوی تخصصی اسکیماهای استاندارد گوگل (Google Rich Results Suite)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تولید و اعتبارسنجی خودکار کامل‌ترین اسکیماهای فروشگاهی مطابق آخرین مستندات رسمی Google Search Central
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تاییدیه ۱۰۰٪ تست نتایج غنی گوگل (Rich Results Eligible)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Product', label: 'Product (محصول فروشگاهی)', desc: 'قیمت، ستاره، موجودی انبار، مرجوعی ۷ روزه' },
                { id: 'FAQPage', label: 'FAQPage (پرسش و پاسخ)', desc: 'آکاردئون غنی در صفحه اول سرچ گوگل' },
                { id: 'BreadcrumbList', label: 'BreadcrumbList (مسیر راهنما)', desc: 'ساختار درختی دسته‌بندی در گوگل' },
                { id: 'Organization', label: 'Organization (سازمان و برند)', desc: 'باکس سرچ مستقیم گوگل (Sitelinks Searchbox)' },
              ].map((sch) => (
                <button
                  key={sch.id}
                  onClick={() => {
                    setSelectedSchemaType(sch.id as any);
                    handleFetchSchema(sch.id as any);
                  }}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedSchemaType === sch.id
                      ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1 text-slate-200">{sch.label}</span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{sch.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Schema Preview & JSON-LD Output Grid */}
          {generatedSchemaData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Google Live Search Card Simulator (What users see on Google) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      پیش‌نمایش زنده کارت گوگل (Google Rich Result SERP Preview)
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      Mobile & Desktop SERP
                    </span>
                  </div>

                  {/* Simulated Google Card */}
                  <div className="bg-white text-slate-900 rounded-xl p-4 shadow-xl border border-slate-200 font-sans space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600" dir="ltr">
                      <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-bold">K</div>
                      <span className="text-slate-800 font-medium">kamvaweb.com</span>
                      <span>›</span>
                      <span className="truncate">{generatedSchemaData.richSnippetPreview?.url || 'products › item'}</span>
                    </div>

                    <h4 className="text-base text-blue-800 font-medium hover:underline cursor-pointer leading-snug">
                      {generatedSchemaData.richSnippetPreview?.title}
                    </h4>

                    {/* Google Product Rich Snippet Stars & Price */}
                    {selectedSchemaType === 'Product' && (
                      <div className="flex flex-wrap items-center gap-2 text-xs py-1">
                        <div className="flex items-center text-amber-500 font-bold">
                          <span>★★★★★</span>
                          <span className="text-slate-700 mr-1 font-mono">4.9</span>
                          <span className="text-slate-500 text-[11px] mr-1">(۱۲۸ نظر)</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-800 font-bold font-mono">
                          {generatedSchemaData.richSnippetPreview?.price || '۷۸,۵۰۰,۰۰۰ تومان'}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                          ✔ موجود در انبار
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {generatedSchemaData.richSnippetPreview?.description}
                    </p>

                    {/* FAQ Rich Accordion */}
                    {selectedSchemaType === 'FAQPage' && generatedSchemaData.richSnippetPreview?.faqItems && (
                      <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                        <span className="text-[11px] font-bold text-slate-700 block">سوالات متداول کاربران در گوگل:</span>
                        {generatedSchemaData.richSnippetPreview.faqItems.map((faq: any, idx: number) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">
                            <span className="font-bold block text-[11px]">❓ {faq.question}</span>
                            <span className="text-[11px] text-slate-600 mt-0.5 block">{faq.answer}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Schema Validation Specs */}
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>اعتبارسنجی مشخصات با Google Search Central:</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-0.5 pt-1">
                      <li>✔ تایید فیلدهای اجباری (@type, name, offers, price, priceCurrency)</li>
                      <li>✔ شامل فیلدهای MerchantReturnPolicy و ShippingDetails برای بج سبز مرجوعی</li>
                      <li>✔ پشتیبانی از AggregateRating و ثبت ستاره‌های گوگل</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* JSON-LD Code Block */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      کد استاندارد JSON-LD (آماده درج در HEAD یا افزونه)
                    </span>

                    <button
                      onClick={() => copyToClipboard(generatedSchemaData.jsonLdString, 'jsonld')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {copiedKey === 'jsonld' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'jsonld' ? 'کپی شد!' : 'کپی کدهای JSON-LD'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <pre
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-[460px] scrollbar-thin"
                      dir="ltr"
                    >
                      {generatedSchemaData.jsonLdString}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: KEYWORD RESEARCH & COMPETITORS (EXISTING LAB)       */}
      {/* ========================================================= */}
      {activeTab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">پیکربندی تحقیق کلمات کلیدی</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">کلمه کلیدی کانون (Focus Keyword)</label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="مثال: خرید لپ‌تاپ گیمینگ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">حوزه فعالیت سایت (Niche)</label>
                <input
                  type="text"
                  value={nicheInput}
                  onChange={(e) => setNicheInput(e.target.value)}
                  placeholder="مثال: فروشگاه کالای دیجیتال و گیمینگ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">رقبای صفحه اول گوگل (اختیاری)</label>
                <input
                  type="text"
                  value={competitorsInput}
                  onChange={(e) => setCompetitorsInput(e.target.value)}
                  placeholder="مثال: دیجی‌کالا، مقداد آی‌تی، کالاتیک"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleRunSeoAnalysis}
                disabled={isAnalyzingSeo}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingSeo ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    <span>خزش و استخراج دیتاهای گوگل...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>تحلیل سئو و شکاف رقبا</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 space-y-4">
            {seoResult ? (
              <div className="space-y-4">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-slate-400 block font-semibold">قصد جستجو (Search Intent)</span>
                    <span className="text-sm font-bold text-white block">{seoResult.searchIntent}</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-slate-400 block font-semibold">سختی رتبه ۱ گوگل</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-amber-400 font-mono">{seoResult.difficultyScore} / 100</span>
                      <span className="text-[10px] text-slate-400">رقابت متوسط</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-slate-400 block font-semibold">پتانسیل ترافیک ماهانه</span>
                    <span className="text-sm font-bold text-emerald-400 block font-mono">{seoResult.potentialTraffic}</span>
                  </div>
                </div>

                {/* Long Tail Keywords Table */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    کلمات کلیدی دم‌دراز (Long-tail Keywords) با نرخ تبدیل بالا
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-2 font-semibold">کلمه کلیدی پیشنهادی</th>
                          <th className="pb-2 font-semibold">حجم تخمینی</th>
                          <th className="pb-2 font-semibold">هدف</th>
                          <th className="pb-2 font-semibold">اولویت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {seoResult.longTailKeywords?.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 font-bold text-slate-100">{item.keyword}</td>
                            <td className="py-2.5 font-mono text-cyan-400">{item.volume}</td>
                            <td className="py-2.5 text-slate-300">{item.intent}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                {item.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
                در حال بارگذاری تحلیل سئو...
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ECOMMERCE PRICING INTELLIGENCE (EXISTING)          */}
      {/* ========================================================= */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">ورودی محصول و رقبا</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">نام کالای فروشگاه</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">قیمت فعلی شما</label>
                <input
                  type="text"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">استعلام قیمت رقبا</label>
                <input
                  type="text"
                  value={competitorPriceData}
                  onChange={(e) => setCompetitorPriceData(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleRunPricingAnalysis}
                disabled={isAnalyzingPricing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-900/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingPricing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>تحلیل بازار و سودآوری...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>محاسبه قیمت بهینه و نرخ تبدیل</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {pricingResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-amber-300 block font-semibold">قیمت پیشنهادی هوش مصنوعی</span>
                    <span className="text-lg font-black text-white block font-mono">{pricingResult.recommendedPrice}</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-slate-400 block font-semibold">میانگین بازار رقبا</span>
                    <span className="text-base font-bold text-slate-200 block font-mono">{pricingResult.marketAverage}</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
                    <span className="text-[11px] text-slate-400 block font-semibold">اثر بر حجم و حاشیه سود</span>
                    <span className="text-base font-bold text-emerald-400 block font-mono">{pricingResult.marginImpact}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    استراتژی قیمت‌گذاری و تریگرهای فروشگاهی کاموا استور
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{pricingResult.pricingStrategy}</p>
                  
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 block">تریگرهای CRO پیشنهادی در قالب کامواوب:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {pricingResult.croTriggers?.map((trigger: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{trigger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
                در حال بارگذاری تحلیل قیمت...
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
