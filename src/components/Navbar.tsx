import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  MessageSquareHeart, 
  Boxes, 
  Search, 
  TrendingUp, 
  Store, 
  BrainCircuit, 
  UserCheck, 
  Code2,
  Wand2,
  Rocket,
  ArrowUpCircle,
  Activity,
  LifeBuoy,
  Eye,
  Flame,
  ArrowRightLeft,
  ChevronDown,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { KamvaLogo } from './KamvaLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleLivePreview?: () => void;
  isLivePreview?: boolean;
  onRunAutoTune?: () => void;
}

interface NavCategory {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onToggleLivePreview,
  isLivePreview,
  onRunAutoTune,
}) => {
  const categories: NavCategory[] = [
    {
      id: 'store-core',
      title: 'فروشگاه و ساختار',
      items: [
        { id: 'options', label: 'تنظیمات قالب', icon: Store, badge: 'Main' },
        { id: 'theme-migrator', label: 'مهاجرت قالب', icon: ArrowRightLeft },
        { id: 'smart-widgets', label: 'چیدمان ویجت‌ها', icon: Flame },
        { id: 'user-portal', label: 'پنل کاربری', icon: UserCheck },
      ],
    },
    {
      id: 'ai-core',
      title: 'هوش مصنوعی و ML',
      items: [
        { id: 'neural-ml', label: 'شبکه عصبی ML', icon: BrainCircuit, badge: 'AI' },
        { id: 'smart-config', label: 'کانفیگ AI', icon: Wand2 },
        { id: 'sales-ai', label: 'دستیار فروش', icon: MessageSquareHeart },
        { id: 'analytics', label: 'تحلیل و نرخ تبدیل', icon: TrendingUp },
      ],
    },
    {
      id: 'tools-dev',
      title: 'طراحی و توسعه',
      items: [
        { id: 'elementor', label: 'استودیو المنتور', icon: Boxes },
        { id: 'developer-studio', label: 'استودیو برنامه‌نویسی', icon: Code2, badge: 'PHP' },
        { id: 'seo-market', label: 'سئو و گوگل', icon: Search },
      ],
    },
    {
      id: 'speed-sec',
      title: 'سرعت و امنیت',
      items: [
        { id: 'cache-optimizer', label: 'بهینه‌سازی کش', icon: Zap },
        { id: 'speed-security', label: 'امنیت و فایروال', icon: ShieldCheck, badge: 'AIOS' },
      ],
    },
    {
      id: 'ops-deploy',
      title: 'استقرار و نگهداری',
      items: [
        { id: 'deploy-helper', label: 'استقرار پروداکشن', icon: Rocket },
        { id: 'disaster-recovery', label: 'بک‌آپ و بازیابی', icon: LifeBuoy },
        { id: 'health-report', label: 'گزارش سلامت', icon: Activity },
        { id: 'updater', label: 'آپدیت هوشمند', icon: ArrowUpCircle },
      ],
    },
  ];

  // Find active category
  const activeCategory = categories.find((cat) =>
    cat.items.some((item) => item.id === activeTab)
  ) || categories[0];

  const [selectedCategoryId, setSelectedCategory] = useState<string>(activeCategory.id);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  return (
    <header className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Theme Title */}
          <div className="flex items-center gap-3">
            <KamvaLogo size="md" showText={false} />
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                پیشخوان مدیریت کامواوب پرو
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                WP 7.1
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* AI Auto-Tuning Header Button */}
            {onRunAutoTune && (
              <button
                onClick={onRunAutoTune}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:via-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer ring-1 ring-purple-400/40 animate-pulse"
                title="پایش متقاطع کش، امنیت و ML و اعمال تنظیمات پرفیکت"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>AI Auto-Tuning</span>
              </button>
            )}

            {/* Live Frontend Preview Button */}
            {onToggleLivePreview && (
              <button
                onClick={onToggleLivePreview}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-800 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>پیش‌نمایش زنده</span>
              </button>
            )}

            {/* Smart Config Shortcut */}
            <button
              onClick={() => {
                setSelectedCategory('ai-core');
                setActiveTab('smart-config');
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#f05023]" />
              <span>کانفیگ AI</span>
            </button>

            {/* Deploy Shortcut */}
            <button
              onClick={() => {
                setSelectedCategory('ops-deploy');
                setActiveTab('deploy-helper');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-400" />
              <span>استقرار</span>
            </button>
          </div>
        </div>

        {/* Category Segment Selector Bar */}
        <div className="flex items-center gap-2 pt-1 pb-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          
          {/* Main Category Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 shrink-0">
            {categories.map((cat) => {
              const isCatActive = selectedCategoryId === cat.id;
              const hasActiveChild = cat.items.some((item) => item.id === activeTab);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : hasActiveChild
                      ? 'text-indigo-300 bg-indigo-950/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.title}</span>
                  {hasActiveChild && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 shrink-0" />

          {/* Sub Items under Selected Category */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {currentCategory.items.map((item) => {
              const Icon = item.icon;
              const isTabActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isTabActive
                      ? 'bg-slate-800 text-white border border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                      : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </header>
  );
};
