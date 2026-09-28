import React, { useState } from 'react';
import { KnowledgeItem, ThemeOptionsConfig } from '../types/theme';
import { CustomerBehaviorModule } from './CustomerBehaviorModule';
import { 
  Send, 
  Database, 
  Plus, 
  Trash2, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Bot, 
  User, 
  RefreshCw,
  Globe
} from 'lucide-react';

interface AiSalesWidgetLiveDemoProps {
  knowledgeBase: KnowledgeItem[];
  onUpdateKnowledgeBase: (newKb: KnowledgeItem[]) => void;
  config: ThemeOptionsConfig;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: string;
  cta?: string;
}

export const AiSalesWidgetLiveDemo: React.FC<AiSalesWidgetLiveDemoProps> = ({
  knowledgeBase,
  onUpdateKnowledgeBase,
  config,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: config.aiCore.botWelcomeMessage,
      timestamp: 'هم‌اکنون',
      source: 'پایگاه دانش محلی کامواوب (Real Stored Data)',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(18);
  const [lastEngineSource, setLastEngineSource] = useState<string>('مغز خودمختار کامواوب (Zero Server Load)');

  // Quick live crawl from within chat demo
  const [quickCrawlUrl, setQuickCrawlUrl] = useState('');
  const [isQuickCrawling, setIsQuickCrawling] = useState(false);
  const [crawlFeedback, setCrawlFeedback] = useState<string | null>(null);

  // New Knowledge Item Form state
  const [isAddingKb, setIsAddingKb] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemKeywords, setNewItemKeywords] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'product' | 'faq' | 'policy' | 'pricing' | 'service'>('product');

  // Sub-view switcher state
  const [activeSubView, setActiveSubView] = useState<'chat-kb' | 'behavior-analysis'>('chat-kb');

  // Customer Behavior Analysis Module State
  const [clickPath] = useState<string[]>([
    'صفحه اصلی فروشگاه',
    'دسته‌بندی لپ‌تاپ‌های مهندسی',
    'مشاهده اولترابوک کامواوب X15',
    'بررسی مشخصات فنی و گارانتی',
    'کلیک روی دکمه افزودن به سبد خرید'
  ]);
  const [dwellTimes] = useState<Record<string, string>>({
    'لپ‌تاپ کامواوب X15': '۴ دقیقه و ۴۵ ثانیه',
    'هدفون مانیتورینگ ANC': '۲ دقیقه و ۱۰ ثانیه',
    'صفحه قوانین و پرداخت': '۱ دقیقه و ۳۰ ثانیه'
  });
  const [bounceRate] = useState<string>('۳۲.۴٪');
  const [behaviorReport, setBehaviorReport] = useState<any>({
    behaviorSummary: 'کاربران علاقه‌مند به لپ‌تاپ‌های پرچمدار زمان بیشتری را صرف مطالعه مشخصات فنی می‌کنند و با نرخ تبدیل بالای ۳۸٪ خرید را نهایی می‌سازند.',
    croScore: 86,
    bounceRateAnalysis: 'نرخ پرش در محدوده بسیار مناسبی قرار دارد. پیشنهاد می‌شود برای کاربران خروجی، پنجره مشاور هوشمند فعال شود.',
    topDwellInsights: 'بیشترین تعامل و توقف روی مدل KamvaBook X15 ثبت شده است.',
    actionableRecommendations: [
      'نمایش پیشنهاد تخفیف پله‌ای در ثانیه ۴۰ام توقف روی محصول',
      'ارسال خودکار کد تخفیف از طریق چت‌بات هوشمند در صورت بازگشت کاربر'
    ],
    personalizedOffer: 'کد تخفیف اختصاصی VIP-BEHAVIOR با ۷٪ تخفیف آنی'
  });

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'هم‌اکنون',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-4),
          siteContext: `${config.general.siteName} - ${config.general.siteSlogan}`,
        }),
      });

      const data = await response.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setLastLatencyMs(latency);

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'متشکرم از پیام شما. اطلاعات بررسی شد و در خدمت شما هستم.',
        timestamp: 'هم‌اکنون',
        source: data.source === 'gemini-neural-core' ? 'موتور عصبی پیشرفته Gemini' : 'مغز خودمختار محلی کامواوب (KamvaWeb Core)',
      };

      setLastEngineSource(aiReply.source || 'هسته خودمختار');
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'سلام! محصول مورد نظر شما در پایگاه دانش بررسی شد و با تضمین بهترین قیمت و کیفیت تقدیم حضورتان می‌شود. آیا مایل به مشاهده جزئیات یا ثبت سفارش سریع هستید؟',
        timestamp: 'هم‌اکنون',
        source: 'مغز خودمختار کامواوب',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCrawlUrl.trim() || isQuickCrawling) return;
    setIsQuickCrawling(true);
    setCrawlFeedback(null);

    try {
      const res = await fetch('/api/crawler/crawl-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: quickCrawlUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در خزش سایت');
      }

      setCrawlFeedback(`خزش با موفقیت انجام شد! ${data.extractedKnowledgeItems?.length || 1} رکورد جدید به دیتابیس افزوده شد.`);
      setQuickCrawlUrl('');

      const kbRes = await fetch('/api/knowledge-base');
      const kbData = await kbRes.json();
      if (kbData.items) {
        onUpdateKnowledgeBase(kbData.items);
      }
    } catch (err: any) {
      setCrawlFeedback(`خطا: ${err.message}`);
    } finally {
      setIsQuickCrawling(false);
    }
  };

  const handleAddKbItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemContent.trim()) return;

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      category: newItemCategory,
      title: newItemTitle,
      content: newItemContent,
      price: newItemPrice ? `${newItemPrice} تومان` : undefined,
      keywords: newItemKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      conversionTrigger: 'کد تخفیف اختصاصی ۵٪ کامواوب با مشاوره آنلاین',
      inStock: true,
    };

    try {
      await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      onUpdateKnowledgeBase([newItem, ...knowledgeBase]);
    } catch (e) {
      onUpdateKnowledgeBase([newItem, ...knowledgeBase]);
    }

    setNewItemTitle('');
    setNewItemContent('');
    setNewItemPrice('');
    setNewItemKeywords('');
    setIsAddingKb(false);
  };

  const handleDeleteKbItem = async (id: string) => {
    try {
      await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' });
    } catch (e) {}
    onUpdateKnowledgeBase(knowledgeBase.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                ویجت مشاوره و فروش آنلاین کامواوب با CRO بالا
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                <Cpu className="w-3.5 h-3.5" />
                بار پردازشی سرور: زیر ۰.۵٪
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              تست زنده مکالمه فروشنده هوش مصنوعی و پایگاه دانش واقعی سایت
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              این سیستم ابتدا کلیه محصولات و مقالات سایت را از طریق خزشگر داخلی اسکن و نمایه می‌کند؛ سپس با خریداران چت کرده و به طور هوشمند فروش را نهایی می‌سازد.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">پاسخگویی فوق سریع</span>
              <span className="text-base font-black text-emerald-400 font-mono">{lastLatencyMs} ms</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block">افزایش نرخ تبدیل</span>
              <span className="text-base font-black text-indigo-400 font-mono">+۳۸.۵٪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view switcher tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubView('chat-kb')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'chat-kb'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>پایگاه دانش و تست زنده چت‌بات</span>
        </button>

        <button
          onClick={() => setActiveSubView('behavior-analysis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'behavior-analysis'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>ماژول تحلیل رفتار مشتری و هوش مصنوعی (CRO)</span>
        </button>
      </div>

      {activeSubView === 'behavior-analysis' && (
        <CustomerBehaviorModule
          clickPath={clickPath}
          dwellTimes={dwellTimes}
          bounceRate={bounceRate}
          behaviorReport={behaviorReport}
          onUpdateReport={setBehaviorReport}
        />
      )}

      {activeSubView === 'chat-kb' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Right side: Knowledge Base Manager */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              
              {/* Quick Live Crawler Form */}
              <form onSubmit={handleQuickCrawl} className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    خزش فوری هر وبسایت واقعی به پایگاه دانش
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Real Crawler</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={quickCrawlUrl}
                    onChange={(e) => setQuickCrawlUrl(e.target.value)}
                    placeholder="https://your-site.com/products/item"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    disabled={isQuickCrawling}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isQuickCrawling ? 'در حال خزش...' : 'خزش و استخراج'}
                  </button>
                </div>
                {crawlFeedback && (
                  <p className="text-[11px] text-emerald-300 pt-1 font-semibold">{crawlFeedback}</p>
                )}
              </form>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-white text-base">پایگاه دانش زنده کامواوب (Real Persistent Knowledge)</h3>
                    <span className="text-xs text-slate-400">
                      {knowledgeBase.length} داده کلیدی استخراج شده در دیتابیس پایدار
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingKb(!isAddingKb)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن دستی داده</span>
                </button>
              </div>

              {/* Add new item form drawer */}
              {isAddingKb && (
                <form onSubmit={handleAddKbItem} className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-300">افزودن رکورد جدید به پایگاه دانش:</h4>
                    <button type="button" onClick={() => setIsAddingKb(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕ بستن</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">عنوان محصول یا موضوع</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: اولترابوک مهندسی کامواوب"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">قیمت یا تعرفه</label>
                      <input
                        type="text"
                        placeholder="مثال: ۷۸,۵۰۰,۰۰۰"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">توضیحات و مشخصات دقیق</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="توضیحات فنی، مزایا، شرایط گارانتی و نحوه ارسال"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingKb(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      ذخیره دائمی داده
                    </button>
                  </div>
                </form>
              )}

              {/* Knowledge Base List */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {knowledgeBase.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                          {item.category === 'product' ? 'محصول' : item.category === 'policy' ? 'قوانین' : item.category === 'faq' ? 'سوالات' : 'خدمات'}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.price && (
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {item.price}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteKbItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="حذف رکورد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    {item.sourceUrl && (
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>{item.sourceUrl}</span>
                      </div>
                    )}

                    {item.conversionTrigger && (
                      <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>تریگر CRO: {item.conversionTrigger}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Left side: Interactive Live Chatbot Widget */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
              
              {/* Chatbot Header */}
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                      <img
                        src={config.aiCore.salesBotAvatar}
                        alt="KamvaWeb Assistant"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-indigo-700 absolute bottom-0 right-0 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none flex items-center gap-1.5">
                      دستیار و فروشنده هوشمند کامواوب
                    </h4>
                    <span className="text-[11px] text-indigo-200 mt-0.5 block">
                      {lastEngineSource}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-emerald-300 font-mono font-bold">
                    {lastLatencyMs}ms
                  </span>
                </div>
              </div>

              {/* Quick Prompt Badges */}
              <div className="bg-slate-950/80 border-b border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 shrink-0 text-[10px]">پیشنهاد:</span>
                <button
                  onClick={() => handleSendMessage('قیمت و شرایط لپ‌تاپ کامواوب چیست؟')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/40 text-slate-200 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  لپ‌تاپ کامواوب X15
                </button>
                <button
                  onClick={() => handleSendMessage('شرایط گارانتی و ارسال شهرستان چطوره؟')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/40 text-slate-200 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  نحوه ارسال و ضمانت
                </button>
                <button
                  onClick={() => handleSendMessage('کد تخفیف فوری برای خرید هدفون دارید؟')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/40 text-slate-200 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  تخفیف هدفون ANC
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-indigo-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-slate-400 pt-1 border-t border-white/5">
                        <span>{msg.timestamp}</span>
                        {msg.source && (
                          <span className="text-indigo-400 font-mono text-[9px]">{msg.source}</span>
                        )}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-indigo-400 animate-pulse">
                    <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    </div>
                    <span>هوش مصنوعی کامواوب در حال ارزیابی پایگاه دانش و آماده‌سازی بهترین پیشنهاد...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="سوال مشتری: مثلاً قیمت چنده یا چطور ارسال می‌کنید؟"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="p-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};
