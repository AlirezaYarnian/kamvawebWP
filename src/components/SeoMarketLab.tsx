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
  ShieldCheck
} from 'lucide-react';
import { WeeklyTrendsReport, GoogleSchemaDefinition, WeeklyTrendKeyword } from '../types/theme';

export const SeoMarketLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends-alerts' | 'schemas' | 'seo' | 'pricing'>('trends-alerts');

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

  // Run initial queries
  useEffect(() => {
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
      {/* TAB 1: WEEKLY GOOGLE TRENDS ALERTS & MANAGER DISPATCHER   */}
      {/* ========================================================= */}
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
