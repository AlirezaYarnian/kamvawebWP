import React, { useState } from 'react';
import { 
  GitFork, 
  Download, 
  FileCode, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Terminal,
  Copy,
  Check,
  Package
} from 'lucide-react';

export const ChildThemeManager: React.FC = () => {
  const [themeName, setThemeName] = useState('NexusAI Pro Child');
  const [themeSlug, setThemeSlug] = useState('nexusai-pro-child');
  const [description, setDescription] = useState('قالب کودک سفارشی و پرفورمنس بالا برای قالب اختصاصی NexusAI');
  const [author, setAuthor] = useState('KamvaWeb Pro Studio');
  const [parentTemplate, setParentTemplate] = useState('nexusai');
  const [includeCustomizations, setIncludeCustomizations] = useState(true);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [activeFileTab, setActiveFileTab] = useState<'style.css' | 'functions.php' | 'README.md'>('style.css');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleGenerateChildTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const res = await fetch('/api/child-theme/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeName,
          themeSlug,
          description,
          author,
          parentTemplate,
          includeCustomizations,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGenerationResult(data);
      }
    } catch (err) {
      console.error('Failed to generate child theme:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-emerald-400" />
                مدیر قالب کودک وردپرس
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
                ChildThemeManager
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ساخت قالب کودک (Child Theme) با یک کلیک برای NexusAI
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تمامی شخصی‌سازی‌های پنل، رنگ‌ها و توکن‌ها را بدون نگرانی از به‌روزرسانی‌های قالب اصلی در قالب کودک خود حفظ کنید.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Settings */}
        <form onSubmit={handleGenerateChildTheme} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>مشخصات قالب کودک (Child Theme)</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">نام قالب کودک (Theme Name):</label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">شناسهکوه / اسلاگ (Folder Slug):</label>
            <input
              type="text"
              value={themeSlug}
              onChange={(e) => setThemeSlug(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">قالب والد (Parent Template):</label>
            <select
              value={parentTemplate}
              onChange={(e) => setParentTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="nexusai">NexusAI Pro (قالب اصلی)</option>
              <option value="kamvaweb-pro">KamvaWeb Pro (هسته کاموا)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">توضیحات پوسته:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">طراح / توسعه‌دهنده (Author):</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="includeCust"
              checked={includeCustomizations}
              onChange={(e) => setIncludeCustomizations(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="includeCust" className="text-xs text-slate-300 cursor-pointer">
              انتقال و بسته‌بندی خودکار شخصی‌سازی‌های پنل (Custom CSS و Tokenها)
            </label>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitFork className="w-4 h-4" />}
            <span>{isGenerating ? 'در حال ساخت قالب کودک...' : 'تولید و بسته‌بندی قالب کودک'}</span>
          </button>
        </form>

        {/* Results & File Preview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span>پیش‌نمایش ساختار و فایل‌ها</span>
              </h3>
              {generationResult && (
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  آماده دانلود
                </span>
              )}
            </div>

            {generationResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  {(['style.css', 'functions.php', 'README.md'] as const).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setActiveFileTab(filename)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeFileTab === filename
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filename}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed select-all">
                    {generationResult.files[activeFileTab]}
                  </pre>
                  <button
                    onClick={() => handleCopyCode(generationResult.files[activeFileTab])}
                    className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'کپی شد' : 'کپی'}</span>
                  </button>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 space-y-1">
                  <p className="font-bold">موفقیت: {generationResult.message}</p>
                  <p className="text-slate-400 font-mono">اسلاگ پوشه: wp-content/themes/{generationResult.slug}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <Terminal className="w-10 h-10 text-slate-600 animate-pulse" />
                <p className="text-xs">فرم مشخصات را تکمیل کرده و روی دکمه «تولید و بسته‌بندی» کلیک کنید تا ساختار قالب کودک نمایش داده شود.</p>
              </div>
            )}
          </div>

          {generationResult && (
            <button
              onClick={() => alert(`دانلود آرشیو زیپ قالب کودک "${themeName}" آماده شد.`)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>دانلود بسته زیپ قالب کودک (.zip)</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
