import React, { useState, useEffect } from 'react';
import { defaultThemeConfig, sampleKnowledgeBase } from './data/initialData';
import { ThemeOptionsConfig, KnowledgeItem } from './types/theme';
import { Navbar } from './components/Navbar';
import { ThemeOptionsPanel } from './components/ThemeOptionsPanel';
import { SmartConfigGenerator } from './components/SmartConfigGenerator';
import { ProductionDeployer } from './components/ProductionDeployer';
import { AiDisasterRecovery } from './components/AiDisasterRecovery';
import { HealthReportDashboard } from './components/HealthReportDashboard';
import { AiThemeUpdater } from './components/AiThemeUpdater';
import { NeuralNetworkDashboard } from './components/NeuralNetworkDashboard';
import { CacheAndImageOptimizer } from './components/CacheAndImageOptimizer';
import { UserPortalCustomizer } from './components/UserPortalCustomizer';
import { DeveloperStudio } from './components/DeveloperStudio';
import { AiSalesWidgetLiveDemo } from './components/AiSalesWidgetLiveDemo';
import { ElementorVisualSimulator } from './components/ElementorVisualSimulator';
import { SeoMarketLab } from './components/SeoMarketLab';
import { SpeedSecurityAuditor } from './components/SpeedSecurityAuditor';
import { AiLearningAnalytics } from './components/AiLearningAnalytics';
import { 
  Store, 
  LifeBuoy, 
  Rocket,
  ShieldCheck,
  Zap,
  Wand2,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('options');
  const [themeConfig, setThemeConfig] = useState<ThemeOptionsConfig>(defaultThemeConfig);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(sampleKnowledgeBase);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#f05023] selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

        {/* Tab 2: Smart Config Generator using AI */}
        {activeTab === 'smart-config' && (
          <SmartConfigGenerator
            currentConfig={themeConfig}
            onApplyConfig={setThemeConfig}
          />
        )}

        {/* Tab 3: Production Deployment Helper */}
        {activeTab === 'deploy-helper' && (
          <ProductionDeployer
            config={themeConfig}
          />
        )}

        {/* Tab: AI Disaster Recovery & Incremental Backups */}
        {activeTab === 'disaster-recovery' && (
          <AiDisasterRecovery
            config={themeConfig}
          />
        )}

        {/* Tab: Health Report Dashboard & Monthly PDF */}
        {activeTab === 'health-report' && (
          <HealthReportDashboard
            config={themeConfig}
          />
        )}

        {/* Tab: AI-Driven Theme Updater */}
        {activeTab === 'updater' && (
          <AiThemeUpdater
            config={themeConfig}
          />
        )}

        {/* Tab 4: Neural Network & Machine Learning Core */}
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

        {/* Tab 5: Cache, Lossless Image Optimizer & Database Cleaner */}
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

        {/* Tab 6: AIOS Security & Firewall */}
        {activeTab === 'speed-security' && (
          <SpeedSecurityAuditor />
        )}

        {/* Tab 7: User Portal & Registration Customizer */}
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

        {/* Tab 8: Developer Studio & Code Sandbox */}
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

        {/* Tab 9: Google Intelligence & SEO Marketing */}
        {activeTab === 'seo-market' && (
          <SeoMarketLab />
        )}

        {/* Tab 10: Live AI Sales Assistant */}
        {activeTab === 'sales-ai' && (
          <AiSalesWidgetLiveDemo
            knowledgeBase={knowledgeBase}
            onUpdateKnowledgeBase={setKnowledgeBase}
            config={themeConfig}
          />
        )}

        {/* Tab 11: Elementor Studio Simulator */}
        {activeTab === 'elementor' && (
          <ElementorVisualSimulator
            config={themeConfig}
            knowledgeBase={knowledgeBase}
          />
        )}

        {/* Tab 12: Learning Analytics & Conversion Tracking */}
        {activeTab === 'analytics' && (
          <AiLearningAnalytics />
        )}

      </main>

      {/* Bottom Sticky Status / Bar */}
      <div className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#ff805d] font-bold bg-[#f05023]/15 px-2.5 py-0.5 rounded-md border border-[#f05023]/25">
              <Store className="w-3.5 h-3.5 text-[#f05023]" />
              پلتفرم پروداکشن کامواوب پرو (Kamva Core & Store)
            </span>
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              پایه توسعه: وردپرس ۷.۱ مری لو (WP 7.1)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              ساندباکس خودترمیمی خطاها: فعال
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              سرعت لایت‌هاوس: ۹۹/۱۰۰
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>PHP 8.2+ Production</span>
            <span>•</span>
            <span>MySQL 8.0</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">کاملاً بومی و پایدار</span>
          </div>
        </div>
      </div>

    </div>
  );
}
