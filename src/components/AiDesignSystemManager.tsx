import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  FileCode, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Type, 
  Box, 
  RefreshCw, 
  Code2, 
  Terminal, 
  ExternalLink,
  Zap,
  Globe,
  SlidersHorizontal,
  Layout,
  CheckSquare
} from 'lucide-react';

export const AiDesignSystemManager: React.FC = () => {
  const [tokens, setTokens] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('مدرن و لوکس ایرانی با کنتراست فوق‌العاده برای فروشگاه آنلاین');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [exportedCss, setExportedCss] = useState<string | null>(null);
  const [customizerPhp, setCustomizerPhp] = useState<string | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedPhp, setCopiedPhp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'export_css' | 'customizer_php'>('editor');

  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/design-system/tokens');
      const data = await res.json();
      if (data.success) {
        setTokens(data.tokens);
      }
    } catch (e) {
      console.error('Failed to load design system tokens', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/design-system/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: aiPrompt })
      });
      const data = await res.json();
      if (data.success) {
        setTokens(data.tokens);
        showToast('توکن‌های دیزاین با موفقیت توسط هوش مصنوعی بازتولید شد.');
      }
    } catch (e) {
      console.error('Failed AI design system generation', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleExportCss = async () => {
    try {
      const res = await fetch('/api/design-system/export-css', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens })
      });
      const data = await res.json();
      if (data.success) {
        setExportedCss(data.cssContent);
        setActiveTab('export_css');
        showToast('فایل theme-tokens.css با موفقیت تولید و ذیل قالب فرزند ذخیره گردید.');
      }
    } catch (e) {
      console.error('Failed to export CSS tokens', e);
    }
  };

  const handleSyncCustomizer = async () => {
    try {
      const res = await fetch('/api/design-system/sync-customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens })
      });
      const data = await res.json();
      if (data.success) {
        setCustomizerPhp(data.phpSnippet);
        setActiveTab('customizer_php');
        showToast('کدهای WordPress Customizer API آماده درج در functions.php گردید.');
      }
    } catch (e) {
      console.error('Failed to sync Customizer API', e);
    }
  };

  const copyToClipboard = (text: string, type: 'css' | 'php') => {
    navigator.clipboard.writeText(text);
    if (type === 'css') {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2500);
    } else {
      setCopiedPhp(true);
      setTimeout(() => setCopiedPhp(false), 2500);
    }
  };

  const updateColorToken = (key: string, value: string) => {
    setTokens((prev: any) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  if (isLoading || !tokens) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">در حال بارگذاری توکن‌های دیزاین سیستم سیستم...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                مدیریت توکن‌های دیزاین سیستم وردپرس
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                AiDesignSystemManager v2.4
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              استخراج مستقیم توکن‌های طراحی به فایل CSS مستقل (پایدار در تغییر قالب فرزند و هماهنگ با Customizer API)
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              تولید یکپارچه متغیرهای CSS `:root` برای رنگ‌ها، تایپوگرافی، انحناها و سایه‌ها با قابلیت ذخیره در `theme-tokens.css` و همگام‌سازی مستقیم با سفارشی‌سازی وردپرس.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCss}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              خروجی فایل theme-tokens.css
            </button>
            <button
              onClick={handleSyncCustomizer}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              اتصال به Customizer API
            </button>
          </div>
        </div>
      </div>

      {/* AI Token Generator Prompt Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>تولید هوشمند پالت رنگ و توکن‌های دیزاین با AI:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="توصیف سبک بصری (مثلاً: مینیمال فروشگاهی با رنگ‌های طلایی و مشکی)"
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isAiGenerating}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-md shrink-0"
          >
            {isAiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            تولید توکن‌های دیزاین
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'editor'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          ویرایش توکن‌ها (Token Editor)
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-4 h-4" />
          پیش‌نمایش زنده کامپوننت‌ها (Live Sandbox)
        </button>

        <button
          onClick={() => {
            if (!exportedCss) handleExportCss();
            setActiveTab('export_css');
          }}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'export_css'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          فایل CSS خروجی (theme-tokens.css)
        </button>

        <button
          onClick={() => {
            if (!customizerPhp) handleSyncCustomizer();
            setActiveTab('customizer_php');
          }}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === 'customizer_php'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          کد Customizer API
        </button>
      </div>

      {/* TAB 1: Token Editor */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Color Tokens Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="w-5 h-5 text-indigo-400" />
              توکن‌های پالت رنگ (Color Tokens)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(tokens.colors).map(([key, val]) => (
                <div key={key} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-300 font-mono font-bold block">{key}</span>
                    <span className="text-[10px] text-slate-500 font-mono">--kamva-color-{key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={val as string}
                      onChange={(e) => updateColorToken(key, e.target.value)}
                      className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={val as string}
                      onChange={(e) => updateColorToken(key, e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-mono rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Spacing Tokens Panel */}
          <div className="space-y-6">

            {/* Typography */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Type className="w-5 h-5 text-emerald-400" />
                توکن‌های تایپوگرافی (Typography Tokens)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">فونت اصلی (Base Font Family):</label>
                  <input
                    type="text"
                    value={tokens.typography.fontFamilyBase}
                    onChange={(e) => setTokens({ ...tokens, typography: { ...tokens.typography, fontFamilyBase: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">فونت عناوین (Heading Font Family):</label>
                  <input
                    type="text"
                    value={tokens.typography.fontFamilyHeading}
                    onChange={(e) => setTokens({ ...tokens, typography: { ...tokens.typography, fontFamilyHeading: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Border Radius & Shadows */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Box className="w-5 h-5 text-amber-400" />
                انحنا و شعاع باکسباکس (Border Radius Tokens)
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(tokens.borderRadius).map(([key, val]) => (
                  <div key={key} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-1">
                    <span className="text-slate-300 font-mono text-[11px] block">{key}</span>
                    <input
                      type="text"
                      value={val as string}
                      onChange={(e) => setTokens({ ...tokens, borderRadius: { ...tokens.borderRadius, [key]: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 font-mono rounded px-2 py-1 text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Live Sandbox Preview */}
      {activeTab === 'preview' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Layout className="w-5 h-5 text-indigo-400" />
            پیش‌نمایش زنده کامپوننت‌های وردپرس بر اساس توکن‌های فعال
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* UI Components Card */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 font-sans">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">دکمه‌ها و عناصر تعاملی</h4>

              <div className="flex flex-wrap gap-3">
                <button
                  style={{
                    backgroundColor: tokens.colors.primary,
                    borderRadius: tokens.borderRadius.radiusMd,
                    color: '#ffffff'
                  }}
                  className="px-5 py-2.5 font-bold text-xs shadow-md transition hover:opacity-90"
                >
                  دکمه اصلی (Primary)
                </button>

                <button
                  style={{
                    backgroundColor: tokens.colors.secondary,
                    borderRadius: tokens.borderRadius.radiusMd,
                    color: '#ffffff'
                  }}
                  className="px-5 py-2.5 font-bold text-xs shadow-md transition hover:opacity-90"
                >
                  دکمه مکمل (Secondary)
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">کارت محصول ووکامرس</h4>
                <div
                  style={{
                    backgroundColor: tokens.colors.backgroundCard,
                    borderColor: tokens.colors.surfaceBorder,
                    borderRadius: tokens.borderRadius.radiusLg,
                  }}
                  className="border p-4 space-y-3 shadow-lg"
                >
                  <span
                    style={{ backgroundColor: `${tokens.colors.primary}20`, color: tokens.colors.primary }}
                    className="px-2.5 py-1 rounded text-[11px] font-bold inline-block"
                  >
                    پیشنهاد ویژه کاموا پرو
                  </span>
                  <h5 className="text-sm font-bold text-white">قالب اختصاصی کامواوب پرو v4.3</h5>
                  <p className="text-xs text-slate-400">طراحی شیک با بالاترین سرعت لود و هماهنگ با WooCommerce.</p>
                </div>
              </div>
            </div>

            {/* Typography Scale Preview */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 font-sans">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">تایپوگرافی و عناوین</h4>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white">عنوان اصلی H1 (32px)</h1>
                <h2 className="text-xl font-bold text-slate-200">عنوان زیرمجموعه H2 (24px)</h2>
                <h3 className="text-base font-semibold text-indigo-400">تیتر بخش H3 (18px)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  متن بدنه استاندارد با فونت Vazirmatn و خوانایی بالا در کلیه دستگاه‌ها.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Compiled theme-tokens.css */}
      {activeTab === 'export_css' && exportedCss && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" />
              محتوای کامل theme-tokens.css (آماده ذخیره در قالب اصلی و فرزند):
            </span>
            <button
              onClick={() => copyToClipboard(exportedCss, 'css')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              {copiedCss ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              کپی کامل کدهای CSS
            </button>
          </div>

          <pre className="text-xs text-slate-300 max-h-96 overflow-y-auto leading-relaxed select-text font-mono bg-slate-900 p-4 rounded-xl">
            {exportedCss}
          </pre>
        </div>
      )}

      {/* TAB 4: WordPress Customizer API PHP Snippet */}
      {activeTab === 'customizer_php' && customizerPhp && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-indigo-400 font-bold flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              کدهای PHP یکپارچه‌سازی با WordPress Customizer API:
            </span>
            <button
              onClick={() => copyToClipboard(customizerPhp, 'php')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              {copiedPhp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              کپی کدهای PHP
            </button>
          </div>

          <pre className="text-xs text-cyan-300 max-h-96 overflow-y-auto leading-relaxed select-text font-mono bg-slate-900 p-4 rounded-xl">
            {customizerPhp}
          </pre>
        </div>
      )}

    </div>
  );
};
