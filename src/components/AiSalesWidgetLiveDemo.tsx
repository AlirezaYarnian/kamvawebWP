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
  Globe,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Sliders,
  HelpCircle,
  DollarSign,
  Award,
  Truck,
  ShoppingCart,
  Percent,
  CheckCircle2
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
      text: config.aiCore.botWelcomeMessage || 'سلام! من دستیار هوشمند و مشاور فروشگاه هستم. چطور می‌توانم در انتخاب محصول به شما کمک کنم؟',
      timestamp: 'هم‌اکنون',
      source: 'پایگاه دانش محلی کامواوب (Real Stored Data)',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(16);
  const [lastEngineSource, setLastEngineSource] = useState<string>('مغز خودمختار کامواوب (Zero Server Load)');
  
  // Real-time Sales Intent & Auto-Knowledge Extraction State
  const [salesIntent, setSalesIntent] = useState<any>({
    purchaseIntentScore: 78,
    intentCategory: 'کسب اطلاعات محصول / آماده‌سازی خرید',
    conversionProbability: 'بالا (High Probability)'
  });
  const [isExtractingKb, setIsExtractingKb] = useState(false);
  const [extractKbFeedback, setExtractKbFeedback] = useState<string | null>(null);

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

  // Sub-view switcher state: 'chat-kb' | 'bot-training' | 'behavior-analysis'
  const [activeSubView, setActiveSubView] = useState<'chat-kb' | 'bot-training' | 'behavior-analysis'>('chat-kb');

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

  // Chatbot Training & Persona Customization State
  const [botPersona, setBotPersona] = useState<'professional' | 'friendly' | 'expert' | 'sales'>('sales');
  const [customInstructions, setCustomInstructions] = useState<string>(
    'همیشه پاسخ‌ها را با لحنی صمیمی و حرفه‌ای ارائه بده. در انتهای پاسخ‌های مرتبط با محصول، یک پیشنهاد تخفیف یا لینک افزودن به سبد خرید معرفی کن.'
  );
  const [customTrainingFaqs, setCustomTrainingFaqs] = useState<Array<{ q: string; a: string }>>([
    { q: 'شرایط ارسال سفارشات چطور است؟', a: 'کلیه سفارشات با پست پیشتاز و تیپاکس طی ۲۴ الی ۴۸ ساعت کاری به سراسر کشور ارسال می‌شود.' },
    { q: 'آیا امکان مرجوعی کالا وجود دارد؟', a: 'بله، با تضمین بازگشت وجه ۷ روزه بدون قید و شرط در صورت نارضایتی از کیفیت کالا.' }
  ]);
  const [newTrainingQ, setNewTrainingQ] = useState('');
  const [newTrainingA, setNewTrainingA] = useState('');
  const [trainingSavedNotice, setTrainingSavedNotice] = useState(false);

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
          siteContext: `${config.general.siteName} - Persona: ${botPersona} - Instructions: ${customInstructions}`,
        }),
      });

      const data = await response.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setLastLatencyMs(latency);

      if (data.salesAnalytics) {
        setSalesIntent(data.salesAnalytics);
      }

      // Check if any custom training FAQ matches
      let finalReply = data.reply || 'اطلاعات بررسی شد و در خدمت شما هستم.';
      const matchedFaq = customTrainingFaqs.find(f => textToSend.toLowerCase().includes(f.q.toLowerCase().slice(0, 5)));
      if (matchedFaq) {
        finalReply = matchedFaq.a + '\n\n💡 (پاسخ سفارشی‌شده بر اساس آموزش‌های شما)';
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: finalReply,
        timestamp: 'هم‌اکنون',
        source: data.source === 'gemini-neural-core' ? 'موتور عصبی پیشرفته Gemini' : 'مغز خودمختار محلی کامواوب (ربات آموزش‌دیده)',
      };

      setLastEngineSource(aiReply.source || 'هسته خودمختار');
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'سلام! محصول مورد نظر شما در پایگاه دانش بررسی شد و با تضمین بهترین قیمت و کیفیت تقدیم حضورتان می‌شود. آیا مایل به ثبت سفارش هستید؟',
        timestamp: 'هم‌اکنون',
        source: 'مغز خودمختار کامواوب',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractKnowledgeFromChat = async () => {
    if (messages.length < 2 || isExtractingKb) return;
    setIsExtractingKb(true);
    setExtractKbFeedback(null);

    try {
      const res = await fetch('/api/ai/chat/extract-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messagesHistory: messages }),
      });
      const data = await res.json();
      if (data.success && data.newItems) {
        onUpdateKnowledgeBase([...data.newItems, ...knowledgeBase]);
        setExtractKbFeedback(data.message);
        setTimeout(() => setExtractKbFeedback(null), 5000);
      }
    } catch (e) {
      console.error('Failed to extract knowledge', e);
      setExtractKbFeedback('خطا در استخراج دانش خودکار از چت.');
    } finally {
      setIsExtractingKb(false);
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
      if (data.success && data.scrapedData) {
        const newItem: KnowledgeItem = {
          id: `crawled-${Date.now()}`,
          title: data.scrapedData.title || 'صفحه خزیده شده',
          content: data.scrapedData.summary || data.scrapedData.content || 'محتوای استخراج شده از لینک',
          price: data.scrapedData.price || 'تماس بگیرید',
          category: 'product',
          keywords: data.scrapedData.keywords || ['محصول', 'جدید'],
          conversionTrigger: 'تخفیف ویژه خرید آنلاین مستقیم',
          sourceUrl: quickCrawlUrl,
        };
        onUpdateKnowledgeBase([newItem, ...knowledgeBase]);
        setCrawlFeedback(`✓ با موفقیت از "${data.scrapedData.title}" استخراج و به پایگاه دانش افزوده شد!`);
        setQuickCrawlUrl('');
      } else {
        setCrawlFeedback('خطا در خزش لینک. لطفا دوباره تلاش کنید.');
      }
    } catch (e) {
      setCrawlFeedback('ارتباط با خزشگر برقرار نشد.');
    } finally {
      setIsQuickCrawling(false);
    }
  };

  const handleAddKbItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemContent.trim()) return;

    const newItem: KnowledgeItem = {
      id: `kb-manual-${Date.now()}`,
      title: newItemTitle,
      content: newItemContent,
      price: newItemPrice || 'توافقی',
      category: newItemCategory,
      keywords: newItemKeywords ? newItemKeywords.split(',').map((s) => s.trim()) : [newItemTitle],
      conversionTrigger: 'مشاوره رایگان خرید و ارسال فوری',
    };

    onUpdateKnowledgeBase([newItem, ...knowledgeBase]);
    setNewItemTitle('');
    setNewItemContent('');
    setNewItemPrice('');
    setNewItemKeywords('');
    setIsAddingKb(false);
  };

  const handleDeleteKbItem = (id: string) => {
    onUpdateKnowledgeBase(knowledgeBase.filter((k) => k.id !== id));
  };

  const handleAddTrainingFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainingQ.trim() || !newTrainingA.trim()) return;
    setCustomTrainingFaqs([...customTrainingFaqs, { q: newTrainingQ, a: newTrainingA }]);
    setNewTrainingQ('');
    setNewTrainingA('');
    setTrainingSavedNotice(true);
    setTimeout(() => setTrainingSavedNotice(false), 3000);
  };

  const handleDeleteTrainingFaq = (index: number) => {
    setCustomTrainingFaqs(customTrainingFaqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner - Clean & Modern */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>هسته هوش مصنوعی، پایگاه دانش و مدیریت چت‌بات</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            دستیار فروش هوشمند و آموزش چت‌بات کامواوب
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
            مدیریت پایگاه دانش، آموزش دستورالعمل‌ها، تنظیم شخصیت چت‌بات و بررسی آنالیز رفتار مخاطبان جهت افزایش نرخ تبدیل فروشگاه.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 block">اقلام پایگاه دانش</span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-0.5 block">{knowledgeBase.length} مورد</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 block">پاسخگویی ربات</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">&lt; {lastLatencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* Sub-View Navigation Tabs - Clean & Spacious */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubView('chat-kb')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'chat-kb'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>تست زنده چت‌بات و پایگاه دانش</span>
        </button>

        <button
          onClick={() => setActiveSubView('bot-training')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'bot-training'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>آموزش پیشرفته و شخصیت چت‌بات</span>
        </button>

        <button
          onClick={() => setActiveSubView('behavior-analysis')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubView === 'behavior-analysis'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>ماژول تحلیل رفتار مشتری و CRO</span>
        </button>
      </div>

      {/* Conditional Rendering for Sub-Views */}
      {activeSubView === 'behavior-analysis' ? (
        <CustomerBehaviorModule
          clickPath={clickPath}
          dwellTimes={dwellTimes}
          bounceRate={bounceRate}
          behaviorReport={behaviorReport}
          onUpdateReport={setBehaviorReport}
        />
      ) : activeSubView === 'bot-training' ? (
        /* Chatbot Advanced Training & Persona View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Top: Persona & Behavior Instructions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">شخصیت و لحن پاسخگویی ربات</h3>
                    <p className="text-[11px] text-slate-400">انتخاب سبک گویش و رویکرد فروش مشاور هوشمند</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sales', title: 'مشاور فروش و تخفیف', desc: 'تمرکز بالا روی متقاعد کردن و ارائه پیشنهاد شگفت‌انگیز' },
                  { id: 'professional', title: 'رسمی و شرکتی', desc: 'پاسخ‌های دقیق، ساختاریافته و کاملاً حرفه‌ای' },
                  { id: 'friendly', title: 'صمیمی و دوستانه', desc: 'گویش گرم، خودمانی و راحت با مخاطب' },
                  { id: 'expert', title: 'متخصص فنی و گارانتی', desc: 'تمرکز روی جزئیات سخت‌افزاری و اصالت کالا' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setBotPersona(p.id as any)}
                    className={`p-4 rounded-xl text-right transition-all cursor-pointer border ${
                      botPersona === p.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block text-white">{p.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">{p.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 block">دستورالعمل‌ها و پرامپت‌های رفتاری سفارشی:</label>
                <textarea
                  rows={4}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="دستورالعمل‌های خاص برای ربات..."
                />
              </div>

              <button
                onClick={() => {
                  setTrainingSavedNotice(true);
                  setTimeout(() => setTrainingSavedNotice(false), 3000);
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>ذخیره تنظیمات و به‌روزرسانی هوش مصنوعی ربات</span>
              </button>

              {trainingSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium animate-pulse">
                  ✓ تنظیمات و شخصیت جدید ربات با موفقیت ذخیره و روی هسته فعال شد!
                </div>
              )}
            </div>
          </div>

          {/* Right / Bottom: Custom Q&A Training Fine-Tuning */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">آموزش پرسش و پاسخ‌های اختصاصی (Q&A)</h3>
                    <p className="text-[11px] text-slate-400">تدریس پاسخ دقیق به سوالات پرتکرار مشتریان</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddTrainingFaq} className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">افزودن آموزش جدید به ربات:</span>
                <input
                  type="text"
                  value={newTrainingQ}
                  onChange={(e) => setNewTrainingQ(e.target.value)}
                  placeholder="سوال مشتری (مثلاً: شرایط پرداخت اقساطی چطور است؟)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  rows={2}
                  value={newTrainingA}
                  onChange={(e) => setNewTrainingA(e.target.value)}
                  placeholder="پاسخ دقیق ربات به این سوال..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={!newTrainingQ.trim() || !newTrainingA.trim()}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>آموزش این مورد به چت‌بات</span>
                </button>
              </form>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-400 block">آموزش‌های فعال ثبت شده ({customTrainingFaqs.length}):</span>
                {customTrainingFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative group">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {faq.q}
                      </span>
                      <button
                        onClick={() => handleDeleteTrainingFaq(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="حذف آموزش"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed pr-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Full-Width: Advanced Sales & Objection Handling Matrix */}
          <div className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">ماتریس آموزش پیشرفته فنون فروش و رفع اعتراضات مشتریان (Objection Handling Matrix)</h3>
                    <p className="text-[11px] text-slate-400">سناریوهای روانشناسی تبدیل و مذاکره خودکار هوش مصنوعی برای افزایش فروشگاه</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 self-start sm:self-auto">
                  ۶ سناریوی هوشمند فعال
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: DollarSign,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    title: 'مدیریت اعتراض به قیمت (Price Resistance)',
                    userQuery: 'قیمت محصولاتتون خیلی بالاست، تخفیف بیشتری نمیدین؟',
                    strategy: 'تاکید بر ۲۴ ماه گارانتی تعویض درجا، ارزش مالکیت طولانی‌مدت، فعال‌سازی کد تخفیف ۷٪ آنی (KAMVA-VIP) و پیشنهاد خرید اقساطی ۴ ماهه بدون ضامن.',
                    triggerText: 'تست زنده سناریوی قیمت',
                  },
                  {
                    icon: ShieldCheck,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    title: 'رفع تردید در اصالت کالا (Trust & Authenticity)',
                    userQuery: 'از کجا معلوم کالاها اصل باشن و فیک نباشه؟',
                    strategy: 'ارائه نماد اعتماد اینماد ۵ ستاره، تضمین بازگشت ۱۰۰٪ وجه تا ۷ روز بی‌قید و شرط، ارسال فاکتور رسمی و ثبت سریال در سامانه گارانتی.',
                    triggerText: 'تست سناریوی اصالت',
                  },
                  {
                    icon: Percent,
                    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                    title: 'مشاوره خرید اقساطی بدون چک (BNPL Financing)',
                    userQuery: 'شرایط خرید اقساطی با اسنپ‌پی بدون چک چطوره؟',
                    strategy: 'توضیح تسویه در ۴ قسط بدون سود و کارمزد با اعتبارسنجی زیر ۳ دقیقه فقط با کدملی، بدون نیاز به چک، سفته یا ضامن.',
                    triggerText: 'تست سناریوی اقساط',
                  },
                  {
                    icon: Truck,
                    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                    title: 'پاسخ به سوالات لجستیک و ارسال (Delivery Timing)',
                    userQuery: 'سفارش من دقیقاً چند روزه به شهرستان می‌رسه؟',
                    strategy: 'تحویل زیر ۳ ساعت در تهران، ۲۴ الی ۴۸ ساعت برای شهرستان‌ها با پست پیشتاز و تیپاکس، همراه با بیمه کامل و ارسال رایگان بالای ۲ میلیون تومان.',
                    triggerText: 'تست سناریوی ارسال',
                  },
                  {
                    icon: TrendingUp,
                    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    title: 'کشف نیاز و مشاوره بودجه (Need & Budget Discovery)',
                    userQuery: 'با بودجه محدود زیر ۱۰ میلیون چی پیشنهاد می‌دین؟',
                    strategy: 'تحلیل دقیق سقف بودجه، معرفی مدل‌های با بالاترین ارزش خرید (Value-for-Money) و ارائه راهکار ارتقاء سبد با اقساط ماهانه.',
                    triggerText: 'تست کشف نیاز بودجه',
                  },
                  {
                    icon: ShoppingCart,
                    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                    title: 'مقایسه محصولات و پیشنهاد باندل (Cross-Sell / Up-Sell)',
                    userQuery: 'بین لپ‌تاپ مهندسی و هدفون مانیتورینگ کدوم بهتره؟',
                    strategy: 'تفکیک کاربردها بر اساس نیاز کاری، معرفی پکیج باندل با ۱۵٪ تخفیف روی کل سبد خرید و اکسسوری‌های هدیه.',
                    triggerText: 'تست مقایسه و باندل',
                  }
                ].map((scenario, sIdx) => {
                  const Icon = scenario.icon;
                  return (
                    <div key={sIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${scenario.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-white">{scenario.title}</span>
                        </div>
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] text-amber-200/90">
                          <strong>پرسش مشتری:</strong> «{scenario.userQuery}»
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">استراتژی فروش:</strong> {scenario.strategy}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveSubView('chat-kb');
                          handleSendMessage(scenario.userQuery);
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-700 hover:border-indigo-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{scenario.triggerText}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Main Grid: Knowledge Base (Right) & Live Chat Widget (Left) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Right side: Knowledge Base Management & Crawler */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quick Live URL Crawl Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">خزشگر هوشمند لینک (Live Crawler)</h3>
                    <p className="text-[11px] text-slate-400">افزودن آنی محصول یا مقاله از وب به پایگاه دانش</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleQuickCrawl} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={quickCrawlUrl}
                    onChange={(e) => setQuickCrawlUrl(e.target.value)}
                    placeholder="https://yourstore.com/product-item"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isQuickCrawling || !quickCrawlUrl.trim()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                  >
                    {isQuickCrawling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>خزش و یادگیری</span>
                  </button>
                </div>
                {crawlFeedback && (
                  <p className="text-xs text-emerald-400 font-medium">{crawlFeedback}</p>
                )}
              </form>
            </div>

            {/* Knowledge Base Items List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">پایگاه دانش محلی و محصولات</h3>
                    <p className="text-[11px] text-slate-400">مرجع پاسخگویی ربات و تحلیلگر فروش</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingKb(!isAddingKb)}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن دستی</span>
                </button>
              </div>

              {isAddingKb && (
                <form onSubmit={handleAddKbItem} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">افزودن آیتم جدید به پایگاه دانش:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="عنوان محصول یا مقاله"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="قیمت (مثلاً 24,000,000 تومان)"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={newItemContent}
                    onChange={(e) => setNewItemContent(e.target.value)}
                    placeholder="توضیحات و مشخصات فنی..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemKeywords}
                      onChange={(e) => setNewItemKeywords(e.target.value)}
                      placeholder="کلیدواژه‌ها (با کاما جدا کنید)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      ثبت نهایی
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {knowledgeBase.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                        {item.price && (
                          <span className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5 block">{item.price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteKbItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              
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
                      {lastEngineSource} (شخصیت: {botPersona})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExtractKnowledgeFromChat}
                    disabled={isExtractingKb || messages.length < 2}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-lg transition-all flex items-center gap-1 shadow cursor-pointer disabled:opacity-50"
                    title="استخراج و ساخت خودکار دانش جدید از گفتگوی چت"
                  >
                    <GraduationCap className={`w-3.5 h-3.5 ${isExtractingKb ? 'animate-spin' : ''}`} />
                    <span>{isExtractingKb ? 'استخراج دانش...' : 'استخراج دانش خودکار'}</span>
                  </button>

                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/30 text-emerald-300 font-mono font-bold">
                    {lastLatencyMs}ms
                  </span>
                </div>
              </div>

              {/* Real-time Sales Intent & Conversion Probability Bar */}
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">نیت خرید خریدار (Sales Intent):</span>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold">
                    {salesIntent.intentCategory}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">احتمال تبدیل:</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">
                    {salesIntent.purchaseIntentScore}% ({salesIntent.conversionProbability})
                  </span>
                </div>
              </div>

              {extractKbFeedback && (
                <div className="bg-emerald-950/90 text-emerald-200 text-xs px-4 py-2 border-b border-emerald-500/40 flex items-center justify-between animate-fade-in">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {extractKbFeedback}
                  </span>
                </div>
              )}

              {/* Quick Consultative Sales Prompt Badges */}
              <div className="bg-slate-950/80 border-b border-slate-800/80 px-3 py-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-thin">
                <span className="text-slate-400 shrink-0 text-[10px] font-bold">تست سناریوهای فروش:</span>
                <button
                  onClick={() => handleSendMessage('قیمت و مشخصات فنی اولترابوک کامواوب X15 رو بفرمایید')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/40 text-slate-200 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  💻 لپ‌تاپ X15
                </button>
                <button
                  onClick={() => handleSendMessage('قیمت محصولاتتون خیلی بالاست، تخفیف بیشتری نمیدین؟')}
                  className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-600 text-amber-200 border border-amber-500/30 rounded-full transition-all shrink-0 cursor-pointer"
                  title="تست روانشناسی فروش و مدیریت اعتراض به قیمت"
                >
                  💰 اعتراض به قیمت
                </button>
                <button
                  onClick={() => handleSendMessage('از کجا مطمئن بشم کالاهای شما اصل هستن و فیک نیست؟')}
                  className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/30 rounded-full transition-all shrink-0 cursor-pointer"
                  title="تست اعتماد و تضمین اصالت و اینماد"
                >
                  🛡️ شک در اصالت
                </button>
                <button
                  onClick={() => handleSendMessage('شرایط خرید اقساطی با اسنپ‌پی بدون چک و ضامن چطوره؟')}
                  className="px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/30 rounded-full transition-all shrink-0 cursor-pointer"
                  title="تست خرید اقساطی BNPL در ۴ قسط"
                >
                  💳 خرید اقساطی
                </button>
                <button
                  onClick={() => handleSendMessage('بین لپ‌تاپ مهندسی و هدفون مانیتورینگ کدوم برای کار من بهتره؟')}
                  className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-600 text-purple-200 border border-purple-500/30 rounded-full transition-all shrink-0 cursor-pointer"
                  title="تست کشف نیاز، مقایسه و پیشنهاد باندل"
                >
                  ⚖️ مقایسه و باندل
                </button>
                <button
                  onClick={() => handleSendMessage('آیا شما لپ‌تاپ‌های ایسوس ROG هم فروش اقساطی دارید؟')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-rose-900/60 text-rose-300 font-bold border border-rose-500/30 rounded-full transition-all shrink-0 cursor-pointer"
                  title="تست سوال خارج از پایگاه دانش و ارجاع مودبانه به مشاور انسانی"
                >
                  ❓ ارجاع به مشاور انسانی
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

                      {/* Interactive Consultative Conversion Actions */}
                      {msg.sender === 'ai' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5">
                          {/* Discount Copy Trigger */}
                          {msg.text.includes('KAMVA-VIP') && (
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText('KAMVA-VIP');
                                const sysMsg: ChatMessage = {
                                  id: `sys-coupon-${Date.now()}`,
                                  sender: 'ai',
                                  text: '🎁 کد تخفیف ۷٪ آنی (KAMVA-VIP) با موفقیت در کلیپ‌بورد شما ذخیره شد و در مرحله تسویه حساب اعمال خواهد شد!',
                                  timestamp: 'هم‌اکنون',
                                  source: 'تخفیف اختصاصی مشاور فروش'
                                };
                                setMessages((prev) => [...prev, sysMsg]);
                              }}
                              className="w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Percent className="w-3.5 h-3.5" />
                              <span>کپی کد تخفیف ۷٪ آنی (KAMVA-VIP)</span>
                            </button>
                          )}

                          {/* Installment Guide Trigger */}
                          {(msg.text.includes('اسنپ‌پی') || msg.text.includes('قسط')) && (
                            <button
                              onClick={() => {
                                const sysMsg: ChatMessage = {
                                  id: `sys-bnpl-${Date.now()}`,
                                  sender: 'ai',
                                  text: '💳 راهنمای خرید اقساطی: سبد خرید خود را تکمیل نمایید و در درگاه پرداخت، گزینه «اسنپ‌پی» را انتخاب کنید. قسط اول در لحظه خرید و ۳ قسط دیگر در ماه‌های آینده بدون ضامن کسر خواهد شد.',
                                  timestamp: 'هم‌اکنون',
                                  source: 'سرویس BNPL اسنپ‌پی و تارا'
                                };
                                setMessages((prev) => [...prev, sysMsg]);
                              }}
                              className="w-full py-1.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>مشاهده راهنمای خرید در ۴ قسط بدون سود</span>
                            </button>
                          )}

                          {/* Human Sales Advisor Transfer Button */}
                          {(msg.text.includes('مشاور') || msg.text.includes('ارتباط')) && (
                            <button
                              onClick={() => {
                                const confirmMsg: ChatMessage = {
                                  id: `sys-${Date.now()}`,
                                  sender: 'ai',
                                  text: '🎧 درخواست شما با موفقیت برای اولین مشاور فروشگاه ارجاع داده شد. شماره تماس مستقیم: ۰۲۱-۹۱۰۰۰۰۰۰ | پشتیبانی برخط واتساپ در خدمت شماست.',
                                  timestamp: 'هم‌اکنون',
                                  source: 'سامانه ارجاع به مشاور انسانی کامواوب',
                                };
                                setMessages((prev) => [...prev, confirmMsg]);
                              }}
                              className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>درخواست اتصال به مشاور متخصص فروشگاه</span>
                            </button>
                          )}
                        </div>
                      )}
                      
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
                    <span>هوش مصنوعی کامواوب در حال ارزیابی پایگاه دانش و آماده‌سازی بهترین پاسخ...</span>
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
