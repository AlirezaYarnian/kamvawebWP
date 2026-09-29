import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Workflow, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Database, 
  Image as ImageIcon, 
  Search, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';

export const AiWorkflowAutomator: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<string>('Connecting...');
  const [isRunningId, setIsRunningId] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows/action-scheduler');
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.workflows);
        setSchedulerStatus(data.actionSchedulerStatus);
      }
    } catch (e) {
      console.error('Failed to load workflows', e);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleExecuteWorkflow = async (workflowId: string) => {
    setIsRunningId(workflowId);
    try {
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      });
      const data = await res.json();
      if (data.success) {
        setExecutionLogs([data.executionLog, ...executionLogs]);
      }
    } catch (e) {
      console.error('Execution failed', e);
    } finally {
      setIsRunningId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                اتوماسیون جریان کاری وردپرس
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                Action Scheduler API
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AiWorkflowAutomator — جریان‌های کاری گره‌ای و تعمیر و نگهداری خودکار
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              مدیریت و اجرای وظایف دوره‌ای تعمیر و نگهداری مانند پاکسازی دیتابیس، چرخه بهینه‌سازی تصاویر و پایش سئو از طریق هسته Action Scheduler وردپرس.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {schedulerStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Node Workflow Representation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>معماری گره‌ای اتوماسیون (Trigger ➔ Action ➔ Log)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">مرحله ۱: تریگر (Trigger)</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="font-bold text-white text-sm">زمان‌بندی و رویداد</h4>
            <p className="text-xs text-slate-400">اجرای دوره‌ای بر اساس ساعت، روز یا رویدادهای خاص وردپرس (Action Scheduler)</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold">مرحله ۲: پردازش هوشمند (Action)</span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-bold text-white text-sm">عملیات نگهداری و بهینه‌سازی</h4>
            <p className="text-xs text-slate-400">پاکسازی Transients، تبدیل WebP تصاویر و بررسی سئو بدون وقفه در پرفورمنس</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">مرحله ۳: گزارش و تست (Log)</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-sm">ثبت نتیجه و پایش سلامت</h4>
            <p className="text-xs text-slate-400">ثبت جزئیات پردازش، تعداد اقلام اصلاح‌شده و گزارش‌های سلامت خودکار سیستم</p>
          </div>

        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">جریان‌های کاری فعال در Action Scheduler</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <div 
              key={wf.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold font-mono">
                    {wf.trigger}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
                    فعال
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base">{wf.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{wf.action}</p>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span>آخرین اجرا:</span>
                    <span className="text-slate-200">{wf.lastRun}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>اجرای بعدی:</span>
                    <span className="text-indigo-300">{wf.nextRun}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExecuteWorkflow(wf.id)}
                disabled={isRunningId === wf.id}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isRunningId === wf.id ? 'animate-spin' : ''}`} />
                <span>{isRunningId === wf.id ? 'در حال اجرای فوری...' : 'اجرای فوری (Run Now)'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs */}
      {executionLogs.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>گزارش زنده اجرای Action Scheduler</span>
          </h3>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
            {executionLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>هوک: <strong className="text-indigo-300">{log.hook}</strong></span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>اقلام پردازش‌شده: <strong className="text-emerald-400">{log.itemsProcessed}</strong></span>
                  <span>زمان: {log.durationMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
