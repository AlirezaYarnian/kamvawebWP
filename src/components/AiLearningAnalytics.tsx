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
  Users
} from 'lucide-react';

interface MetricTimelinePoint {
  day: string;
  epoch: number;
  conversionRate: number; // e.g. 1.8% to 6.4%
  pageSpeedScore: number; // e.g. 48 to 99
  avgResponseMs: number; // e.g. 240ms to 18ms
  learnedKeywords: number; // e.g. 120 to 1480
  blockedThreats: number;
}

export const AiLearningAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'conversion' | 'speed' | 'learning'>('conversion');
  const [isSimulatingLearning, setIsSimulatingLearning] = useState(false);
  const [autoLearnBonus, setAutoLearnBonus] = useState(0);

  // Learning progression data points over 30 days
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

  // Find max/min for SVG scaling
  const maxConv = 7.5;
  const maxSpeed = 100;

  return (
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

        {/* Learning Milestones & Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>مرحله ۱: استخراج خودکار پایگاه دانش</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              هوش مصنوعی در ۳ روز نخست، کلیه دسته‌بندی‌ها، متاتگ‌ها و مقالات سایت را اسکن و یک نقشه مفهومی برداری محلی تشکیل داده است.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>مرحله ۲: شخصی‌سازی پاسخ و تریگر فروش</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              با آنالیز صفحات خروج و بیش از ۳,۲۰۰ مکالمه، دقیقاً زمان طلایی پیشنهاد تخفیف یا هدایت به سبد خرید را یاد گرفته است.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>مرحله ۳: حذف گلوگاه‌های سرعت وردپرس</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              اسکریپت‌های بلااستفاده ووکامرس و فرم‌ها در برگه‌های نامربوط به صورت خودکار Dequeue شده و رتبه سرعت را روی ۹۹ تثبیت کرده‌اند.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
