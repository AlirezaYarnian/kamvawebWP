import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  Terminal,
  Code2,
  Maximize2
} from 'lucide-react';

export const ThemeComponentIsolationLab: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<'header' | 'footer' | 'product_card' | 'hero_banner' | 'ai_widget'>('header');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [themeVariant, setThemeVariant] = useState<'dark' | 'light' | 'glass'>('dark');
  const [primaryAccent, setPrimaryAccent] = useState('#f05023');
  const [isSimulating, setIsSimulating] = useState(false);
  const [eventsLog, setEventsLog] = useState<string[]>([
    'محیط ایزوله ساندباکس آماده‌سازی شد.',
    'بارگذاری کامپوننت انتخابی بدون تاثیر روی استایل گلوبال سایت.'
  ]);

  const componentsList = [
    { id: 'header', label: 'هدر پیشرفته و منوی ناوبری (Header V2)', category: 'ساختار هدر' },
    { id: 'footer', label: 'فوتر مگا منو و خبرنامه (Footer Pro)', category: 'ساختار فوتر' },
    { id: 'product_card', label: 'کارت محصول ووکامرس (Product Card)', category: 'فروشگاه' },
    { id: 'hero_banner', label: 'بنر هیرو اولترابوک (Hero Showcase)', category: 'صفحه اصلی' },
    { id: 'ai_widget', label: 'ویجت چت و دستیار هوشمند فروش', category: 'هوش مصنوعی' },
  ];

  const handleTriggerAction = (actionName: string) => {
    setIsSimulating(true);
    setEventsLog(prev => [`[${new Date().toLocaleTimeString()}] تست تعاملی: ${actionName} با موفقیت اجرا شد.`, ...prev]);
    setTimeout(() => setIsSimulating(false), 500);
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
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                آزمایشگاه ایزوله‌سازی کامپوننت‌ها
              </span>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono font-bold">
                ThemeComponentIsolationLab
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              آزمایشگاه تست ساندباکس UI (بدون تاثیر روی پیش‌نمایش اصلی)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              کامپوننت‌های منفرد قالب مانند هدر، فوتر و کارت‌های محصول را در یک محیط کاملاً ایزوله تست و عیب‌یابی کنید.
            </p>
          </div>
        </div>
      </div>

      {/* Lab Layout: Sidebar Controls & Sandbox Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">انتخاب کامپوننت</h3>
            <div className="space-y-2">
              {componentsList.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id as any)}
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col gap-0.5 ${
                    selectedComponent === comp.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <span>{comp.label}</span>
                  <span className={`text-[10px] ${selectedComponent === comp.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {comp.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">تنظیمات ساندباکس</h3>
            
            <div>
              <label className="block text-xs text-slate-300 mb-1">حالت تم (Theme Mode):</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['dark', 'light', 'glass'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setThemeVariant(v)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      themeVariant === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">رنگ اصلی (Primary Token):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryAccent}
                  onChange={(e) => setPrimaryAccent(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <span className="font-mono text-xs text-slate-300">{primaryAccent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Viewport Area */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl lg:col-span-3 flex flex-col justify-between space-y-6">
          
          {/* Viewport Toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">اندازه نمایشگر (Viewport):</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>دسکتاپ</span>
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>تبلت</span>
                </button>
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>موبایل</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400">Sandbox Isolated Frame</span>
            </div>
          </div>

          {/* Render Isolated Component Viewport */}
          <div className={`mx-auto transition-all duration-300 w-full ${
            viewportMode === 'mobile' ? 'max-w-sm' : viewportMode === 'tablet' ? 'max-w-2xl' : 'max-w-full'
          }`}>
            <div className={`border rounded-2xl p-6 shadow-2xl transition-all ${
              themeVariant === 'light' 
                ? 'bg-slate-100 text-slate-900 border-slate-300' 
                : themeVariant === 'glass' 
                ? 'bg-slate-950/70 backdrop-blur-xl text-white border-indigo-500/40' 
                : 'bg-slate-950 text-white border-slate-800'
            }`}>
              
              {selectedComponent === 'header' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white" style={{ backgroundColor: primaryAccent }}>
                        K
                      </div>
                      <span className="font-extrabold text-sm tracking-tight">کامواوب پرو — هدر ایزوله</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-300">
                      <span className="cursor-pointer hover:text-white">محصولات</span>
                      <span className="cursor-pointer hover:text-white">توسعه‌دهندگان</span>
                      <span className="cursor-pointer hover:text-white">پشتیبانی</span>
                    </div>
                    <button 
                      onClick={() => handleTriggerAction('کلیک روی دکمه ورود هدر')}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow" 
                      style={{ backgroundColor: primaryAccent }}
                    >
                      ورود / ثبت‌نام
                    </button>
                  </div>
                </div>
              )}

              {selectedComponent === 'footer' && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <h4 className="font-bold mb-2">درباره کامواوب</h4>
                      <p className="text-slate-400 leading-relaxed">پیشرو در ارائه قالب‌های فوق‌سریع و هوشمند وردپرس با پشتیبانی ۲۴ ساعته.</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">لینک‌های سریع</h4>
                      <ul className="space-y-1 text-slate-400">
                        <li className="hover:text-white cursor-pointer">سایت فروشگاهی ESCMarket</li>
                        <li className="hover:text-white cursor-pointer">مستندات هوش مصنوعی</li>
                        <li className="hover:text-white cursor-pointer">گواهینامه سرعت ۹۹</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">عضویت در خبرنامه</h4>
                      <div className="flex gap-2">
                        <input type="email" placeholder="ایمیل شما..." className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs w-full" />
                        <button onClick={() => handleTriggerAction('عضویت خبرنامه فوتر')} className="px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: primaryAccent }}>عضویت</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedComponent === 'product_card' && (
                <div className="max-w-xs mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
                  <div className="h-36 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs font-bold text-indigo-200">KamvaBook X15 Pro</span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded">۷٪ تخفیف</span>
                  </div>
                  <h4 className="font-bold text-sm">اولترابوک مهندسی Core i9</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold text-xs">۷۸,۵۰۰,۰۰۰ تومان</span>
                    <button onClick={() => handleTriggerAction('افزودن به سبد خرید کارت محصول')} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: primaryAccent }}>افزودن به سبد</button>
                  </div>
                </div>
              )}

              {selectedComponent === 'hero_banner' && (
                <div className="text-center space-y-4 py-8">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold">پرچمدار سال ۲۰۲۶</span>
                  <h3 className="text-2xl font-extrabold tracking-tight">معماری هوش مصنوعی نسل جدید</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">سریع‌ترین قالب وردپرس جهان با لود زیر ۰.۸ ثانیه و انطباق کامل با سئوی گوگل.</p>
                  <button onClick={() => handleTriggerAction('کلیک روی دکمه شروع هیرو')} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg" style={{ backgroundColor: primaryAccent }}>شروع تجربه رایگان</button>
                </div>
              )}

              {selectedComponent === 'ai_widget' && (
                <div className="max-w-sm mx-auto bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-xs">دستیار هوشمند فروش کاموا</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg text-xs text-slate-300">
                    سلام! چطور می‌توانم در انتخاب محصول مناسب به شما کمک کنم؟
                  </div>
                  <button onClick={() => handleTriggerAction('ارسال پیام به ویجت هوش مصنوعی')} className="w-full py-2 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: primaryAccent }}>شروع گفتگو</button>
                </div>
              )}

            </div>
          </div>

          {/* Telemetry & Event Logs */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>لاگ رویدادها و تله‌متری کامپوننت ایزوله:</span>
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 max-h-32 overflow-y-auto">
              {eventsLog.map((log, index) => (
                <div key={index} className="text-indigo-300">› {log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
