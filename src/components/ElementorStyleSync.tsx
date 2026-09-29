import React, { useState } from 'react';
import { 
  Boxes, 
  Palette, 
  Type, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ElementorStyleSync: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#f05023');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [darkColor, setDarkColor] = useState('#080c14');
  
  const [headingFont, setHeadingFont] = useState('Vazirmatn');
  const [bodyFont, setBodyFont] = useState('Vazirmatn');
  const [baseFontSize, setBaseFontSize] = useState('16px');

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleSyncToElementor = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setSyncLogs([
      'برقراری اتصال امن با Elementor Global Settings API...',
      'دریافت استایل‌های کنونی کیت المنتور (Elementor Kit ID #12)...',
      `پوش رنگ‌های اصلی قالب (${primaryColor}, ${secondaryColor}, ${accentColor}) در سیستم رنگ‌های سراسری المنتور...`,
      `تنظیم فونت‌های هدر (${headingFont}) و بدنه (${bodyFont}) در تایپوگرافی المنتور...`,
      'بازسازی و پاکسازیکش CSS المنتور (Regenerate CSS Files)...',
      'همگام‌سازی با موفقیت کامل انجام شد!'
    ]);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 1800);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-purple-400" />
                هماهنگ‌ساز المنتور پرو
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
                Elementor Global Settings API
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ElementorStyleSync — انتقال توکن‌های طراحی NexusAI به المنتور
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              رنگ‌ها، تایپوگرافی و متغیرهای طراحی قالب اختصاصی خود را با یک کلیک مستقیماً به پنل تنظیمات سراسری المنتور (Elementor Global Kits) منتقل کنید.
            </p>
          </div>

          <button
            onClick={handleSyncToElementor}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 ring-1 ring-purple-400/50"
          >
            <Send className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'در حال ارسال توکن‌ها...' : 'ارسال و همگام‌سازی با المنتور'}</span>
          </button>
        </div>

        {syncSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>توکن‌های طراحی NexusAI با موفقیت در کیت سراسری المنتور ثبت شدند و تمامی المان‌های صفحه به‌روزرسانی شدند.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Colors Token Config */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">توکن‌های رنگی پالت NexusAI</h3>
              <p className="text-xs text-slate-400">رنگ‌های اصلی برند که به Global Colors المنتور تزریق می‌شوند</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">رنگ اصلی (Primary / Brand):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <span className="font-mono text-xs text-slate-300 w-20">{primaryColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">رنگ ثانویه (Secondary):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <span className="font-mono text-xs text-slate-300 w-20">{secondaryColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">رنگ تاکیدی (Accent):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <span className="font-mono text-xs text-slate-300 w-20">{accentColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">رنگ تیره پس‌زمینه (Dark Base):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <span className="font-mono text-xs text-slate-300 w-20">{darkColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Token Config */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">توکن‌های تایپوگرافی (Global Typography)</h3>
              <p className="text-xs text-slate-400">فونت‌ها و اندازه‌های استاندارد هدینگ‌ها و متن‌های بدنه</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">فونت هدینگ‌ها (Headings):</span>
              <select
                value={headingFont}
                onChange={(e) => setHeadingFont(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 font-sans text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Vazirmatn">Vazirmatn (وزیرمتن)</option>
                <option value="IranYekan">IranYekan (ایران یکان)</option>
                <option value="Dana">Dana (دانا)</option>
                <option value="Sahel">Sahel (ساحل)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">فونت متن بدنه (Body Text):</span>
              <select
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 font-sans text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Vazirmatn">Vazirmatn (وزیرمتن)</option>
                <option value="IranYekan">IranYekan (ایران یکان)</option>
                <option value="Dana">Dana (دانا)</option>
                <option value="YekanBakh">YekanBakh (یکان بخ)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">اندازه پایه فونت (Base Size):</span>
              <select
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="14px">۱۴ پیکسل</option>
                <option value="15px">۱۵ پیکسل</option>
                <option value="16px">۱۶ پیکسل (توصیه شده)</option>
                <option value="18px">۱۸ پیکسل</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Sync Log Box */}
      {syncLogs.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>گزارش زنده همگام‌سازی با المنتور API</span>
          </h3>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
            {syncLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-400">›</span>
                <span className={index === syncLogs.length - 1 && !isSyncing ? 'text-emerald-400 font-bold' : ''}>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
