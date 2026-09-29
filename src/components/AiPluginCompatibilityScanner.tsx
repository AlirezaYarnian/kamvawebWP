import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Power, 
  Code2, 
  Terminal, 
  Lock, 
  FileText, 
  Zap, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AiPluginCompatibilityScanner: React.FC = () => {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ totalPlugins: 0, activeCount: 0, criticalCount: 0, warningCount: 0 });
  const [selectedPlugin, setSelectedAttack] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [remediationSteps, setRemediationSteps] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const fetchPlugins = async () => {
    try {
      const res = await fetch('/api/plugin-scanner/list');
      const data = await res.json();
      if (data.success) {
        setPlugins(data.plugins || []);
        setSummary({
          totalPlugins: data.totalPlugins,
          activeCount: data.activeCount,
          criticalCount: data.criticalCount,
          warningCount: data.warningCount,
        });
        if (data.plugins && data.plugins.length > 0 && !selectedPlugin) {
          setSelectedAttack(data.plugins[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load plugin list', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleScanPlugin = async (id: string) => {
    setScanningId(id);
    try {
      const res = await fetch('/api/plugin-scanner/scan-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId: id })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedAttack(data.plugin);
        setRemediationSteps(data.remediationSteps || []);
        showToast(`اسکن کدها و تست تداخل افزونه "${data.plugin.name}" انجام شد.`);
        fetchPlugins();
      }
    } catch (e) {
      console.error('Failed plugin scan', e);
    } finally {
      setScanningId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/plugin-scanner/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginId: id, active: !currentActive })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        fetchPlugins();
        if (selectedPlugin && selectedPlugin.id === id) {
          setSelectedAttack(data.plugin);
        }
      } else {
        alert(data.error || 'خطا در تغییر وضعیت افزونه');
      }
    } catch (e) {
      console.error('Failed toggle active', e);
    }
  };

  const filteredPlugins = plugins.filter(p => {
    if (filterRisk === 'all') return true;
    return p.riskLevel === filterRisk;
  });

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
                <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                اسکنر هوشمند سازگاری و امنیت افزونه‌ها
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                AiPluginCompatibilityScanner v1.0
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              اسکن کدهای افزونه‌های وردپرس و کشف آسیب‌پذیری و تداخل قبل از فعال‌سازی
            </h2>
            
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              شناسایی توابع منسوخ‌شده PHP 8.2+، تداخل‌های جاوااسکریپت و کدهای ناامن پیش از فعال‌سازی در محیط زنده جهت جلوگیری از خطای ۵۰۰ یا نفوذ امنیتی.
            </p>
          </div>

          <button
            onClick={fetchPlugins}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>بازخوانی افزونه‌ها</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold">کل افزونه‌های نصب‌شده:</span>
          <div className="text-2xl font-extrabold font-mono text-white">{summary.totalPlugins} افزونه</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold">افزونه‌های فعال:</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{summary.activeCount} فعال</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold">هشدار آسیب‌پذیری بحرانی:</span>
          <div className="text-2xl font-extrabold font-mono text-rose-400">{summary.criticalCount} مورد</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs text-slate-400 font-bold">نیازمند بهینه‌سازی:</span>
          <div className="text-2xl font-extrabold font-mono text-amber-400">{summary.warningCount} مورد</div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List of Installed Plugins */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-indigo-400" />
              <span>لیست افزونه‌های موجود وردپرس</span>
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterRisk === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                همه ({plugins.length})
              </button>
              <button
                onClick={() => setFilterRisk('critical')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterRisk === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                بحرانی ({plugins.filter(p => p.riskLevel === 'critical').length})
              </button>
              <button
                onClick={() => setFilterRisk('safe')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterRisk === 'safe' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ایمن ({plugins.filter(p => p.riskLevel === 'safe').length})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPlugins.map((plg) => {
              const isSelected = selectedPlugin?.id === plg.id;
              const isScanningThis = scanningId === plg.id;

              return (
                <div
                  key={plg.id}
                  onClick={() => setSelectedAttack(plg)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-slate-950 border-indigo-500/50 shadow-lg' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">{plg.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">v{plg.version}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        plg.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        plg.riskLevel === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        امتیاز سازگاری: {plg.compatibilityScore}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{plg.aiAuditSummary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScanPlugin(plg.id);
                      }}
                      disabled={isScanningThis}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isScanningThis ? 'animate-spin text-amber-400' : ''}`} />
                      <span>{isScanningThis ? 'در حال اسکن...' : 'اسکن با AI'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(plg.id, plg.activeInWp);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                        plg.activeInWp 
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {plg.activeInWp ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Audit Inspector Panel for Selected Plugin */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                نتیجه اسکن لایه‌ای کدهای افزونه
              </span>
              {selectedPlugin && (
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  selectedPlugin.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedPlugin.riskLevel === 'critical' ? 'ریسک بحرانی' : 'ایمن'}
                </span>
              )}
            </div>

            {selectedPlugin ? (
              <div className="space-y-3.5 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">نام و توسعه‌دهنده:</span>
                  <p className="font-extrabold text-white">{selectedPlugin.name} ({selectedPlugin.author})</p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">خلاصه تحلیل هوش مصنوعی:</span>
                  <p className="text-slate-200 leading-relaxed">{selectedPlugin.aiAuditSummary}</p>
                </div>

                {/* Deprecated Functions List */}
                {selectedPlugin.deprecatedFunctionsFound && selectedPlugin.deprecatedFunctionsFound.length > 0 && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      توابع منسوخ‌شده در PHP 8.2+:
                    </span>
                    <ul className="space-y-1 font-mono text-[11px] text-amber-200 list-disc list-inside dir-ltr text-left">
                      {selectedPlugin.deprecatedFunctionsFound.map((fn: string, idx: number) => (
                        <li key={idx}>{fn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Security Vulnerabilities */}
                {selectedPlugin.securityVulnerabilities && selectedPlugin.securityVulnerabilities.length > 0 && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-rose-500/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      آسیب‌پذیری‌های امنیتی شناسایی‌شده:
                    </span>
                    <ul className="space-y-1 font-mono text-[11px] text-rose-200 list-disc list-inside dir-ltr text-left">
                      {selectedPlugin.securityVulnerabilities.map((vuln: string, idx: number) => (
                        <li key={idx}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hook & Asset Conflicts */}
                {selectedPlugin.hookConflicts && selectedPlugin.hookConflicts.length > 0 && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" />
                      تداخل‌های هوک و اسکریپت‌ها:
                    </span>
                    <ul className="space-y-1 font-mono text-[11px] text-indigo-200 list-disc list-inside dir-ltr text-left">
                      {selectedPlugin.hookConflicts.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {remediationSteps && remediationSteps.length > 0 && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400">گام‌های اصلاحی پیشنهادی:</span>
                    <ul className="space-y-1 text-[11px] text-emerald-200 list-disc list-inside">
                      {remediationSteps.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-12 text-center">لطفاً افزونه‌ای را جهت مشاهده جزئیات انتخاب کنید.</p>
            )}
          </div>

          {selectedPlugin && (
            <button
              onClick={() => handleToggleActive(selectedPlugin.id, selectedPlugin.activeInWp)}
              disabled={selectedPlugin.riskLevel === 'critical' && !selectedPlugin.activeInWp}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                selectedPlugin.activeInWp 
                  ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{selectedPlugin.activeInWp ? 'غیرفعال‌سازی افزونه' : 'تایید ایمنی و فعال‌سازی در وردپرس'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
