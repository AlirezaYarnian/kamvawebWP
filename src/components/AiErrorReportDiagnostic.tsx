import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bug, 
  CheckCircle2, 
  Cpu, 
  FileCode, 
  Flame, 
  RefreshCw, 
  ShieldAlert, 
  Terminal, 
  Wand2, 
  Zap, 
  Check, 
  Play, 
  ArrowRight, 
  Code2, 
  Clock, 
  Layers, 
  CheckCheck
} from 'lucide-react';

interface ErrorLog {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'HIGH' | 'INFO';
  message: string;
  file: string;
  line: number;
  timestamp: string;
  status: 'unresolved' | 'resolved_patched';
  sourceComponent: string;
  stackTrace: string;
  codeSnippetOriginal: string;
  patchSuggested: string;
  explanationFa: string;
  fixSummaryFa: string;
  isPatched: boolean;
  patchAppliedAt: string | null;
}

export const AiErrorReportDiagnostic: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isApplyingPatch, setIsApplyingPatch] = useState<boolean>(false);
  const [patchSuccessMsg, setPatchSuccessMsg] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const fetchErrorLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/error-diagnostic/logs');
      const data = await res.json();
      if (data.logs) {
        setErrorLogs(data.logs);
        if (data.logs.length > 0 && !selectedError) {
          setSelectedError(data.logs[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load error logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  const handleApplyPatch = async (errorId: string) => {
    setIsApplyingPatch(true);
    setPatchSuccessMsg(null);
    try {
      const res = await fetch('/api/error-diagnostic/apply-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorId })
      });
      const data = await res.json();
      if (data.success) {
        setPatchSuccessMsg(data.message);
        // Refresh local list
        const updatedLogs = errorLogs.map(err => 
          err.id === errorId ? { ...err, isPatched: true, status: 'resolved_patched' as const, patchAppliedAt: new Date().toISOString() } : err
        );
        setErrorLogs(updatedLogs);
        if (selectedError && selectedError.id === errorId) {
          setSelectedError({ ...selectedError, isPatched: true, status: 'resolved_patched', patchAppliedAt: new Date().toISOString() });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplyingPatch(false);
    }
  };

  const handleSimulateError = async (type: 'fatal' | 'memory') => {
    try {
      const res = await fetch('/api/error-diagnostic/simulate-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorType: type })
      });
      const data = await res.json();
      if (data.errorLog) {
        setErrorLogs(prev => [data.errorLog, ...prev]);
        setSelectedError(data.errorLog);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyzeErrorWithAi = async (errorId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/error-diagnostic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorId })
      });
      const data = await res.json();
      if (data.analysis && selectedError) {
        const updatedError = {
          ...selectedError,
          explanationFa: data.analysis.explanationFa || selectedError.explanationFa,
          fixSummaryFa: data.analysis.fixSummaryFa || selectedError.fixSummaryFa,
          patchSuggested: data.analysis.patchSuggested || selectedError.patchSuggested
        };
        setSelectedError(updatedError);
        setErrorLogs(prev => prev.map(e => e.id === errorId ? updatedError : e));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredLogs = errorLogs.filter(err => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'unresolved') return !err.isPatched;
    if (filterSeverity === 'critical') return err.severity === 'CRITICAL';
    return true;
  });

  const criticalCount = errorLogs.filter(e => e.severity === 'CRITICAL' && !e.isPatched).length;
  const unresolvedCount = errorLogs.filter(e => !e.isPatched).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-white">
                  عیب‌یاب هوشمند خطاها و پچ‌های خودکار کد
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  AiErrorReportDiagnostic v3.0
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                پایش زنده خطاهای PHP 8.2، کدهای ناایمن دیتابیس ($wpdb)، سرریز حافظه RAM و تداخل توابع تم با تحلیل زبان طبیعی فارسی و اصلاح لحظه‌ای کدها در ساندباکس.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateError('fatal')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bug className="w-4 h-4 text-rose-400" />
              <span>شبیه‌سازی Fatal Error</span>
            </button>
            <button
              onClick={() => handleSimulateError('memory')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>شبیه‌سازی سرریز Memory</span>
            </button>
            <button
              onClick={fetchErrorLogs}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="به‌روزرسانی لیست خطاها"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Live Monitoring Badge Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              شنودگر PHP Live Listener: فعال
            </span>
            <span className="text-slate-500">•</span>
            <span>موتور تحلیل: Kamva Local Neural Engine</span>
            <span className="text-slate-500">•</span>
            <span>ایزوله‌سازی ساندباکس: غیرمخرب (Zero Downtime)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              {criticalCount} خطای کریتیکال
            </span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              {unresolvedCount} حل‌نشده
            </span>
          </div>
        </div>
      </div>

      {/* Main Master-Detail Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Error Log List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>فهرست خطاهای لایو ({errorLogs.length})</span>
            </h3>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-900 text-xs text-slate-300 border border-slate-800 rounded-lg px-2 py-1 outline-none focus:border-rose-500"
            >
              <option value="all">همه خطاها</option>
              <option value="unresolved">حل‌نشده‌ها</option>
              <option value="critical">فقط Critical</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
                هیچ خطایی طبق فیلتر انتخابی یافت نشد.
              </div>
            ) : (
              filteredLogs.map((err) => {
                const isSelected = selectedError?.id === err.id;
                return (
                  <div
                    key={err.id}
                    onClick={() => setSelectedError(err)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-slate-900 border-rose-500/60 shadow-lg ring-1 ring-rose-500/30' 
                        : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                        err.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        err.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {err.type}
                      </span>

                      {err.isPatched ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCheck className="w-3 h-3" />
                          <span>اصلاح شده</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>در انتظار پچ</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 font-medium line-clamp-2 dir-ltr text-left font-mono mb-2">
                      {err.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <span className="truncate max-w-[180px] text-slate-400 font-mono" title={err.file}>
                        {err.file.split('/').pop()}:{err.line}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(err.timestamp).toLocaleTimeString('fa-IR')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Error Diagnostic Detail & Auto-Patch (8 cols) */}
        <div className="lg:col-span-8">
          {selectedError ? (
            <div className="space-y-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedError.id}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      بخش: {selectedError.sourceComponent}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white font-mono dir-ltr text-left mt-2">
                    {selectedError.message}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAnalyzeErrorWithAi(selectedError.id)}
                    disabled={isAnalyzing}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className={`w-4 h-4 text-purple-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'در حال تحلیل...' : 'تحلیل مجدد با AI'}</span>
                  </button>

                  {!selectedError.isPatched && (
                    <button
                      onClick={() => handleApplyPatch(selectedError.id)}
                      disabled={isApplyingPatch}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className={`w-4 h-4 text-emerald-200 ${isApplyingPatch ? 'animate-bounce' : ''}`} />
                      <span>{isApplyingPatch ? 'در حال اعمال پچ...' : 'اجرای پچ اتوماتیک (1-Click)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Success Notification Banner */}
              {patchSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{patchSuccessMsg}</span>
                </div>
              )}

              {/* AI Explanation in Persian */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>تحلیل روان فارسی و علت ریشه‌ای خطا (توسط موتور عصبی محلی):</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedError.explanationFa}
                </p>
                <div className="pt-2 border-t border-purple-500/10 text-xs text-purple-200 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">راهکار پیشنهادی:</span>
                  <span>{selectedError.fixSummaryFa}</span>
                </div>
              </div>

              {/* Code Diff Box: Original vs Patch Suggested */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-rose-400" />
                    <span>مقارنه کد قبلی و پچ اصلاح‌شده پیشنهادی (Code Diff Patch):</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedError.file} (خط {selectedError.line})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dir-ltr text-left font-mono text-xs">
                  
                  {/* Original Code */}
                  <div className="rounded-xl border border-rose-500/30 bg-slate-950 overflow-hidden">
                    <div className="bg-rose-950/40 px-3 py-1.5 border-b border-rose-500/20 text-rose-400 font-bold text-[11px] flex items-center justify-between">
                      <span>کد دارای خطا (Original Code)</span>
                      <span className="text-[10px] text-rose-400/80">خطادار</span>
                    </div>
                    <pre className="p-3 text-rose-200/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                      {selectedError.codeSnippetOriginal}
                    </pre>
                  </div>

                  {/* Patch Suggested Code */}
                  <div className="rounded-xl border border-emerald-500/30 bg-slate-950 overflow-hidden">
                    <div className="bg-emerald-950/40 px-3 py-1.5 border-b border-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-between">
                      <span>کد ایمن‌سازی شده پچ (Auto-Fixed Patch)</span>
                      <span className="text-[10px] text-emerald-400/80">ایمن و بهینه</span>
                    </div>
                    <pre className="p-3 text-emerald-200/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                      {selectedError.patchSuggested}
                    </pre>
                  </div>

                </div>
              </div>

              {/* Stack Trace Box */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>ردیابی استک استریس PHP (Stack Trace Log):</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 dir-ltr text-left overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedError.stackTrace}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-sm">
              جهت مشاهده جزئیات و پچ اتوماتیک، یک خطا از فهرست سمت راست انتخاب کنید.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
