import React, { useState, useEffect } from 'react';
import { defaultThemeConfig, sampleKnowledgeBase } from './data/initialData';
import { ThemeOptionsConfig, KnowledgeItem } from './types/theme';
import { Navbar } from './components/Navbar';
import { ThemeOptionsPanel } from './components/ThemeOptionsPanel';
import { NeuralNetworkDashboard } from './components/NeuralNetworkDashboard';
import { CacheAndImageOptimizer } from './components/CacheAndImageOptimizer';
import { UserPortalCustomizer } from './components/UserPortalCustomizer';
import { DeveloperStudio } from './components/DeveloperStudio';
import { AiSalesWidgetLiveDemo } from './components/AiSalesWidgetLiveDemo';
import { ElementorVisualSimulator } from './components/ElementorVisualSimulator';
import { SeoMarketLab } from './components/SeoMarketLab';
import { SpeedSecurityAuditor } from './components/SpeedSecurityAuditor';
import { AiLearningAnalytics } from './components/AiLearningAnalytics';
import { ThemeCodeViewerModal } from './components/ThemeCodeViewerModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { 
  generateWordPressThemeZip, 
  generateKamvaCorePluginZip, 
  triggerDownload 
} from './utils/zipGenerator';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Boxes, 
  Download, 
  FileCode2, 
  MessageSquareHeart, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  LifeBuoy, 
  FolderGit2,
  BrainCircuit,
  Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('options');
  const [themeConfig, setThemeConfig] = useState<ThemeOptionsConfig>(defaultThemeConfig);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(sampleKnowledgeBase);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadingPlugin, setIsDownloadingPlugin] = useState<boolean>(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Load real persistent knowledge base and theme options from server on mount
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const kbRes = await fetch('/api/knowledge-base');
        if (kbRes.ok) {
          const kbData = await kbRes.json();
          if (kbData.items && kbData.items.length > 0) {
            setKnowledgeBase(kbData.items);
          }
        }
      } catch (e) {
        console.warn('Using local baseline knowledge items');
      }

      try {
        const confRes = await fetch('/api/theme-options');
        if (confRes.ok) {
          const confData = await confRes.json();
          if (confData && confData.general) {
            setThemeConfig(confData);
          }
        }
      } catch (e) {
        console.warn('Using local baseline config');
      }
    };

    loadRealData();
  }, []);

  const refreshKnowledgeBaseFromServer = async () => {
    try {
      const res = await fetch('/api/knowledge-base');
      const data = await res.json();
      if (data.items) {
        setKnowledgeBase(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zipBlob = await generateWordPressThemeZip(themeConfig.general.siteName);
      triggerDownload(zipBlob, 'kamvaweb-wordpress-theme.zip');
    } catch (error) {
      console.error('Failed to generate theme zip:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPluginZip = async () => {
    try {
      setIsDownloadingPlugin(true);
      const zipBlob = await generateKamvaCorePluginZip();
      triggerDownload(zipBlob, 'kamva-core.zip');
    } catch (error) {
      console.error('Failed to generate plugin zip:', error);
    } finally {
      setIsDownloadingPlugin(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        onDownloadPluginZip={handleDownloadPluginZip}
        isDownloading={isDownloading}
        isDownloadingPlugin={isDownloadingPlugin}
        onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Kamva Store & Comprehensive Theme Options */}
        {activeTab === 'options' && (
          <ThemeOptionsPanel
            config={themeConfig}
            onChangeConfig={setThemeConfig}
            onRefreshKnowledgeBase={refreshKnowledgeBaseFromServer}
          />
        )}

        {/* Tab 2: Neural Network & Machine Learning Core */}
        {activeTab === 'neural-ml' && (
          <NeuralNetworkDashboard
            neuralConfig={themeConfig.neuralNetwork}
            onUpdateConfig={(updated) =>
              setThemeConfig({
                ...themeConfig,
                neuralNetwork: { ...themeConfig.neuralNetwork, ...updated },
              })
            }
          />
        )}

        {/* Tab 3: Cache, Lossless Image Optimizer & Database Cleaner */}
        {activeTab === 'cache-optimizer' && (
          <CacheAndImageOptimizer
            imageConfig={themeConfig.imageOptimizer}
            cacheConfig={themeConfig.kamvaSpeedCache}
            onUpdateImageConfig={(updated) =>
              setThemeConfig({
                ...themeConfig,
                imageOptimizer: { ...themeConfig.imageOptimizer, ...updated },
              })
            }
            onUpdateCacheConfig={(updated) =>
              setThemeConfig({
                ...themeConfig,
                kamvaSpeedCache: { ...themeConfig.kamvaSpeedCache, ...updated },
              })
            }
          />
        )}

        {/* Tab 4: AIOS Security & Firewall */}
        {activeTab === 'speed-security' && (
          <SpeedSecurityAuditor />
        )}

        {/* Tab 5: User Portal & Registration Customizer */}
        {activeTab === 'user-portal' && (
          <UserPortalCustomizer
            portalConfig={themeConfig.userPortal}
            onUpdateConfig={(updated) =>
              setThemeConfig({
                ...themeConfig,
                userPortal: { ...themeConfig.userPortal, ...updated },
              })
            }
          />
        )}

        {/* Tab 6: Developer Studio & Code Sandbox */}
        {activeTab === 'developer-studio' && (
          <DeveloperStudio
            devConfig={themeConfig.developerStudio}
            onUpdateConfig={(updated) =>
              setThemeConfig({
                ...themeConfig,
                developerStudio: { ...themeConfig.developerStudio, ...updated },
              })
            }
          />
        )}

        {/* Tab 7: Google Intelligence & SEO Marketing */}
        {activeTab === 'seo-market' && (
          <SeoMarketLab />
        )}

        {/* Tab 8: Live AI Sales Assistant */}
        {activeTab === 'sales-ai' && (
          <AiSalesWidgetLiveDemo
            knowledgeBase={knowledgeBase}
            onUpdateKnowledgeBase={setKnowledgeBase}
            config={themeConfig}
          />
        )}

        {/* Tab 9: Elementor Studio Simulator */}
        {activeTab === 'elementor' && (
          <ElementorVisualSimulator
            config={themeConfig}
            knowledgeBase={knowledgeBase}
          />
        )}

        {/* Tab 10: Learning Analytics & Conversion Tracking */}
        {activeTab === 'analytics' && (
          <AiLearningAnalytics />
        )}

      </main>

      {/* Bottom Sticky Status / Bar */}
      <div className="sticky bottom-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-indigo-300 font-bold bg-indigo-500/15 px-2.5 py-0.5 rounded-md border border-indigo-500/25">
              <Store className="w-3.5 h-3.5 text-indigo-400" />
              کامواوب پرو (Kamva Core & Store)
            </span>
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              پایه توسعه: وردپرس ۷.۱ مری لو (WP 7.1)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              سیستم خودترمیمی و مصونیت از آپدیت‌ها: فعال
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-purple-400 font-medium">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              افزونه قابل‌نصب kamva-core: آماده تحویل
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              سرعت لایت‌هاوس: ۹۹/۱۰۰
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>PHP 8.2+</span>
            <span>•</span>
            <span>MySQL 8.0</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">بدون وابستگی خارجی</span>
          </div>
        </div>
      </div>

      {/* Code Viewer Modal */}
      <ThemeCodeViewerModal
        isOpen={isCodeViewerOpen}
        onClose={() => setIsCodeViewerOpen(false)}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
      />

      {/* GitHub Export Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        siteName={themeConfig.general.siteName}
      />

    </div>
  );
}
