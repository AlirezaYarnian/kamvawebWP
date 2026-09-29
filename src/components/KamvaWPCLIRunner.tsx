import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  RefreshCw, 
  Database, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Clock, 
  Users, 
  Search, 
  Power, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Cpu, 
  HardDrive, 
  Server, 
  Code2, 
  Activity,
  Layers,
  HelpCircle,
  XCircle
} from 'lucide-react';

interface PresetCommand {
  id: string;
  title: string;
  command: string;
  category: string;
  description: string;
  danger: boolean;
}

interface CommandLogItem {
  id: string;
  command: string;
  category: string;
  executedAt: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error';
  output: string;
  executedBy: string;
}

export const KamvaWPCLIRunner: React.FC = () => {
  const [presets, setPresets] = useState<PresetCommand[]>([]);
  const [history, setHistory] = useState<CommandLogItem[]>([]);
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [customCommand, setCustomCommand] = useState('wp ');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // AI Assistant state
  const [aiQuery, setAiQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedCommand: string;
    explanation: string;
    category: string;
    dangerLevel: string;
  } | null>(null);

  // Active terminal logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '================================================================',
    '  KAMVA PRO WP-CLI ENGINE v2.9.0 (PHP 8.2.18 / WP 6.5.2)        ',
    '  System Ready. Type commands or select a preset to execute.   ',
    '================================================================'
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchPresetsAndHistory = async () => {
    try {
      const [presetsRes, historyRes] = await Promise.all([
        fetch('/api/wp-cli/presets'),
        fetch('/api/wp-cli/history')
      ]);
      const presetsData = await presetsRes.json();
      const historyData = await historyRes.json();

      if (presetsData.success) {
        setPresets(presetsData.presets || []);
        setEnvInfo(presetsData.environmentInfo);
      }
      if (historyData.success) {
        setHistory(historyData.history || []);
      }
    } catch (err) {
      console.error('Failed to load WP-CLI data', err);
    }
  };

  useEffect(() => {
    fetchPresetsAndHistory();
  }, []);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, autoScroll]);

  const handleRunCommand = async (cmdToRun: string, category: string = 'Custom') => {
    if (!cmdToRun || isExecuting) return;

    setIsExecuting(true);
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    
    // Append input command to terminal screen
    setTerminalLogs(prev => [
      ...prev,
      `\n[${timestamp}] $ ${cmdToRun}`
    ]);

    try {
      const res = await fetch('/api/wp-cli/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdToRun, category })
      });
      const data = await res.json();

      if (data.success && data.result) {
        const result: CommandLogItem = data.result;
        setTerminalLogs(prev => [
          ...prev,
          result.output,
          `[Completed in ${result.durationMs}ms - Status: ${result.status.toUpperCase()}]`
        ]);
        fetchPresetsAndHistory();
      } else {
        setTerminalLogs(prev => [
          ...prev,
          `ERROR: ${data.error || 'اجرای دستور با خطا مواجه شد.'}`
        ]);
      }
    } catch (err: any) {
      setTerminalLogs(prev => [
        ...prev,
        `FATAL ERROR: ${err.message || 'خطا در ارتباط با سرور'}`
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAiAsk = async () => {
    if (!aiQuery.trim() || isAiThinking) return;

    setIsAiThinking(true);
    try {
      const lastOutputSnippet = terminalLogs.slice(-10).join('\n');
      const res = await fetch('/api/wp-cli/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: aiQuery,
          currentOutput: lastOutputSnippet
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiSuggestion(data);
      }
    } catch (err) {
      console.error('AI assistant failed', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  const copyTerminalText = () => {
    const text = terminalLogs.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIndex('terminal');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const downloadTerminalLog = () => {
    const text = terminalLogs.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wp-cli-execution-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTerminal = () => {
    setTerminalLogs([
      '================================================================',
      '  KAMVA PRO WP-CLI ENGINE v2.9.0 (Terminal Log Cleared)        ',
      '================================================================'
    ]);
  };

  const filteredPresets = activeCategory === 'all' 
    ? presets 
    : presets.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'database': return <Database className="w-4 h-4 text-amber-400" />;
      case 'cache': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-purple-400" />;
      case 'users': return <Users className="w-4 h-4 text-indigo-400" />;
      default: return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                اجراکننده دستورات کنسول WP-CLI
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active CLI Node
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              KamvaWPCLIRunner - مدیریت خط فرمان و اتوماسیون سرور وردپرس
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              اجرای مستقیم دستورات پیشرفته دیتابیس، تخلیه کش ردیس، بررسی یکپارچگی کدهای هسته و بهینه‌سازی جداول بدون نیاز به اتصال SSH.
            </p>
          </div>

          {/* System Specs */}
          {envInfo && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-xl text-xs font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-slate-400">WP-CLI:</div>
                  <div className="text-white font-bold">{envInfo.wpCliVersion}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400">PHP Version:</div>
                  <div className="text-white font-bold">{envInfo.phpVersion}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-400">Memory Limit:</div>
                  <div className="text-white font-bold">{envInfo.memoryLimit}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Controls & Presets / Right Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Panel: Command Presets & Custom Runner (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Custom Command Input */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                ورودی دستور سفارشی WP-CLI
              </h3>
              <span className="text-xs text-slate-400 font-mono">Terminal Exec</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleRunCommand(customCommand); }} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400 font-mono text-sm font-bold">
                  $
                </div>
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="wp db optimize --compact"
                  className="w-full bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-sm rounded-xl pr-9 pl-24 py-3 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={isExecuting || !customCommand.trim()}
                  className="absolute left-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-lg"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  اجرای دستور
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">میانبرهای سریع:</span>
                <button
                  type="button"
                  onClick={() => setCustomCommand('wp cache flush')}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-[11px] transition"
                >
                  wp cache flush
                </button>
                <button
                  type="button"
                  onClick={() => setCustomCommand('wp db optimize')}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-[11px] transition"
                >
                  wp db optimize
                </button>
                <button
                  type="button"
                  onClick={() => setCustomCommand('wp core verify-checksums')}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-[11px] transition"
                >
                  wp core verify-checksums
                </button>
              </div>
            </form>
          </div>

          {/* AI WP-CLI Assistant */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">دستیار هوش مصنوعی WP-CLI Gemini</h4>
                  <p className="text-xs text-slate-400">درخواست خود را به زبان فارسی بنویسید تا دستور دقیق ساخته شود</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                placeholder="مثلاً: چطور آدرس سایت رو از HTTP به HTTPS تغییر بدم؟"
                className="flex-1 bg-slate-950 border border-indigo-500/20 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                onClick={handleAiAsk}
                disabled={isAiThinking || !aiQuery.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md shrink-0"
              >
                {isAiThinking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                تحلیل AI
              </button>
            </div>

            {aiSuggestion && (
              <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4 text-xs space-y-3 font-sans animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    دستور پیشنهادی هوش مصنوعی:
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                    {aiSuggestion.category}
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-300 text-xs flex items-center justify-between" dir="ltr">
                  <span>$ {aiSuggestion.suggestedCommand}</span>
                  <button
                    onClick={() => {
                      setCustomCommand(aiSuggestion.suggestedCommand);
                      handleRunCommand(aiSuggestion.suggestedCommand, aiSuggestion.category);
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-sans font-bold rounded flex items-center gap-1 transition"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    اجرای مستقیم
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {aiSuggestion.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Preset Commands Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                دستورات آماده و بهینه‌سازی سرور
              </h3>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
                {['all', 'Database', 'Cache', 'Security', 'Maintenance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'همه' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 rounded-xl p-3.5 space-y-2.5 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                        {getCategoryIcon(preset.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                          {preset.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {preset.category}
                        </span>
                      </div>
                    </div>

                    {preset.danger && (
                      <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold">
                        تغییر حساس
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2 text-[11px] font-mono text-emerald-400 truncate" dir="ltr">
                    $ {preset.command}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <button
                    onClick={() => handleRunCommand(preset.command, preset.category)}
                    disabled={isExecuting}
                    className="w-full py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    اجرای سریع
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel: Live Terminal Output (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Terminal Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[580px]">
            {/* Terminal Top Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 mr-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  bash - wp-cli@kamva-server
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={copyTerminalText}
                  title="کپی متن ترمینال"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                >
                  {copiedIndex === 'terminal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={downloadTerminalLog}
                  title="دانلود فایل لاگ"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearTerminal}
                  title="پاکسازی خروجی"
                  className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 rounded-lg text-xs transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 select-text bg-[#080c14] text-emerald-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              {terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`whitespace-pre-wrap ${
                    log.startsWith('[') && log.includes('$')
                      ? 'text-cyan-300 font-bold border-t border-slate-800/60 pt-2 mt-2'
                      : log.startsWith('ERROR') || log.startsWith('FATAL')
                      ? 'text-rose-400 font-bold'
                      : log.startsWith('Success') || log.includes('Success:')
                      ? 'text-emerald-300 font-bold'
                      : 'text-slate-300'
                  }`}
                  dir="ltr"
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Footer Info */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Auto-scroll</span>
                </label>
                <span>Lines: {terminalLogs.length}</span>
              </div>
            </div>
          </div>

          {/* Execution History Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                تاریخچه اجراهای اخیر
              </h4>
              <button
                onClick={fetchPresetsAndHistory}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  هیچ سابقه اجرایی ثبت نشده است.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs space-x-2 space-x-reverse hover:border-slate-700 transition"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="font-mono text-emerald-300 font-semibold truncate text-[11px]" dir="ltr">
                        $ {item.command}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{item.executedAt}</span>
                        <span>•</span>
                        <span>{item.durationMs}ms</span>
                        <span>•</span>
                        <span className="text-slate-300">{item.executedBy}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRunCommand(item.command, item.category)}
                      disabled={isExecuting}
                      title="اجرای مجدد"
                      className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
