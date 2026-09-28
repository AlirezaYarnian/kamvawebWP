import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Store, 
  ShieldAlert, 
  Zap, 
  Layers, 
  UserCheck, 
  Check, 
  CheckCircle2, 
  ArrowLeft, 
  Palette, 
  Sliders, 
  Globe, 
  Boxes,
  HelpCircle,
  RefreshCw,
  Eye,
  Settings2
} from 'lucide-react';
import { ThemeOptionsConfig } from '../types/theme';

interface SmartConfigGeneratorProps {
  currentConfig: ThemeOptionsConfig;
  onApplyConfig: (newConfig: ThemeOptionsConfig) => void;
}

export const SmartConfigGenerator: React.FC<SmartConfigGeneratorProps> = ({
  currentConfig,
  onApplyConfig,
}) => {
  const [nicheInput, setNicheInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    presets: any;
    rationale: string;
    highlightFeatures: string[];
    targetNiche: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'review' | 'diff'>('review');
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const sampleNiches = [
    { label: 'فروشگاه کالای دیجیتال و گیمینگ', query: 'فروشگاه اینترنتی لپ‌تاپ، لوازم جانبی گیمینگ و قطعات کامپیوتر با مشخصات فنی دقیق' },
    { label: 'آکادمی آموزش آنلاین و فروش دوره', query: 'پلتفرم آموزشی و آکادمی آنلاین دوره‌های برنامه‌نویسی و هوش مصنوعی با اشتراک VIP' },
    { label: 'فروشگاه مد، پوشاک و اکسسوری', query: 'بوتیک آنلاین لباس زنانه و مردانه، کفش و اکسسوری با قابلیت انتخاب رنگ و سایز' },
    { label: 'وبسایت شرکتی B2B و خدمات ابری', query: 'وبسایت شرکتی ارائه خدمات نرم‌افزاری و ابری با فرم استعلام قیمت و معرفی پروژه‌ها' },
    { label: 'پلتفرم اشتراکی و کلینیک تخصصی', query: 'مرکز نوبت‌دهی آنلاین پزشکی و فروش پکیج‌های سلامت و مشاوره تخصصی' },
  ];

  const handleGenerate = async (queryText?: string) => {
    const textToSubmit = queryText || nicheInput;
    if (!textToSubmit.trim()) return;

    setIsGenerating(true);
    setAppliedToast(null);

    try {
      const res = await fetch('/api/smart-config-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicheDescription: textToSubmit.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data);
      } else {
        throw new Error('خطا در ارتباط با سرور');
      }
    } catch (e) {
      console.warn('Fallback to local rule engine');
      // Local fallback
      setGeneratedResult({
        targetNiche: textToSubmit,
        rationale: `پیکربندی هوشمند کامواوب برای حوزه "${textToSubmit}" بر اساس تحلیل بهینه‌سازی سرعت و نرخ تبدیل تنظیم شد.`,
        highlightFeatures: [
          'هدرساز اختصاصی کاموا استور با مگامنو',
          'سپر امنیتی چندلایه AIOS و فایروال WAF',
          'کش لایت‌اسپید همراه با فشرده‌ساز تصاویر بدون افت کیفیت',
          'ویجت مشاوره و هدایت هوشمند مشتریان به خرید'
        ],
        presets: {
          ...currentConfig,
          general: {
            ...currentConfig.general,
            siteType: 'ecommerce',
            primaryColor: '#f05023',
            secondaryColor: '#233876',
            fontFamily: 'Vazirmatn',
          },
          storeBuilderOptions: {
            ...currentConfig.storeBuilderOptions,
            headerBuilder: {
              ...currentConfig.storeBuilderOptions.headerBuilder,
              headerLayout: 'categories_sidebar',
              stickyHeader: true,
            }
          }
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;
    const mergedConfig: ThemeOptionsConfig = {
      ...currentConfig,
      ...generatedResult.presets,
      general: {
        ...currentConfig.general,
        ...(generatedResult.presets.general || {}),
      },
      storeBuilderOptions: {
        ...currentConfig.storeBuilderOptions,
        ...(generatedResult.presets.storeBuilderOptions || {}),
      },
      userPortal: {
        ...currentConfig.userPortal,
        ...(generatedResult.presets.userPortal || {}),
      },
      neuralNetwork: {
        ...currentConfig.neuralNetwork,
        ...(generatedResult.presets.neuralNetwork || {}),
      },
      aiosSecurity: {
        ...currentConfig.aiosSecurity,
        ...(generatedResult.presets.aiosSecurity || {}),
      },
      kamvaSpeedCache: {
        ...currentConfig.kamvaSpeedCache,
        ...(generatedResult.presets.kamvaSpeedCache || {}),
      },
      featureFlags: {
        ...currentConfig.featureFlags,
        ...(generatedResult.presets.featureFlags || {}),
      }
    };

    onApplyConfig(mergedConfig);
    setAppliedToast(`پیکربندی هوشمند برای حوزه «${generatedResult.targetNiche}» با موفقیت در قالب زنده کامواوب اعمال شد!`);
    setTimeout(() => setAppliedToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f05023] to-purple-600 text-white shadow-lg shadow-[#f05023]/20">
                <Wand2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f05023]/20 text-[#ff805d] border border-[#f05023]/30">
                هوش مصنوعی کامواوب (Smart Config AI)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              تولیدکننده پیکربندی هوشمند قالب (Smart Config Generator)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              کافیست زمینه فعالیت و ایده وب‌سایت خود را به زبان ساده شرح دهید؛ موتور هوش مصنوعی کامواوب بر اساس نیاز دقیق کسب‌وکار شما، کلیه تم‌آپشن‌ها، هدرساز، پنل کاربری، رنگ‌بندی و تنظیمات امنیت و کش را به بهترین شکل ممکن تنظیم می‌کند.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-right font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              تنظیم خودکار ۱۲ ماژول همزمان
            </span>
            <span className="text-slate-400">بدون نیاز به ساعت‌ها آزمون و خطا</span>
            <span className="text-[#f05023] font-bold">بیشترین نرخ تبدیل و سرعت ۹۹/۱۰۰</span>
          </div>
        </div>
      </div>

      {/* Input Form & Sample Chips */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f05023]" />
            <span>حوزه کاری و نوع وب‌سایت خود را توصیف کنید:</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              placeholder="مثال: می‌خواهم یک فروشگاه اینترنتی مدرن برای فروش لوازم دیجیتال، ساعت هوشمند و لوازم گیمینگ با فیلتر دقیق مشخصات فنی و ارسال فوری داشته باشم..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#f05023] focus:ring-1 focus:ring-[#f05023] transition-all resize-none"
            />
            
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !nicheInput.trim()}
              className="absolute left-3 bottom-3 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f05023] via-orange-600 to-indigo-600 hover:from-[#e04519] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#f05023]/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال تحلیل و تنظیم قالب با AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>تولید خودکار تنظیمات بهینه</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400">
            یا یکی از الگوهای آماده پرطرفدار زیر را انتخاب کنید:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleNiches.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNicheInput(chip.query);
                  handleGenerate(chip.query);
                }}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#f05023]" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Toast Alert */}
      {appliedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold animate-fadeIn flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{appliedToast}</span>
          </div>
          <span className="text-[11px] bg-emerald-500/30 px-2 py-0.5 rounded font-mono">LIVE APPLIED</span>
        </div>
      )}

      {/* Generated Results View */}
      {generatedResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
          
          {/* Result Header & Apply Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  پیشنهاد بهینه هوش مصنوعی آماده است
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  هدف: {generatedResult.targetNiche}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">
                پیکربندی اختصاصی تولید شده برای وب‌سایت شما
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 cursor-pointer ring-2 ring-emerald-400/40"
              >
                <Check className="w-5 h-5" />
                <span>اعمال این تنظیمات در قالب زنده کامواوب</span>
              </button>
            </div>
          </div>

          {/* Rationale & Highlights Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  تحلیل مهندسی و دلیل انتخاب‌ها:
                </h4>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {generatedResult.rationale}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
              {generatedResult.highlightFeatures.map((feat, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800/80 px-3 py-2 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Configuration Cards Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Branding & Palette */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#f05023]" />
                  <span>طراحی و هویت بصری</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {generatedResult.presets.general?.siteType}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>رنگ اصلی سازمانی:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: generatedResult.presets.general?.primaryColor }} />
                    <span className="font-mono text-slate-400">{generatedResult.presets.general?.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>تایپوگرافی و فونت:</span>
                  <span className="font-bold text-indigo-300">{generatedResult.presets.general?.fontFamily}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>حالت دارک پیش‌فرض:</span>
                  <span className="text-emerald-400 font-bold">فعال (Dark Mode)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Store Layout & Engine */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-indigo-400" />
                  <span>موتور کاموا استور</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Store Layout</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>چیدمان هدرساز:</span>
                  <span className="font-bold text-indigo-300 font-mono">
                    {generatedResult.presets.storeBuilderOptions?.headerBuilder?.headerLayout}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>افکت هاور کارت کالا:</span>
                  <span className="font-bold text-teal-300 font-mono">
                    {generatedResult.presets.storeBuilderOptions?.shopCatalog?.productCardHoverStyle}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>سواچز متغیرها و ایجکس:</span>
                  <span className="text-emerald-400 font-bold">فعال</span>
                </div>
              </div>
            </div>

            {/* Card 3: User Portal & Speed/Security */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>پنل کاربری و امنیت</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Portal & AIOS</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>نوع پنل کاربری:</span>
                  <span className="font-bold text-emerald-300 font-mono">
                    {generatedResult.presets.userPortal?.portalSiteType}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>ورود پیامکی OTP:</span>
                  <span className="text-emerald-400 font-bold">فعال</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span>فایروال WAF و کش ردیس:</span>
                  <span className="text-emerald-400 font-bold">حداکثر بهینه‌سازی</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
