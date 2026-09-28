import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  MessageSquareHeart, 
  Boxes, 
  Search, 
  Download, 
  FileCode2, 
  TrendingUp, 
  Store, 
  FolderGit2,
  BrainCircuit,
  Layers,
  UserCheck,
  Code2
} from 'lucide-react';
import { KamvaLogo } from './KamvaLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownloadZip: () => void;
  onDownloadPluginZip: () => void;
  isDownloading: boolean;
  isDownloadingPlugin: boolean;
  onOpenCodeViewer: () => void;
  onOpenGitHubModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadZip,
  onDownloadPluginZip,
  isDownloading,
  isDownloadingPlugin,
  onOpenCodeViewer,
  onOpenGitHubModal,
}) => {
  const navItems = [
    { id: 'options', label: 'کاموا استور و تم‌آپشن', icon: Store, badge: 'Store Engine' },
    { id: 'neural-ml', label: 'شبکه عصبی و ML', icon: BrainCircuit, badge: 'Neural AI' },
    { id: 'cache-optimizer', label: 'کش، عکس و دیتابیس', icon: Zap, badge: 'Speed' },
    { id: 'speed-security', label: 'امنیت AIOS و WAF', icon: ShieldCheck, badge: 'Security' },
    { id: 'user-portal', label: 'پنل ورود و کاربران', icon: UserCheck, badge: 'Portal' },
    { id: 'developer-studio', label: 'استودیوی برنامه‌نویس', icon: Code2, badge: 'Dev' },
    { id: 'seo-market', label: 'گوگل و سئو مارکتینگ', icon: Search, badge: 'Google' },
    { id: 'sales-ai', label: 'ویجت فروش زنده', icon: MessageSquareHeart, badge: 'Live AI' },
    { id: 'elementor', label: 'المنتور اختصاصی', icon: Boxes, badge: 'Builder' },
    { id: 'analytics', label: 'نرخ یادگیری و تبدیل', icon: TrendingUp, badge: 'Insights' },
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
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  موتور کاموا استور + WP 7.1
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                مغز خودمختار محلی • شبکه عصبی • امنیت AIOS • کش لایت‌اسپید • پنل کاربری • افزونه kamva-core
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Download Installable Plugin Button */}
            <button
              onClick={onDownloadPluginZip}
              disabled={isDownloadingPlugin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-purple-400/30 rounded-xl shadow-md shadow-purple-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="دانلود مستقیم افزونه قابل‌نصب kamva-core.zip شامل تمامی ۱۱ ماژول"
            >
              {isDownloadingPlugin ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Layers className="w-4 h-4 text-purple-200" />
              )}
              <span className="hidden md:inline">دانلود افزونه kamva-core</span>
              <span className="md:hidden">افزونه</span>
            </button>

            {/* GitHub Export Button */}
            <button
              onClick={onOpenGitHubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border border-indigo-400/30 rounded-xl shadow-md shadow-indigo-900/30 transition-all active:scale-95 cursor-pointer"
              title="خروجی کامل پروژه جهت پوش در گیت‌هاب شخصی (GitHub Repository)"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-200" />
              <span className="hidden sm:inline">خروجی گیت‌هاب</span>
            </button>

            {/* Source Code Modal Button */}
            <button
              onClick={onOpenCodeViewer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
              title="مشاهده کدهای PHP، CSS و ماژول‌های قالب و افزونه کاموا کُر"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">سورس‌کد پروژه</span>
            </button>

            {/* Download Full Theme ZIP Button */}
            <button
              onClick={onDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="دانلود فایل زیپ پوسته استاندارد وردپرس"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>فشرده‌سازی...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>دانلود زیپ قالب</span>
                </>
              )}
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
                    : 'text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
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
