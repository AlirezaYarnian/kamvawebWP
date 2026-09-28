import React, { useState } from 'react';
import { ThemeOptionsConfig, KnowledgeItem } from '../types/theme';
import { 
  Boxes, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Settings, 
  Sparkles, 
  Bot, 
  ShoppingBag, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Plus, 
  ArrowLeft,
  Percent,
  Star,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ElementorVisualSimulatorProps {
  config: ThemeOptionsConfig;
  knowledgeBase: KnowledgeItem[];
}

export const ElementorVisualSimulator: React.FC<ElementorVisualSimulatorProps> = ({
  config,
  knowledgeBase,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedWidget, setSelectedWidget] = useState<'sales-bot' | 'advisor' | 'faq' | 'hero'>('sales-bot');
  
  // Custom controls for Elementor widget settings
  const [widgetTitle, setWidgetTitle] = useState('مشاور تخصصی خرید و فروشگاه');
  const [widgetBadge, setWidgetBadge] = useState('پاسخگویی آنی کمتر از ۱ ثانیه');
  const [widgetThemeColor, setWidgetThemeColor] = useState('#6366f1');
  const [showExitIntent, setShowExitIntent] = useState(true);

  return (
    <div className="space-y-4">
      
      {/* Elementor Editor Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-pink-600/30">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">ویرایشگر اختصاصی المنتور و المنتور پرو</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 font-semibold px-2 py-0.5 rounded-full border border-pink-500/30">
                KamvaWeb AI & Store Widgets v4.2
              </span>
            </div>
            <span className="text-xs text-slate-400">یکپارچه‌سازی کامل المنتور با استایل‌های پیشرفته کاموا استور و حذف DOM اضافه</span>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="نمای دسکتاپ"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">دسکتاپ</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="نمای تبلت"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">تبلت</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="نمای موبایل"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">موبایل</span>
          </button>
        </div>

        {/* Update / Publish Button */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>بروزرسانی در برگه</span>
          </button>
        </div>
      </div>

      {/* Main Studio: Elementor Panel (Right) + Canvas Preview (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Right side: Elementor Control & Widget List Panel */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Category: Nexus AI Elements */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                ویجت‌های اختصاصی کامواوب (KamvaWeb Pack)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">۴ ویجت فعال</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedWidget('sales-bot')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                  selectedWidget === 'sales-bot'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Bot className={`w-5 h-5 ${selectedWidget === 'sales-bot' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-emerald-400">CRO High</span>
                </div>
                <div>
                  <span className="text-xs font-bold block">مشاور هوشمند فروش</span>
                  <span className="text-[10px] text-slate-400">چت تعاملی و متقاعدکننده</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedWidget('advisor')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                  selectedWidget === 'advisor'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <ShoppingBag className={`w-5 h-5 ${selectedWidget === 'advisor' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-amber-400">Cross-Sell</span>
                </div>
                <div>
                  <span className="text-xs font-bold block">پیشنهاد تطبیقی کالا</span>
                  <span className="text-[10px] text-slate-400">آنالیز علاقه و سبد خرید</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedWidget('faq')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                  selectedWidget === 'faq'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <HelpCircle className={`w-5 h-5 ${selectedWidget === 'faq' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-cyan-400">Dynamic</span>
                </div>
                <div>
                  <span className="text-xs font-bold block">سوالات متداول هوشمند</span>
                  <span className="text-[10px] text-slate-400">پاسخگویی آنی برداری</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedWidget('hero')}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 ${
                  selectedWidget === 'hero'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Percent className={`w-5 h-5 ${selectedWidget === 'hero' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-pink-400">High CTR</span>
                </div>
                <div>
                  <span className="text-xs font-bold block">هدر و تریگر فروش ویژه</span>
                  <span className="text-[10px] text-slate-400">تایمر معکوس و پروموشن</span>
                </div>
              </button>
            </div>
          </div>

          {/* Elementor Active Widget Controls Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-400" />
                تنظیمات محتوا و استایل ویجت انتخابی
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Elementor Controls</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">عنوان سربرگ ویجت</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">متن برچسب آنلاین بودن</label>
                <input
                  type="text"
                  value={widgetBadge}
                  onChange={(e) => setWidgetBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300">نمایش پاپ‌آپ هنگام خروج کاربر (Exit Intent)</span>
                <input
                  type="checkbox"
                  checked={showExitIntent}
                  onChange={(e) => setShowExitIntent(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1">
                <span className="text-[11px] text-indigo-300 font-semibold block flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  بهینه‌سازی DOM توسط قالب
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  تعداد Wrapperهای این ویجت در کدهای HTML از ۶ لایه به ۱ لایه کاهش یافته است تا سرعت لود به ۱۰۰٪ برسد.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Left side: Canvas Live Preview Area */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            className={`w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              viewport === 'mobile' ? 'max-w-sm' : viewport === 'tablet' ? 'max-w-xl' : 'max-w-full'
            }`}
          >
            {/* Mockup Browser Window Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                <span className="text-[11px] text-slate-400 font-mono mr-2">https://my-site.com/shop</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                99/100 PageSpeed
              </span>
            </div>

            {/* Canvas Body (Replicating a modern Elementor page) */}
            <div className="p-6 space-y-6 min-h-[580px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
              
              {/* Site Header simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    N
                  </div>
                  <span className="font-bold text-sm text-white">{config.general.siteName}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="hover:text-white cursor-pointer">محصولات</span>
                  <span className="hover:text-white cursor-pointer">مشاوره تخصصی</span>
                  <span className="hover:text-white cursor-pointer">درباره ما</span>
                </div>
              </div>

              {/* Dynamic widget preview based on selection */}
              {selectedWidget === 'sales-bot' && (
                <div className="border-2 border-dashed border-indigo-500/50 rounded-2xl p-5 bg-slate-900/80 shadow-2xl relative">
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    ویجت فعال المنتور: AI Sales Bot
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5">
                          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-indigo-400" />
                          </div>
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 animate-pulse"></span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{widgetTitle}</h4>
                        <span className="text-[11px] text-emerald-400">{widgetBadge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="bg-slate-800/90 p-3 rounded-xl rounded-tr-none text-xs text-slate-200 border border-slate-700/60 leading-relaxed">
                      سلام دوست من! 👋 من به کلیه موجودی، تخفیف‌ها و کالاهای سایت دسترسی دارم. چه کالایی مد نظرتونه تا راهنمایی‌تون کنم؟
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                        💻 پیشنهاد لپ‌تاپ تا ۸۰ میلیون
                      </span>
                      <span className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                        🎧 هدفون نویزکنسلینگ
                      </span>
                      <span className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                        🏷️ دریافت کد تخفیف اختصاصی
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      placeholder="پیام خود را بنویسید (آماده تعامل لحظه‌ای با مشتری)..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pr-3 pl-16 text-xs text-slate-400"
                    />
                    <button className="absolute left-2 top-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg font-semibold">
                      ارسال
                    </button>
                  </div>
                </div>
              )}

              {selectedWidget === 'advisor' && (
                <div className="border-2 border-dashed border-indigo-500/50 rounded-2xl p-5 bg-slate-900/80 shadow-2xl relative space-y-3">
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    ویجت فعال المنتور: Smart Product Advisor
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">پیشنهاد هوشمند هوش مصنوعی بر اساس علایق شما</h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                      تطبیق ۹۸٪
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {knowledgeBase.slice(0, 2).map((item) => (
                      <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-white">{item.title}</h5>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.content}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                          <span className="text-xs font-mono font-bold text-emerald-400">{item.price}</span>
                          <button className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-semibold">
                            افزودن به سبد
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedWidget === 'faq' && (
                <div className="border-2 border-dashed border-indigo-500/50 rounded-2xl p-5 bg-slate-900/80 shadow-2xl relative space-y-3">
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    ویجت فعال المنتور: Dynamic FAQ
                  </div>

                  <h4 className="font-bold text-white text-sm">سوالات پرتکرار خریداران (پاسخ آنی)</h4>
                  <div className="space-y-2">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-indigo-300 block mb-1">شرایط تحویل و ضمانت بازگشت چگونه است؟</span>
                      <p className="text-slate-400 text-[11px]">تحویل فوری ۳ ساعته در تهران و ۲۴ ساعته در شهرستان‌ها به همراه ۷ روز ضمانت بازگشت بی‌قید و شرط وجه.</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <span className="font-bold text-indigo-300 block mb-1">آیا امکان پرداخت در محل وجود دارد؟</span>
                      <p className="text-slate-400 text-[11px]">بله، برای تمامی استان‌های تهران و البرز تسویه در محل با دستگاه کارت‌خوان فعال می‌باشد.</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedWidget === 'hero' && (
                <div className="border-2 border-dashed border-indigo-500/50 rounded-2xl p-6 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 shadow-2xl relative space-y-4 text-center">
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    ویجت فعال المنتور: AI Smart Hero
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    جشنواره تخفیف با پیشنهاد هوشمند فروش
                  </span>

                  <h3 className="text-xl font-black text-white">
                    خرید مدرن‌ترین تجهیزات با تضمین اصالت و کمترین قیمت بازار
                  </h3>

                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    همین حالا با مشاور هوش مصنوعی گفتگو کنید تا بهترین محصول مناسب نیاز و بودجه شما را پیشنهاد دهد.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30">
                      مشاوره آنی با هوش مصنوعی
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700">
                      مشاهده کاتالوگ محصولات
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
