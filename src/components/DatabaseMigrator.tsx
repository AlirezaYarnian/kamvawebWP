import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  ArrowUpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Clock,
  Play,
  FileCode,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';

interface TableIntegrity {
  table_name: string;
  label: string;
  exists: boolean;
  status: string;
  rows: number;
  size_kb: number;
}

interface MigrationDefinition {
  version: string;
  title: string;
  description: string;
  tables: string[];
  date: string;
}

interface MigrationHistoryItem {
  version: string;
  timestamp: string;
  executed_by: string;
  status: string;
}

export const DatabaseMigrator: React.FC = () => {
  const [installedVersion, setInstalledVersion] = useState('1.4.0');
  const [targetVersion, setTargetVersion] = useState('1.4.0');
  const [isUpToDate, setIsUpToDate] = useState(true);
  const [tables, setTables] = useState<Record<string, TableIntegrity>>({});
  const [definitions, setDefinitions] = useState<MigrationDefinition[]>([]);
  const [history, setHistory] = useState<MigrationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Dry run modal
  const [dryRunData, setDryRunData] = useState<any>(null);
  const [isDryRunning, setIsDryRunning] = useState(false);

  // Selected target for rollback or migrate
  const [selectedTargetVersion, setSelectedTargetVersion] = useState('1.4.0');

  const fetchMigrationStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/database/migrations');
      const data = await res.json();
      if (data.success) {
        setInstalledVersion(data.installed_version);
        setTargetVersion(data.target_version);
        setIsUpToDate(data.migrations_up_to_date);
        setTables(data.tables_integrity || {});
        setDefinitions(data.definitions || []);
        setHistory(data.history || []);
        setSelectedTargetVersion(data.target_version);
      }
    } catch (e) {
      console.error('Failed to fetch migrations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMigrationStatus();
  }, []);

  const handleRunMigration = async (versionToRun = selectedTargetVersion) => {
    setIsMigrating(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/database/run-migrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion: versionToRun }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setInstalledVersion(data.version);
        setIsUpToDate(true);
        if (data.tables_integrity) setTables(data.tables_integrity);
        fetchMigrationStatus();
      }
    } catch (e) {
      console.error('Migration error:', e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleRollback = async (versionToRollback: string) => {
    if (!confirm(`آیا از بازگردانی ساختار دیتابیس به نسخه ${versionToRollback} اطمینان دارید؟`)) return;
    setIsMigrating(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/database/migrations/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion: versionToRollback }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setInstalledVersion(data.version);
        fetchMigrationStatus();
      }
    } catch (e) {
      console.error('Rollback error:', e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/database/migrations/optimize-tables', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        if (data.tables_integrity) setTables(data.tables_integrity);
      }
    } catch (e) {
      console.error('Optimize error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDryRun = async (targetVer: string) => {
    setIsDryRunning(true);
    try {
      const res = await fetch('/api/database/migrations/dry-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion: targetVer }),
      });
      const data = await res.json();
      if (data.success) {
        setDryRunData(data);
      }
    } catch (e) {
      console.error('Dry run error:', e);
    } finally {
      setIsDryRunning(false);
    }
  };

  const totalRows = Object.values(tables).reduce((acc, t) => acc + (t.rows || 0), 0);
  const totalSizeKb = Object.values(tables).reduce((acc, t) => acc + (t.size_kb || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                KamvaMigrationManager v{targetVersion}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                dbDelta Safe Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              مدیریت نسخه و مایگریشن جداول دیتابیس (Database Migrator)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              مدیریت ایمن چرخه حیات اسکیما، ساخت جداول اختصاصی NexusAI، اجرای بروزرسانی‌های گام‌به‌گام و بازگردانی (Rollback) بدون قطعی دیتابیس.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOptimize()}
              disabled={isOptimizing}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Zap className={`w-4 h-4 text-amber-400 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>بهینه‌سازی و Defrag جداول</span>
            </button>
            <button
              onClick={() => handleRunMigration(targetVersion)}
              disabled={isMigrating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-500/25"
            >
              <ArrowUpCircle className={`w-4 h-4 ${isMigrating ? 'animate-spin' : ''}`} />
              <span>اجرای مایگریشن کلی (v{targetVersion})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Message Notification */}
      {statusMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-300 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>نسخه نصب شده اسکیما</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
            <span>v{installedVersion}</span>
            {isUpToDate ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                بروز
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                نیازمند مایگریشن
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>نسخه هدف (Target Schema)</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">v{targetVersion}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>کل رکوردهای ذخیره‌شده</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalRows.toLocaleString('fa-IR')} رکورد</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>حجم جداول اختصاصی</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{totalSizeKb.toFixed(1)} KB</div>
        </div>
      </div>

      {/* Tables Health Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>جداول اختصاصی کامواوب (Custom Theme Tables)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">وضعیت سلامت و حجم داده‌های ذخیره شده در MySQL</p>
          </div>
          <button
            onClick={fetchMigrationStatus}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>بروزرسانی وضعیت</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(tables).map(([key, t]) => (
            <div
              key={key}
              className="bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-4 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{t.label}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{t.table_name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  سالم (Healthy)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                <span className="font-mono">تعداد ردیف‌ها: {t.rows.toLocaleString('fa-IR')}</span>
                <span className="font-mono text-cyan-400">حجم: {t.size_kb} KB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Definitions & Version Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>خط سیر نسخه‌های اسکیما و مایگریشن‌ها (Schema Timeline)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">مشاهده جزئیات تغییرات و امکان اجرای مایگریشن هدفمند یا Rollback</p>
          </div>
        </div>

        <div className="space-y-4">
          {definitions.map((def) => {
            const isInstalled = versionCompareGte(installedVersion, def.version);
            const isCurrent = installedVersion === def.version;
            return (
              <div
                key={def.version}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
                    : isInstalled
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-950/30 border-dashed border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-white">
                      v{def.version}
                    </span>
                    <h4 className="font-bold text-sm text-white">{def.title}</h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        نسخه جاری
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">📅 {def.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{def.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">جداول درگیر:</span>
                    {def.tables.map((tbl) => (
                      <span key={tbl} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {tbl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDryRun(def.version)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>بررسی آزمایشی (Dry Run)</span>
                  </button>

                  {isInstalled && !isCurrent ? (
                    <button
                      onClick={() => handleRollback(def.version)}
                      disabled={isMigrating}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback به این نسخه</span>
                    </button>
                  ) : !isInstalled ? (
                    <button
                      onClick={() => handleRunMigration(def.version)}
                      disabled={isMigrating}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>مایگریشن به v{def.version}</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      فعال و مستقر
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Migration Execution Logs / History */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>تاریخچه و لاگ‌های اجرای مایگریشن در دیتابیس</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">نسخه اسکیما</th>
                <th className="p-3">زمان اجرا</th>
                <th className="p-3">اجرا شده توسط</th>
                <th className="p-3">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-950/40 transition-colors">
                  <td className="p-3 font-bold text-white">v{h.version}</td>
                  <td className="p-3 text-slate-400">{h.timestamp}</td>
                  <td className="p-3">{h.executed_by}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        h.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {h.status === 'success' ? 'موفقیت‌آمیز' : 'Rollback'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dry Run Modal */}
      {dryRunData && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <span>نتیجه شبیه‌سازی مایگریشن (Dry Run) - v{dryRunData.targetVersion}</span>
              </h3>
              <button
                onClick={() => setDryRunData(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">سطح ریسک:</span>
                <span className="text-emerald-400 font-bold">{dryRunData.riskLevel}</span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">زمان تخمینی اجرا:</span>
                <span className="text-cyan-400 font-mono">{dryRunData.estimatedMs} میلی‌ثانیه</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">دستورات SQL شبیه‌سازی‌شده:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 space-y-1 max-h-40 overflow-y-auto">
                  {dryRunData.simulatedSql.map((sql: string, idx: number) => (
                    <div key={idx}>&gt; {sql}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDryRunData(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setDryRunData(null);
                  handleRunMigration(dryRunData.targetVersion);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg"
              >
                تایید و اجرای مایگریشن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function versionCompareGte(v1: string, v2: string): boolean {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return true;
    if (num1 < num2) return false;
  }
  return true;
}
