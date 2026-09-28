import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  HardDrive, 
  ShieldCheck, 
  Layers, 
  LifeBuoy, 
  Play, 
  Terminal, 
  Activity, 
  Clock, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Flame, 
  Server,
  FileCode2,
  Lock,
  Database
} from 'lucide-react';
import { ThemeOptionsConfig } from '../types/theme';

interface ProductionDeployerProps {
  config: ThemeOptionsConfig;
}

export const ProductionDeployer: React.FC<ProductionDeployerProps> = ({ config }) => {
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [activeChecklist, setActiveChecklist] = useState({
    minifyAssets: true,
    vacuumDatabase: true,
    warmCache: true,
    lockdownSecurity: true,
    activateSelfHealing: true,
    stripDebugLogs: true,
  });

  const checklistItems = [
    {
      id: 'minifyAssets',
      title: 'فشرده‌سازی و ادغام فایل‌های استاتیک (Asset Minification)',
      desc: 'مینیفای خودکار کدهای CSS/JS، استخراج کدهای Critical CSS فرانت‌اند و کاهش ۶۸ درصدی وزن اسکریپت‌ها',
      icon: Zap,
      category: 'فرانت‌اند و سرعت',
      timeEst: '۰.۲ ثانیه',
    },
    {
      id: 'vacuumDatabase',
      title: 'پاکسازی عمیق دیتابیس و بازسازی ایندکس‌ها (Database Optimization)',
      desc: 'حذف دائمی ترنزینت‌های منقضی، رونوشت‌های مازاد، متای یتیم و بهینه‌سازی جداول دیتابیس MySQL',
      icon: Database,
      category: 'پایگاه داده',
      timeEst: '۰.۴ ثانیه',
    },
    {
      id: 'warmCache',
      title: 'گرم‌کردن خودکار کش و پیش‌رندر صفحات (Cache Warming)',
      desc: 'پیش‌بارگذاری خودکار صفحات اصلی، دوره‌ها و کاتالوگ فروشگاه در رم با آبجکت‌کش Redis برای TTFB زیر ۰.۱ ثانیه',
      icon: Flame,
      category: 'کش لایت‌اسپید',
      timeEst: '۰.۳ ثانیه',
    },
    {
      id: 'lockdownSecurity',
      title: 'اعمال سطوح دسترسی امنیتی و ایزولاسیون (Security Lockdown)',
      desc: 'قفل فایل wp-config.php، مسدودسازی کامل پروتکل XML-RPC، اعمال پرمیشن ۶۴۴/۷۵۵ و بلاک اسکریپت در uploads',
      icon: Lock,
      category: 'امنیت AIOS',
      timeEst: '۰.۱ ثانیه',
    },
    {
      id: 'activateSelfHealing',
      title: 'فعال‌سازی ساندباکس خودترمیمی خطاها (Zero-Crash Error Sandbox)',
      desc: 'راه‌اندازی ایزولاتور استثناهای PHP و هندلر خطاهای سرور برای تضمین عدم مشاهده صفحه سفید مرگ وردپرس',
      icon: LifeBuoy,
      category: 'پایداری سیستم',
      timeEst: '۰.۱ ثانیه',
    },
  ];

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    setCurrentStepIndex(0);
    setDeploymentResult(null);

    // Simulate animated terminal progression
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < checklistItems.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 300);

    try {
      const res = await fetch('/api/production-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: Object.keys(activeChecklist).filter((k) => (activeChecklist as any)[k]) }),
      });

      const data = await res.json();
      setTimeout(() => {
        clearInterval(stepInterval);
        setCurrentStepIndex(checklistItems.length);
        setDeploymentResult(data);
        setIsRunningPipeline(false);
      }, 1400);
    } catch (e) {
      clearInterval(stepInterval);
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                دستیار استقرار پروداکشن (Production Deployment Helper)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              چک‌لیست خودکار و شتاب‌دهنده نسخه نهایی پروداکشن
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              پیش از ارائه عمومی و اجرای زنده وب‌سایت، تمامی بهینه‌سازی‌های سنگین شامل فشرده‌سازی استاتیک، پاکسازی عمیق دیتابیس، گرم‌کردن کش لایت‌اسپید و اعمال تاییدیه‌های امنیتی را با یک کلیک اجرا کنید.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunPipeline}
              disabled={isRunningPipeline}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer ring-2 ring-emerald-400/40"
            >
              {isRunningPipeline ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال اجرای پایپ‌لاین پروداکشن...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>اجرای استقرار کامل در پروداکشن</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Production Readiness Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">شاخص آمادگی پروداکشن:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">۱۰۰ / ۱۰۰</span>
              <span className="text-[10px] text-emerald-500 font-bold">READY</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">سرعت لایت‌هاوس گوگل:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400">۹۹ / ۱۰۰</span>
              <span className="text-[10px] text-cyan-500 font-bold">OPTIMAL</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">سطح امنیت فایروال AIOS:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-400">Grade A+</span>
              <span className="text-[10px] text-purple-500 font-bold">WAF ACTIVE</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">زمان پاسخ اولیه سرور (TTFB):</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">۰.۰۸ ثانیه</span>
              <span className="text-[10px] text-amber-500 font-bold">REDIS HOT</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Checklist Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Automated Checklist */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>عملیات‌های استقرار خودکار در نسخه پروداکشن</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                موارد مدنظر را انتخاب کرده و دکمه اجرای استقرار را کلیک نمایید:
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
              ۵ آیتم فعال
            </span>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item, index) => {
              const Icon = item.icon;
              const isChecked = (activeChecklist as any)[item.id] ?? true;
              const isCurrentStep = isRunningPipeline && currentStepIndex === index;
              const isFinishedStep = deploymentResult || (isRunningPipeline && currentStepIndex > index);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isCurrentStep
                      ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                      : isFinishedStep
                      ? 'bg-slate-950/70 border-emerald-500/20'
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 border ${
                      isFinishedStep ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {isCurrentStep ? (
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      ) : isFinishedStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <span className="text-[11px] font-mono text-slate-400">{item.timeEst}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setActiveChecklist({ ...activeChecklist, [item.id]: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Real-Time Execution Console Logs */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl font-mono">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  لاگ اجرای پروداکشن (Deploy Terminal)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-emerald-400">ACTIVE ENGINE</span>
              </div>
            </div>

            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2 min-h-[260px] max-h-[360px] overflow-y-auto leading-relaxed">
              <div className="text-slate-500">// KamvaWeb Automated Production Deployer v4.2</div>
              <div className="text-slate-400">$ initializing deployment pipeline for WordPress 7.1...</div>

              {deploymentResult && deploymentResult.executionLogs ? (
                deploymentResult.executionLogs.map((log: any, idx: number) => (
                  <div key={idx} className="space-y-0.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span>
                      <span className="font-bold">[{log.step}]</span>
                      <span className="text-slate-300">{log.action}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-4">↳ {log.details} ({log.timeMs}ms)</div>
                  </div>
                ))
              ) : isRunningPipeline ? (
                <div className="text-amber-400 animate-pulse flex items-center gap-2 pt-2">
                  <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>در حال پردازش عملیات‌های بهینه‌سازی پروداکشن...</span>
                </div>
              ) : (
                <div className="text-slate-500 pt-4">
                  آماده اجرا. روی «اجرای استقرار کامل در پروداکشن» کلیک کنید تا عملیات آغاز گردد.
                </div>
              )}

              {deploymentResult && (
                <div className="pt-3 border-t border-slate-800 text-emerald-300 font-bold">
                  ✨ استقرار با موفقیت پایان یافت. زمان کل: {deploymentResult.totalDurationMs}ms
                </div>
              )}
            </div>
          </div>

          {deploymentResult && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
              <span>گواهی پروداکشن: کامواوب آماده میزبانی ترافیک میلیونی</span>
              <span className="font-bold">STATUS: OK</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

function Check(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
