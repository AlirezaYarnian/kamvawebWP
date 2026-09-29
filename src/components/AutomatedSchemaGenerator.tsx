import React, { useState } from 'react';
import { 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  Code2, 
  Utensils, 
  ShoppingBag, 
  HelpCircle, 
  BookOpen, 
  Terminal, 
  Layers, 
  Star,
  RefreshCw
} from 'lucide-react';

export const AutomatedSchemaGenerator: React.FC = () => {
  const [postTitle, setPostTitle] = useState('طرز تهیه کباب تابه زعفرانی خانگی با برنج ایرانی');
  const [postContent, setPostContent] = useState('طرز تهیه کباب تابه زعفرانی بسیار خوشمزه و سریع در ۳۰ دقیقه. مواد لازم: گوشت چرخ‌کرده ۵۰ workflow، پیاز، زعفران دم‌کرده، کره و ادویه‌جات. زمان آماده‌سازی ۱۵ دقیقه و پخت ۳۰ دقیقه برای ۴ نفر. حدود ۴۲۰ کالری بر هر وعده.');
  const [targetSchemaType, setTargetSchemaType] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [schemaResult, setSchemaResult] = useState<any | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPhp, setCopiedPhp] = useState(false);

  const handleGenerateSchema = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/seo/auto-schema-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postTitle,
          postContent,
          targetSchemaType
        })
      });
      const data = await res.json();
      if (data.success) {
        setSchemaResult(data);
      }
    } catch (e) {
      console.error('Failed to generate schema', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const setSamplePreset = (type: 'product' | 'recipe' | 'faq') => {
    if (type === 'product') {
      setPostTitle('اولترابوک مهندسی کامواوب پرو X15 با پردازنده Core i9');
      setPostContent('اولترابوک مهندسی با ۳۲ گیگابایت رم DDR5، کارت گرافیک RTX 4080 و گارانتی ۲۴ ماهه تعویض درجا. قیمت ۷۸,۵۰۰,۰۰۰ تومان. کد محصول: KAMVA-X15-PRO. موجود در انبار با ارسال فوری.');
      setTargetSchemaType('Product');
    } else if (type === 'recipe') {
      setPostTitle('طرز تهیه کیک شکلاتی بی‌بی خونگی با بافت اسفنجی');
      setPostContent('طرز تهیه کیک شکلاتی خانگی خوشمزه. زمان آماده‌سازی ۲۰ دقیقه و زمان پخت ۴۰ دقیقه. مواد لازم: آرد ۳ لیوان، پودر کاکائو، تخم مرغ، شیر و روغن. مناسب برای ۶ نفر. کالری ۳۱۰ کیلوکالری.');
      setTargetSchemaType('Recipe');
    } else {
      setPostTitle('سوالات متداول نحوه ثبت سفارش، ارسال و گارانتی کامواوب');
      setPostContent('سوال ۱: شرایط ارسال به شهرستان‌ها چگونه است؟ پاسخ: ارسال با پست پیشتاز و تیپاکس ۲۴ الی ۴۸ ساعته. سوال ۲: آیا خرید اقساطی بدون ضامن ممکن است؟ پاسخ: بله از طریق اسنپ‌پی در ۴ قسط بدون سود.');
      setTargetSchemaType('FAQPage');
    }
  };

  const copyToClipboard = (text: string, isPhp: boolean) => {
    navigator.clipboard.writeText(text);
    if (isPhp) {
      setCopiedPhp(true);
      setTimeout(() => setCopiedPhp(false), 2500);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
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
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                تولیدکننده خودکار اسکیما و Rich Results
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                AutomatedSchemaGenerator v1.0
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              استخراج و تزریق هوشمند کدهای JSON-LD (Product, Recipe, FAQ) به پست‌های وردپرس
            </h2>
            
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تزریق کدهای ساختاریافته استاندارد Schema.org به متن پست‌ها، محصولات و مقالات وردپرس جهت کسب ستاره، قیمت، زمان پخت و آکاردئون سوالات متداول در صفحه اول گوگل.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSamplePreset('product')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>محصول</span>
            </button>
            <button
              onClick={() => setSamplePreset('recipe')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-rose-400" />
              <span>دستور پخت</span>
            </button>
            <button
              onClick={() => setSamplePreset('faq')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>FAQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Form & AI Trigger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>عنوان محتوا یا محصول:</span>
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="عنوان مقاله، محصول، دستور پخت یا سوالات..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">نوع اسکیمای مدنظر:</label>
            <select
              value={targetSchemaType}
              onChange={(e) => setTargetSchemaType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="auto">✨ تشخیص خودکار هوش مصنوعی (AI Auto-Detect)</option>
              <option value="Product">🛒 محصول ووکامرس (Product)</option>
              <option value="Recipe">🍳 دستور پخت و آشپزی (Recipe)</option>
              <option value="FAQPage">❓ سوالات متداول (FAQPage)</option>
              <option value="Article">📰 مقاله و خبر (Article / BlogPosting)</option>
              <option value="HowTo">🛠️ راهنما و آموزش مرحله‌ای (HowTo)</option>
            </select>
          </div>

        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">متن محتوا / توضیحات محصول / دستور تهیه:</label>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={4}
            placeholder="متن کامل محتوا جهت استخراج خودکار فیلدهای قیمت، زمان پخت، کالری، مراحل یا سوال و پاسخ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <button
          onClick={handleGenerateSchema}
          disabled={isGenerating || !postTitle.trim()}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'در حال استخراج فیلدها و ساخت اسکیما...' : 'تولید و تزریق هوشمند اسکیما با AI'}</span>
        </button>
      </div>

      {/* Generated Results Panel */}
      {schemaResult && (
        <div className="space-y-6 animate-fade-in">

          {/* AI Detection Summary */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white">نوع اسکیمای شناسایی‌شده:</span>{' '}
                <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                  {schemaResult.detectedSchemaType}
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">{schemaResult.summary}</p>
              </div>
            </div>

            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all"
            >
              <span>آزمایش در Google Rich Results Test</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Google SERP Rich Snippet Live Preview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                  پیش‌نمایش زنده در گوگل (Google Rich Snippet SERP Preview)
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                  Rich Result Valid
                </span>
              </div>

              {/* Google Result Card Simulation */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2.5 font-sans">
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 dir-ltr text-left">
                  <span>kamvaweb.com</span>
                  <span className="text-slate-500">›</span>
                  <span className="text-slate-400">posts</span>
                  <span className="text-slate-500">›</span>
                  <span className="text-slate-300 font-mono">{schemaResult.detectedSchemaType.toLowerCase()}</span>
                </div>

                <h4 className="text-base font-extrabold text-blue-400 hover:underline cursor-pointer dir-rtl text-right">
                  {schemaResult.serpPreview?.title || postTitle}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed dir-rtl text-right">
                  {schemaResult.serpPreview?.description || postContent.slice(0, 140) + '...'}
                </p>

                {/* Schema Rich Badges */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  {schemaResult.detectedSchemaType === 'Product' && (
                    <>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>۴.۹</span>
                        <span className="text-slate-400 text-[11px]">(۸۵ نظر)</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span className="font-bold text-emerald-400">{schemaResult.serpPreview?.badgeDetails || '۷۸,۵۰۰,۰۰۰ تومان'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">موجود در انبار</span>
                    </>
                  )}

                  {schemaResult.detectedSchemaType === 'Recipe' && (
                    <>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>۴.۸</span>
                        <span className="text-slate-400 text-[11px]">(۴۲ رأی)</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span className="text-indigo-300 font-bold">زمان پخت: ۴۵ دقیقه</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-rose-300">۳۵۰ کالری</span>
                    </>
                  )}

                  {schemaResult.detectedSchemaType === 'FAQPage' && (
                    <div className="w-full space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 block">سوالات متداول این صفحه (FAQ Snippet):</span>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] text-slate-200">
                        ❓ شرایط ارسال و زمان تحویل چگونه است؟
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* JSON-LD Script Output */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  کد استاندارد JSON-LD (Schema.org)
                </span>

                <button
                  onClick={() => copyToClipboard(schemaResult.htmlScriptTag || schemaResult.jsonLdString, false)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'کپی شد' : 'کپی کد JSON-LD'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-72 overflow-y-auto font-mono text-[11px] text-emerald-300 dir-ltr text-left leading-relaxed select-all">
                <pre>{schemaResult.htmlScriptTag || schemaResult.jsonLdString}</pre>
              </div>
            </div>

          </div>

          {/* WordPress PHP Hook Injector Snippet */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <span>کد تزریق خودکار وردپرس (functions.php wp_head Hook)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  کد آماده قرارگیری در فایل functions.php قالب جهت تزریق خودکار اسکیما در هدر صفحات وردپرس
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(schemaResult.phpCodeSnippet || '', true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                {copiedPhp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPhp ? 'کپی شد' : 'کپی کد PHP وردپرس'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-indigo-300 dir-ltr text-left leading-relaxed max-h-60 overflow-y-auto select-all">
              <pre>{schemaResult.phpCodeSnippet}</pre>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
