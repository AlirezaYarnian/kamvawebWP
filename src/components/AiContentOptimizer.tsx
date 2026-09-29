import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightLeft, 
  Zap, 
  Layers, 
  Eye, 
  Copy, 
  Check, 
  RefreshCw, 
  Wand2, 
  BookOpen, 
  Sliders, 
  Share2, 
  Terminal, 
  ShoppingBag, 
  Globe, 
  Send, 
  Plus, 
  Trash2, 
  Type, 
  Split, 
  Cpu, 
  CheckCheck,
  Smartphone,
  Monitor,
  Flame,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { 
  ContentDocument, 
  ContentOptimizerTarget, 
  EditorConnectionType, 
  ContentTone,
  GrammarIssue,
  SeoRecommendation,
  GutenbergBlockItem
} from '../types/theme';

export const AiContentOptimizer: React.FC = () => {
  // State
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-prod-101');
  const [activeTab, setActiveTab] = useState<'editor' | 'grammar' | 'seo' | 'readability' | 'export'>('editor');
  const [editorMode, setEditorMode] = useState<'blocks' | 'raw' | 'elementor'>('blocks');
  const [serpDevice, setSerpDevice] = useState<'mobile' | 'desktop'>('desktop');
  
  // Document form state
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [focusKeyphrase, setFocusKeyphrase] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [contentRaw, setContentRaw] = useState<string>('');
  const [targetType, setTargetType] = useState<ContentOptimizerTarget>('product_description');
  const [editorType, setEditorType] = useState<EditorConnectionType>('woocommerce_rest');
  const [tone, setTone] = useState<ContentTone>('persuasive_sales');
  
  // Optimization results
  const [blocks, setBlocks] = useState<GutenbergBlockItem[]>([]);
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([]);
  const [seoRecs, setSeoRecs] = useState<SeoRecommendation[]>([]);
  const [seoScore, setSeoScore] = useState<number>(92);
  const [readabilityScore, setReadabilityScore] = useState<number>(88);
  const [grammarScore, setGrammarScore] = useState<number>(95);
  const [readabilityMetrics, setReadabilityMetrics] = useState<any>(null);
  const [lsiKeywords, setLsiKeywords] = useState<string[]>([]);
  
  // UI states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSyncingWp, setIsSyncingWp] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [elementorJsonString, setElementorJsonString] = useState<string>('');
  const [wpSyncResponse, setWpSyncResponse] = useState<any>(null);

  // Load document list
  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/content-optimizer/documents');
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.warn('Failed to fetch documents', err);
    }
  };

  // Load document by ID
  const loadSingleDocument = async (id: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/content-optimizer/documents/${id}`);
      const data = await res.json();
      if (data.success && data.document) {
        const doc: ContentDocument = data.document;
        setTitle(doc.title);
        setSlug(doc.slug);
        setFocusKeyphrase(doc.focusKeyphrase);
        setMetaTitle(doc.metaTitle);
        setMetaDescription(doc.metaDescription);
        setContentRaw(doc.contentRaw);
        setTargetType(doc.targetType);
        setEditorType(doc.editorType);
        setTone(doc.tone);
        setBlocks(doc.blocks || []);
        setGrammarIssues(doc.grammarIssues || []);
        setSeoRecs(doc.seoRecommendations || []);
        setSeoScore(doc.seoScore || 90);
        setReadabilityScore(doc.readabilityScore || 85);
        setGrammarScore(doc.grammarScore || 92);
        setReadabilityMetrics(doc.readabilityMetrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadSingleDocument(selectedDocId);
  }, []);

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    loadSingleDocument(id);
  };

  // Run AI analysis
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/content-optimizer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentRaw,
          title,
          focusKeyphrase,
          targetType,
          editorType,
          tone
        })
      });
      const data = await res.json();
      if (data.success) {
        setSeoScore(data.seoScore);
        setReadabilityScore(data.readabilityScore);
        setGrammarScore(data.grammarScore);
        setGrammarIssues(data.grammarIssues || []);
        setSeoRecs(data.seoRecommendations || []);
        setReadabilityMetrics(data.readabilityMetrics);
        if (data.blocks && data.blocks.length > 0) {
          setBlocks(data.blocks);
        }
        if (data.lsiKeywords) {
          setLsiKeywords(data.lsiKeywords);
        }
        if (!metaTitle && data.suggestedMetaTitle) {
          setMetaTitle(data.suggestedMetaTitle);
        }
        if (!metaDescription && data.suggestedMetaDescription) {
          setMetaDescription(data.suggestedMetaDescription);
        }
        showToast('آنالیز هوشمند و بهینه‌سازی گرامر، سئو و ساختار بلاک‌ها با موفقیت انجام شد!');
      }
    } catch (err) {
      console.error(err);
      showToast('خطا در ارتباط با سرور آنالیز محتوا.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply single grammar fix
  const handleApplyGrammarFix = (issue: GrammarIssue) => {
    let updatedContent = contentRaw.replace(issue.originalText, issue.suggestedText);
    setContentRaw(updatedContent);
    setGrammarIssues(prev => prev.map(i => i.id === issue.id ? { ...i, applied: true } : i));
    setGrammarScore(prev => Math.min(100, prev + 2));
    showToast(`اصلاحیه «${issue.originalText}» به «${issue.suggestedText}» اعمال شد.`);
  };

  // Fix all grammar issues
  const handleFixAllGrammar = () => {
    let text = contentRaw;
    grammarIssues.forEach(issue => {
      if (!issue.applied) {
        text = text.replaceAll(issue.originalText, issue.suggestedText);
      }
    });
    setContentRaw(text);
    setGrammarIssues(prev => prev.map(i => ({ ...i, applied: true })));
    setGrammarScore(99);
    showToast('تمامی اصلاحات نیم‌فاصله، حشو و نگارش با موفقیت اعمال گردید.');
  };

  // Sync with WordPress Database
  const handleSyncToWordPress = async () => {
    setIsSyncingWp(true);
    try {
      const res = await fetch('/api/content-optimizer/sync-wp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDocId,
          title,
          content: contentRaw,
          blocks,
          targetType,
          editorType,
          metaTitle,
          metaDescription,
          focusKeyphrase
        })
      });
      const data = await res.json();
      if (data.success) {
        setWpSyncResponse(data.wpPost);
        showToast(data.message || 'همگام‌سازی با پایگاه داده وردپرس با موفقیت تکمیل شد.');
      }
    } catch (err) {
      console.error(err);
      showToast('خطا در همگام‌سازی با وردپرس.');
    } finally {
      setIsSyncingWp(false);
    }
  };

  // Generate Elementor Container model
  const handleGenerateElementor = async () => {
    try {
      const res = await fetch('/api/content-optimizer/generate-elementor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          blocks,
          focusKeyphrase
        })
      });
      const data = await res.json();
      if (data.success) {
        setElementorJsonString(data.elementorJsonString);
        showToast('مدل ویجت‌های کانتینر المنتور (Elementor JSON) تولید گردید.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
    showToast(`${label} در کلیپ‌بورد کپی شد.`);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
                <Wand2 className="w-6 h-6 text-white" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                  بهینه‌ساز هوشمند محتوا و دستیار بلاک‌های وردپرس / المنتور
                  <span className="text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    AiContentOptimizer v2.5
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  اتصال مستقیم به ویرایشگر بلاک گوتنبرگ و المنتور جهت بهینه‌سازی بلادرنگ سئو، نگارش فارسی، خوانایی و روان‌شناسی فروش
                </p>
              </div>
            </div>
          </div>

          {/* Quick Document Picker & Action */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={selectedDocId}
              onChange={(e) => handleSelectDoc(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.targetType === 'product_description' ? '🛍️ محصول: ' : '📝 مقاله: '} {doc.title.slice(0, 38)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isAnalyzing ? 'در حال پردازش هوشمند...' : 'آنالیز مجدد با هوش مصنوعی'}</span>
            </button>

            <button
              onClick={handleSyncToWordPress}
              disabled={isSyncingWp}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isSyncingWp ? 'animate-spin' : ''}`} />
              <span>{isSyncingWp ? 'در حال ارسال به WP...' : 'همگام‌سازی در دیتابیس وردپرس'}</span>
            </button>
          </div>
        </div>

        {/* Global Live Scores Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">نمره سئو محتوا (SEO)</span>
              <span className="text-lg font-black text-emerald-400">{seoScore} / ۱۰۰</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Search className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">شاخص روان‌خوانی (Readability)</span>
              <span className="text-lg font-black text-blue-400">{readabilityScore} / ۱۰۰</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">پاکی نگارش فارسی (Grammar)</span>
              <span className="text-lg font-black text-purple-400">{grammarScore} / ۱۰۰</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Type className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">وضعیت اتصال به ادیتور</span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {editorType === 'woocommerce_rest' ? 'ووکامرس REST v3' : editorType === 'elementor' ? 'موتور المنتور' : 'گوتنبرگ WP 7.1'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ویرایشگر و بلاک‌های زنده (Live Editor)</span>
        </button>

        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
            activeTab === 'grammar'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>ویراستاری فارسی و نیم‌فاصله</span>
          {grammarIssues.filter(i => !i.applied).length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {grammarIssues.filter(i => !i.applied).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>بهینه‌سازی سئو، SERP و اسکیما</span>
        </button>

        <button
          onClick={() => setActiveTab('readability')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'readability'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>شاخص‌های خوانایی و روانی متن</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'export'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>خروجی گوتنبرگ / JSON المنتور</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE EDITOR & BLOCK SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form & Meta Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Context & Target Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>پیکربندی نوع محتوا و ادیتور</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">نوع هدف محتوا</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as ContentOptimizerTarget)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    <option value="product_description">توضیحات محصول ووکامرس (WooCommerce)</option>
                    <option value="blog_post">مقاله و پست وبلاگ (Gutenberg Blog Post)</option>
                    <option value="landing_elementor">سکشن لندینگ پیج المنتور (Elementor)</option>
                    <option value="category_archive">توضیحات دسته‌بندی و آرشیو (Archive SEO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">ویرایشگر متصل (Editor Engine)</label>
                  <select
                    value={editorType}
                    onChange={(e) => setEditorType(e.target.value as EditorConnectionType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    <option value="woocommerce_rest">ووکامرس REST API + بلاک‌های اختصاصی کاموا</option>
                    <option value="gutenberg">بلاک ادیتور گوتنبرگ (Core Gutenberg Blocks)</option>
                    <option value="elementor">موتور المنتور کانتینری (Elementor Flexbox)</option>
                    <option value="classic_tinymce">ویرایشگر کلاسیک TinyMCE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">لحن و روان‌شناسی نگارش (Tone)</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as ContentTone)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    <option value="persuasive_sales">فروش ترغیب‌کننده و رفع دغدغه خریدار (High-Conversion Sales)</option>
                    <option value="authoritative_technical">تخصصی، فنی و مستند (Authority & Engineering)</option>
                    <option value="educational_seo">آموزشی، جامع و بهینه‌شده برای رتبه ۱ گوگل</option>
                    <option value="luxury_vip">لوکس، خاص و پرمیوم (VIP Tone)</option>
                    <option value="engaging_story">داستان‌سرایی صمیمی و درگیرکننده (Storytelling)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Focus Keyphrase & LSI */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>کلیدواژه کانونی و LSI هوشمند</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">عبارت کلیدی کانونی (Focus Keyphrase)</label>
                  <input
                    type="text"
                    value={focusKeyphrase}
                    onChange={(e) => setFocusKeyphrase(e.target.value)}
                    placeholder="مثال: هدفون بی سیم نویز کنسلینگ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {lsiKeywords.length > 0 && (
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">پیشنهاد کلمات کلیدی LSI و معنایی:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {lsiKeywords.map((kw, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setContentRaw(prev => prev + `\n${kw}`);
                            showToast(`کلمه کلیدی «${kw}» به انتهای متن اضافه شد.`);
                          }}
                          className="px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          + {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary of Issues */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>خطاهای نیازمند بازبینی</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {grammarIssues.filter(i => !i.applied).length} مورد
                </span>
              </div>

              {grammarIssues.filter(i => !i.applied).length === 0 ? (
                <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>هیچ خطای نگارشی در متن یافت نشد.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {grammarIssues.filter(i => !i.applied).slice(0, 3).map((issue) => (
                    <div key={issue.id} className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="line-through text-rose-400 font-mono ml-2">{issue.originalText}</span>
                        <span className="text-emerald-400 font-bold font-mono">← {issue.suggestedText}</span>
                      </div>
                      <button
                        onClick={() => handleApplyGrammarFix(issue)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg shrink-0 cursor-pointer"
                      >
                        اصلاح
                      </button>
                    </div>
                  ))}
                  {grammarIssues.filter(i => !i.applied).length > 3 && (
                    <button
                      onClick={() => setActiveTab('grammar')}
                      className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-bold pt-1 cursor-pointer"
                    >
                      مشاهده همه {grammarIssues.filter(i => !i.applied).length} خطای نگارشی →
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Live Block Canvas & WYSIWYG Editor (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Document Title & Slug */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">عنوان صفحه / محصول</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان پست یا محصول..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm sm:text-base font-bold text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>نامک وردپرس (Slug):</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent border-b border-dashed border-slate-700 text-slate-200 focus:outline-none text-xs w-64"
                />
              </div>
            </div>

            {/* Editor Switcher Bar */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditorMode('blocks')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'blocks'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  بلاک‌های زنده گوتنبرگ (Gutenberg Preview)
                </button>
                <button
                  onClick={() => setEditorMode('raw')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'raw'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ویرایشگر متنی آزاد (Raw Content)
                </button>
                <button
                  onClick={() => {
                    setEditorMode('elementor');
                    if (!elementorJsonString) handleGenerateElementor();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'elementor'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  پیش‌نمایش کانتینر المنتور
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                تعداد کلمات: {contentRaw.split(/\s+/).filter(Boolean).length} کلمه
              </span>
            </div>

            {/* Mode 1: Gutenberg Visual Block Preview */}
            {editorMode === 'blocks' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    بلاک‌های ساختاریافته مطابق استانداردهای وردپرس ۷.۱
                  </span>
                  <button
                    onClick={handleRunAiAnalysis}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    بازنویسی خودکار بلاک‌ها
                  </button>
                </div>

                <div className="space-y-4">
                  {blocks.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      هیچ بلاکی برای نمایش وجود ندارد. برای تولید بلاک‌های گوتنبرگ، روی دکمه «آنالیز مجدد با هوش مصنوعی» کلیک کنید.
                    </div>
                  ) : (
                    blocks.map((blk, idx) => (
                      <div
                        key={blk.id || idx}
                        className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all relative group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 px-2.5 py-0.5 rounded-md">
                            {blk.blockName}
                          </span>
                          {blk.hasIssues && (
                            <span className="text-[10px] text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              پیشنهاد بهبود AI در دسترس است
                            </span>
                          )}
                        </div>

                        {/* Render Block Content */}
                        <div 
                          className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-200"
                          dangerouslySetInnerHTML={{ __html: blk.suggestedHtml || blk.innerHtml }}
                        />

                        {blk.suggestedHtml && blk.suggestedHtml !== blk.innerHtml && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[11px]">نسخه پیشنهادی هوش مصنوعی اعمال شده است</span>
                            <button
                              onClick={() => {
                                setBlocks(prev => prev.map(b => b.id === blk.id ? { ...b, innerHtml: b.suggestedHtml || b.innerHtml } : b));
                                showToast('بلاک به‌روزرسانی شد.');
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              تایید نهایی بلاک
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Raw WYSIWYG Editor */}
            {editorMode === 'raw' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">متن خام محتوا / توضیحات محصول</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFixAllGrammar}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Type className="w-3.5 h-3.5" />
                      اصلاح خودکار نیم‌فاصله‌ها
                    </button>
                  </div>
                </div>

                <textarea
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed resize-y"
                  placeholder="متن خود را اینجا وارد یا ویرایش نمایید..."
                />
              </div>
            )}

            {/* Mode 3: Elementor Container Inspector */}
            {editorMode === 'elementor' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-400" />
                    ساختار کانتینر المنتور (Elementor Flexbox Model JSON)
                  </span>
                  <button
                    onClick={() => copyToClipboard(elementorJsonString, 'JSON المنتور')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-sans font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی JSON المنتور
                  </button>
                </div>

                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-300 overflow-x-auto max-h-96 leading-relaxed">
                  {elementorJsonString || 'در حال آماده‌سازی مدل المنتور...'}
                </pre>
              </div>
            )}

            {/* Live Google SERP Snippet Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span>پیش‌نمایش زنده در نتایج جستجوی گوگل (Google SERP Snippet)</span>
                </h3>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSerpDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      serpDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSerpDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      serpDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SERP Card */}
              <div className="p-4 bg-white text-slate-900 rounded-xl space-y-1.5 font-sans" dir="rtl">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">K</span>
                  <span>escmarket.shop › {targetType === 'product_description' ? 'product' : 'blog'} › {slug || 'sample-post'}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {metaTitle || title || 'عنوان متاتگ سئو'}
                </h4>
                <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                  {metaDescription || contentRaw.slice(0, 150) || 'توضیحات متاتگ برای جلب کلیک در نتایج موتور جستجوی گوگل...'}
                </p>
              </div>

              {/* SERP Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>عنوان متاتگ (Meta Title)</span>
                    <span className={metaTitle.length > 60 ? 'text-rose-400' : 'text-emerald-400'}>
                      {metaTitle.length} / ۶۰ کاراکتر
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>توضیحات متا (Meta Description)</span>
                    <span className={metaDescription.length > 160 ? 'text-rose-400' : 'text-emerald-400'}>
                      {metaDescription.length} / ۱۶۰ کاراکتر
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSIAN GRAMMAR & PROSE STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-400" />
                  <span>سامانه هوشمند ویراستاری فارسی، نیم‌فاصله‌ها و پالایش حشو</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  شناسایی خطاهای تایپی، اصلاح فاصله‌گذاری، پیوند نشانه‌های جمع و افعال، و تبدیل اصطلاحات زائد به نثر فاخر
                </p>
              </div>

              <button
                onClick={handleFixAllGrammar}
                disabled={grammarIssues.filter(i => !i.applied).length === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span>اعمال همگانی تمامی اصلاحات (Fix All)</span>
              </button>
            </div>

            {/* Issues List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grammarIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    issue.applied 
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' 
                      : 'bg-slate-950 border-slate-800 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      issue.category === 'half_space' ? 'bg-blue-500/20 text-blue-300' :
                      issue.category === 'redundancy' ? 'bg-amber-500/20 text-amber-300' :
                      issue.category === 'spelling' ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {issue.category === 'half_space' ? 'نیم‌فاصله هوشمند' :
                       issue.category === 'redundancy' ? 'حذف حشو و زیاده‌گویی' :
                       issue.category === 'spelling' ? 'اصلاح املایی' : 'علائم نگارشی'}
                    </span>

                    {issue.applied ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        اعمال شد
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyGrammarFix(issue)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        اعمال اصلاحیه
                      </button>
                    )}
                  </div>

                  <div className="my-2 p-2.5 bg-slate-900 rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 line-through">{issue.originalText}</span>
                    <span className="text-emerald-400 font-bold">← {issue.suggestedText}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{issue.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEO RECOMMENDATIONS & SCHEMA GRAPH */}
      {/* ========================================================================= */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-400" />
                  <span>توصیه‌های پیشرفته سئو و کدهای اسکیما (Structured Data)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  بررسی فاکتورهای الگوریتم رتبه‌بندی گوگل، توزیع چگالی کلیدواژه، و معماری داده‌های ساختاریافته
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-sm">
                نمره سئو: {seoScore} / ۱۰۰
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
              {seoRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        rec.impact === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                        rec.impact === 'high' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {rec.impact === 'critical' ? 'بسیار مهم' : rec.impact === 'high' ? 'تاثیر بالا' : 'بهبود تکمیلی'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{rec.description}</p>
                  </div>

                  {rec.currentVal && (
                    <div className="text-left font-mono text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
                      {rec.currentVal}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generated JSON-LD Schema Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  اسکیما مارک‌آپ استاندارد JSON-LD (تزریق خودکار به قالب کاموا)
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": targetType === 'product_description' ? "Product" : "Article",
                    "name": title,
                    "description": metaDescription,
                    "inLanguage": "fa-IR",
                    "offers": {
                      "@type": "Offer",
                      "priceCurrency": "IRT",
                      "price": "6200000",
                      "availability": "https://schema.org/InStock"
                    }
                  }, null, 2), 'کد اسکیما JSON-LD')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg cursor-pointer flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  کپی کد اسکیما
                </button>
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-emerald-300 text-xs font-mono overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": targetType === 'product_description' ? "Product" : "Article",
  "name": title,
  "description": metaDescription,
  "inLanguage": "fa-IR",
  "offers": targetType === 'product_description' ? {
    "@type": "Offer",
    "priceCurrency": "IRT",
    "price": "6200000",
    "availability": "https://schema.org/InStock"
  } : undefined
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: READABILITY & METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'readability' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>شاخص‌های خوانایی و روان‌شناسی مخاطب</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                سنجش سهولت درک محتوا، طول جملات، کلمات انتقالی، و اجتناب از عبارات مجهول و خسته‌کننده
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400">تعداد کلمات کل متن</span>
                <span className="text-2xl font-black text-white block">
                  {readabilityMetrics?.wordCount || contentRaw.split(/\s+/).filter(Boolean).length}
                </span>
                <span className="text-[10px] text-emerald-400">ایده‌آل برای درک سریع</span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400">میانگین طول جملات</span>
                <span className="text-2xl font-black text-blue-400 block">
                  {readabilityMetrics?.avgWordLength || '۴.۸'}
                </span>
                <span className="text-[10px] text-slate-400">کاراکتر به ازای هر واژه</span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400">افعال مجهول (Passive Voice)</span>
                <span className="text-2xl font-black text-emerald-400 block">
                  {readabilityMetrics?.passiveVoicePercentage || '۴'}٪
                </span>
                <span className="text-[10px] text-emerald-400">کمتر از ۱۰٪ (بسیار مطلوب)</span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400">واژگان پیونددهنده (Transition)</span>
                <span className="text-2xl font-black text-purple-400 block">
                  {readabilityMetrics?.transitionWordsPercentage || '۳۰'}٪
                </span>
                <span className="text-[10px] text-purple-400">حفظ پیوستگی ذهن کاربر</span>
              </div>
            </div>

            {/* Conversion Triggers & Psychological Hooks */}
            <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/20 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>محرک‌های روان‌شناسی فروش (Neuromarketing Triggers)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-indigo-300 font-bold block mb-1">فرمول PAS (مسئله-تحریک-حل)</span>
                  <p className="text-slate-400">بیان صریح چالش نویز محیطی و ارائه راه‌حل فوری با ANC</p>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-emerald-300 font-bold block mb-1">کاهش ریسک خرید (Risk Reversal)</span>
                  <p className="text-slate-400">ضمانت ۱۰۰٪ اصالت و بازگشت وجه ۷ روزه بدون قید و شرط</p>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-purple-300 font-bold block mb-1">اعتماد اجتماعی (Social Proof)</span>
                  <p className="text-slate-400">اشاره به تایید استودیویی و استفاده در پروژه‌های ضبط صدا</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EXPORT & SYNC HUB */}
      {/* ========================================================================= */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <span>مرکز خروجی و همگام‌سازی مستقیم با وردپرس</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                انتقال کد بلاک‌های بهینه‌سازی‌شده به گوتنبرگ، ساختار کانتینری المنتور یا ذخیره مستقیم در پایگاه داده وردپرس
              </p>
            </div>

            {/* 1-Click Sync Status Card */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  همگام‌سازی بلادرنگ با هسته وردپرس
                </h4>
                <p className="text-xs text-slate-400">
                  محتوا را به طور مستقیم به REST API وردپرس (پست یا محصول ووکامرس) ارسال کنید.
                </p>
                {wpSyncResponse && (
                  <div className="text-[11px] text-emerald-400 font-mono mt-2">
                    ✓ پست شناسه #{wpSyncResponse.wp_post_id} با متاتگ‌های سئو در وضعیت {wpSyncResponse.post_status} ذخیره شد.
                  </div>
                )}
              </div>

              <button
                onClick={handleSyncToWordPress}
                disabled={isSyncingWp}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSyncingWp ? 'animate-spin' : ''}`} />
                <span>{isSyncingWp ? 'در حال ارسال به WP...' : 'همگام‌سازی در وردپرس'}</span>
              </button>
            </div>

            {/* Gutenberg Raw Blocks Markup */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-sans text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  کد مارک‌آپ بلاک‌های گوتنبرگ (Gutenberg HTML Blocks)
                </span>
                <button
                  onClick={() => copyToClipboard(
                    blocks.map(b => `<!-- wp:${b.blockName} -->\n${b.suggestedHtml || b.innerHtml}\n<!-- /wp:${b.blockName} -->`).join('\n\n'),
                    'کد بلاک‌های گوتنبرگ'
                  )}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-sans font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  کپی تمام بلاک‌ها
                </button>
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-200 overflow-x-auto max-h-64 leading-relaxed">
{blocks.map(b => `<!-- wp:${b.blockName} -->\n${b.suggestedHtml || b.innerHtml}\n<!-- /wp:${b.blockName} -->`).join('\n\n')}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
