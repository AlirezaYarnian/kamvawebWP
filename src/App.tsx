import React, { useState, useEffect } from 'react';
import { defaultThemeConfig, sampleKnowledgeBase } from './data/initialData';
import { ThemeOptionsConfig, KnowledgeItem } from './types/theme';
import { Navbar } from './components/Navbar';
import { WordPressLivePreview } from './components/WordPressLivePreview';
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
import { SmartWidgetLayoutEngine } from './components/SmartWidgetLayoutEngine';
import { SmartThemeMigrator } from './components/SmartThemeMigrator';
import { DatabaseMigrator } from './components/DatabaseMigrator';
import { EscMarketStoreStudio } from './components/EscMarketStoreStudio';
import { AiAutoTuningModal } from './components/AiAutoTuningModal';
import { AiContentOptimizer } from './components/AiContentOptimizer';
import { KamvaCacheEngine } from './components/KamvaCacheEngine';
import { ElementorStyleSync } from './components/ElementorStyleSync';
import { KamvaMarketingGenius } from './components/KamvaMarketingGenius';
import { ChildThemeManager } from './components/ChildThemeManager';
import { AiWorkflowAutomator } from './components/AiWorkflowAutomator';
import { ThemeComponentIsolationLab } from './components/ThemeComponentIsolationLab';
import { NexusRealtimeTrafficMonitor } from './components/NexusRealtimeTrafficMonitor';
import { AiSeoContentCalendar } from './components/AiSeoContentCalendar';
import { GlobalAiBehaviorSettings } from './components/GlobalAiBehaviorSettings';
import { GlobalSafetyProtocol } from './components/GlobalSafetyProtocol';
import { PredictiveResourceScaler } from './components/PredictiveResourceScaler';
import { AutomatedSchemaGenerator } from './components/AutomatedSchemaGenerator';
import { AiPluginCompatibilityScanner } from './components/AiPluginCompatibilityScanner';
import { KamvaWPCLIRunner } from './components/KamvaWPCLIRunner';
import { AiLandingPageOptimizer } from './components/AiLandingPageOptimizer';
import { AiDesignSystemManager } from './components/AiDesignSystemManager';
import { KamvaLocalNeuralHub } from './components/KamvaLocalNeuralHub';
import { AiErrorReportDiagnostic } from './components/AiErrorReportDiagnostic';
import { ThemePackageGenerator } from './components/ThemePackageGenerator';
import { wpApiFetch, WordPressApiError } from './utils/wpApiFetch';
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
  const [isLivePreviewMode, setIsLivePreviewMode] = useState<boolean>(false);
  const [isAutoTuningOpen, setIsAutoTuningOpen] = useState<boolean>(false);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);

  // Apply best-practice cross-module configurations
  const handleApplyAutoTuning = async () => {
    const tunedConfig: ThemeOptionsConfig = {
      ...themeConfig,
      kamvaSpeedCache: {
        ...themeConfig.kamvaSpeedCache,
        enabled: true,
        pageCache: true,
        objectCacheRedis: true,
        minifyHtml: true,
        minifyCss: true,
        minifyJs: true,
        combineCssJs: true,
        criticalCssGenerator: true,
        lazyLoadImages: true,
        lazyLoadIframes: true,
      },
      imageOptimizer: {
        ...themeConfig.imageOptimizer,
        enabled: true,
        autoConvertWebp: true,
        autoConvertAvif: true,
        losslessQualityPercent: 88,
        stripExifMetadata: true,
      },
      neuralNetwork: {
        ...themeConfig.neuralNetwork,
        enabled: true,
        learningRate: 0.001,
        adaptiveCachePrewarming: true,
        anomalyDetectionActive: true,
        userIntentInference: true,
        realtimeOptimizationScore: 99,
      },
      aiosSecurity: {
        ...themeConfig.aiosSecurity,
        enabled: true,
        smartWafFirewall: true,
        xmlRpcDisabled: true,
        restApiHardened: true,
        honeypotSpamProtection: true,
        blockMaliciousUserAgents: true,
        antiSqlInjection: true,
      },
      developerStudio: {
        ...themeConfig.developerStudio,
        enabled: true,
        sandboxMode: true,
      }
    };

    setThemeConfig(tunedConfig);

    try {
      await fetch('/api/theme-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tunedConfig),
      });
    } catch (err) {
      console.warn('Auto-tuning saved locally', err);
    }
  };

  // Load real persistent knowledge base and theme options from server on mount
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const kbData = await wpApiFetch<any>({ path: '/api/knowledge-base' });
        if (kbData && kbData.items && kbData.items.length > 0) {
          setKnowledgeBase(kbData.items);
        } else {
          console.log('WordPress database returned no knowledge base records. Falling back to default baseline.');
          setKnowledgeBase(sampleKnowledgeBase);
        }
      } catch (e: any) {
        console.warn('Failed loading knowledge base. Falling back to default baseline.', e);
        setKnowledgeBase(sampleKnowledgeBase);
        if (e instanceof WordPressApiError && e.status === 401) {
          setIsUnauthorized(true);
        }
      }

      try {
        const confData = await wpApiFetch<any>({ path: '/api/theme-options' });
        if (confData && confData.general) {
          setThemeConfig(confData);
        } else {
          console.log('WordPress database returned no theme options. Falling back to default baseline config.');
          setThemeConfig(defaultThemeConfig);
        }
      } catch (e: any) {
        console.warn('Failed loading theme options. Falling back to default baseline config.', e);
        setThemeConfig(defaultThemeConfig);
        if (e instanceof WordPressApiError && e.status === 401) {
          setIsUnauthorized(true);
        }
      }
    };

    loadRealData();
  }, []);

  const refreshKnowledgeBaseFromServer = async () => {
    try {
      const data = await wpApiFetch<any>({ path: '/api/knowledge-base' });
      if (data && data.items) {
        setKnowledgeBase(data.items);
      }
    } catch (e) {
      console.error('Failed refreshing knowledge base', e);
    }
  };

  // If in Live Store Frontend Mode, render the full WordPress Frontend
  if (isLivePreviewMode) {
    return (
      <WordPressLivePreview
        config={themeConfig}
        knowledgeBase={knowledgeBase}
        onSwitchToAdmin={() => setIsLivePreviewMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#f05023] selection:text-white">
      
      {/* 401 Unauthorized Session Expired Re-authentication Overlay */}
      {isUnauthorized && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-white">نشست امنیتی وردپرس منقضی شده است!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              برای برقراری ارتباط ایمن با هسته وردپرس و فعال‌سازی قابلیت‌های هوش مصنوعی محلی، لطفاً مجدداً در پیشخوان مدیریت وردپرس وارد شوید یا صفحه را تازه کنید.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                تلاش مجدد و بارگذاری نشست (Refresh Session)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleLivePreview={() => setIsLivePreviewMode(true)}
        isLivePreview={isLivePreviewMode}
        onRunAutoTune={() => setIsAutoTuningOpen(true)}
      />

      {/* AI Auto-Tuning Modal */}
      <AiAutoTuningModal
        isOpen={isAutoTuningOpen}
        onClose={() => setIsAutoTuningOpen(false)}
        onApplyTuning={handleApplyAutoTuning}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab ESCMarket: Complete E-Commerce Store Studio (escmarket.shop UI) */}
        {activeTab === 'escmarket-store' && (
          <EscMarketStoreStudio />
        )}

        {/* Tab: AI Content Optimizer for Gutenberg and Elementor */}
        {activeTab === 'content-optimizer' && (
          <AiContentOptimizer />
        )}

        {/* Tab: Kamva Marketing Genius */}
        {activeTab === 'marketing-genius' && (
          <KamvaMarketingGenius />
        )}

        {/* Tab 1: Kamva Store & Comprehensive Theme Options */}
        {activeTab === 'options' && (
          <ThemeOptionsPanel
            config={themeConfig}
            onChangeConfig={setThemeConfig}
            onRefreshKnowledgeBase={refreshKnowledgeBaseFromServer}
          />
        )}

        {/* Tab: Smart Theme Migrator to NexusAI */}
        {activeTab === 'theme-migrator' && (
          <SmartThemeMigrator
            currentConfig={themeConfig}
            onApplyConfig={setThemeConfig}
            onViewLivePreview={() => setIsLivePreviewMode(true)}
          />
        )}

        {/* Tab: Smart Widget Layout Engine & Real-time Heatmap */}
        {activeTab === 'smart-widgets' && (
          <SmartWidgetLayoutEngine />
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

        {/* Tab: Theme Package Generator */}
        {activeTab === 'theme-package-generator' && (
          <ThemePackageGenerator />
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

        {/* Tab: AI Error Report Diagnostic */}
        {activeTab === 'error-diagnostic' && (
          <AiErrorReportDiagnostic />
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

        {/* Tab: Elementor Style Sync */}
        {activeTab === 'elementor-sync' && (
          <ElementorStyleSync />
        )}

        {/* Tab: Kamva Cache Engine */}
        {activeTab === 'kamva-cache' && (
          <KamvaCacheEngine />
        )}

        {/* Tab: Child Theme Manager */}
        {activeTab === 'child-theme' && (
          <ChildThemeManager />
        )}

        {/* Tab: AI Workflow Automator */}
        {activeTab === 'workflow-automator' && (
          <AiWorkflowAutomator />
        )}

        {/* Tab: Theme Component Isolation Lab */}
        {activeTab === 'component-lab' && (
          <ThemeComponentIsolationLab />
        )}

        {/* Tab: Automated Schema Generator */}
        {activeTab === 'auto-schema' && (
          <AutomatedSchemaGenerator />
        )}

        {/* Tab: Kamva WP-CLI Runner */}
        {activeTab === 'wp-cli' && (
          <KamvaWPCLIRunner />
        )}

        {/* Tab: AI Landing Page Optimizer */}
        {activeTab === 'landing-optimizer' && (
          <AiLandingPageOptimizer />
        )}

        {/* Tab: AI Design System Manager */}
        {activeTab === 'design-system' && (
          <AiDesignSystemManager />
        )}

        {/* Tab: Kamva Local Neural Hub */}
        {activeTab === 'local-neural' && (
          <KamvaLocalNeuralHub />
        )}

        {/* Tab: AI Plugin Compatibility Scanner */}
        {activeTab === 'plugin-scanner' && (
          <AiPluginCompatibilityScanner />
        )}

        {/* Tab: Nexus Realtime Traffic Monitor */}
        {activeTab === 'realtime-traffic' && (
          <NexusRealtimeTrafficMonitor />
        )}

        {/* Tab: Predictive Resource Scaler */}
        {activeTab === 'predictive-scaler' && (
          <PredictiveResourceScaler />
        )}

        {/* Tab: AI SEO Content Calendar */}
        {activeTab === 'seo-calendar' && (
          <AiSeoContentCalendar />
        )}

        {/* Tab: Global AI Behavior Settings */}
        {activeTab === 'ai-behavior' && (
          <GlobalAiBehaviorSettings />
        )}

        {/* Tab: Global Safety Protocol */}
        {activeTab === 'global-safety' && (
          <GlobalSafetyProtocol />
        )}

        {/* Tab 12: Learning Analytics & Conversion Tracking */}
        {activeTab === 'analytics' && (
          <AiLearningAnalytics />
        )}

        {/* Tab 13: Database Schema Migrator */}
        {activeTab === 'db-migrator' && (
          <DatabaseMigrator />
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
