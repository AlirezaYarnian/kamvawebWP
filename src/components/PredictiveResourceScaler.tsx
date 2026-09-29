import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Cpu, 
  Server, 
  HardDrive, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Clock, 
  Activity, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Power 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const PredictiveResourceScaler: React.FC = () => {
  const [scalerData, setScalerData] = useState<any>({
    autoScalingEnabled: true,
    currentLimits: {
      phpMemoryLimit: '256M',
      wpMaxMemoryLimit: '512M',
      redisMaxMemory: '1024MB',
      opcacheBufferMb: 128,
      maxExecutionTimeSec: 60,
      dbMaxConnections: 150,
    },
    recommendedLimits: {
      phpMemoryLimit: '512M',
      wpMaxMemoryLimit: '1024M',
      redisMaxMemory: '2048MB',
      opcacheBufferMb: 256,
      maxExecutionTimeSec: 180,
      dbMaxConnections: 350,
    },
    upcomingHighTrafficEvent: {
      eventName: 'کمپین تخفیف ویژه پاییزه ووکامرس',
      expectedSpikeTime: 'امروز ساعت ۲۰:۰۰',
      predictedTrafficMultiplier: '3.8x',
      confidenceScore: 94,
      triggerReason: 'بررسی تاریخچه بازدید، زمان‌بندی ایمیل مارکتینگ و الگوی رفتاری کاربران فروشگاه'
    },
    scalingHistory: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [aiForecast, setAiForecast] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 24-hour predictive traffic chart data
  const chartData = [
    { time: '10:00', actualLoad: 1200, predictedLoad: 1200, memoryNeededMb: 256 },
    { time: '12:00', actualLoad: 1800, predictedLoad: 1850, memoryNeededMb: 280 },
    { time: '14:00', actualLoad: 2400, predictedLoad: 2500, memoryNeededMb: 320 },
    { time: '16:00', actualLoad: null, predictedLoad: 3800, memoryNeededMb: 410 },
    { time: '18:00', actualLoad: null, predictedLoad: 6200, memoryNeededMb: 512 },
    { time: '20:00 (پیک کمپین)', actualLoad: null, predictedLoad: 12400, memoryNeededMb: 800 },
    { time: '22:00', actualLoad: null, predictedLoad: 8900, memoryNeededMb: 620 },
    { time: '00:00', actualLoad: null, predictedLoad: 3100, memoryNeededMb: 350 },
  ];

  const fetchScalerStatus = async () => {
    try {
      const res = await fetch('/api/resource-scaler/status');
      const data = await res.json();
      if (data.success && data.config) {
        setScalerData(data.config);
      }
    } catch (e) {
      console.error('Failed to load resource scaler status', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScalerStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApplyScaling = async () => {
    setIsApplying(true);
    try {
      const res = await fetch('/api/resource-scaler/apply-scaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phpMemoryLimit: scalerData.recommendedLimits.phpMemoryLimit,
          redisMaxMemory: scalerData.recommendedLimits.redisMaxMemory,
          autoScalingEnabled: scalerData.autoScalingEnabled
        })
      });
      const data = await res.json();
      if (data.success) {
        setScalerData(data.config);
        showToast(data.message);
      }
    } catch (e) {
      console.error('Failed to apply scaling', e);
      showToast('خطا در اعمال تنظیمات مقیاس‌پذیری سرور.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRunAiPredict = async () => {
    setIsPredicting(true);
    try {
      const res = await fetch('/api/resource-scaler/ai-predict', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.aiForecast) {
        setAiForecast(data.aiForecast);
        showToast('تحلیل هوش مصنوعی و پیش‌بینی ترافیک سرور با موفقیت به روز شد.');
      }
    } catch (e) {
      console.error('Failed AI prediction', e);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                مقیاس‌پذیر پیش‌بینانه منابع سرور
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                PredictiveResourceScaler v1.2
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              افزایش خودکار و هوشمند RAM حافظه PHP و کش Redis قبل از جهش ترافیک
            </h2>
            
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تحلیل پیش‌بینانه الگوی ترافیک وردپرس و کمپین‌های ووکامرس برای ارتقای لایه‌های کش ردیس و حافظه پردازشی، پیش از وقوع کندی یا خطای 502 Bad Gateway.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAiPredict}
              disabled={isPredicting}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
              <span>{isPredicting ? 'در حال تحلیل پیش‌بینانه...' : 'پیش‌بینی هوشمند ترافیک'}</span>
            </button>

            <button
              onClick={handleApplyScaling}
              disabled={isApplying}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isApplying ? 'در حال اعمال تغییرات...' : 'اعمال طرح ارتقای پیشنهادی'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming High Traffic Alert Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-1">
              <Clock className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                رویداد پر ترافیک شناسایی‌شده
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                {scalerData.upcomingHighTrafficEvent?.eventName}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                زمان وقوع پیش‌بینی‌شده: <span className="font-bold text-amber-300">{scalerData.upcomingHighTrafficEvent?.expectedSpikeTime}</span> | پیش‌بینی جهش: <span className="font-mono text-emerald-400 font-bold">{scalerData.upcomingHighTrafficEvent?.predictedTrafficMultiplier}</span> (اطمینان: {scalerData.upcomingHighTrafficEvent?.confidenceScore}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 block">وضعیت Auto-Scaling:</span>
              <span className="text-xs font-bold text-emerald-400">فعال (آماده ارتقای لحظه‌ای)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Cards Allocation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* PHP Memory Limit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              تخصیص حافظه PHP (WP_MEMORY_LIMIT)
            </span>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold">
              PHP 8.2
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-extrabold font-mono text-white">{scalerData.currentLimits?.phpMemoryLimit}</span>
            <span className="text-xs text-slate-400">← پیشنهادی: <span className="font-bold text-emerald-400 font-mono">{scalerData.recommendedLimits?.phpMemoryLimit}</span></span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-3/4 rounded-full" />
          </div>
        </div>

        {/* Redis Object Cache */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              حافظه کش ردیس (Redis maxmemory)
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
              L2 Object Cache
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-extrabold font-mono text-white">{scalerData.currentLimits?.redisMaxMemory}</span>
            <span className="text-xs text-slate-400">← پیشنهادی: <span className="font-bold text-emerald-400 font-mono">{scalerData.recommendedLimits?.redisMaxMemory}</span></span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-1/2 rounded-full" />
          </div>
        </div>

        {/* Database Max Connections */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-400" />
              حداکثر اتصالات همزمان دیتابیس
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-bold">
              MySQL 8.0
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-extrabold font-mono text-white">{scalerData.currentLimits?.dbMaxConnections} کانکشن</span>
            <span className="text-xs text-slate-400">← پیشنهادی: <span className="font-bold text-emerald-400 font-mono">{scalerData.recommendedLimits?.dbMaxConnections}</span></span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-2/3 rounded-full" />
          </div>
        </div>

      </div>

      {/* Predictive Chart & AI Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Area Chart for Predicted vs Actual Load */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>پیش‌بینی ۲۴ ساعته بار سرور و میزان حافظه مورد نیاز</span>
            </h3>
            <p className="text-xs text-slate-400">مقایسه ترافیک فعلی با میزان درخواست‌های پیش‌بینی‌شده در طول ۲۴ ساعت آینده</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="actualLoad" name="بار واقعی (Req/min)" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predictedLoad" name="پیش‌بینی بار (Req/min)" stroke="#6366f1" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecast Result Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>تحلیل پیش‌بینانه Gemini AI</span>
            </h3>

            {aiForecast ? (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-400">خلاصه تحلیل:</span>
                  <p className="leading-relaxed text-white">{aiForecast.summary}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400">طرح اقدام پیشگیرانه:</span>
                  <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                    {aiForecast.scalingActionPlan?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 block">تاثیر ارتقا:</span>
                  <p className="text-emerald-300 font-bold mt-0.5">{aiForecast.estimatedPerformanceBoost}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto opacity-50" />
                <p className="text-xs text-slate-400">
                  برای دریافت آخرین تحلیلی هوش مصنوعی از الگوی ترافیک و گام‌های ارتقا، روی دکمه «پیش‌بینی هوشمند ترافیک» کلیک کنید.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunAiPredict}
            disabled={isPredicting}
            className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>به‌روزرسانی تحلیل هوش مصنوعی</span>
          </button>
        </div>

      </div>

      {/* Scaling Action History Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>تاریخچه ارتقاها و تغییرات منابع سرور</span>
            </h3>
            <p className="text-xs text-slate-400">سوابق تغییرات RAM، حافظه PHP و کش ردیس در بستر زمان</p>
          </div>

          <button
            onClick={fetchScalerStatus}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>بروزرسانی لاگ‌ها</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4">عنوان اقدام</th>
                <th className="py-3 px-4">محرک (Trigger)</th>
                <th className="py-3 px-4">زمان ثبت</th>
                <th className="py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {scalerData.scalingHistory?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.triggeredBy}</td>
                  <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                      موفق (Completed)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
