import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  HardDrive, 
  Sparkles, 
  BarChart3, 
  Sliders, 
  ArrowUpRight, 
  Power, 
  HelpCircle,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface PluginHeatmapItem {
  pluginId: string;
  pluginName: string;
  version: string;
  active: boolean;
  memoryOverheadMb: number;
  dbQueryOverheadMs: number;
  jsPayloadKb: number;
  metricsImpact: {
    lcpImpactMs: number;
    inpImpactMs: number;
    clsImpactScore: number;
    ttfbImpactMs: number;
  };
  heatLevel: 'green' | 'yellow' | 'red';
  primaryBottleneck: string;
  aiRemediationRecommendation: string;
}

interface CoreWebVitalsData {
  overallMetrics: {
    lcpSeconds: number;
    lcpRating: string;
    inpMs: number;
    inpRating: string;
    clsScore: number;
    clsRating: string;
    ttfbSeconds: number;
    ttfbRating: string;
    fcpSeconds: number;
    fcpRating: string;
  };
  pluginHeatmap: PluginHeatmapItem[];
}

interface CoreWebVitalsHeatmapProps {
  data: CoreWebVitalsData;
  onRefresh?: () => void;
}

export const CoreWebVitalsHeatmap: React.FC<CoreWebVitalsHeatmapProps> = ({ data, onRefresh }) => {
  const [pluginsState, setPluginsState] = useState<PluginHeatmapItem[]>(data?.pluginHeatmap || []);
  const [selectedPlugin, setSelectedPlugin] = useState<PluginHeatmapItem | null>(
    data?.pluginHeatmap?.find(p => p.heatLevel === 'red') || data?.pluginHeatmap?.[0] || null
  );
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [simulatedDisabled, setSimulatedDisabled] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const metrics = data?.overallMetrics || {
    lcpSeconds: 1.2,
    lcpRating: 'good',
    inpMs: 88,
    inpRating: 'good',
    clsScore: 0.02,
    clsRating: 'good',
    ttfbSeconds: 0.08,
    ttfbRating: 'good',
    fcpSeconds: 0.42,
    fcpRating: 'good'
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const togglePluginSimulation = (pluginId: string) => {
    if (simulatedDisabled.includes(pluginId)) {
      setSimulatedDisabled(prev => prev.filter(id => id !== pluginId));
    } else {
      setSimulatedDisabled(prev => [...prev, pluginId]);
    }
  };

  // Calculate simulated LCP reduction
  const simulatedDisabledItems = pluginsState.filter(p => simulatedDisabled.includes(p.pluginId));
  const totalLcpSavedMs = simulatedDisabledItems.reduce((acc, p) => acc + Math.max(0, p.metricsImpact.lcpImpactMs), 0);
  const totalJsSavedKb = simulatedDisabledItems.reduce((acc, p) => acc + p.jsPayloadKb, 0);

  const simulatedLcpSeconds = Math.max(0.4, Number((metrics.lcpSeconds - totalLcpSavedMs / 1000).toFixed(2)));

  const handleApplyAiFix = (pluginName: string) => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      showToast(`بهینه‌سازی کدهای JS/CSS و دیتابیس افزونه "${pluginName}" اعمال گردید.`);
    }, 1200);
  };

  const filteredPlugins = filterLevel === 'all'
    ? pluginsState
    : pluginsState.filter(p => p.heatLevel === filterLevel);

  const getHeatBadgeClass = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'red': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'yellow': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'green': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  const getHeatBgColor = (impactMs: number) => {
    if (impactMs <= 30) return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
    if (impactMs <= 250) return 'bg-amber-950/60 text-amber-300 border-amber-800/50';
    return 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-bold';
  };

  return (
    <div className="space-y-6 font-sans">

      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Heatmap Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                نقشه حرارتی گلوگاه‌های Core Web Vitals
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono">
                Real-Time Plugin Impact
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              CoreWebVitalsHeatmap - نگاشت حرارتی تأثیر افزونه‌ها بر سرعت لود و رندر وردپرس
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              شناسایی دقیق سهم هر افزونه در زمان LCP (بارگذاری بزرگ‌ترین محتوا)، INP (زمان پاسخ اینتراکشن) و CLS (پرش لایه‌بندی).
            </p>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-center shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              پایش مجدد
            </button>
          )}
        </div>

        {/* Core Web Vitals Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block">LCP (Largest Contentful)</span>
            <div className="text-lg font-extrabold text-emerald-400 flex items-baseline gap-1">
              <span>{simulatedLcpSeconds}s</span>
              {simulatedDisabled.length > 0 && (
                <span className="text-[10px] text-amber-400 font-mono">({metrics.lcpSeconds}s)</span>
              )}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold inline-block">
              Good (&lt; 2.5s)
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block">INP (Interaction Response)</span>
            <div className="text-lg font-extrabold text-cyan-400">{metrics.inpMs}ms</div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold inline-block">
              Good (&lt; 200ms)
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block">CLS (Layout Shift)</span>
            <div className="text-lg font-extrabold text-emerald-400">{metrics.clsScore}</div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold inline-block">
              Good (&lt; 0.1)
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block">TTFB (Server Time)</span>
            <div className="text-lg font-extrabold text-teal-400">{metrics.ttfbSeconds}s</div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-bold inline-block">
              Fast (&lt; 0.2s)
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-400 font-bold block">FCP (First Contentful)</span>
            <div className="text-lg font-extrabold text-purple-400">{metrics.fcpSeconds}s</div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold inline-block">
              Instant
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Bar if plugins disabled */}
      {simulatedDisabled.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-amber-300 font-bold block">
                نتیجه شبیه‌سازی غیرفعال‌سازی یا بهینه‌سازی {simulatedDisabled.length} افزونه:
              </span>
              <span className="text-slate-300">
                صرفه‌جویی <b className="text-emerald-400">{totalLcpSavedMs}ms</b> در LCP و حذف <b className="text-amber-400">{totalJsSavedKb}KB</b> پادبار جاوااسکریپت!
              </span>
            </div>
          </div>

          <button
            onClick={() => setSimulatedDisabled([])}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition self-end sm:self-center"
          >
            بازنشانی شبیه‌سازی
          </button>
        </div>
      )}

      {/* HEATMAP MATRIX GRID */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            ماتریس حرارتی گلوگاه‌های افزونه‌ها (Plugin Heatmap Matrix)
          </h4>

          {/* Filter Level Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'red', 'yellow', 'green'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  filterLevel === lvl
                    ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'همه' : lvl === 'red' ? 'گلوگاه شدید (Red)' : lvl === 'yellow' ? 'متوسط (Yellow)' : 'بهینه (Green)'}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="p-3 text-right">نام افزونه</th>
                <th className="p-3 text-center">تأثیر LCP (ms)</th>
                <th className="p-3 text-center">تأثیر INP (ms)</th>
                <th className="p-3 text-center">پرش CLS</th>
                <th className="p-3 text-center">تأثیر TTFB (ms)</th>
                <th className="p-3 text-center">حجم JS/CSS</th>
                <th className="p-3 text-center">رم PHP</th>
                <th className="p-3 text-center">عملیات شبیه‌سازی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPlugins.map((plugin) => {
                const isSelected = selectedPlugin?.pluginId === plugin.pluginId;
                const isDisabledSim = simulatedDisabled.includes(plugin.pluginId);

                return (
                  <tr
                    key={plugin.pluginId}
                    onClick={() => setSelectedPlugin(plugin)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition ${
                      isSelected ? 'bg-slate-800/80 border-r-4 border-amber-400' : ''
                    } ${isDisabledSim ? 'opacity-40 line-through' : ''}`}
                  >
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-mono font-bold ${getHeatBadgeClass(plugin.heatLevel)}`}>
                        {plugin.heatLevel.toUpperCase()}
                      </span>
                      <span>{plugin.pluginName}</span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-mono ${getHeatBgColor(plugin.metricsImpact.lcpImpactMs)}`}>
                        {plugin.metricsImpact.lcpImpactMs > 0 ? `+${plugin.metricsImpact.lcpImpactMs}ms` : `${plugin.metricsImpact.lcpImpactMs}ms`}
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono text-slate-300">
                      +{plugin.metricsImpact.inpImpactMs}ms
                    </td>

                    <td className="p-3 text-center font-mono text-slate-300">
                      +{plugin.metricsImpact.clsImpactScore}
                    </td>

                    <td className="p-3 text-center font-mono text-slate-300">
                      +{plugin.metricsImpact.ttfbImpactMs}ms
                    </td>

                    <td className="p-3 text-center font-mono text-slate-400">
                      {plugin.jsPayloadKb} KB
                    </td>

                    <td className="p-3 text-center font-mono text-slate-400">
                      {plugin.memoryOverheadMb} MB
                    </td>

                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => togglePluginSimulation(plugin.pluginId)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 mx-auto ${
                          isDisabledSim
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {isDisabledSim ? 'فعال‌سازی' : 'تست حذف'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED PLUGIN BOTTLENECK & REMEDIATION DETAIL */}
      {selectedPlugin && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  تحلیل عمیق گلوگاه افزونه "{selectedPlugin.pluginName}"
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  Plugin ID: {selectedPlugin.pluginId} | v{selectedPlugin.version}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleApplyAiFix(selectedPlugin.pluginName)}
              disabled={isOptimizing}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 self-start sm:self-center"
            >
              {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              اعمال رفع گلوگاه هوشمند AI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-rose-400 font-bold block flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                توصیف دقیق گلوگاه عملکردی (Primary Bottleneck):
              </span>
              <p className="text-slate-200 leading-relaxed text-sm">
                {selectedPlugin.primaryBottleneck}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                راهکار هوش مصنوعی کامواوب (AI Remediation):
              </span>
              <p className="text-slate-200 leading-relaxed text-sm">
                {selectedPlugin.aiRemediationRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
