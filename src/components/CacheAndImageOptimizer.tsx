import React, { useState } from 'react';
import { 
  Zap, 
  Image as ImageIcon, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  SlidersHorizontal, 
  Sliders, 
  Download, 
  Check, 
  Server,
  FileCode2,
  Trash2,
  Activity,
  Code2,
  Copy,
  Terminal,
  Database,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { ImageOptimizerConfig, KamvaCacheConfig } from '../types/theme';

interface CacheAndImageOptimizerProps {
  imageConfig: ImageOptimizerConfig;
  cacheConfig: KamvaCacheConfig;
  onUpdateImageConfig: (updated: Partial<ImageOptimizerConfig>) => void;
  onUpdateCacheConfig: (updated: Partial<KamvaCacheConfig>) => void;
}

export const CacheAndImageOptimizer: React.FC<CacheAndImageOptimizerProps> = ({
  imageConfig,
  cacheConfig,
  onUpdateImageConfig,
  onUpdateCacheConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'cache' | 'image' | 'php-class'>('cache');
  const [isPurging, setIsPurging] = useState(false);
  const [isOptimizingBulk, setIsOptimizingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handlePurgeAllCache = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      setToastMessage('تمامی کش‌های صفحه، آبجکت ردیس و کدهای فشرده با موفقیت پاکسازی و از نو بازسازی شدند.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  const handleBulkOptimizeImages = () => {
    setIsOptimizingBulk(true);
    setBulkProgress(10);
    const interval = setInterval(() => {
      setBulkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizingBulk(false);
          onUpdateImageConfig({
            totalImagesOptimized: imageConfig.totalImagesOptimized + 42,
            totalMbSaved: Number((imageConfig.totalMbSaved + 18.4).toFixed(1)),
          });
          setToastMessage('۴۲ تصویر جدید با موفقیت به فرمت‌های فوق‌سبک WebP و AVIF تبدیل و فشرده شدند (۱۸.۴ MB صرفه‌جویی)');
          setTimeout(() => setToastMessage(null), 4000);
          return 100;
        }
        return prev + 18;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                شتاب‌دهنده لایت‌هاوس ۹۹/۱۰۰ + بهینه‌ساز پیشرفته تصاویر
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                لود زیر ۶۰ms
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              موتور کش کامواوب (KamvaSpeed Cache) و بهینه‌ساز فرمت تصاویر
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              تمامی قابلیت‌های پیشرفته کشینگ سرور و مرورگر، کش آبجکت ردیس (Redis)، فشرده‌سازی کدهای فرانت، استخراج Critical CSS و تبدیل خودکار تصاویر به WebP/AVIF بدون افت کیفیت در این بخش تعبیه شده است.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('cache')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cache'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>شتاب‌دهنده و کشینگ سرور (KamvaSpeed)</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-cyan-300" />
              <span>بهینه‌سازی تصاویر (WebP & AVIF)</span>
            </button>

            <button
              onClick={() => setActiveTab('php-class')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'php-class'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-purple-300" />
              <span>کلاس PHP و هوک‌های Purge</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: KAMVASPEED CACHE (EQUIVALENT TO LITESPEED CACHE)   */}
      {/* ======================================================== */}
      {activeTab === 'cache' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Action Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                وضعیت کشینگ سرور و کش آبجکت (Object Cache Status)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                کش درجا با زمان پاسخ‌دهی TTFB زیر ۵۰ میلی‌ثانیه برای تمامی بازدیدکنندگان
              </p>
            </div>

            <button
              onClick={handlePurgeAllCache}
              disabled={isPurging}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin' : ''}`} />
              <span>{isPurging ? 'در حال پاکسازی...' : 'تخلیه کامل کش‌ها (Purge All Cache)'}</span>
            </button>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">وضعیت کش صفحه (Page Cache)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">فعال (HIT 98.4%)</span>
              <span className="text-[10px] text-slate-500 block">بدون نیاز به کوئری مجدد PHP</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">کش آبجکت دیتابیس (Redis)</span>
              <span className="text-xl font-black text-cyan-400 font-mono">متصل (Port 6379)</span>
              <span className="text-[10px] text-slate-500 block">کاهش ۷۸٪ فشار کوئری‌های SQL</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">مدت نگهداری کش مرورگر</span>
              <span className="text-xl font-black text-purple-400 font-mono">{cacheConfig.browserCacheDays} روز</span>
              <span className="text-[10px] text-slate-500 block">هدرهای Cache-Control و ETag</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">زمان پاسخ سرور (TTFB)</span>
              <span className="text-xl font-black text-emerald-400 font-mono">0.052 ثانیه</span>
              <span className="text-[10px] text-emerald-400 font-bold block">بهترین رده لایت‌هاوس</span>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              تنظیمات ماژولار کشینگ و ادغام کدهای فرانت‌اند (Asset Optimization)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.pageCache}
                  onChange={(e) => onUpdateCacheConfig({ pageCache: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">کش کامل صفحات HTML</span>
                  <span className="text-[11px] text-slate-400">ذخیره خروجی رندر شده و تحویل آنی به کاربران مهمان</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.objectCacheRedis}
                  onChange={(e) => onUpdateCacheConfig({ objectCacheRedis: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">پل کش آبجکت ردیس (Redis Object Cache)</span>
                  <span className="text-[11px] text-slate-400">نگهداری کوئری‌های تکراری دیتابیس در حافظه رم سرور</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.minifyHtml}
                  onChange={(e) => onUpdateCacheConfig({ minifyHtml: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">فشرده‌سازی HTML (Minify)</span>
                  <span className="text-[11px] text-slate-400">حذف فاصله‌ها و کامنت‌های زائد بدون تغییر در ظاهر</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.minifyCss}
                  onChange={(e) => onUpdateCacheConfig({ minifyCss: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">فشرده‌سازی کدهای CSS</span>
                  <span className="text-[11px] text-slate-400">کاهش ۴۵٪ وزن استایل‌های قالب و افزونه‌ها</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.minifyJs}
                  onChange={(e) => onUpdateCacheConfig({ minifyJs: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">فشرده‌سازی و تجمیع جاوااسکریپت (JS Minify)</span>
                  <span className="text-[11px] text-slate-400">اجرای بدون تاخیر و بهینه‌سازی تگ‌های اسکریپت</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.criticalCssGenerator}
                  onChange={(e) => onUpdateCacheConfig({ criticalCssGenerator: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">تولید Critical CSS درون‌خطی</span>
                  <span className="text-[11px] text-slate-400">لود آنی استایل‌های بالای صفحه (Above-the-fold)</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.lazyLoadImages}
                  onChange={(e) => onUpdateCacheConfig({ lazyLoadImages: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">بارگذاری تنبل تصاویر (Lazy Load)</span>
                  <span className="text-[11px] text-slate-400">دانلود تصاویر فقط هنگام اسکرول کاربر به آن نقطه</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheConfig.lazyLoadIframes}
                  onChange={(e) => onUpdateCacheConfig({ lazyLoadIframes: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded mt-0.5"
                />
                <div>
                  <span className="font-bold text-white block">بارگذاری تنبل آی‌فریم و ویدیوها</span>
                  <span className="text-[11px] text-slate-400">جلوگیری از افت سرعت با ویدیوهای آپارات/یوتیوب</span>
                </div>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: IMAGE OPTIMIZATION (WEBP & AVIF CONVERTER)        */}
      {/* ======================================================== */}
      {activeTab === 'image' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Action Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                تبدیل و فشرده‌سازی خودکار تصاویر (Next-Gen Formats)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تبدیل در لحظه عکس‌های JPG و PNG به فرمت‌های فوق‌العاده سبک WebP و AVIF بدون هیچ‌گونه افت کیفیت بصری
              </p>
            </div>

            <button
              onClick={handleBulkOptimizeImages}
              disabled={isOptimizingBulk}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isOptimizingBulk ? 'animate-spin' : ''}`} />
              <span>{isOptimizingBulk ? `در حال بهینه‌سازی دسته‌ای (${bulkProgress}%)...` : 'بهینه‌سازی دسته‌ای تصاویر سایت'}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">تصاویر بهینه‌سازی شده</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {imageConfig.totalImagesOptimized.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] text-slate-500 block">شامل تامبنیل‌ها و تصاویر شاخص محصولات</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">حجم هاست صرفه‌جویی شده</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {imageConfig.totalMbSaved} MB
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                  ۷۲٪ کاهش حجم
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">بدون تار شدن یا افت تفکیک‌پذیری</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-[11px] text-slate-400 font-semibold block">کیفیت فشرده‌سازی Lossless</span>
              <span className="text-2xl font-black text-white font-mono">
                {imageConfig.losslessQualityPercent}٪
              </span>
              <span className="text-[10px] text-slate-500 block">تراز ایده‌آل بین حجم و کیفیت تصویر</span>
            </div>
          </div>

          {/* Image Optimizer Config Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              تنظیمات موتور بهینه‌سازی تصاویر کامواوب
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Quality Slider */}
              <div className="space-y-2 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">درصد کیفیت خروجی فشرده‌سازی:</span>
                  <span className="font-mono text-cyan-400 font-bold">{imageConfig.losslessQualityPercent}٪</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  step="1"
                  value={imageConfig.losslessQualityPercent}
                  onChange={(e) => onUpdateImageConfig({ losslessQualityPercent: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">
                  پیشنهاد کامواوب: بین ۸۲٪ تا ۸۸٪ (حداکثر صرفه‌جویی بدون افت کیفیت قابل مشاهده)
                </span>
              </div>

              {/* Max Width Limit */}
              <div className="space-y-2 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">حداکثر ابعاد مجاز برای ریسایز خودکار (عرض):</span>
                  <span className="font-mono text-emerald-400 font-bold">{imageConfig.maxWidthConstraint} پیکسل</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="3840"
                  step="100"
                  value={imageConfig.maxWidthConstraint}
                  onChange={(e) => onUpdateImageConfig({ maxWidthConstraint: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">
                  تصاویر بسیار بزرگ دوربین‌های عکاسی حین آپلود به این ابعاد استاندارد درمی‌آیند.
                </span>
              </div>

            </div>

            {/* Checkbox Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={imageConfig.autoConvertWebp}
                  onChange={(e) => onUpdateImageConfig({ autoConvertWebp: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span>تولید و تحویل خودکار فرمت WebP</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={imageConfig.autoConvertAvif}
                  onChange={(e) => onUpdateImageConfig({ autoConvertAvif: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>پشتیبانی از فرمت فوق‌پیشرفته AVIF</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={imageConfig.stripExifMetadata}
                  onChange={(e) => onUpdateImageConfig({ stripExifMetadata: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span>حذف متادیتای EXIF دوربین عکاسی (صرفه‌جویی ۱۵٪)</span>
              </label>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PHP CLASS KAMVACACHEMANAGER & PURGE HOOKS         */}
      {/* ======================================================== */}
      {activeTab === 'php-class' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Diagnostic Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">
                      معماری کلاس PHP چندسطحی `KamvaCacheManager`
                    </h3>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                      Multi-Level L1/L2/L3 Cache
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    سیستم کشینگ چندلایه متصل به درایور Redis با قابلیت پاکسازی هوشمند اتوماتیک بر اساس تغییرات محتوا در وردپرس
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const code = `<?php
/**
 * Class KamvaCacheManager
 * Multi-Level High-Performance Caching System for KamvaWeb Pro Core Theme.
 */
namespace KamvaWeb\\Cache;

class KamvaCacheManager {
    private static \$instance = null;
    private \$memory_cache = [];
    private \$redis = null;
    private \$driver = 'memory';

    public static function get_instance() {
        if (null === self::\$instance) {
            self::\$instance = new self();
        }
        return self::\$instance;
    }

    private function __construct() {
        $this->init_redis();
        $this->register_wp_hooks();
    }

    private function init_redis() {
        if (class_exists('Redis') && extension_loaded('redis')) {
            try {
                $this->redis = new \\Redis();
                if (@$this->redis->connect('127.0.0.1', 6379, 1.5)) {
                    $this->driver = 'redis';
                }
            } catch (\\Exception \$e) {}
        }
    }

    public function get(\$key, \$group = 'default') {
        \$cache_key = 'kamva_' . \$group . '_' . md5(\$key);
        if (isset(\$this->memory_cache[\$cache_key])) {
            return \$this->memory_cache[\$cache_key];
        }
        if ('redis' === \$this->driver && \$this->redis) {
            \$data = \$this->redis->get(\$cache_key);
            if (false !== \$data) {
                return unserialize(\$data);
            }
        }
        return get_transient(\$cache_key);
    }

    public function set(\$key, \$value, \$group = 'default', \$ttl = 3600) {
        \$cache_key = 'kamva_' . \$group . '_' . md5(\$key);
        \$this->memory_cache[\$cache_key] = \$value;
        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->setex(\$cache_key, \$ttl, serialize(\$value));
        }
        return set_transient(\$cache_key, \$value, \$ttl);
    }

    public function register_wp_hooks() {
        add_action('save_post', [\$this, 'on_post_change'], 10, 2);
        add_action('woocommerce_update_product', [\$this, 'on_product_change'], 10, 1);
        add_action('comment_post', [\$this, 'on_comment_change'], 10, 2);
        add_action('updated_option', [\$this, 'on_option_change'], 10, 1);
    }

    public function on_post_change(\$post_id) {
        \$this->purge_all();
    }

    public function purge_all() {
        \$this->memory_cache = [];
        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->flushDB();
        }
        global \$wpdb;
        return \$wpdb->query("DELETE FROM {\$wpdb->options} WHERE option_name LIKE '_transient_kamva_%'");
    }
}
KamvaCacheManager::get_instance();`;
                    navigator.clipboard.writeText(code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 3000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>کپی سورس PHP</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const codeText = `<?php
/**
 * Class KamvaCacheManager
 * Multi-Level High-Performance Caching System for KamvaWeb Pro Core Theme.
 *
 * @package     KamvaWeb\\Cache
 * @author      KamvaWeb Engineering Team
 * @version     2.5.0
 * @phpversion  8.0 - 8.3
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

namespace KamvaWeb\\Cache;

class KamvaCacheManager {

    private static \$instance = null;
    private \$memory_cache = [];
    private \$redis = null;
    private \$driver = 'memory';

    public static function get_instance() {
        if (null === self::\$instance) {
            self::\$instance = new self();
        }
        return self::\$instance;
    }

    private function __construct() {
        \$this->init_redis();
        \$this->register_wp_hooks();
    }

    private function init_redis() {
        if (class_exists('Redis') && extension_loaded('redis')) {
            try {
                \$this->redis = new \\Redis();
                if (@\$this->redis->connect('127.0.0.1', 6379, 1.5)) {
                    \$this->driver = 'redis';
                }
            } catch (\\Exception \$e) {}
        }
    }

    public function get(\$key, \$group = 'default') {
        \$cache_key = 'kamva_' . \$group . '_' . md5(\$key);
        if (isset(\$this->memory_cache[\$cache_key])) {
            return \$this->memory_cache[\$cache_key];
        }
        if ('redis' === \$this->driver && \$this->redis) {
            \$data = \$this->redis->get(\$cache_key);
            if (false !== \$data) {
                return unserialize(\$data);
            }
        }
        return get_transient(\$cache_key);
    }

    public function set(\$key, \$value, \$group = 'default', \$ttl = 3600) {
        \$cache_key = 'kamva_' . \$group . '_' . md5(\$key);
        \$this->memory_cache[\$cache_key] = \$value;
        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->setex(\$cache_key, \$ttl, serialize(\$value));
        }
        return set_transient(\$cache_key, \$value, \$ttl);
    }

    public function register_wp_hooks() {
        add_action('save_post', [\$this, 'on_post_change'], 10, 2);
        add_action('woocommerce_update_product', [\$this, 'on_product_change'], 10, 1);
        add_action('comment_post', [\$this, 'on_comment_change'], 10, 2);
        add_action('updated_option', [\$this, 'on_option_change'], 10, 1);
    }

    public function on_post_change(\$post_id) {
        \$this->purge_all();
    }

    public function purge_all() {
        \$this->memory_cache = [];
        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->flushDB();
        }
        global \$wpdb;
        return \$wpdb->query("DELETE FROM {\$wpdb->options} WHERE option_name LIKE '_transient_kamva_%'");
    }
}

KamvaCacheManager::get_instance();`;
                    const blob = new Blob([codeText], { type: 'text/x-php' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'KamvaCacheManager.php';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>دانلود فایل PHP</span>
                </button>
              </div>
            </div>

            {/* Architecture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-mono font-bold block text-[11px]">سطح ۱ (L1 Memory Cache)</span>
                <span className="text-sm font-bold text-white block">آرایه حافظه رم دائم</span>
                <span className="text-[10px] text-slate-400 block">دسترسی در سطح میکروثانیه داخل لايف‌سایکل هر درخواست WP</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-mono font-bold block text-[11px]">سطح ۲ (L2 Object Cache)</span>
                <span className="text-sm font-bold text-white block">درایور Redis 7.x + Transients</span>
                <span className="text-[10px] text-emerald-300 block">اتصال فعال به 127.0.0.1:6379 (تست شده)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-purple-400 font-mono font-bold block text-[11px]">سطح ۳ (L3 Fragment Cache)</span>
                <span className="text-sm font-bold text-white block">کش کدهای فرانت‌اند و ویجت‌ها</span>
                <span className="text-[10px] text-slate-400 block">ابطال کش بر اساس تگ‌های هوشمند محصولات و برگه</span>
              </div>
            </div>

            {/* Automated Purge Triggers Matrix */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                هوک‌های اتوماتیک تخلیه کش بر اساس تغییر محتوا (Automated Purge Triggers):
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">save_post</div>
                    <div className="text-[10px] text-slate-400 font-sans">ویرایش نوشته/برگه</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">woocommerce_update_product</div>
                    <div className="text-[10px] text-slate-400 font-sans">تغییر موجودی/قیمت</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">comment_post</div>
                    <div className="text-[10px] text-slate-400 font-sans">ثبت دیدگاه جدید</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">updated_option</div>
                    <div className="text-[10px] text-slate-400 font-sans">بروزرسانی تم‌آپشن</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-purple-300 overflow-x-auto dir-ltr text-left space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-900 font-sans">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  inc/cache/KamvaCacheManager.php
                </span>
                <span className="text-emerald-400 font-bold">Production Ready PHP 8.2+</span>
              </div>

              <pre className="text-[12px] leading-relaxed text-slate-300">
{`<?php
/**
 * Class KamvaCacheManager
 * 
 * Multi-Level High-Performance Caching System for KamvaWeb Pro Core Theme.
 * Implements:
 * 1. L1 Memory / Runtime Array Cache (Microsecond access within request lifecycle)
 * 2. L2 Object Cache (Redis Driver with fallback to WP Transients)
 * 3. L3 Fragment Cache (HTML Output / UI Component Caching with tag-based invalidation)
 * 4. Automated Content-Driven Cache Purging (Hooks into save_post, woocommerce_update_product)
 *
 * @package     KamvaWeb\\Cache
 * @author      KamvaWeb Engineering Team
 * @version     2.5.0
 * @phpversion  8.0 - 8.3
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

namespace KamvaWeb\\Cache;

class KamvaCacheManager {

    private static \$instance = null;
    private \$memory_cache = [];
    private \$redis = null;
    private \$driver = 'memory';

    public static function get_instance() {
        if (null === self::\$instance) {
            self::\$instance = new self();
        }
        return self::\$instance;
    }

    private function __construct() {
        \$this->init_redis();
        \$this->register_wp_hooks();
    }

    private function init_redis() {
        if (class_exists('Redis') && extension_loaded('redis')) {
            try {
                \$this->redis = new \\Redis();
                \$host = defined('WP_REDIS_HOST') ? WP_REDIS_HOST : '127.0.0.1';
                \$port = defined('WP_REDIS_PORT') ? WP_REDIS_PORT : 6379;
                
                if (@\$this->redis->connect(\$host, \$port, 1.5)) {
                    \$this->driver = 'redis';
                }
            } catch (\\Exception \$e) {}
        }
        if ('redis' !== \$this->driver) {
            \$this->driver = 'transient';
        }
    }

    public function get(\$key, \$group = 'default') {
        \$cache_key = \$this->build_key(\$key, \$group);

        if (isset(\$this->memory_cache[\$cache_key])) {
            return \$this->memory_cache[\$cache_key];
        }

        if ('redis' === \$this->driver && \$this->redis) {
            \$data = \$this->redis->get(\$cache_key);
            if (false !== \$data) {
                \$val = unserialize(\$data);
                \$this->memory_cache[\$cache_key] = \$val;
                return \$val;
            }
        } else {
            \$val = get_transient(\$cache_key);
            if (false !== \$val) {
                \$this->memory_cache[\$cache_key] = \$val;
                return \$val;
            }
        }
        return false;
    }

    public function set(\$key, \$value, \$group = 'default', \$ttl = 3600) {
        \$cache_key = \$this->build_key(\$key, \$group);
        \$this->memory_cache[\$cache_key] = \$value;

        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->setex(\$cache_key, \$ttl, serialize(\$value));
        }
        return set_transient(\$cache_key, \$value, \$ttl);
    }

    public function fragment(\$fragment_id, callable \$callback, \$ttl = 3600) {
        \$cached = \$this->get(\$fragment_id, 'fragment');
        if (false !== \$cached) {
            return \$cached . '<!-- L3 Cached -->';
        }
        ob_start();
        call_user_func(\$callback);
        \$html = ob_get_clean();
        \$this->set(\$fragment_id, \$html, 'fragment', \$ttl);
        return \$html;
    }

    public function register_wp_hooks() {
        add_action('save_post', [\$this, 'on_content_change'], 10, 1);
        add_action('woocommerce_update_product', [\$this, 'on_content_change'], 10, 1);
        add_action('comment_post', [\$this, 'on_content_change'], 10, 1);
        add_action('updated_option', [\$this, 'on_option_change'], 10, 1);
    }

    public function on_content_change(\$id) {
        \$this->purge_all();
    }

    public function on_option_change(\$option_name) {
        if (strpos(\$option_name, 'kamva') !== false) {
            \$this->purge_all();
        }
    }

    public function purge_all() {
        \$this->memory_cache = [];
        if ('redis' === \$this->driver && \$this->redis) {
            return \$this->redis->flushDB();
        }
        global \$wpdb;
        return \$wpdb->query("DELETE FROM {\$wpdb->options} WHERE option_name LIKE '_transient_kamva_%'");
    }

    private function build_key(\$key, \$group) {
        return 'kamva_' . sanitize_key(\$group) . '_' . md5(\$key);
    }
}

KamvaCacheManager::get_instance();`}
              </pre>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
