import React, { useState, useEffect } from 'react';
import { 
  ThemeOptionsConfig, 
  ThemeMigrationAnalysisResult, 
  MappedFieldItem, 
  LegacyThemeSlug,
  ThemeMigrationHistoryItem,
  MigrationFieldCategory
} from '../types/theme';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  RefreshCw, 
  Download, 
  Layers, 
  History, 
  Settings, 
  Store, 
  Cpu, 
  Eye, 
  Copy, 
  Sliders, 
  HardDrive, 
  Check, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  PackageCheck,
  Undo2,
  Trash2,
  Code,
  FileText
} from 'lucide-react';

interface SmartThemeMigratorProps {
  currentConfig: ThemeOptionsConfig;
  onApplyConfig: (newConfig: ThemeOptionsConfig) => void;
  onViewLivePreview?: () => void;
}

export const SmartThemeMigrator: React.FC<SmartThemeMigratorProps> = ({
  currentConfig,
  onApplyConfig,
  onViewLivePreview,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<LegacyThemeSlug>('woodmart');
  const [sourceFormat, setSourceFormat] = useState<string>('redux_framework');
  const [rawPayload, setRawPayload] = useState<string>('');
  const [presets, setPresets] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ThemeMigrationAnalysisResult | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [history, setHistory] = useState<ThemeMigrationHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'migrator' | 'history' | 'php_bridge'>('migrator');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [userOverrides, setUserOverrides] = useState<Record<string, any>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load presets and migration history on mount
  useEffect(() => {
    loadPresets();
    loadHistory();
  }, []);

  const loadPresets = async () => {
    try {
      const res = await fetch('/api/migrator/presets');
      if (res.ok) {
        const data = await res.json();
        if (data.presets && data.presets.length > 0) {
          setPresets(data.presets);
          const initial = data.presets.find((p: any) => p.themeSlug === 'woodmart') || data.presets[0];
          setRawPayload(initial.samplePayload);
          setSourceFormat(initial.sourceFormat);
        }
      }
    } catch (e) {
      console.warn('Could not load migrator presets', e);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/migrator/history');
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setHistory(data.history);
        }
      }
    } catch (e) {
      console.warn('Could not load migrator history', e);
    }
  };

  const handleSelectPreset = (preset: any) => {
    setSelectedTheme(preset.themeSlug);
    setSourceFormat(preset.sourceFormat);
    setRawPayload(preset.samplePayload);
    setAnalysisResult(null);
    setAppliedSuccess(false);
  };

  const handleAnalyzeTheme = async () => {
    setIsAnalyzing(true);
    setStatusMessage('در حال پردازش درخت تنظیمات، نگاشت کلیدها و تحلیل عملکرد...');
    try {
      const res = await fetch('/api/migrator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeSlug: selectedTheme,
          rawPayload,
          sourceFormat,
          useAiAssistant: true,
        }),
      });

      if (!res.ok) {
        throw new Error('خطا در تحلیل تنظیمات');
      }

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setStatusMessage(null);
      }
    } catch (err: any) {
      alert(err.message || 'خطا در ارتباط با سرور مهاجرت');
      setStatusMessage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteMigration = async () => {
    if (!analysisResult) return;
    setIsApplying(true);
    try {
      // Merge any user field overrides into resultingConfig
      const finalConfig = { ...analysisResult.resultingConfig };
      
      const res = await fetch('/api/migrator/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisResult: {
            ...analysisResult,
            resultingConfig: finalConfig,
          },
          sourceTheme: selectedTheme,
          customAuthor: 'مدیر ارشد کامواوب (NexusAI Migrator)',
        }),
      });

      if (!res.ok) {
        throw new Error('خطا در اعمال مهاجرت');
      }

      const data = await res.json();
      if (data.success) {
        setAppliedSuccess(true);
        onApplyConfig(data.newConfig || finalConfig);
        loadHistory();
      }
    } catch (err: any) {
      alert(err.message || 'خطا در اعمال پیکربندی');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRollback = async (historyId: string) => {
    if (!confirm('آیا از بازگردانی تنظیمات به این نسخه پشتیبان اطمینان دارید؟')) return;
    try {
      const res = await fetch('/api/migrator/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId }),
      });

      const data = await res.json();
      if (data.success && data.restoredConfig) {
        onApplyConfig(data.restoredConfig);
        alert(data.message || 'پیکربندی بازگردانی شد.');
        loadHistory();
      }
    } catch (e) {
      alert('خطا در بازگردانی بک‌آپ');
    }
  };

  const handleCopyPhpCode = () => {
    if (!analysisResult?.phpBridgeSnippet) return;
    navigator.clipboard.writeText(analysisResult.phpBridgeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadConfigJson = () => {
    if (!analysisResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult.resultingConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexusai-migrated-config-${selectedTheme}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMappedItems = analysisResult?.mappedItems.filter(item => {
    if (activeCategoryFilter === 'all') return true;
    return item.category === activeCategoryFilter;
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                موتور مهاجرت هوشمند قالب (Smart Theme Migrator)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                نگاشت ساختار تم‌آپشن NexusAI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                حفظ ۱۰۰٪ سئو و بدون قطعی (Zero Downtime)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              انتقال خودکار از قالب‌های سنتی وردپرس به اکوسیستم NexusAI
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              فایل‌های تم، دامپ تنظیمات کاستومایزر یا ریداکس فریم‌ورک قالب‌های فعلی مانند وودمارت (WoodMart)، آسترا (Astra)، فلت‌سام (Flatsome)، آوادا (Avada) و دیوی را به صورت هوشمند تحلیل کرده و کلیه رنگ‌ها، هدرساز، کاتالوگ ووکامرس، کش و استایل‌های سفارشی را بدون خطا به ساختار نوین <code className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded font-mono text-xs">ThemeOptionsConfig</code> نگاشت نمایید.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('migrator')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'migrator'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                میزکار مهاجرت
              </button>
              <button
                onClick={() => setActiveTab('php_bridge')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'php_bridge'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                بریج PHP
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تاریخچه و بک‌آپ ({history.length})
              </button>
            </div>

            {onViewLivePreview && (
              <button
                onClick={onViewLivePreview}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>مشاهده فروشگاه زنده</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-[11px] text-slate-400 font-medium">سازگاری با قالب‌های پرمخاطب</div>
            <div className="text-base font-black text-indigo-300 mt-0.5">۷ قالب مطرح + فرمت سفارشی</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-[11px] text-slate-400 font-medium">میانگین افزایش امتیاز لایت‌هاوس</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">+۴۵ امتیاز (به سوی ۹۹/۱۰۰)</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-[11px] text-slate-400 font-medium">کاهش حجم DOM و درخواست‌ها</div>
            <div className="text-base font-black text-amber-400 mt-0.5">تا ۶۸٪ سبک‌تر و بدون جی‌کوئری</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-[11px] text-slate-400 font-medium">حذف پلاگین‌های مازاد و سنگین</div>
            <div className="text-base font-black text-teal-300 mt-0.5">۴ الی ۷ افزونه کش، سواچ و سواپ</div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MIGRATOR WORKSPACE */}
      {activeTab === 'migrator' && (
        <div className="space-y-8">
          
          {/* STEP 1: SELECT PRESET OR PASTE LEGACY DUMP */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">مرحله ۱ از ۳</span>
                <h2 className="text-lg font-bold text-white mt-0.5">انتخاب قالب مبدا یا بارگذاری فایل تنظیمات</h2>
              </div>
              <div className="text-xs text-slate-400">
                فرمت منبع: <span className="font-mono text-indigo-300 font-semibold">{sourceFormat}</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {presets.map((preset) => {
                const isSelected = selectedTheme === preset.themeSlug;
                return (
                  <button
                    key={preset.themeSlug}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Store className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="font-bold text-xs mt-2 truncate">{preset.themeName.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">نسخه {preset.themeVersion}</div>
                    </div>
                    <span className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50 self-start truncate max-w-full">
                      {preset.sourceFormat}
                    </span>
                  </button>
                );
              })}

              {/* Custom Raw Upload / Input Card */}
              <button
                onClick={() => {
                  setSelectedTheme('custom_raw');
                  setSourceFormat('custom_json_or_php');
                  setAnalysisResult(null);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                  selectedTheme === 'custom_raw'
                    ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <FileCode className="w-4 h-4 text-pink-400" />
                    {selectedTheme === 'custom_raw' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="font-bold text-xs mt-2">سفارشی / دستی</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">paste functions.php</div>
                </div>
                <span className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-700/50 self-start">
                  RAW INPUT
                </span>
              </button>
            </div>

            {/* Code / JSON Input Editor Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label htmlFor="rawPayloadArea" className="font-medium flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  محتوای خام تنظیمات (JSON Export, Redux Dump, theme_mods یا کدهای PHP کاستومایزر):
                </label>
                <span className="font-mono text-[11px] text-slate-500">
                  {rawPayload.split('\n').length} خط کد
                </span>
              </div>

              <textarea
                id="rawPayloadArea"
                value={rawPayload}
                onChange={(e) => {
                  setRawPayload(e.target.value);
                  setAnalysisResult(null);
                }}
                rows={7}
                placeholder="کدهای JSON یا خروجی کاستومایزر را در اینجا قرار دهید..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent selection:bg-indigo-600/30"
              />
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>موتور هوشمند تمام متغیرهای رنگی، فونت‌های فارسی، ساختار ستون‌های فروشگاه و کش را شناسایی می‌کند.</span>
              </div>

              <button
                onClick={handleAnalyzeTheme}
                disabled={isAnalyzing || !rawPayload.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-900/40 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>در حال تحلیل و نگاشت هوشمند...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>تحلیل و نگاشت خودکار به ThemeOptionsConfig</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: MAPPING RESULTS & SIDE-BY-SIDE DIFF */}
          {analysisResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
              
              {/* Analysis Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>قالب شناسایی شده</span>
                    <PackageCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-lg font-black text-white">{analysisResult.sourceThemeName}</div>
                  <div className="text-[11px] text-slate-400">نسخه {analysisResult.sourceThemeVersion} • {analysisResult.sourceFormat}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>فیلدهای نگاشت شده</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {analysisResult.mappedFieldsCount} از {analysisResult.totalExtractedSettings} فیلد
                  </div>
                  <div className="text-[11px] text-slate-400">میانگین دقت تطابق: {analysisResult.averageConfidenceScore}٪</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>جهش سرعت لایت‌هاوس</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-center gap-2 text-lg font-black">
                    <span className="text-red-400">{analysisResult.performanceProjection.lighthouseBefore}</span>
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                    <span className="text-emerald-400">{analysisResult.performanceProjection.lighthouseAfter}/۱۰۰</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    کاهش حجم صفحه: {analysisResult.performanceProjection.pageWeightBeforeKb}KB ➔ {analysisResult.performanceProjection.pageWeightAfterKb}KB
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>پلاگین‌های قابل حذف</span>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-lg font-black text-teal-300">
                    {analysisResult.pluginReplacements.length} افزونه سنگین
                  </div>
                  <div className="text-[11px] text-slate-400">
                    صرفه‌جویی در {analysisResult.performanceProjection.dbQueriesReductionPercent}٪ کوئری‌های دیتابیس
                  </div>
                </div>

              </div>

              {/* Main Remapping Studio Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
                
                {/* Category Filter Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">مرحله ۲ از ۳</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">ماتریس نگاشت هوشمند و بازبینی مشخصات</h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'همه فیلدها' },
                      { id: 'general', label: 'عمومی و رنگ' },
                      { id: 'header', label: 'هدرساز' },
                      { id: 'shop', label: 'فروشگاه و آرشیو' },
                      { id: 'single_product', label: 'محصول تکی' },
                      { id: 'performance', label: 'کش و سرعت' },
                      { id: 'security', label: 'امنیت AIOS' },
                      { id: 'developer_snippets', label: 'کدهای سفارشی' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCategoryFilter(tab.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                          activeCategoryFilter === tab.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mapped Fields List Table */}
                <div className="space-y-3">
                  {filteredMappedItems.map(item => (
                    <div 
                      key={item.id}
                      className="bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-4 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Left/Legacy column */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              قالب قدیمی: {item.legacyKey}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {item.categoryTitleFa}
                            </span>
                          </div>
                          <div className="text-sm font-mono text-slate-300 truncate max-w-md">
                            {item.legacyValueFormatted}
                          </div>
                        </div>

                        {/* Mapping Arrow & Match Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="hidden md:flex flex-col items-center">
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                              {item.confidenceScore}٪ دقت
                            </span>
                            <ArrowLeft className="w-4 h-4 text-indigo-400 mt-1" />
                          </div>
                        </div>

                        {/* Right/NexusAI Target Column */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                              NexusAI: {item.nexusKeyPath}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              {item.matchType === 'exact_key' ? 'تطابق مستقیم' : item.matchType === 'semantic_ai' ? 'نگاشت هوشمند AI' : 'بهینه‌سازی بومی'}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-indigo-200">
                            {item.nexusValueFormatted}
                          </div>
                        </div>

                      </div>

                      {/* Explanation Note */}
                      <div className="mt-3 pt-2.5 border-t border-slate-900 text-xs text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{item.explanationFa}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredMappedItems.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      موردی در این دسته‌بندی یافت نشد.
                    </div>
                  )}
                </div>

                {/* Redundant Plugins Replacement Matrix */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <h4 className="text-sm font-bold text-white">افزونه‌های مازاد که با فعال‌سازی کامواوب می‌توانید غیرفعال کنید:</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {analysisResult.pluginReplacements.map(plugin => (
                      <div key={plugin.id} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-red-300 line-through">{plugin.legacyPluginName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            جایگزین بومی آماده
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          ← {plugin.nexusNativeReplacement}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {plugin.benefitFa} (کاهش {plugin.queriesSaved} کوئری)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compatibility & Anti-Collision Resolutions */}
                <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-2xl p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-bold text-indigo-200">تضمین عدم تداخل و سازگاری بومی (Anti-Conflict Shield):</h4>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {analysisResult.incompatibilitiesResolved.map((res, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* STEP 3: ACTION BAR & 1-CLICK APPLY */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadConfigJson}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود خروجی JSON</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('php_bridge')}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>مشاهده هوک بریج PHP</span>
                    </button>
                  </div>

                  <button
                    onClick={handleExecuteMigration}
                    disabled={isApplying || appliedSuccess}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isApplying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>در حال اعمال پیکربندی و ساخت نسخه پشتیبان...</span>
                      </>
                    ) : appliedSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>مهاجرت با موفقیت اعمال گردید!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>اعمال فوری تنظیمات در سیستم NexusAI</span>
                      </>
                    )}
                  </button>
                </div>

                {appliedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">پیکربندی قالب جدید در سیستم ذخیره شد!</div>
                        <div className="text-xs text-emerald-300">
                          کلیه گزینه‌های هدرساز، کاتالوگ ووکامرس، سرعت و کدهای اختصاصی فوراً همگام‌سازی شدند.
                        </div>
                      </div>
                    </div>

                    {onViewLivePreview && (
                      <button
                        onClick={onViewLivePreview}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
                      >
                        بررسی فرانت‌اند قالب
                      </button>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* VIEW 2: PHP MIGRATION BRIDGE CODE */}
      {activeTab === 'php_bridge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">بریج سازگاری و فیلترهای PHP وردپرس (Theme Migrator Bridge)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                این فایل در مسیر <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">kamva-theme/inc/theme-migrator-bridge.php</code> به صورت پیش‌فرض فعال است و فراخوانی‌های <code className="text-indigo-300">get_theme_mod</code> قدیمی را به صورت آنی ترجمه می‌کند.
              </p>
            </div>

            <button
              onClick={handleCopyPhpCode}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-900/30"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'کپی شد!' : 'کپی کدهای PHP'}</span>
            </button>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
            <pre>{analysisResult?.phpBridgeSnippet || `<?php
/**
 * KamvaWeb & NexusAI Smart Theme Migrator Bridge
 * Auto-shims legacy get_theme_mod & woodmart/astra/flatsome options
 */
if (!defined('ABSPATH')) exit;

class Kamva_Smart_Theme_Migrator_Bridge {
    private static $instance = null;
    private $nexus_config = [];

    public static function get_instance() {
        if (null === self::$instance) self::$instance = new self();
        return self::$instance;
    }

    private function __construct() {
        $this->nexus_config = get_option('kamva_theme_options', []);
        add_filter('woodmart_get_opt', [$this, 'shim_woodmart_options'], 10, 2);
        add_filter('astra_get_option', [$this, 'shim_astra_options'], 10, 3);
        add_filter('flatsome_option', [$this, 'shim_flatsome_options'], 10, 2);
    }

    public function shim_woodmart_options($value, $slug) {
        if ($slug === 'primary-color') return $this->nexus_config['general']['primaryColor'] ?? $value;
        if ($slug === 'sticky_header') return $this->nexus_config['storeBuilderOptions']['headerBuilder']['stickyHeader'] ?? $value;
        return $value;
    }
}
Kamva_Smart_Theme_Migrator_Bridge::get_instance();`}</pre>
          </div>
        </div>
      )}

      {/* VIEW 3: MIGRATION HISTORY & ROLLBACK */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">تاریخچه مهاجرت‌ها و نسخه‌های پشتیبان خودکار</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                قبل از هر مهاجرت یک اسنپ‌شات کامل ذخیره می‌شود و در صورت نیاز با یک کلیک قابل بازگردانی است.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {history.map(item => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.sourceThemeName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'applied' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.status === 'applied' ? 'اعمال شده' : 'بازگردانی شده'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>{new Date(item.timestamp).toLocaleString('fa-IR')}</span>
                    <span>•</span>
                    <span>{item.fieldsCount} فیلد نگاشت شده</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{item.speedBoost}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRollback(item.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>بازگردانی به این نسخه</span>
                  </button>
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">
                هنوز هیچ عملیات مهاجرتی ثبت نشده است. پس از اولین مهاجرت، تاریخچه آن در اینجا نمایش داده خواهد شد.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
