import React from 'react';
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
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { KamvaLogo } from './KamvaLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCodeViewer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: 'options', label: 'موتور کاموا استور و تم‌آپشن', icon: Store, badge: 'Store' },
    { id: 'smart-config', label: 'تولید پیکربندی هوشمند با AI', icon: Wand2, badge: 'Smart AI', highlight: true },
    { id: 'deploy-helper', label: 'دستیار استقرار پروداکشن', icon: Rocket, badge: 'Deploy', highlight: true },
    { id: 'disaster-recovery', label: 'بازیابی بحران و بک‌آپ AI', icon: LifeBuoy, badge: 'Rescue AI', highlight: true },
    { id: 'health-report', label: 'گزارش سلامت و PDF ماهانه', icon: Activity, badge: 'Audit PDF' },
    { id: 'updater', label: 'آپدیت هوشمند و سازگاری AI', icon: ArrowUpCircle, badge: 'v4.3 Upstream' },
    { id: 'neural-ml', label: 'شبکه عصبی و یادگیری ماشین', icon: BrainCircuit, badge: 'Neural' },
    { id: 'cache-optimizer', label: 'کش، عکس و دیتابیس', icon: Zap, badge: 'Speed' },
    { id: 'speed-security', label: 'امنیت AIOS و فایروال', icon: ShieldCheck, badge: 'AIOS' },
    { id: 'user-portal', label: 'پنل ورود و کاربران', icon: UserCheck, badge: 'Portal' },
    { id: 'developer-studio', label: 'استودیوی برنامه‌نویس', icon: Code2, badge: 'PHP Dev' },
    { id: 'seo-market', label: 'گوگل و سئو مارکتینگ', icon: Search, badge: 'Google' },
    { id: 'sales-ai', label: 'ویجت فروش زنده', icon: MessageSquareHeart, badge: 'Live AI' },
    { id: 'elementor', label: 'استودیو المنتور', icon: Boxes, badge: 'Elementor' },
    { id: 'analytics', label: 'نرخ تبدیل و یادگیری', icon: TrendingUp, badge: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Theme Title using KamvaLogo */}
          <div className="flex items-center gap-3">
            <KamvaLogo size="md" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  کامواوب | KamvaWeb Pro
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f05023]/20 text-[#ff7854] border border-[#f05023]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  نسخه پروداکشن وردپرس ۷.۱
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                موتور فروشگاهی کاموا استور • هسته عصبی خودمختار • امنیت چندلایه AIOS • کش لایت‌اسپید • سورس‌کد خالص PHP
              </p>
            </div>
          </div>

          {/* Quick Production Actions */}
          <div className="flex items-center gap-2">
            
            {/* Smart Config Generator Shortcut */}
            <button
              onClick={() => setActiveTab('smart-config')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                activeTab === 'smart-config'
                  ? 'bg-gradient-to-r from-[#f05023] to-orange-600 text-white shadow-lg shadow-[#f05023]/30 ring-1 ring-[#f05023]'
                  : 'bg-slate-900 hover:bg-slate-800 text-[#ff8b6b] border border-[#f05023]/30'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>پیکربندی هوشمند با AI</span>
            </button>

            {/* Production Deployer Shortcut */}
            <button
              onClick={() => setActiveTab('deploy-helper')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                activeTab === 'deploy-helper'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                  : 'bg-gradient-to-r from-emerald-950/60 to-slate-900 hover:from-emerald-900/40 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-400" />
              <span>دستیار استقرار پروداکشن</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Scrollable horizontally) */}
        <nav className="flex items-center gap-1.5 py-2 overflow-x-auto border-t border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : item.highlight
                    ? 'text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60'
                    : 'text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-[#f05023]' : 'text-indigo-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
