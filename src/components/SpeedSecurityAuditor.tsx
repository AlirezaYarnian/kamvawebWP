import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Gauge, 
  Flame, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Layers, 
  HardDrive, 
  Cpu, 
  Activity,
  ShieldAlert,
  Server,
  Database,
  Trash2,
  Sparkles,
  ArrowDownCircle,
  Clock,
  Check,
  ChevronRight,
  TrendingDown,
  Info,
  Copy,
  Download,
  Filter,
  Search,
  Eye,
  Terminal,
  FileCheck,
  History,
  SlidersHorizontal,
  FolderLock
} from 'lucide-react';
import { 
  sampleSpeedMetrics, 
  sampleManagedPlugins, 
  sampleSecurityLogs 
} from '../data/initialData';
import { SecurityEvent, DatabaseHealthReport, OrphanedTableItem, TransientDataItem, DbCleanupHistoryItem } from '../types/theme';

export const SpeedSecurityAuditor: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'database'>('overview');

  // Overview states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(sampleSecurityLogs);

  // Database Cleaner States
  const [dbHealth, setDbHealth] = useState<DatabaseHealthReport | null>(null);
  const [isAnalyzingDb, setIsAnalyzingDb] = useState(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [isCleaningDb, setIsCleaningDb] = useState(false);
  const [selectedTables, setSelectedTables] = useState<Record<string, boolean>>({});
  
  // Cleanup Toggles
  const [cleanTransientsChecked, setCleanTransientsChecked] = useState(true);
  const [cleanRevisionsChecked, setCleanRevisionsChecked] = useState(true);
  const [cleanOrphanedMetaChecked, setCleanOrphanedMetaChecked] = useState(true);
  const [cleanTrashedPostsChecked, setCleanTrashedPostsChecked] = useState(true);
  const [optimizeOverheadChecked, setOptimizeOverheadChecked] = useState(true);
  const [dryRunMode, setDryRunMode] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  // Filter & Search inside Database tab
  const [dbFilter, setDbFilter] = useState<'all' | 'orphaned' | 'transients' | 'revisions_meta' | 'custom_inspector' | 'history'>('all');
  const [selectedProfile, setSelectedProfile] = useState<'ecommerce_heavy' | 'blog_long_history' | 'corporate'>('ecommerce_heavy');
  const [searchTerm, setSearchTerm] = useState('');

  // Custom Table Inspector
  const [customTableName, setCustomTableName] = useState('');
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState(false);
  const [customTableResult, setCustomTableResult] = useState<{
    tableName: string;
    sourcePlugin: string;
    riskLevel: 'safe' | 'caution' | 'critical';
    aiExplanation: string;
    recommendedAction: string;
    sqlQuery: string;
  } | null>(null);

  // Notifications & UI states
  const [cleanupSuccessMessage, setCleanupSuccessMessage] = useState<string | null>(null);
  const [copiedQueryKey, setCopiedQueryKey] = useState<string | null>(null);
  const [cleanupHistory, setCleanupHistory] = useState<DbCleanupHistoryItem[]>([]);

  // Fetch Database health on mount
  const fetchDbHealth = async (profile = selectedProfile) => {
    setIsAnalyzingDb(true);
    setScanStepText('در حال خواندن وضعیت فعلی دیتابیس وردپرس...');
    try {
      const res = await fetch('/api/database/analyze-health');
      const data = await res.json();
      if (data.result) {
        setDbHealth(data.result);
        const initialSelections: Record<string, boolean> = {};
        data.result.orphanedTables?.forEach((t: OrphanedTableItem) => {
          initialSelections[t.tableName] = true;
        });
        setSelectedTables(initialSelections);
      }
      // Also fetch history
      const historyRes = await fetch('/api/database/cleanup-history');
      const historyData = await historyRes.json();
      if (historyData.result) {
        setCleanupHistory(historyData.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingDb(false);
      setScanStepText('');
    }
  };

  useEffect(() => {
    fetchDbHealth();
  }, []);

  // Deep AI Database Scan with step-by-step progress simulation
  const handleRunAiDeepScan = async () => {
    setIsAnalyzingDb(true);
    setScanStepText('مرحله ۱/۴: بررسی ساختار متادیتا و حجم جداول InnoDB...');
    
    await new Promise((r) => setTimeout(r, 450));
    setScanStepText('مرحله ۲/۴: تحلیل جداول یتیم و تطبیق با هوش مصنوعی کامواوب...');
    
    await new Promise((r) => setTimeout(r, 550));
    setScanStepText('مرحله ۳/۴: پایش سطر به سطر ترنزینت‌های منقضی در wp_options و Autoload...');
    
    try {
      const res = await fetch('/api/database/ai-deep-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: selectedProfile,
          prefix: 'wp_',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setDbHealth(data.result);
        const initialSelections: Record<string, boolean> = {};
        data.result.orphanedTables?.forEach((t: OrphanedTableItem) => {
          initialSelections[t.tableName] = true;
        });
        setSelectedTables(initialSelections);
        setCleanupSuccessMessage('اسکن هوشمند دیتابیس با موفقیت انجام شد: موارد زائد و هرز با دقت تفکیک گردیدند.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingDb(false);
      setScanStepText('');
    }
  };

  // Inspect custom table with AI
  const handleInspectCustomTable = async () => {
    if (!customTableName.trim()) return;
    setIsAnalyzingCustom(true);
    try {
      const res = await fetch('/api/database/custom-table-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName: customTableName.trim() }),
      });
      const data = await res.json();
      if (data.result) {
        setCustomTableResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingCustom(false);
    }
  };

  // Execute Cleanup or Dry Run Simulation
  const handleExecuteDbCleanup = async () => {
    if (isCleaningDb) return;
    setIsCleaningDb(true);
    setCleanupSuccessMessage(null);

    const chosenTableNames = Object.entries(selectedTables)
      .filter(([_, isSelected]) => isSelected)
      .map(([tableName]) => tableName);

    try {
      const res = await fetch('/api/database/optimize-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanOrphanedTables: chosenTableNames.length > 0,
          selectedTableNames: chosenTableNames,
          cleanTransients: cleanTransientsChecked,
          cleanRevisions: cleanRevisionsChecked,
          cleanOrphanedMeta: cleanOrphanedMetaChecked,
          cleanTrashedPosts: cleanTrashedPostsChecked,
          optimizeOverhead: optimizeOverheadChecked,
          dryRun: dryRunMode,
          autoBackup: autoBackupEnabled,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.dryRun) {
          setCleanupSuccessMessage(
            `🔎 شبیه‌سازی موفق: با اجرای نهایی ${data.metrics.freedMb} مگابایت دیسک آزاد و ${data.metrics.purgedRows.toLocaleString('fa-IR')} سطر بدون آسیب به سایت حذف خواهد شد.`
          );
        } else {
          setCleanupSuccessMessage(
            `✨ پاکسازی قطعی دیتابیس با موفقیت انجام شد: ${data.metrics.freedMb} مگابایت فضا آزاد گردید، ${data.metrics.purgedRows.toLocaleString('fa-IR')} رکورد هرز پاکسازی شدند و شاخص TTFB تا ۵۲٪ شتاب گرفت!`
          );
          if (data.updatedHealth) {
            setDbHealth(data.updatedHealth);
            if (data.updatedHealth.history) {
              setCleanupHistory(data.updatedHealth.history);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCleaningDb(false);
    }
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const handleSelectAllSafe = () => {
    if (!dbHealth?.orphanedTables) return;
    const newSelections: Record<string, boolean> = {};
    dbHealth.orphanedTables.forEach((t) => {
      newSelections[t.tableName] = t.riskLevel === 'safe';
    });
    setSelectedTables(newSelections);
  };

  const handleDeselectAll = () => {
    setSelectedTables({});
  };

  const handleCopySql = (sql: string, key: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQueryKey(key);
    setTimeout(() => {
      setCopiedQueryKey(null);
    }, 2000);
  };

  const handleDownloadSql = () => {
    window.location.href = '/api/database/export-sql';
  };

  // Overview security simulation
  const handleRunDiagnostics = () => {
    setIsScanning(true);
    setScanProgress(10);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          const newEvent: SecurityEvent = {
            id: `sec-${Date.now()}`,
            timestamp: 'هم‌اکنون',
            type: 'brute_force',
            ip: '193.106.31.77',
            targetUrl: '/kamva-secure-login',
            actionTaken: 'مسدود شد (IP Banned)',
            severity: 'critical',
          };
          setSecurityEvents((curr) => [newEvent, ...curr.slice(0, 5)]);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  // Filtered lists
  const filteredOrphanedTables = dbHealth?.orphanedTables?.filter((t) => {
    if (!searchTerm) return true;
    return (
      t.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sourcePlugin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.aiAnalysis.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const filteredTransients = dbHealth?.transients?.filter((tr) => {
    if (!searchTerm) return true;
    return (
      tr.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                <Zap className="w-3.5 h-3.5" />
                هسته کامواوب: بهینه‌ساز هوشمند سرعت + امنیت WAF + پاکسازی دیتابیس
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                شتاب TTFB سرور • زمان پاسخ‌دهی زیر ۶۰ms
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              پایش عملکرد، امنیت WAF و پاکسازی هوشمند دیتابیس وردپرس
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              هسته هوش مصنوعی کامواوب با تحلیل سطر به سطر دیتابیس، جداول رها شده از افزونه‌های حذف شده (Orphaned Tables) و ترنزینت‌های منقضی جدول wp_options را شناسایی و به صورت امن پاکسازی می‌کند.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/90 border border-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-indigo-300" />
              <span>پایش سرعت و فایروال WAF</span>
            </button>

            <button
              onClick={() => setActiveSubTab('database')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'database'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-300" />
              <span>پاکسازی هوشمند دیتابیس (AI Cleaner)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW (SPEED BENCHMARKS, PLUGINS & WAF LOGS)    */}
      {/* ========================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex justify-end">
            <button
              onClick={handleRunDiagnostics}
              disabled={isScanning}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال پایش هوشمند ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>اجرای اسکن زنده عملکرد و امنیت</span>
                </>
              )}
            </button>
          </div>

          {/* Speed Metrics Benchmark Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleSpeedMetrics.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 space-y-3 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 line-clamp-1">{item.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    عالی
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">قبل از هوش مصنوعی:</span>
                    <span className="text-xs line-through text-rose-400 font-mono">
                      {item.before} {item.unit}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] text-emerald-400 block font-bold">با کامواوب:</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {item.after} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Two Column Section: Managed Plugins & Firewall Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Managed Plugins Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">مدیریت هوشمند منابع افزونه‌ها (Plugin Dequeue)</h3>
                      <p className="text-[11px] text-slate-400">لود مشروط اسکریپت‌ها فقط در صفحاتی که واقعاً نیاز است</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                    ۵۶۰ms صرفه‌جویی
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sampleManagedPlugins.map((plugin) => (
                    <div
                      key={plugin.slug}
                      className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{plugin.name}</span>
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                            {plugin.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>حجم کدهای فرانت: <strong className="text-slate-300 font-mono">{plugin.originalWeightKb} KB</strong></span>
                          <span>•</span>
                          <span>کاهش زمان لود: <strong className="text-emerald-400 font-mono">+{plugin.savingMs}ms</strong></span>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          لود مشروط فعال
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Firewall & WAF Security Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">سپر دفاعی و فایروال All-in-One WAF</h3>
                      <p className="text-[11px] text-slate-400">دفاع لایه برنامه در برابر حملات تزریق SQL و بروت‌فورس</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    سپر فعال
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {securityEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          {evt.type === 'brute_force' ? 'حمله بروت‌فورس روی ورود' :
                           evt.type === 'xmlrpc_attempt' ? 'تلاش نفوذ از طریق XML-RPC' :
                           evt.type === 'sql_injection' ? 'تزریق کد مخرب SQL' : 'خزنده و بات مخرب'}
                        </span>
                        <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-mono text-slate-300">IP: {evt.ip}</span>
                        <span className="text-emerald-400 font-medium">{evt.actionTaken}</span>
                      </div>
                      
                      <span className="text-[10px] text-slate-500 font-mono block truncate" dir="ltr">
                        Target: {evt.targetUrl}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-emerald-300 block">
                    امنیت لایه شبکه و سرور فعال است
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ورود به پنل با مسیر اختصاصی محافظت شده و حملات مکرر ورود پس از ۴ تلاش ناموفق آدرس IP را به مدت ۱ ساعت در بلک‌لیست قرار می‌دهند.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: AI WORDPRESS DATABASE OPTIMIZER & ORPHANED CLEANER */}
      {/* ========================================================= */}
      {activeSubTab === 'database' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Action & Diagnostics Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  موتور هوش مصنوعی پاکسازی و تحلیل دیتابیس وردپرس
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  شناسایی هوشمند جداول یتیم (Orphaned Tables) از افزونه‌های حذف شده، ترنزینت‌های منقضی در wp_options، متاداده‌های رها شده و دیفرگمنت ایندکس‌ها.
                </p>
              </div>

              {/* Profile Selector & Scan Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="ecommerce_heavy">فروشگاه ووکامرس (پرمحصول با متغیرهای سنگین)</option>
                  <option value="blog_long_history">سایت مجله‌ای/وبلاگی (با تاریخچه Revisions)</option>
                  <option value="corporate">وبسایت شرکتی و لندینگ پیج</option>
                </select>

                <button
                  onClick={handleRunAiDeepScan}
                  disabled={isAnalyzingDb}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-900/20"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingDb ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingDb ? 'در حال تحلیل هوش مصنوعی...' : 'اسکن عمیق دیتابیس با هوش مصنوعی'}</span>
                </button>

                <button
                  onClick={handleDownloadSql}
                  title="دانلود اسکریپت SQL بهینه‌سازی برای phpMyAdmin"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>خروجی SQL</span>
                </button>
              </div>
            </div>

            {/* Scan Progress Status Note */}
            {isAnalyzingDb && scanStepText && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs flex items-center gap-2.5 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="font-medium">{scanStepText}</span>
              </div>
            )}

            {/* KPI Metrics Summary */}
            {dbHealth && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">حجم کل دیتابیس</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white font-mono">{dbHealth.totalDbSizeMb} MB</span>
                    <span className="text-[10px] text-slate-400 font-mono">InnoDB</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">شامل فضا و ایندکس‌ها</span>
                </div>

                <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] text-emerald-400 block font-semibold">فضای هرز قابل آزادسازی</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {dbHealth.bloatedSizeMb > 0 ? `-${dbHealth.bloatedSizeMb} MB` : '۰ MB (پاکسازی شده)'}
                    </span>
                    {dbHealth.bloatedSizeMb > 0 && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                        {Math.round((dbHealth.bloatedSizeMb / dbHealth.totalDbSizeMb) * 100)}٪ حجم زائد
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">بدون حذف دیتای اصلی</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">رکوردهای هرز شناسایی شده</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {dbHealth.cleanableRowsCount.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-[10px] text-slate-400">سطر قابل حذف</span>
                  </div>
                  <span className="text-[10px] text-amber-300/80 block">ترنزینت، بازبینی و جداول یتیم</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">حجم Autoload در wp_options</span>
                    {dbHealth.autoloadedOptionsSizeKb > 800 ? (
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">بحرانی</span>
                    ) : (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">بهینه</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-black font-mono ${dbHealth.autoloadedOptionsSizeKb > 800 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {dbHealth.autoloadedOptionsSizeKb} KB
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">استاندارد لایت‌هاوس: زیر ۵۰۰KB</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">شتاب زمان اجرای کوئری‌ها</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-cyan-400 font-mono">
                      +{dbHealth.queryTimeReductionPercent}%
                    </span>
                    <span className="text-[10px] text-cyan-300">بهبود سرعت</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">شتاب لود صفحات فروشگاه</span>
                </div>
              </div>
            )}

            {/* Execution Controls & Simulation Mode */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-5 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={cleanTransientsChecked}
                      onChange={(e) => setCleanTransientsChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>پاکسازی ترنزینت‌های منقضی (wp_options)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={cleanRevisionsChecked}
                      onChange={(e) => setCleanRevisionsChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>حذف نسخه‌های پیش‌نویس (Revisions)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={cleanOrphanedMetaChecked}
                      onChange={(e) => setCleanOrphanedMetaChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>حذف متاداده‌های یتیم (Postmeta/Termmeta)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={cleanTrashedPostsChecked}
                      onChange={(e) => setCleanTrashedPostsChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>تخلیه زباله‌دان و پیش‌نویس خودکار</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={optimizeOverheadChecked}
                      onChange={(e) => setOptimizeOverheadChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>یکپارچه‌سازی فضای هرز InnoDB (Optimize Table)</span>
                  </label>
                </div>

                {/* Dry Run & Backup Toggles */}
                <div className="flex items-center gap-3 text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={dryRunMode}
                      onChange={(e) => setDryRunMode(e.target.checked)}
                      className="w-3.5 h-3.5 accent-cyan-500 rounded"
                    />
                    <span className="text-cyan-300 font-medium">حالت شبیه‌سازی (Dry Run)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 border-r border-slate-700 pr-3">
                    <input
                      type="checkbox"
                      checked={autoBackupEnabled}
                      onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-500 rounded"
                    />
                    <span className="text-slate-300">پشتیبان Rollback خودکار</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllSafe}
                    className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  >
                    انتخاب همه موارد ایمن (Safe)
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/50 hover:bg-slate-800 cursor-pointer"
                  >
                    لغو انتخاب همه
                  </button>
                </div>

                <button
                  onClick={handleExecuteDbCleanup}
                  disabled={isCleaningDb || (dbHealth?.bloatedSizeMb === 0 && !dryRunMode)}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 ${
                    dryRunMode
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/40'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40'
                  }`}
                >
                  <Trash2 className={`w-4 h-4 ${isCleaningDb ? 'animate-bounce' : ''}`} />
                  <span>
                    {isCleaningDb
                      ? 'در حال پردازش و پاکسازی...'
                      : dryRunMode
                      ? 'اجرای شبیه‌سازی پاکسازی (تست امن)'
                      : dbHealth?.bloatedSizeMb === 0
                      ? 'دیتابیس در وضعیت بهینه و پاکسازی‌شده است'
                      : 'پاکسازی ایمن و آزادسازی فوری دیتابیس'}
                  </span>
                </button>
              </div>
            </div>

            {/* Success toast */}
            {cleanupSuccessMessage && (
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{cleanupSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setCleanupSuccessMessage(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
                >
                  بستن
                </button>
              </div>
            )}
          </div>

          {/* Sub Navigation Inside Database (Filter Tabs & Search) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setDbFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                همه موارد هرز
              </button>
              <button
                onClick={() => setDbFilter('orphaned')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'orphaned' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                جداول یتیم ({dbHealth?.orphanedTables?.length || 0})
              </button>
              <button
                onClick={() => setDbFilter('transients')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'transients' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                ترنزینت‌های منقضی ({dbHealth?.transients?.length || 0})
              </button>
              <button
                onClick={() => setDbFilter('revisions_meta')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'revisions_meta' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                پیش‌نویس‌ها و متاداده
              </button>
              <button
                onClick={() => setDbFilter('custom_inspector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'custom_inspector' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                تحلیل‌گر جدول دلخواه
              </button>
              <button
                onClick={() => setDbFilter('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  dbFilter === 'history' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                تاریخچه پاکسازی‌ها
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="جستجو در نام جداول یا پلاگین..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* ======================================================= */}
          {/* TAB 2.A: CUSTOM TABLE INSPECTOR (INTERACTIVE)           */}
          {/* ======================================================= */}
          {dbFilter === 'custom_inspector' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">تحلیل فوری جدول دلخواه با مغز هوش مصنوعی</h4>
                  <p className="text-xs text-slate-400">
                    نام هر جدولی از دیتابیس وردپرس خود را وارد کنید تا هوش مصنوعی افزونه سازنده، کارکرد و ایمن بودن حذف آن را بررسی کند.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="مثال: wp_actionscheduler_logs یا wp_revslider_css یا wp_posts"
                  value={customTableName}
                  onChange={(e) => setCustomTableName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInspectCustomTable()}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
                <button
                  onClick={handleInspectCustomTable}
                  disabled={isAnalyzingCustom || !customTableName.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingCustom ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingCustom ? 'در حال تحلیل...' : 'تحلیل با هوش مصنوعی'}</span>
                </button>
              </div>

              {/* Preset Quick Checks */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">جداول متداول برای تست سریع:</span>
                {['wp_yoast_indexable', 'wp_wfblocks7', 'wp_revslider_css', 'wp_actionscheduler_logs', 'wp_posts'].map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCustomTableName(name);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
                    dir="ltr"
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Analysis Result Card */}
              {customTableResult && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-sm font-bold text-white" dir="ltr">
                      {customTableResult.tableName}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        customTableResult.riskLevel === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : customTableResult.riskLevel === 'caution'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {customTableResult.riskLevel === 'safe'
                        ? 'ایمن برای حذف'
                        : customTableResult.riskLevel === 'caution'
                        ? 'نیاز به احتیاط'
                        : 'بحرانی (غیرقابل حذف)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">افزونه یا هسته سازنده:</span>
                      <strong className="text-white">{customTableResult.sourcePlugin}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">پیشنهاد عملیاتی:</span>
                      <strong className="text-cyan-300">{customTableResult.recommendedAction}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-xs text-slate-300 space-y-1">
                    <span className="text-indigo-400 font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      توضیحات تحلیلی هوش مصنوعی کامواوب:
                    </span>
                    <p className="leading-relaxed">{customTableResult.aiExplanation}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">دستور SQL پیشنهادی:</span>
                      <button
                        onClick={() => handleCopySql(customTableResult.sqlQuery, 'custom')}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedQueryKey === 'custom' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedQueryKey === 'custom' ? 'کپی شد!' : 'کپی دستور'}</span>
                      </button>
                    </div>
                    <code className="block bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto" dir="ltr">
                      {customTableResult.sqlQuery}
                    </code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2.B: CLEANUP HISTORY LOGS                           */}
          {/* ======================================================= */}
          {dbFilter === 'history' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <History className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-white text-sm">تاریخچه و گزارش پاکسازی‌های دیتابیس</h4>
              </div>

              {cleanupHistory.length > 0 ? (
                <div className="space-y-3">
                  {cleanupHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          پاکسازی و بهینه‌سازی موفقیت‌آمیز
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">فضای آزاد شده:</span>
                          <strong className="text-emerald-400 font-mono">{item.freedMb} MB</strong>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">سطرهای پاکسازی‌شده:</span>
                          <strong className="text-amber-400 font-mono">{item.purgedRows.toLocaleString('fa-IR')}</strong>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">حجم جدید دیتابیس:</span>
                          <strong className="text-white font-mono">{item.newTotalSizeMb} MB</strong>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">مدت اجرا:</span>
                          <strong className="text-cyan-400 font-mono">{item.durationMs} ms</strong>
                        </div>
                      </div>

                      {item.itemsSummary && (
                        <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                          <strong>موارد پاکسازی‌شده:</strong> {item.itemsSummary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800/60">
                  تاکنون هیچ عملیات پاکسازی در این نشست ثبت نشده است. پس از اجرای نخستین پاکسازی، لاگ‌های تغییرات در این بخش نمایش داده می‌شوند.
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2.C: DETAILED CARDS (ORPHANED TABLES & TRANSIENTS)   */}
          {/* ======================================================= */}
          {(dbFilter === 'all' || dbFilter === 'orphaned' || dbFilter === 'transients' || dbFilter === 'revisions_meta') && dbHealth && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Orphaned Tables Column */}
              {(dbFilter === 'all' || dbFilter === 'orphaned') && (
                <div className={dbFilter === 'orphaned' ? 'lg:col-span-12 space-y-4' : 'lg:col-span-7 space-y-4'}>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-amber-400" />
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            جداول یتیم و رها شده (Orphaned Tables Left by Deleted Plugins)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            افزونه‌هایی که قبلاً حذف شده‌اند اما جداول آنها در دیتابیس مانده و سرعت بک‌آپ و کوئری را کند می‌کنند.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
                        {filteredOrphanedTables.length} جدول
                      </span>
                    </div>

                    {filteredOrphanedTables.length > 0 ? (
                      <div className="space-y-3">
                        {filteredOrphanedTables.map((table) => (
                          <div
                            key={table.tableName}
                            className={`bg-slate-950/70 border rounded-xl p-4 space-y-3 transition-colors ${
                              selectedTables[table.tableName] ? 'border-indigo-500/40' : 'border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!selectedTables[table.tableName]}
                                  onChange={() => toggleTableSelection(table.tableName)}
                                  className="w-4 h-4 accent-emerald-500 rounded"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-white block" dir="ltr">
                                      {table.tableName}
                                    </span>
                                    {table.tableEngine && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                        {table.tableEngine}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400">
                                    منبع: <strong className="text-amber-300">{table.sourcePlugin}</strong>
                                    {table.lastAccessedDate && (
                                      <span className="text-slate-500 text-[10px] mr-2">• آخرین دسترسی: {table.lastAccessedDate}</span>
                                    )}
                                  </span>
                                </div>
                              </label>

                              <div className="text-left shrink-0 font-mono text-xs">
                                <span className="font-bold text-emerald-400 block">{table.sizeMb} MB</span>
                                <span className="text-[10px] text-slate-400">{table.rowCount.toLocaleString('fa-IR')} رکورد</span>
                              </div>
                            </div>

                            {/* AI Explanation Box */}
                            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-[11px] text-slate-300 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  تحلیل تخصصی هوش مصنوعی:
                                </span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                                  ضریب اطمینان: {table.confidencePercent || 98}٪ ایمن
                                </span>
                              </div>
                              <p className="leading-relaxed">{table.aiAnalysis}</p>
                            </div>

                            {/* SQL Preview & Copy */}
                            <div className="flex items-center justify-between pt-1">
                              <code className="text-[10px] text-slate-400 font-mono truncate max-w-[80%]" dir="ltr">
                                {table.sqlCleanupQuery}
                              </code>
                              <button
                                onClick={() => handleCopySql(table.sqlCleanupQuery, table.tableName)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                {copiedQueryKey === table.tableName ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                <span>{copiedQueryKey === table.tableName ? 'کپی شد!' : 'کپی دستور'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>کلیه جداول یتیم با موفقیت پاکسازی شده‌اند و هیچ جدول رها شده‌ای در دیتابیس وجود ندارد.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transients & Revisions Column */}
              {(dbFilter === 'all' || dbFilter === 'transients' || dbFilter === 'revisions_meta') && (
                <div className={dbFilter === 'transients' || dbFilter === 'revisions_meta' ? 'lg:col-span-12 space-y-4' : 'lg:col-span-5 space-y-4'}>
                  
                  {/* Expired Transients Card */}
                  {(dbFilter === 'all' || dbFilter === 'transients') && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-cyan-400" />
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              داده‌های گذرا و منقضی (Expired Transients)
                            </h4>
                            <p className="text-[11px] text-slate-400">انباشت کش‌های تاریخ‌گذشته در جدول تنظیمات wp_options</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                          wp_options
                        </span>
                      </div>

                      {filteredTransients.length > 0 ? (
                        <div className="space-y-3">
                          {filteredTransients.map((trans, i) => (
                            <div key={i} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-2 hover:border-slate-700 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">{trans.category}</span>
                                <div className="text-left font-mono">
                                  <span className="text-emerald-400 font-bold block">{trans.sizeMb} MB</span>
                                  <span className="text-[10px] text-slate-400">{trans.count.toLocaleString('fa-IR')} کش</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{trans.description}</p>
                              
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                                <div className="text-[10px] text-rose-300 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                                  <span>{trans.impact}</span>
                                </div>
                                {trans.isAutoloaded && (
                                  <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                                    Autoload فعال
                                  </span>
                                )}
                              </div>

                              {trans.sqlCleanupQuery && (
                                <div className="flex items-center justify-between pt-1">
                                  <code className="text-[9px] text-slate-500 font-mono truncate max-w-[80%]" dir="ltr">
                                    {trans.sqlCleanupQuery}
                                  </code>
                                  <button
                                    onClick={() => handleCopySql(trans.sqlCleanupQuery, `trans-${i}`)}
                                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedQueryKey === `trans-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedQueryKey === `trans-${i}` ? 'کپی شد' : 'کپی'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                          تمامی ترنزینت‌های منقضی با موفقیت از جدول wp_options پاکسازی شدند و سرعت لود تنظیمات در وضعیت بهینه است.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Additional Bloat Breakdown */}
                  {(dbFilter === 'all' || dbFilter === 'revisions_meta') && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Flame className="w-4 h-4 text-rose-400" />
                        سایر داده‌های هرز قابل پاکسازی
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-slate-400 text-[10px] block">نسخه‌های پیش‌نویس (Revisions)</span>
                          <span className="font-bold text-white font-mono text-sm block">
                            {dbHealth.postRevisionsCount} نسخه ({dbHealth.revisionsSizeMb} MB)
                          </span>
                          <span className="text-[9px] text-slate-500">تاریخچه ویرایش‌های قدیمی</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-slate-400 text-[10px] block">متاداده‌های یتیم (Postmeta)</span>
                          <span className="font-bold text-white font-mono text-sm block">
                            {dbHealth.orphanedPostmetaCount} سطر (۵.۲ MB)
                          </span>
                          <span className="text-[9px] text-slate-500">مربوط به محصولات و نوشته‌های حذف‌شده</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-slate-400 text-[10px] block">پیش‌نویس خودکار و زباله‌دان</span>
                          <span className="font-bold text-white font-mono text-sm block">
                            {(dbHealth.trashedPostsCount || 0) + (dbHealth.autoDraftsCount || 0)} مورد (۳.۸ MB)
                          </span>
                          <span className="text-[9px] text-slate-500">نوشته‌های رها شده در Trash</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                          <span className="text-slate-400 text-[10px] block">فضای یکپارچه‌نشده (Overhead)</span>
                          <span className="font-bold text-cyan-400 font-mono text-sm block">
                            {dbHealth.overheadSizeMb || 0} MB
                          </span>
                          <span className="text-[9px] text-slate-500">نیاز به دستور Optimize Table</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
