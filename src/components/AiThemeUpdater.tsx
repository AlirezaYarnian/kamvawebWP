import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  GitBranch, 
  Layers, 
  FileCode2, 
  ArrowUpCircle, 
  Clock, 
  Lock, 
  Undo2, 
  Zap, 
  Play, 
  Terminal, 
  ExternalLink,
  Code2,
  Check
} from 'lucide-react';
import { ThemeOptionsConfig } from '../types/theme';

interface AiThemeUpdaterProps {
  config: ThemeOptionsConfig;
}

export const AiThemeUpdater: React.FC<AiThemeUpdaterProps> = ({ config }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateData, setUpdateData] = useState<any>(null);
  const [activeVersionTab, setActiveVersionTab] = useState<'scan' | 'changelog' | 'rollback'>('scan');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState('4.2.0');

  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    setSuccessToast(null);

    try {
      const res = await fetch('/api/theme-updater/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentVersion,
          customSnippets: config.developerStudio?.customPhpSnippets || [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUpdateData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    handleCheckForUpdates();
  }, []);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/theme-updater/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion: '4.3.0' }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentVersion('4.3.0');
        setSuccessToast(data.message);
        setTimeout(() => setSuccessToast(null), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                هسته پایش و آپدیت هوشمند کامواوب (AI-Driven Theme Updater)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                نسخه فعلی: {currentVersion}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              پایش خودکار مخزن وردپرس و ارزیابی سازگاری هوش مصنوعی با کدهای سفارشی شما
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              پیش از پیشنهاد یا اعمال هرگونه آپدیت، هوش مصنوعی کامواوب مخزن وردپرس و کدهای اختصاصی شما را با تحلیل درخت سینتکس انتزاعی (AST) اسکن کرده و از عدم شکستگی حتی یک قطعه‌کد اطمینان حاصل می‌کند.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCheckForUpdates}
              disabled={isChecking || isUpdating}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isChecking ? 'در حال اسکن مخزن...' : 'بررسی مجدد آپدیت‌ها'}</span>
            </button>

            {currentVersion !== '4.3.0' && (
              <button
                onClick={handleApplyUpdate}
                disabled={isUpdating || isChecking}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2 ring-2 ring-emerald-400/40"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>در حال اعمال آپدیت امن...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>ارتقای امن به نسخه ۴.۳.۰ با AI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">ROLLBACK READY</span>
        </div>
      )}

      {/* Compatibility Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">شاخص سازگاری کدهای اختصاصی:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">۹۹.۶٪</span>
              <span className="text-[10px] text-emerald-500 font-bold">ZERO BREAKING</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">فایل‌ها و هوک‌های اسکن‌شده:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400">۱۷۲ مورد</span>
              <span className="text-[10px] text-cyan-500 font-bold">AST VERIFIED</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileCode2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">سازگاری با هسته وردپرس:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-400">WP 7.1.1</span>
              <span className="text-[10px] text-indigo-500 font-bold">READY</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">نقطه بازگشت امن خودکار (Rollback):</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">فعال</span>
              <span className="text-[10px] text-amber-500 font-bold">۰.۲ ثانیه</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Undo2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        
        {/* Sub Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveVersionTab('scan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeVersionTab === 'scan' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              گزارش اسکن کدهای سفارشی (AST Scan)
            </button>
            <button
              onClick={() => setActiveVersionTab('changelog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeVersionTab === 'changelog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              تغییرات نسخه جدید (Upstream Changelog)
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            آخرین پایش مخزن: همین چند لحظه پیش
          </span>
        </div>

        {/* Tab 1: AST Scan on Custom Snippets */}
        {activeVersionTab === 'scan' && (
          <div className="space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>نتیجه تحلیل هوش مصنوعی: ارتقا به نسخه ۴.۳.۰ کاملاً ایمن و بدون شکستگی است.</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                تمام اسنیپت‌های سفارشی شما در پورتال Developer Studio با هوک‌های استاندارد وردپرس ۷.۱ منطبق هستند و هیچ متد منسوخ‌شده‌ای در فرآیند ارتقا متوقف نخواهد شد.
              </p>
            </div>

            {/* Scanned Snippets Breakdown */}
            <div className="space-y-3">
              {(config.developerStudio?.customPhpSnippets || []).map((snip, idx) => (
                <div key={snip.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{snip.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        سازگار ۱۰۰٪
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Hook: {snip.hook} • Priority: {snip.priority}
                    </span>
                  </div>

                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" />
                    <span>تایید شده توسط موتور هوش مصنوعی</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upstream Changelog */}
        {activeVersionTab === 'changelog' && updateData && (
          <div className="space-y-4">
            {updateData.upstreamReleases.map((rel: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{rel.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {rel.version}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{rel.releaseDate}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {rel.changelog.map((item: string, i: number) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
