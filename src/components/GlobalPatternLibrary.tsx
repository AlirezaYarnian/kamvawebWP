import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit3,
  Eye,
  ExternalLink,
  Code2,
  FileCode2,
  Terminal,
  Monitor,
  Tablet,
  Smartphone,
  Share2,
  Zap,
  Tag,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Box,
  Cpu,
  Bookmark,
  ShieldCheck,
  X
} from 'lucide-react';
import { NexusAIComponent } from '../types/patterns';

interface GlobalPatternLibraryProps {
  onApplyToSimulator?: (component: NexusAIComponent) => void;
}

export const GlobalPatternLibrary: React.FC<GlobalPatternLibraryProps> = ({ onApplyToSimulator }) => {
  const [patterns, setPatterns] = useState<NexusAIComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [filterAiOnly, setFilterAiOnly] = useState(false);

  // Modals & Panels
  const [previewModalComponent, setPreviewModalComponent] = useState<NexusAIComponent | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [isAiForgeOpen, setIsAiForgeOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('hero');
  const [aiComplexity, setAiComplexity] = useState('advanced');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importToken, setImportToken] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const [editingComponent, setEditingComponent] = useState<NexusAIComponent | null>(null);

  // New component form state
  const [newCompData, setNewCompData] = useState<Partial<NexusAIComponent>>({
    name: '',
    nameFa: '',
    category: 'features',
    categoryLabelFa: 'ویژگی‌ها و قابلیت‌ها',
    description: '',
    version: '1.0.0',
    complexity: 'intermediate',
    tags: ['elementor', 'nexus-ai', 'rtl'],
    customCss: '',
    customJs: '',
    elementorJson: { version: '0.4', type: 'container', elements: [] },
    liveDemoHtml: '',
  });

  // Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, 'elementor' | 'css' | 'js' | 'php'>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPatterns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/patterns');
      if (res.ok) {
        const data = await res.json();
        setPatterns(data.patterns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, []);

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`${label} با موفقیت در کلیپ‌بورد کپی شد.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePattern = async (id: string) => {
    if (!window.confirm('آیا از حذف این کامپوننت از کتابخانه الگوهای سراسری اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/patterns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPatterns(patterns.filter((p) => p.id !== id));
        showToast('کامپوننت با موفقیت حذف گردید.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateAiComponent = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/patterns/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          category: aiCategory,
          complexity: aiComplexity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.component) {
          setPatterns([data.component, ...patterns]);
          setIsAiForgeOpen(false);
          setAiPrompt('');
          setPreviewModalComponent(data.component);
          showToast('کامپوننت اختصاصی جدید توسط هوش مصنوعی با موفقیت ساخته و ذخیره شد.');
        }
      } else {
        throw new Error('خطا در تولید کامپوننت');
      }
    } catch (e: any) {
      showToast('خطا در تولید کامپوننت هوش مصنوعی. لطفاً مجدداً تلاش نمایید.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleImportToken = async () => {
    if (!importToken.trim()) return;
    setIsImporting(true);
    try {
      const res = await fetch('/api/patterns/import-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: importToken.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.component) {
          setPatterns([data.component, ...patterns]);
          setIsImportModalOpen(false);
          setImportToken('');
          showToast('کامپوننت با موفقیت از توکن پروژه مبدا وارد کتابخانه گردید.');
        }
      } else {
        throw new Error('توکن نامعتبر است');
      }
    } catch (e: any) {
      showToast('خطا در واردسازی توکن. فرمت توکن نامعتبر است.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveComponent = async () => {
    const compToSave = editingComponent || newCompData;
    if (!compToSave.name?.trim()) {
      showToast('لطفاً عنوان انگلیسی و فارسی کامپوننت را وارد کنید.');
      return;
    }

    try {
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compToSave),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.component) {
          if (editingComponent) {
            setPatterns(patterns.map((p) => (p.id === data.component.id ? data.component : p)));
            setEditingComponent(null);
          } else {
            setPatterns([data.component, ...patterns]);
            setIsCreateModalOpen(false);
          }
          showToast(data.message || 'کامپوننت با موفقیت ذخیره شد.');
        }
      }
    } catch (e) {
      showToast('خطا در ذخیره‌سازی کامپوننت.');
    }
  };

  const categories = [
    { id: 'all', label: 'همه کامپوننت‌ها', icon: Layers },
    { id: 'hero', label: 'هیرو و سربرگ‌ها', icon: Sparkles },
    { id: 'pricing', label: 'جداول قیمت‌گذاری', icon: Tag },
    { id: 'ecommerce', label: 'ووکامرس و پرداخت سریع', icon: Box },
    { id: 'features', label: 'بنتو گرید فیچرها', icon: Cpu },
    { id: 'testimonials', label: 'نظرات و اعتماد مشتریان', icon: Bookmark },
    { id: 'cta', label: 'لید مگنت و فراخوان', icon: Zap },
  ];

  const filteredPatterns = patterns.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedComplexity !== 'all' && p.complexity !== selectedComplexity) return false;
    if (filterAiOnly && !p.isAiGenerated) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || (p.nameFa && p.nameFa.toLowerCase().includes(q));
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      const matchTag = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTag;
    }
    return true;
  });

  const sampleAiPromptPrompts = [
    'سکشن پلن‌های اشتراک شیشه‌ای سه‌بعدی با انیمیشن هاور و سوئیچ ماهانه/سالانه برای المنتور',
    'هیرو بنر تعاملی لندینگ پیج با ذرات شناور و دکمه پخش تیزر ویدیویی',
    'باکس پیشنهاد شگفت‌انگیز ووکامرس با تایمر شمارش معکوس نئونی و خرید سریع',
    'گرید بنتو مدرن معرفی فیچرهای هوش مصنوعی با ایکون‌های متحرک'
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 bg-slate-900/95 border border-cyan-500/50 rounded-2xl text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-2xl shadow-cyan-950/80 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                کتابخانه الگوهای سراسری و کامپوننت‌های نکسوس (Global Pattern Library)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">
                NexusAI Multi-Project Sync
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              ذخیره و بازاستفاده سکشن‌های پیچیده المنتور، کدهای سفارشی CSS/JS در تمام پروژه‌ها
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              طراحی، خروجی استاندارد المنتور (Elementor JSON Export)، شورت‌کدهای چندمنظوره PHP و انتقال بدون افت کیفیت سکشن‌های حرفه‌ای بین سایت‌های وردپرسی و پروژه‌های آژانس.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAiForgeOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>تولید با هوش مصنوعی (AI Forge)</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>ورود با توکن اشتراکی</span>
            </button>

            <button
              onClick={() => {
                setEditingComponent(null);
                setIsCreateModalOpen(true);
              }}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>کامپوننت جدید</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">الگوهای آماده:</span>
            <span className="text-sm font-black text-cyan-400 font-mono">{patterns.length}</span>
          </div>
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">بهینه‌سازی AI:</span>
            <span className="text-sm font-black text-emerald-400 font-mono">97.4%</span>
          </div>
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">استفاده در پروژه‌ها:</span>
            <span className="text-sm font-black text-indigo-400 font-mono">
              {patterns.reduce((acc, curr) => acc + (curr.sharedAcrossProjectsCount || 1), 0)} بار
            </span>
          </div>
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">سازگاری المنتور:</span>
            <span className="text-sm font-black text-amber-400 font-mono">v3.16 - v3.24+</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Complexity */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در نام، تگ یا کاربرد..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            >
              <option value="all">تمام سطوح پیچیدگی</option>
              <option value="beginner">مقدماتی (Beginner)</option>
              <option value="intermediate">متوسط (Intermediate)</option>
              <option value="advanced">پیشرفته (Advanced)</option>
              <option value="enterprise">سازمانی (Enterprise)</option>
            </select>

            <button
              onClick={() => setFilterAiOnly(!filterAiOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filterAiOnly
                  ? 'bg-indigo-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>فقط هوش مصنوعی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">در حال بارگذاری الگوهای سراسری و کامپوننت‌های نکسوس...</p>
        </div>
      ) : filteredPatterns.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">الگویی با این مشخصات یافت نشد</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            می‌توانید با استفاده از هوش مصنوعی (AI Forge) کامپوننت دلخواه خود را در چند ثانیه بسازید.
          </p>
          <button
            onClick={() => setIsAiForgeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>تولید با AI Forge</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatterns.map((comp) => {
            const activeTab = activeCodeTab[comp.id] || 'elementor';
            return (
              <div
                key={comp.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header Gradient */}
                  <div className={`p-5 bg-gradient-to-r ${comp.previewColorGradient || 'from-slate-900 to-indigo-950'} border-b border-slate-800/80 relative`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            {comp.categoryLabelFa || comp.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-950/70 text-slate-300 text-[10px] font-mono">
                            {comp.version}
                          </span>
                          {comp.isAiGenerated && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                              AI Optimized {comp.aiOptimizationScore}%
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-black text-white">{comp.nameFa}</h3>
                        <p className="text-[11px] text-slate-400 font-mono">{comp.name}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setPreviewModalComponent(comp)}
                          title="پیش‌نمایش تعاملی"
                          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingComponent(comp);
                            setIsCreateModalOpen(true);
                          }}
                          title="ویرایش کامپوننت"
                          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePattern(comp.id)}
                          title="حذف کامپوننت"
                          className="p-2 rounded-xl bg-slate-950/80 hover:bg-rose-950/50 text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {comp.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {comp.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950/60 text-slate-400 border border-slate-800 font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Code Snippet Tabs */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveCodeTab({ ...activeCodeTab, [comp.id]: 'elementor' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeTab === 'elementor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Elementor JSON
                        </button>
                        <button
                          onClick={() => setActiveCodeTab({ ...activeCodeTab, [comp.id]: 'css' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Scoped CSS
                        </button>
                        <button
                          onClick={() => setActiveCodeTab({ ...activeCodeTab, [comp.id]: 'js' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeTab === 'js' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Custom JS
                        </button>
                        <button
                          onClick={() => setActiveCodeTab({ ...activeCodeTab, [comp.id]: 'php' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeTab === 'php' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          شورت‌کد PHP
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        همگام در {comp.sharedAcrossProjectsCount || 1} سایت
                      </div>
                    </div>

                    {/* Tab Code Content */}
                    <div className="relative">
                      {activeTab === 'elementor' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-28 overflow-y-auto">
                          <pre>{JSON.stringify(comp.elementorJson, null, 2)}</pre>
                        </div>
                      )}
                      {activeTab === 'css' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-28 overflow-y-auto">
                          <pre>{comp.customCss || '/* بدون استایل سفارشی اختصاصی */'}</pre>
                        </div>
                      )}
                      {activeTab === 'js' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300 max-h-28 overflow-y-auto">
                          <pre>{comp.customJs || '// بدون اسکریپت سفارشی اختصاصی'}</pre>
                        </div>
                      )}
                      {activeTab === 'php' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 max-h-28 overflow-y-auto">
                          <pre>{comp.shortcode}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(JSON.stringify(comp.elementorJson), `el-${comp.id}`, 'الگوی المنتور')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedId === `el-${comp.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>کپی JSON المنتور</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(comp.shortcode, `sc-${comp.id}`, 'شورت‌کد کامپوننت')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedId === `sc-${comp.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5" />}
                      <span>کپی شورت‌کد</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(comp.crossProjectSyncToken, `tk-${comp.id}`, 'توکن انتقال')}
                      title="دریافت توکن همگام‌سازی بین پروژه‌ای"
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>توکن اشتراک</span>
                    </button>

                    <a
                      href={`/api/patterns/${comp.id}/export-elementor`}
                      download
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود فایل .json</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIVE INTERACTIVE PREVIEW & RESPONSIVE SANDBOX     */}
      {/* ======================================================== */}
      {previewModalComponent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  👁️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{previewModalComponent.nameFa}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{previewModalComponent.name}</p>
                </div>
              </div>

              {/* Viewport Toggler */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    previewViewport === 'desktop' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="نمای دسکتاپ (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">دسکتاپ</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    previewViewport === 'tablet' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="نمای تبلت (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">تبلت</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    previewViewport === 'mobile' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="نمای موبایل (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">موبایل</span>
                </button>
              </div>

              <button
                onClick={() => setPreviewModalComponent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sandbox Container */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex items-center justify-center">
              <div
                className={`transition-all duration-300 w-full ${
                  previewViewport === 'tablet'
                    ? 'max-w-[768px] border-x border-slate-800 shadow-2xl'
                    : previewViewport === 'mobile'
                    ? 'max-w-[390px] border-x border-slate-800 shadow-2xl rounded-2xl overflow-hidden'
                    : 'max-w-full'
                }`}
              >
                {/* Dynamic CSS Injection */}
                {previewModalComponent.customCss && (
                  <style>{previewModalComponent.customCss}</style>
                )}

                {/* Render Demo HTML */}
                {previewModalComponent.liveDemoHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: previewModalComponent.liveDemoHtml }}
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    پیش‌نمایش HTML موجود نیست. ساختار المنتور آماده بارگذاری است.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">شناسه شورت‌کد:</span>
                <code className="px-2 py-1 rounded bg-slate-900 text-cyan-300 text-xs font-mono border border-slate-800">
                  {previewModalComponent.shortcode}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(JSON.stringify(previewModalComponent.elementorJson), 'modal-el', 'JSON المنتور')}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی JSON المنتور</span>
                </button>
                <button
                  onClick={() => setPreviewModalComponent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: AI COMPONENT FORGE (تولید با هوش مصنوعی)        */}
      {/* ======================================================== */}
      {isAiForgeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">کارگاه تولید کامپوننت هوش مصنوعی (AI Component Forge)</h3>
                  <p className="text-xs text-slate-400">ساخت اتوماتیک سکشن المنتور + CSS نئونی + JS اینتراکتیو با دستور فارسی</p>
                </div>
              </div>
              <button onClick={() => setIsAiForgeOpen(false)} className="text-slate-400 hover:text-white p-2">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  توصیف دقیق کامپوننت یا المان مورد نظر (به فارسی):
                </label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="مثال: یک سکشن بنتو گرید شیشه‌ای برای نمایش امکانات دوره آموزشی با افکت هاور سه‌بعدی و دکمه ثبت‌نام متحرک بساز..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Sample Prompts */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">پیشنهادات سریع:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleAiPromptPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(p)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-right transition-all cursor-pointer"
                    >
                      {p.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">دسته‌بندی:</label>
                  <select
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="hero">هیرو و سربرگ (Hero)</option>
                    <option value="pricing">جداول قیمت (Pricing)</option>
                    <option value="ecommerce">ووکامرس و پرداخت (WooCommerce)</option>
                    <option value="features">بنتو گرید فیچرها (Features)</option>
                    <option value="testimonials">نظرات مشتریان (Testimonials)</option>
                    <option value="cta">لید مگنت و CTA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">سطح پیچیدگی فنی:</label>
                  <select
                    value={aiComplexity}
                    onChange={(e) => setAiComplexity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="intermediate">متوسط (Intermediate)</option>
                    <option value="advanced">پیشرفته (Advanced)</option>
                    <option value="enterprise">انترپرایز و سازمانی (Enterprise)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsAiForgeOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleGenerateAiComponent}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'در حال طراحی و کدنویسی هوشمند...' : 'شروع تولید کامپوننت'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: IMPORT CROSS-PROJECT TOKEN                        */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">ورود کامپوننت با توکن بین پروژه‌ای</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                توکن اشتراک Base64 کامپوننت مورد نظر از پروژه یا دامنه دیگر را در کادر زیر جای‌گذاری نمایید تا مستقیماً به همراه کلیه ساختارهای المنتور و کدهای CSS/JS وارد کتابخانه محلی گردد:
              </p>
              <textarea
                rows={4}
                value={importToken}
                onChange={(e) => setImportToken(e.target.value)}
                placeholder="eyJpaWQiOiJuZXh1cy1oZXJv..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleImportToken}
                disabled={isImporting || !importToken.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isImporting ? 'در حال ورود...' : 'واردسازی به کتابخانه'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT COMPONENT                           */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingComponent ? 'ویرایش کامپوننت نکسوس' : 'ثبت کامپوننت جدید در کتابخانه سراسری'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingComponent(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">نام انگلیسی کامپوننت:</label>
                  <input
                    type="text"
                    value={editingComponent ? editingComponent.name : newCompData.name}
                    onChange={(e) => {
                      if (editingComponent) setEditingComponent({ ...editingComponent, name: e.target.value });
                      else setNewCompData({ ...newCompData, name: e.target.value });
                    }}
                    placeholder="e.g. Hero 3D Bento Box"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">نام فارسی کامپوننت:</label>
                  <input
                    type="text"
                    value={editingComponent ? editingComponent.nameFa : newCompData.nameFa}
                    onChange={(e) => {
                      if (editingComponent) setEditingComponent({ ...editingComponent, nameFa: e.target.value });
                      else setNewCompData({ ...newCompData, nameFa: e.target.value });
                    }}
                    placeholder="مثال: هیرو بنر ۳ بعدی شیشه‌ای"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">دسته‌بندی:</label>
                  <select
                    value={editingComponent ? editingComponent.category : newCompData.category}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (editingComponent) setEditingComponent({ ...editingComponent, category: val });
                      else setNewCompData({ ...newCompData, category: val });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="hero">هیرو و سربرگ</option>
                    <option value="pricing">جداول قیمت</option>
                    <option value="ecommerce">ووکامرس و پرداخت</option>
                    <option value="features">بنتو گرید فیچرها</option>
                    <option value="testimonials">نظرات مشتریان</option>
                    <option value="cta">لید مگنت و CTA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">نسخه (Version):</label>
                  <input
                    type="text"
                    value={editingComponent ? editingComponent.version : newCompData.version}
                    onChange={(e) => {
                      if (editingComponent) setEditingComponent({ ...editingComponent, version: e.target.value });
                      else setNewCompData({ ...newCompData, version: e.target.value });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">سطح پیچیدگی:</label>
                  <select
                    value={editingComponent ? editingComponent.complexity : newCompData.complexity}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (editingComponent) setEditingComponent({ ...editingComponent, complexity: val });
                      else setNewCompData({ ...newCompData, complexity: val });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="beginner">مقدماتی</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">پیشرفته</option>
                    <option value="enterprise">سازمانی</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">توضیحات کاربردی:</label>
                <textarea
                  rows={2}
                  value={editingComponent ? editingComponent.description : newCompData.description}
                  onChange={(e) => {
                    if (editingComponent) setEditingComponent({ ...editingComponent, description: e.target.value });
                    else setNewCompData({ ...newCompData, description: e.target.value });
                  }}
                  placeholder="توضیح کوتاه در مورد هدف سکشن و محل قرارگیری..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">استایل Scoped CSS:</label>
                <textarea
                  rows={3}
                  value={editingComponent ? editingComponent.customCss : newCompData.customCss}
                  onChange={(e) => {
                    if (editingComponent) setEditingComponent({ ...editingComponent, customCss: e.target.value });
                    else setNewCompData({ ...newCompData, customCss: e.target.value });
                  }}
                  placeholder=".my-component { backdrop-filter: blur(16px); }"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">اسکریپت سفارشی JS:</label>
                <textarea
                  rows={3}
                  value={editingComponent ? editingComponent.customJs : newCompData.customJs}
                  onChange={(e) => {
                    if (editingComponent) setEditingComponent({ ...editingComponent, customJs: e.target.value });
                    else setNewCompData({ ...newCompData, customJs: e.target.value });
                  }}
                  placeholder="document.querySelector(...).addEventListener(...)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">کد HTML پیش‌نمایش زنده (Live Demo HTML):</label>
                <textarea
                  rows={3}
                  value={editingComponent ? editingComponent.liveDemoHtml : newCompData.liveDemoHtml}
                  onChange={(e) => {
                    if (editingComponent) setEditingComponent({ ...editingComponent, liveDemoHtml: e.target.value });
                    else setNewCompData({ ...newCompData, liveDemoHtml: e.target.value });
                  }}
                  placeholder='<div class="p-6 bg-slate-900 border border-cyan-500 rounded-2xl">...</div>'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingComponent(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveComponent}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>ذخیره در کتابخانه سراسری</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
