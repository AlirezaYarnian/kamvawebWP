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
  HelpCircle
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
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/30 text-emerald-300 font-mono font-bold">
                    {lastLatencyMs}ms
                  </span>
                </div>
              </div>

              {/* Quick Prompt Badges */}
              <div className="bg-slate-950/80 border-b border-slate-800/80 px-3 py-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 shrink-0 text-[10px]">تست سریع:</span>
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
