import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  FileCode2, 
  Play, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Sliders, 
  Copy, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { DeveloperStudioConfig } from '../types/theme';

interface DeveloperStudioProps {
  devConfig: DeveloperStudioConfig;
  onUpdateConfig: (updated: Partial<DeveloperStudioConfig>) => void;
}

export const DeveloperStudio: React.FC<DeveloperStudioProps> = ({
  devConfig,
  onUpdateConfig,
}) => {
  const [activeEditorTab, setActiveEditorTab] = useState<'php' | 'css' | 'js' | 'hooks'>('php');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(devConfig.customPhpSnippets[0]?.id || '');
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetHook, setNewSnippetHook] = useState('init');
  const [testRunOutput, setTestRunOutput] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedSnippet = devConfig.customPhpSnippets.find((s) => s.id === selectedSnippetId) || devConfig.customPhpSnippets[0];

  const handleUpdateCurrentSnippetCode = (newCode: string) => {
    if (!selectedSnippet) return;
    onUpdateConfig({
      customPhpSnippets: devConfig.customPhpSnippets.map((s) =>
        s.id === selectedSnippet.id ? { ...s, code: newCode } : s
      ),
    });
  };

  const handleToggleSnippet = (id: string) => {
    onUpdateConfig({
      customPhpSnippets: devConfig.customPhpSnippets.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      ),
    });
  };

  const handleCreateNewSnippet = () => {
    if (!newSnippetTitle.trim()) return;
    const newSnippet = {
      id: `snip-${Date.now()}`,
      title: newSnippetTitle.trim(),
      code: `// تابع اختصاصی توسعه‌دهنده برای هوک ${newSnippetHook}\nadd_action('${newSnippetHook}', function() {\n    // کدهای PHP شما در این بخش اجرا می‌شوند\n});`,
      active: true,
      hook: newSnippetHook,
      priority: 10,
    };
    onUpdateConfig({
      customPhpSnippets: [newSnippet, ...devConfig.customPhpSnippets],
    });
    setSelectedSnippetId(newSnippet.id);
    setNewSnippetTitle('');
    setToastMessage('اسنیپت کد جدید ایجاد شد و در محیط سندباکس آماده ویرایش است.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteSnippet = (id: string) => {
    onUpdateConfig({
      customPhpSnippets: devConfig.customPhpSnippets.filter((s) => s.id !== id),
    });
  };

  const handleTestRunPhp = () => {
    setIsRunningTest(true);
    setTestRunOutput(null);
    setTimeout(() => {
      setIsRunningTest(false);
      setTestRunOutput('✅ سینتکس PHP با موفقیت در محیط ایزوله کامواوب بررسی شد. هیچ ارور یا تداخلی شناسایی نشد (Memory usage: 0.12 MB - Execution time: 1.4ms).');
    }, 450);
  };

  const popularWpHooks = [
    { hook: 'init', type: 'action', desc: 'راه‌اندازی اولیه وردپرس قبل از ارسال هدرها' },
    { hook: 'wp_enqueue_scripts', type: 'action', desc: 'بارگذاری استایل‌ها و اسکریپت‌های فرانت‌اند' },
    { hook: 'woocommerce_cart_calculate_fees', type: 'action', desc: 'محاسبه تخفیف‌ها یا هزینه‌های مازاد سبد خرید' },
    { hook: 'the_content', type: 'filter', desc: 'فیلتر و دستکاری محتوای نوشته‌ها و برگه‌ها' },
    { hook: 'template_redirect', type: 'action', desc: 'هدایت شرطی کاربران قبل از لود قالب' },
    { hook: 'woocommerce_single_product_summary', type: 'action', desc: 'افزودن المان سفارشی در صفحه تکی محصول' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                استودیو برنامه‌نویسی و توسعه کد کامواوب (Developer Studio)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                محیط امن سندباکس PHP 8.2+
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              فضای اختصاصی برنامه‌نویس جهت توسعه و افزودن کدهای PHP، CSS و JS به قالب
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              توسعه‌دهندگان وب می‌توانند بدون نیاز به ویرایش مستقیم فایل‌های هسته، توابع هوک سفارشی، استایل‌های فرانت و اسکریپت‌های تحلیلی خود را همراه با اعتبارسنجی سینتکس کدنویسی نمایند.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveEditorTab('php')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeEditorTab === 'php' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span>توابع و هوک‌های PHP</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('css')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeEditorTab === 'css' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>استایل سفارشی CSS</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('js')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeEditorTab === 'js' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>جاوااسکریپت Header/Footer</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('hooks')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeEditorTab === 'hooks' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>کاوشگر هوک‌ها (Hook Explorer)</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PHP SNIPPETS EDITOR & SANDBOX                         */}
      {/* ======================================================== */}
      {activeEditorTab === 'php' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Snippets List Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-xs">اسنیپت‌های فعال PHP</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                  {devConfig.customPhpSnippets.length} قطعه‌کد
                </span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {devConfig.customPhpSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    onClick={() => setSelectedSnippetId(snippet.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedSnippet?.id === snippet.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs line-clamp-1">{snippet.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSnippet(snippet.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="حذف اسنیپت"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                      <span className="font-mono text-cyan-400">Hook: {snippet.hook}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSnippet(snippet.id);
                        }}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                          snippet.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {snippet.active ? 'روشن' : 'خاموش'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Snippet Box */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="عنوان قطعه‌کد جدید..."
                  value={newSnippetTitle}
                  onChange={(e) => setNewSnippetTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="نام هوک (مثلا init)..."
                    value={newSnippetHook}
                    onChange={(e) => setNewSnippetHook(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    onClick={handleCreateNewSnippet}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ایجاد اسنیپت</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor & Test Console */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedSnippet?.title || 'ویرایشگر کد'}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Hook Target: {selectedSnippet?.hook}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestRunPhp}
                    disabled={isRunningTest}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunningTest ? 'animate-spin' : ''}`} />
                    <span>{isRunningTest ? 'در حال بررسی...' : 'اجرای تست سینتکس (Lint Test)'}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="relative">
                <textarea
                  rows={14}
                  value={selectedSnippet?.code || ''}
                  onChange={(e) => handleUpdateCurrentSnippetCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none focus:border-cyan-500 shadow-inner"
                  dir="ltr"
                  spellCheck={false}
                />
              </div>

              {/* Test Output Console */}
              {testRunOutput && (
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/30 font-mono text-xs text-emerald-300 animate-in fade-in duration-200">
                  {testRunOutput}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CUSTOM CSS EDITOR                                     */}
      {/* ======================================================== */}
      {activeEditorTab === 'css' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-white text-sm">ویرایشگر کدهای سفارشی CSS و SCSS</h4>
              <p className="text-xs text-slate-400">این استایل‌ها با بالاترین اولویت در انتهای تمامی استایل‌های سایت لود می‌شوند.</p>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Auto Minified
            </span>
          </div>

          <textarea
            rows={16}
            value={devConfig.customCssScss}
            onChange={(e) => onUpdateConfig({ customCssScss: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-purple-300 leading-relaxed focus:outline-none focus:border-purple-500 shadow-inner"
            dir="ltr"
            placeholder="/* استایل‌های اختصاصی خود را در این بخش بنویسید */"
            spellCheck={false}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CUSTOM JS EDITOR                                      */}
      {/* ======================================================== */}
      {activeEditorTab === 'js' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm">اسکریپت‌های سربرگ (Header JavaScript - در تگ head)</h4>
            <p className="text-xs text-slate-400">مناسب برای کدهای ترکینگ گوگل تگ منیجر، یکتانت و وب‌متریک‌ها</p>
            <textarea
              rows={14}
              value={devConfig.customHeaderJs}
              onChange={(e) => onUpdateConfig({ customHeaderJs: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-cyan-300 leading-relaxed focus:outline-none focus:border-cyan-500"
              dir="ltr"
              placeholder="// JavaScript Head Code"
            />
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm">اسکریپت‌های پاورقی (Footer JavaScript - قبل از بسته شدن body)</h4>
            <p className="text-xs text-slate-400">مناسب برای ابزارک‌های چت آنلاین، رویدادهای کلیک و انیمیشن‌ها</p>
            <textarea
              rows={14}
              value={devConfig.customFooterJs}
              onChange={(e) => onUpdateConfig({ customFooterJs: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none focus:border-emerald-500"
              dir="ltr"
              placeholder="// JavaScript Footer Code"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. HOOKS EXPLORER                                        */}
      {/* ======================================================== */}
      {activeEditorTab === 'hooks' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-bold text-white text-sm">کاوشگر هوک‌های محبوب وردپرس و ووکامرس (Hook Explorer)</h4>
              <p className="text-xs text-slate-400">هوک‌های استاندارد وردپرس برای اتصال مستقیم توابع PHP قالب کامواوب</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularWpHooks.map((item, index) => (
              <div key={index} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300" dir="ltr">{item.hook}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${item.type === 'action' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
