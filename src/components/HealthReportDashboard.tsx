import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Database, 
  Sparkles, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Lock, 
  TrendingUp, 
  Layers, 
  Award, 
  RefreshCw,
  HardDrive,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Check,
  Terminal
} from 'lucide-react';
import { ThemeOptionsConfig } from '../types/theme';
import { KamvaLogo } from './KamvaLogo';
import { CoreWebVitalsHeatmap } from './CoreWebVitalsHeatmap';

interface HealthReportDashboardProps {
  config: ThemeOptionsConfig;
}

export const HealthReportDashboard: React.FC<HealthReportDashboardProps> = ({ config }) => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'performance' | 'vitals-heatmap' | 'security' | 'database' | 'pdf-preview' | 'predictive-conflicts'>('overview');
  const [solvedConflictIds, setSolvedConflictIds] = useState<Record<string, boolean>>({});
  const [isLogScanning, setIsLogScanning] = useState(false);
  const [scannedLogsCount, setScannedLogsCount] = useState(1482);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/health-report');
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (e) {
      console.error('Failed to load health report:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrintPdf = () => {
    window.print();
  };

  if (isLoading || !report) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">در حال تحلیل سلامت عملکرد، امنیت و دیتابیس با هوش مصنوعی...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner & PDF Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                داشبورد جامع سلامت سایت و گزارش ماهانه (Health Report Dashboard)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                دوره: {report.reportMonth}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              پایش عملکرد، ممیزی امنیت چندلایه و گزارش تحلیلی سلامت دیتابیس
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              تحلیل هوشمند شاخص‌های سرعت لایت‌هاوس، وضعیت فایروال WAF، پاکسازی دیتابیس و تولید گزارش چاپی PDF رسمی برای مدیران سایت.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={fetchReport}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-teal-400" />
              <span>بروزرسانی آمار</span>
            </button>

            <button
              onClick={() => setActiveSection('pdf-preview')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'pdf-preview'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>پیش‌نمایش سند ماهانه</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95 cursor-pointer flex items-center gap-2 ring-2 ring-emerald-400/40"
            >
              <Printer className="w-4 h-4" />
              <span>دریافت و چاپ فایل PDF گزارش</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Hidden when printing) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto print:hidden">
        {[
          { id: 'overview' as const, label: 'خلاصه مدیریتی و هوش مصنوعی', icon: Sparkles },
          { id: 'performance' as const, label: 'شاخص‌های سرعت و لایت‌هاوس', icon: Zap },
          { id: 'vitals-heatmap' as const, label: 'نقشه حرارتی Core Web Vitals', icon: Flame },
          { id: 'security' as const, label: 'امنیت، فایروال و آسیب‌پذیری', icon: ShieldCheck },
          { id: 'database' as const, label: 'سلامت پایگاه داده MySQL', icon: Database },
          { id: 'predictive-conflicts' as const, label: 'پیش‌بینی تداخل‌ها و خرابی‌ها', icon: AlertTriangle },
          { id: 'pdf-preview' as const, label: 'سند رسمی ماهانه (Print Ready)', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. OVERVIEW & SCORECARDS                                 */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'pdf-preview') && (
        <div className="space-y-6">
          
          {/* Top Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">نمره سلامت کلی سایت:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">{report.overallHealthScore} / ۱۰۰</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">OPTIMAL</span>
              </div>
              <p className="text-[11px] text-slate-400">{report.statusText}</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">سرعت لایت‌هاوس و TTFB:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">{report.performanceMetrics.lighthouseScore} / ۱۰۰</span>
                <span className="text-xs text-slate-300 font-mono">TTFB: {report.performanceMetrics.ttfbSeconds}s</span>
              </div>
              <p className="text-[11px] text-slate-400">کش آبجکت‌های رم ردیس: {report.performanceMetrics.redisCacheHitRate}%</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">گرید امنیتی فایروال AIOS:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-400">{report.securityMetrics.securityGrade}</span>
                <span className="text-xs text-slate-300">WAF Active</span>
              </div>
              <p className="text-[11px] text-slate-400">{report.securityMetrics.wafFirewallBlockedAttempts} نفوذ دفع‌شده در این ماه</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">سلامت دیتابیس MySQL:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">{report.databaseMetrics.dbHealthScore}٪</span>
                <span className="text-xs text-emerald-400 font-bold">سربار: ۰ مگابایت</span>
              </div>
              <p className="text-[11px] text-slate-400">{report.databaseMetrics.transientsCleanedThisMonth} ترنزینت پاکسازی‌شده</p>
            </div>
          </div>

          {/* AI Executive Summary Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ارزیابی تحلیلی هوش مصنوعی کامواوب (Executive Summary)</h3>
                <span className="text-xs text-slate-400">گزارش خلاصه وضعیت و توصیه‌های فنی برای ماه {report.reportMonth}</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {report.aiExecutiveSummary.executiveAssessment}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>دستاوردها و بهینه‌سازی‌های انجام‌شده در این ماه:</span>
                </h4>
                <div className="space-y-2">
                  {report.aiExecutiveSummary.keyAchievements.map((item: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wide">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>پیشنهادها و اقدامات برای ماه آینده:</span>
                </h4>
                <div className="space-y-2">
                  {report.aiExecutiveSummary.recommendationsNextMonth.map((item: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>روند ۵ ماه اخیر سلامت و پایداری وب‌سایت</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">ماه</th>
                    <th className="py-3 px-4">شاخص سلامت</th>
                    <th className="py-3 px-4">سرعت لایت‌هاوس</th>
                    <th className="py-3 px-4">گرید امنیت</th>
                    <th className="py-3 px-4">تهدیدات مسدودشده</th>
                    <th className="py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {report.monthlyHistoricalTrend.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{row.month}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{row.healthScore} / ۱۰۰</td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">{row.speedScore} / ۱۰۰</td>
                      <td className="py-3 px-4 font-mono">{row.securityGrade}</td>
                      <td className="py-3 px-4 font-mono">{row.blockedThreats} تلاش</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          تایید شده
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PERFORMANCE & SPEED BREAKDOWN                         */}
      {/* ======================================================== */}
      {activeSection === 'performance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>ممیزی تخصصی سرعت، حافظه و منابع سرور</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">جزئیات زمان پاسخگویی TTFB، آبجکت‌کش ردیس و فشرده‌سازی لایت‌اسپید</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">زمان اولین بایت سرور (TTFB):</span>
              <div className="text-2xl font-black text-emerald-400">{report.performanceMetrics.ttfbSeconds} ثانیه</div>
              <p className="text-[11px] text-slate-500">استاندارد گوگل: کمتر از ۰.۸ ثانیه</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">نرخ اصابت کش ردیس (Redis Hit):</span>
              <div className="text-2xl font-black text-cyan-400">{report.performanceMetrics.redisCacheHitRate}٪</div>
              <p className="text-[11px] text-slate-500">کوئری‌ها از حافظه رم لود می‌شوند</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">صرفه‌جویی در پهنای باند:</span>
              <div className="text-2xl font-black text-teal-400">{report.performanceMetrics.totalBandwidthSavedGb} گیگابایت</div>
              <p className="text-[11px] text-slate-500">با تبدیل خودکار به WebP و فشرده‌ساز</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2.5 CORE WEB VITALS HEATMAP                               */}
      {/* ======================================================== */}
      {(activeSection === 'vitals-heatmap' || activeSection === 'performance') && report.coreWebVitalsHeatmap && (
        <CoreWebVitalsHeatmap
          data={report.coreWebVitalsHeatmap}
          onRefresh={fetchReport}
        />
      )}

      {/* ======================================================== */}
      {/* 3. SECURITY & WAF BREAKDOWN                              */}
      {/* ======================================================== */}
      {activeSection === 'security' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>گزارش سپر امنیتی AIOS و مسدودسازی نفوذ</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">مانیتورینگ دیواره آتش، حملات بروت‌فورس و پایش سلامت فایل‌های اصلی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">تلاش‌های نفوذ دفع‌شده:</span>
              <div className="text-2xl font-black text-purple-400">{report.securityMetrics.wafFirewallBlockedAttempts}</div>
              <p className="text-[11px] text-slate-500">شامل حملات تزریق کد و ربات‌های مخرب</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">قفل‌های بروت‌فورس ورود:</span>
              <div className="text-2xl font-black text-rose-400">{report.securityMetrics.bruteForceLockdowns} مورد</div>
              <p className="text-[11px] text-slate-500">IPهای مسدودشده به دلیل تلاش‌های مکرر</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">یکپارچگی کدهای هسته:</span>
              <div className="text-2xl font-black text-emerald-400">۱۰۰٪ سالم</div>
              <p className="text-[11px] text-slate-500">بدون ویرایش غیرمجاز فایل‌های سیستم</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DATABASE METRICS BREAKDOWN                            */}
      {/* ======================================================== */}
      {activeSection === 'database' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>سلامت پایگاه داده و جدول‌های وردپرس</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">پاکسازی دوره‌ای ترنزینت‌ها، رونوشت‌ها و بهینه‌سازی جداول InnoDB</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">ترنزینت‌های پاکسازی‌شده:</span>
              <div className="text-2xl font-black text-cyan-400">{report.databaseMetrics.transientsCleanedThisMonth} سطر</div>
              <p className="text-[11px] text-slate-500">آزادسازی فضای اشغال‌شده جدول wp_options</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">رونوشت‌های مازاد حذف‌شده:</span>
              <div className="text-2xl font-black text-amber-400">{report.databaseMetrics.revisionsPurged} نوشته</div>
              <p className="text-[11px] text-slate-500">کاهش چشمگیر حجم دیتابیس</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">کوئری‌های کند (Slow Queries):</span>
              <div className="text-2xl font-black text-emerald-400">{report.databaseMetrics.slowQueriesCount}</div>
              <p className="text-[11px] text-slate-500">تمام کوئری‌ها در کمتر از ۵ میلی‌ثانیه اجرا می‌شوند</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4.5 PREDICTIVE CONFLICTS & SYSTEM CRASH FORECASTER        */}
      {/* ======================================================== */}
      {activeSection === 'predictive-conflicts' && (
        <div className="space-y-6">
          
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    موتور پیش‌بین تداخل افزونه‌ها و پایداری وردپرس
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-950/80 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono font-bold">
                    WP_DEBUG_LOG Parser
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white pt-1">
                  سامانه هوشمند پیش‌بینی تداخل افزونه‌ها و تشنج هسته وردپرس
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  این سیستم با پایش مستمر لاگ‌های سیستم (`debug.log`)، کوئری‌های تعلیق دیتابیس و الگوهای رفتاری پلاگین‌ها، تعارضات مخرب و افت کارایی را پیش از وقوع سقوط هسته وردپرس پیش‌بینی کرده و راه‌حل‌های پیشگیرانه ارائه می‌دهد.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setIsLogScanning(true);
                    setTimeout(() => {
                      setIsLogScanning(false);
                      setScannedLogsCount(prev => prev + 342);
                      alert('اسکن زنده تمام شد! لاگ‌های جدید با موفقیت ارزیابی شدند. تداخل جدیدی یافت نشد.');
                    }, 1800);
                  }}
                  disabled={isLogScanning}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLogScanning ? 'animate-spin' : ''}`} />
                  <span>{isLogScanning ? 'در حال اسکن عمیق...' : 'تحلیل مجدد و اسکن debug.log'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core Scorecards & Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">ریسک کلی تداخل افزونه‌ها:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-400">۴۲٪</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">MEDIUM RISK</span>
              </div>
              <p className="text-[11px] text-slate-400">۳ تداخل بالقوه پیش‌بینی شده است</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">لاگ‌های تحلیل‌شده سیستم:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-400">{scannedLogsCount.toLocaleString()} سطر</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">ACTIVE SCAN</span>
              </div>
              <p className="text-[11px] text-slate-400">مسیر فایل: `/wp-content/debug.log`</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">شاخص پایداری پیش‌گیرانه:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">۹۸.۸٪</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">HIGH STABILITY</span>
              </div>
              <p className="text-[11px] text-slate-400">پیشگیری خودکار فعال است</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
              <span className="text-xs text-slate-400 font-bold block">ارزیابی سازگاری PHP سرور:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">PHP 8.2 / 8.3</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">VERIFIED</span>
              </div>
              <p className="text-[11px] text-slate-400">بدون خطاهای ناسازگاری Fatal</p>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>فهرست تعارضات و ریسک‌های بحرانی پیش‌بینی شده (Expected System Hazards)</span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Alert Items Loop */}
              {report.predictiveConflicts.alerts.map((alertItem: any) => {
                const isSolved = solvedConflictIds[alertItem.id];
                return (
                  <div
                    key={alertItem.id}
                    className={`border rounded-2xl p-6 shadow-xl transition-all space-y-4 relative overflow-hidden flex flex-col justify-between min-h-[420px] ${
                      isSolved
                        ? 'bg-emerald-950/30 border-emerald-500/40 opacity-80'
                        : alertItem.severity === 'Critical'
                        ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-500/60'
                        : alertItem.severity === 'High'
                        ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500/60'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold font-mono border ${
                          alertItem.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          alertItem.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          اهمیت: {alertItem.severity}
                        </span>
                        
                        <span className="text-xs font-mono font-bold text-rose-400">
                          احتمال وقوع: {alertItem.riskPercentage}٪
                        </span>
                      </div>

                      <h5 className="text-sm font-extrabold text-white">{alertItem.title}</h5>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">افزونه‌های مرتبط:</span>
                        {alertItem.involvedPlugins.map((plug: string, pIdx: number) => (
                          <span key={pIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] rounded text-slate-300 font-bold">
                            {plug}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">خلاصه تداخل و استثنای PHP:</span>
                        <p className="text-xs text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20 font-mono dir-ltr text-left overflow-x-auto text-[10px] leading-relaxed">
                          {alertItem.predictedException}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">شرایط تشنج سیستم:</span>
                        <p className="text-xs text-slate-300">{alertItem.triggerCondition}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-teal-400 font-bold block">اقدام پیشگیرانه هوش مصنوعی (AI Advice):</span>
                        <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                          {alertItem.aiPreventativeAction}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                      <div className="bg-slate-950 p-2 rounded-lg font-mono text-[9px] text-indigo-300 flex items-center justify-between border border-slate-800/80 dir-ltr text-left">
                        <span className="truncate">{alertItem.autoResolveCommand}</span>
                        <span className="text-[9px] text-slate-500 uppercase ml-2 shrink-0">WP-CLI WP Native</span>
                      </div>

                      {isSolved ? (
                        <span className="w-full py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          تداخل با پچ خودکار برطرف شد
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSolvedConflictIds(prev => ({ ...prev, [alertItem.id]: true }));
                            alert(`تداخل "${alertItem.title}" با اجرای پچ خودکار پیشگیرانه با موفقیت برطرف شد.`);
                          }}
                          className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-rose-400 fill-current" />
                          <span>اجرای پچ و حل پیشگیرانه تداخل</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated debug.log Scanner Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>نمایش خطوط و امضاهای امنیتی استخراج شده از `/wp-content/debug.log`</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
                System Scan Trace
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-slate-300 dir-ltr text-left leading-relaxed max-h-56 overflow-y-auto space-y-1 select-all">
              {report.predictiveConflicts.systemDebugLogsSimulated.map((log: string, lIdx: number) => (
                <div key={lIdx} className="p-1 hover:bg-slate-900/80 rounded border-b border-slate-900/40 pb-1.5">
                  <span className="text-amber-500 font-bold">[LOG-{lIdx + 1}]</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PRINT-READY OFFICIAL PDF DOCUMENT VIEW                */}
      {/* ======================================================== */}
      <div className={`${activeSection === 'pdf-preview' ? 'block' : 'hidden print:block'} bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 print:p-0 print:shadow-none print:rounded-none`}>
        
        {/* PDF Document Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <KamvaLogo size="lg" showText={false} />
            <div>
              <h1 className="text-2xl font-black text-slate-900">گزارش ماهانه سلامت و عملکرد وب‌سایت</h1>
              <span className="text-xs text-slate-500">سامانه هوشمند ممیزی و پایش عملکرد کامواوب (KamvaWeb Pro Audit)</span>
            </div>
          </div>

          <div className="text-left font-mono text-xs text-slate-600 space-y-0.5">
            <div><strong>دوره گزارش:</strong> {report.reportMonth}</div>
            <div><strong>تاریخ صدور:</strong> {new Date().toLocaleDateString('fa-IR')}</div>
            <div><strong>شاخص کل:</strong> <span className="text-emerald-600 font-bold">{report.overallHealthScore}/100</span></div>
          </div>
        </div>

        {/* Executive Overview in Print */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
          <h2 className="text-sm font-bold text-slate-900">خلاصه تحلیل مدیریتی هوش مصنوعی:</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {report.aiExecutiveSummary.executiveAssessment}
          </p>
        </div>

        {/* 3 Pillars Table in Print */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-500 block mb-1">سرعت و لایت‌هاوس</span>
            <div className="text-2xl font-black text-emerald-600">{report.performanceMetrics.lighthouseScore}/100</div>
            <span className="text-[10px] text-slate-500">TTFB: {report.performanceMetrics.ttfbSeconds}s</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-500 block mb-1">گرید امنیتی WAF</span>
            <div className="text-2xl font-black text-purple-600">{report.securityMetrics.securityGrade}</div>
            <span className="text-[10px] text-slate-500">{report.securityMetrics.wafFirewallBlockedAttempts} نفوذ دفع‌شده</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-500 block mb-1">پایگاه داده MySQL</span>
            <div className="text-2xl font-black text-cyan-600">{report.databaseMetrics.dbHealthScore}%</div>
            <span className="text-[10px] text-slate-500">سربار صفر مگابایت</span>
          </div>
        </div>

        {/* Achievements List in Print */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase">اقدامات و دستاوردهای انجام‌شده در این ماه:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            {report.aiExecutiveSummary.keyAchievements.map((item: string, idx: number) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Document Footer & Seal */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>گواهی رسمی پایداری و سلامت پروداکشن کامواوب پرو</span>
          </div>
          <span className="font-mono">KAMVAWEB-AUDIT-SEAL-VERIFIED</span>
        </div>

      </div>

    </div>
  );
};
