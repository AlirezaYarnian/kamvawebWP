export interface KnowledgeItem {
  id: string;
  category: 'product' | 'faq' | 'policy' | 'pricing' | 'service';
  title: string;
  content: string;
  keywords: string[];
  conversionTrigger?: string;
  price?: string;
  inStock?: boolean;
  sourceUrl?: string;
  extractedAt?: string;
}

export interface KamvaStoreHeaderConfig {
  headerLayout: 'default' | 'centered-logo' | 'minimal-split' | 'ecommerce-full' | 'modern-float';
  topBarEnabled: boolean;
  topBarText: string;
  topBarPhone: string;
  topBarCurrencySwitcher: boolean;
  topBarLanguageSwitcher: boolean;
  stickyHeader: boolean;
  stickyHeaderEffect: 'slide' | 'fade' | 'smart';
  ajaxSearchWithCategories: boolean;
  ajaxSearchPostTypes: 'product' | 'product_and_post' | 'all';
  wishlistCompareCounter: boolean;
  cartDrawerType: 'offcanvas' | 'dropdown' | 'modal';
  mobileHeaderLayout: 'logo-center' | 'logo-left' | 'search-prominent';
}

export interface KamvaStoreShopConfig {
  productHoverEffect: 'hover-summary' | 'quick-shop' | 'tiled' | 'alt-image' | 'button-on-hover' | 'full-info';
  gridColumnsDesktop: 3 | 4 | 5 | 6;
  gridColumnsTablet: 2 | 3;
  gridColumnsMobile: 1 | 2;
  ajaxPagination: 'infinite' | 'load-more' | 'pagination';
  stockProgressBar: boolean;
  timerSalesCountdown: boolean;
  swatchesAttributeSelector: boolean; // Color & size swatches directly on cards
  quickViewModal: boolean;
  saleBadgePercentage: boolean;
  outOfStockBadge: boolean;
  freeShippingBarThreshold: number; // e.g. 2,000,000 Toman
}

export interface KamvaStoreSingleProductConfig {
  galleryLayout: 'vertical-thumbnails' | 'grid-two-columns' | 'sticky-compact' | 'horizontal-slider';
  ajaxAddToCart: boolean;
  buyNowOneClickButton: boolean;
  stickyAddToCartBar: boolean;
  soldCountSocialProof: boolean;
  frequentlyBoughtTogether: boolean;
  customProductTabs: boolean;
  aiConsultantTabInProduct: boolean;
}

export interface KamvaStoreFooterConfig {
  footerLayout: '4-columns' | '3-columns' | '2-columns' | 'minimal' | '6-columns';
  stickyFooterBarMobile: boolean; // Mobile Bottom Navigation Bar (Home, Shop, Cart, Wishlist, Account)
  enamadTrustBadge: boolean;
  samandehiBadge: boolean;
  copyrightText: string;
}

// Modular Feature Flags (مدیر سایت بتونه هر فیچری رو فعال یا غیرفعال کنه)
export interface ModularFeatureFlags {
  neuralCore: boolean;
  storeBuilder: boolean;
  aiosSecurity: boolean;
  databaseCleaner: boolean;
  imageOptimizer: boolean;
  kamvaSpeedCache: boolean;
  userPortal: boolean;
  developerStudio: boolean;
  adminCustomizer: boolean;
  googleIntelligence: boolean;
  seoEngine: boolean;
  crawlerBot: boolean;
  elementorPack: boolean;
}

// Neural Network & Machine Learning Model
export interface NeuralNetworkConfig {
  enabled: boolean;
  layersCount: number;
  learningRate: number; // 0.001 - 0.1
  trainingEpochs: number;
  synapticWeights: {
    userIntentWeight: number;
    priceSensitivityWeight: number;
    contentRelevanceWeight: number;
    bouncePreventionWeight: number;
    speedOptimizationWeight: number;
  };
  adaptiveCachePrewarming: boolean;
  anomalyDetectionActive: boolean;
  userIntentInference: boolean;
  realtimeOptimizationScore: number; // 0 - 100
  lastTrainedTimestamp: string;
}

// All-In-One Security (AIOS)
export interface AiosSecurityConfig {
  enabled: boolean;
  smartWafFirewall: boolean;
  customLoginUrl: string; // e.g. /kamva-secure-login
  userLockoutMaxAttempts: number;
  lockoutDurationMinutes: number;
  twoFactorAuth: 'disabled' | 'admin_only' | 'all_roles';
  recaptchaV3: boolean;
  honeypotSpamProtection: boolean;
  xmlRpcDisabled: boolean;
  restApiHardened: boolean;
  changeDatabasePrefix: string;
  fileChangeDetection: boolean;
  firewall6g7gRules: boolean;
  ipBlacklist: string[];
  ipWhitelist: string[];
  blockMaliciousUserAgents: boolean;
  antiSqlInjection: boolean;
}

// Image Optimization & WebP/AVIF Converter
export interface ImageOptimizerConfig {
  enabled: boolean;
  autoConvertWebp: boolean;
  autoConvertAvif: boolean;
  losslessQualityPercent: number; // e.g. 85%
  stripExifMetadata: boolean;
  maxWidthConstraint: number; // e.g. 1920px
  maxHeightConstraint: number; // e.g. 1080px
  adaptiveSrcset: boolean;
  totalImagesOptimized: number;
  totalMbSaved: number;
}

// LiteSpeed Cache Equivalent (KamvaSpeed Cache)
export interface KamvaCacheConfig {
  enabled: boolean;
  pageCache: boolean;
  objectCacheRedis: boolean;
  redisHost: string;
  redisPort: number;
  minifyHtml: boolean;
  minifyCss: boolean;
  minifyJs: boolean;
  combineCssJs: boolean;
  criticalCssGenerator: boolean;
  lazyLoadImages: boolean;
  lazyLoadIframes: boolean;
  dnsPrefetchList: string[];
  browserCacheDays: number;
  cacheTtlSeconds: number;
}

// User Portal & Custom Registration Builder
export interface UserPortalConfig {
  enabled: boolean;
  siteCategory: 'shop' | 'academy' | 'corporate' | 'service' | 'vip_membership';
  otpMobileLogin: boolean;
  customRegistrationFields: Array<{
    id: string;
    label: string;
    type: 'text' | 'tel' | 'email' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
  customDashboardTabs: Array<{
    id: string;
    label: string;
    icon: string;
    enabled: boolean;
  }>;
  allowSocialLogin: boolean;
  redirectAfterLogin: string;
  customPortalTitle: string;
  welcomeNotice: string;
}

// Developer Code Studio
export interface DeveloperStudioConfig {
  enabled: boolean;
  sandboxMode: boolean;
  customPhpSnippets: Array<{
    id: string;
    title: string;
    code: string;
    active: boolean;
    hook: string;
    priority: number;
  }>;
  customCssScss: string;
  customHeaderJs: string;
  customFooterJs: string;
}

// WordPress Admin Customizer & AI Speed Booster
export interface AdminCustomizerConfig {
  whiteLabelEnabled: boolean;
  customLoginLogoUrl: string;
  customLoginBackground: string;
  adminThemeColorScheme: 'kamva_dark' | 'midnight_purple' | 'emerald_pro' | 'clean_slate';
  hideWpNotices: boolean;
  customAdminFooterText: string;
  fastAdminAiBooster: boolean; // AI-driven slow query optimizer & widget suppression
  heartbeatAdminFrequencySeconds: number;
  disableAdminSvgCheck: boolean;
}

// Google Search Console & Analytics 4 Intelligence
export interface GoogleIntelligenceData {
  connected: boolean;
  searchConsoleConnected: boolean;
  analytics4Connected: boolean;
  propertyUrl: string;
  monthlyImpressions: number;
  monthlyClicks: number;
  averageCtr: number;
  averagePosition: number;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  activeRealtimeUsers: number;
  conversionRatePercent: number;
  bounceRatePercent: number;
  aiMarketingActionItems: string[];
}

export interface ThemeOptionsConfig {
  general: {
    siteName: string;
    siteSlogan: string;
    siteType: 'ecommerce' | 'corporate' | 'blog' | 'service';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: 'Vazirmatn' | 'Shabnam' | 'Sahel' | 'YekanBakh' | 'IranSans';
    rtlMode: boolean;
    darkMode: boolean;
    pagePreloader: boolean;
    scrollToTopButton: boolean;
  };
  featureFlags: ModularFeatureFlags;
  neuralNetwork: NeuralNetworkConfig;
  storeBuilderOptions: {
    headerBuilder: KamvaStoreHeaderConfig;
    shopCatalog: KamvaStoreShopConfig;
    singleProduct: KamvaStoreSingleProductConfig;
    footerBuilder: KamvaStoreFooterConfig;
  };
  aiosSecurity: AiosSecurityConfig;
  imageOptimizer: ImageOptimizerConfig;
  kamvaSpeedCache: KamvaCacheConfig;
  userPortal: UserPortalConfig;
  developerStudio: DeveloperStudioConfig;
  adminCustomizer: AdminCustomizerConfig;
  googleIntelligence: GoogleIntelligenceData;
  crawlerEngine: {
    enabled: boolean;
    autoCrawlInternalLinks: boolean;
    extractJsonLdSchema: boolean;
    extractPricingTags: boolean;
    lastCrawlUrl: string;
    crawlIntervalHours: number;
    depthLevel: number;
  };
  stabilityAndErrorHealing: {
    autoConflictIsolation: boolean;
    safeModeRecovery: boolean;
    backwardCompatibilityLayer: boolean;
    databaseHealthAutoOptimize: boolean;
    realtimeErrorLogMonitor: boolean;
    activeErrorsCount: number;
    resolvedConflictsCount: number;
    lastHealingTimestamp: string;
  };
  aiCore: {
    enabled: boolean;
    autonomousLocalMode: boolean;
    learningRate: 'conservative' | 'balanced' | 'aggressive';
    serverResourceLimit: number;
    autoIndexIntervalHours: number;
    conversionGoal: 'sales' | 'leads' | 'engagement';
    salesBotAvatar: string;
    botWelcomeMessage: string;
    botTone: 'persuasive' | 'expert' | 'friendly' | 'formal';
    autoSuggestProducts: boolean;
    discountTriggerPercent: number;
  };
  speedOptimizer: {
    enabled: boolean;
    smartPluginDequeue: boolean;
    criticalCssInline: boolean;
    delayNonCriticalJs: boolean;
    adaptiveLazyLoad: boolean;
    minifyHtmlCssJs: boolean;
    heartbeatControl: 'disable' | 'limit' | 'default';
    browserCacheDays: number;
    instantPagePrefetch: boolean;
  };
  securityShield: {
    enabled: boolean;
    smartWafFirewall: boolean;
    bruteForceLimitAttempts: number;
    bruteForceLockoutMinutes: number;
    hideWpLoginUrl: string;
    disableXmlRpc: boolean;
    maskWordPressVersion: boolean;
    realtimeMalwareScanner: boolean;
    twoFactorEnforcement: 'all_admins' | 'all_users' | 'optional';
    blockMaliciousUserAgents: boolean;
    antiSqlInjection: boolean;
  };
  seoIntelligence: {
    enabled: boolean;
    autoJsonLdSchema: boolean;
    openGraphAutomated: boolean;
    autoGenerateMetaTitles: boolean;
    competitorScrapeIntervalDays: number;
    keywordTrackingList: string[];
    ecommercePriceMonitoring: boolean;
    canonicalEnforcement: boolean;
  };
  elementorIntegration: {
    aiWidgetsEnabled: boolean;
    smartStickyConsultant: boolean;
    customElementorBreakpoints: boolean;
    cleanElementorDom: boolean;
    customIconsPack: boolean;
  };
  wordpressCore: {
    targetVersion: string;
    phpRequirement: string;
    interactivityApi: boolean;
    blockPatternsEnhanced: boolean;
    commandPaletteIntegration: boolean;
    nativeAiCoreBridge: boolean;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'brute_force' | 'sql_injection' | 'xss_blocked' | 'xmlrpc_attempt' | 'malicious_bot';
  ip: string;
  targetUrl: string;
  actionTaken: 'مسدود شد (IP Banned)' | 'ترافیک فیلتر شد' | 'درخواست رد شد';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SpeedMetricItem {
  id: string;
  name: string;
  before: number;
  after: number;
  unit: string;
  status: 'improved' | 'optimal';
  description: string;
}

export interface ManagedPlugin {
  slug: string;
  name: string;
  category: string;
  originalWeightKb: number;
  impactScore: 'سبک' | 'متوسط' | 'بسیار سنگین';
  status: 'active' | 'optimized' | 'dequeued_conditionally';
  savingMs: number;
}

export interface WeeklyTrendKeyword {
  keyword: string;
  trendGrowthPercent: number;
  searchVolumeMonthly: string;
  intent: 'معاملاتی (خرید فوری)' | 'مقایسه و تحقیق' | 'اطلاعاتی';
  targetShopCategory: string;
  opportunityLevel: 'فرصت طلایی' | 'رقابت متوسط' | 'پرترافیک';
  suggestedTitle: string;
  suggestedMetaDesc: string;
  recommendedSchema: 'Product' | 'FAQPage' | 'BreadcrumbList' | 'CollectionPage';
}

export interface WeeklyTrendsReport {
  id: string;
  generatedAt: string;
  periodTitle: string;
  topTrendingKeywords: WeeklyTrendKeyword[];
  ecommerceActionItems: string[];
  competitorMovements: {
    competitor: string;
    action: string;
    counterStrategy: string;
  }[];
  managerEmailTarget: string;
  status: 'draft' | 'dispatched_to_manager';
  dispatchedAt?: string;
}

export interface GoogleSchemaDefinition {
  type: 'Product' | 'FAQPage' | 'BreadcrumbList' | 'Organization' | 'LocalBusiness' | 'CollectionPage';
  title: string;
  description: string;
  jsonLd: Record<string, any>;
  richSnippetPreview: {
    title: string;
    url: string;
    description: string;
    rating?: number;
    reviewCount?: number;
    price?: string;
    availability?: string;
    breadcrumbs?: string[];
    faqItems?: { question: string; answer: string }[];
  };
}

export interface OrphanedTableItem {
  tableName: string;
  rowCount: number;
  sizeMb: number;
  sourcePlugin: string;
  riskLevel: 'safe' | 'caution' | 'critical';
  aiAnalysis: string;
  detectedIssue: string;
  selectedForCleanup: boolean;
  sqlCleanupQuery: string;
  tableEngine?: 'InnoDB' | 'MyISAM';
  confidencePercent?: number;
  lastAccessedDate?: string;
}

export interface TransientDataItem {
  category: string;
  count: number;
  sizeMb: number;
  description: string;
  impact: string;
  safeToPurge: boolean;
  sqlCleanupQuery: string;
  isAutoloaded: boolean;
}

export interface DbCleanupHistoryItem {
  id: string;
  timestamp: string;
  freedMb: number;
  purgedRows: number;
  durationMs: number;
  newTotalSizeMb: number;
  mode: 'real' | 'simulation';
  itemsSummary: string;
}

export interface DatabaseHealthReport {
  totalDbSizeMb: number;
  bloatedSizeMb: number;
  cleanableRowsCount: number;
  queryTimeReductionPercent: number;
  overheadSizeMb: number;
  autoloadedOptionsSizeKb: number;
  orphanedTables: OrphanedTableItem[];
  transients: TransientDataItem[];
  postRevisionsCount: number;
  revisionsSizeMb: number;
  spamCommentsCount: number;
  orphanedPostmetaCount: number;
  trashedPostsCount: number;
  autoDraftsCount: number;
  lastOptimizedAt: string;
  status: 'needs_optimization' | 'optimized_clean';
  history?: DbCleanupHistoryItem[];
}

export type WidgetSlotId = 
  | 'top_announcement_bar'
  | 'header_sub_hero'
  | 'sidebar_upper_prime'
  | 'sidebar_sticky_scroll'
  | 'in_content_interstitial'
  | 'floating_bottom_bar'
  | 'exit_intent_overlay';

export interface SmartWidget {
  id: string;
  name: string;
  nameFa: string;
  category: 'cta' | 'ai_assistant' | 'social_proof' | 'urgency' | 'cross_sell' | 'lead_magnet' | 'filter';
  currentSlot: WidgetSlotId;
  defaultSlot: WidgetSlotId;
  priority: number;
  isPinned: boolean;
  active: boolean;
  mlConfidenceScore: number; // 0 - 100
  ctrPercent: number;
  conversionLiftPercent: number;
  impressionsCount: number;
  clicksCount: number;
  dwellTimeAvgSeconds: number;
  heatmapEngagementStatus: 'blazing_hot' | 'warm' | 'neutral' | 'cold_deadzone';
  lastRepositionReason: string;
  lastRepositionTimestamp: string;
  contentTitle: string;
  contentSubtitle: string;
  actionText: string;
  accentColor: string;
}

export interface HeatmapZoneMetric {
  slotId: WidgetSlotId;
  nameFa: string;
  attentionPercentage: number; // 0 - 100%
  clickDensityScore: number; // 0 - 100
  avgScrollReachPercent: number; // 0 - 100%
  activeVisitorsCount: number;
  bounceRiskRate: number; // 0 - 100%
  status: 'peak_hot' | 'high_attention' | 'moderate' | 'low_dropout';
}

export interface HeatmapTelemetryPoint {
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
  intensity: number; // 0.1 - 1.0
  type: 'click' | 'hover_dwell' | 'rage_click';
  timestamp: string;
}

export interface SmartLayoutEngineConfig {
  enabled: boolean;
  autonomousRepositioning: boolean;
  learningAlgorithm: 'multi_armed_bandit' | 'reinforcement_deep_q' | 'heuristic_weighted';
  explorationRateEpsilon: number; // 0.05 - 0.5 (e.g. 0.15 = 15% exploration)
  dwellTimeWeight: number; // 0.1 - 1.0
  clickWeight: number; // 0.1 - 1.0
  scrollReachWeight: number; // 0.1 - 1.0
  mobileAdaptationMode: boolean;
  antiFatigueFrequencyCapping: boolean;
  userIntentAdaptation: boolean;
  repositionIntervalSeconds: number;
  totalAutoRepositioningsCount: number;
  overallCtrLiftPercent: number;
  bounceReductionPercent: number;
  revenuePerVisitorLiftPercent: number;
  activeTestPreset: 'normal' | 'flash_sale_surge' | 'mobile_dropoff_rescue' | 'content_heavy_blog' | 'cart_abandonment';
}

// ==========================================
// SMART THEME MIGRATOR & LEGACY SETTINGS MAPPER
// ==========================================

export type LegacyThemeSlug = 
  | 'woodmart'
  | 'astra'
  | 'flatsome'
  | 'avada'
  | 'divi'
  | 'hello_elementor'
  | 'oceanwp'
  | 'enfold'
  | 'betheme'
  | 'custom_raw';

export type MigrationFieldCategory = 
  | 'general' 
  | 'header' 
  | 'shop' 
  | 'single_product' 
  | 'performance' 
  | 'security' 
  | 'user_portal' 
  | 'developer_snippets' 
  | 'neural_ai';

export interface MappedFieldItem {
  id: string;
  category: MigrationFieldCategory;
  categoryTitleFa: string;
  legacyKey: string;
  legacyValueFormatted: string;
  legacyRawValue: any;
  nexusKeyPath: string;
  nexusValue: any;
  nexusValueFormatted: string;
  confidenceScore: number; // 0 - 100
  matchType: 'exact_key' | 'semantic_ai' | 'heuristic_transform' | 'default_inferred';
  explanationFa: string;
  isCustomModified?: boolean;
  status: 'mapped' | 'warning' | 'skipped' | 'auto_optimized';
}

export interface LegacyPluginReplacement {
  id: string;
  legacyPluginName: string;
  legacySlug: string;
  originalPayloadKb: number;
  nexusNativeReplacement: string;
  benefitFa: string;
  queriesSaved: number;
  recommendation: 'safe_to_deactivate' | 'fully_absorbed' | 'compatibility_layer_active';
}

export interface ThemeMigrationAnalysisResult {
  id: string;
  sourceTheme: LegacyThemeSlug;
  sourceThemeName: string;
  sourceThemeVersion: string;
  analyzedAt: string;
  sourceFormat: 'theme_mods_json' | 'customizer_dat' | 'redux_framework' | 'functions_php' | 'elementor_kit' | 'active_theme_dump';
  totalExtractedSettings: number;
  mappedFieldsCount: number;
  unmappedIgnoredCount: number;
  averageConfidenceScore: number;
  performanceProjection: {
    lighthouseBefore: number;
    lighthouseAfter: number;
    pageWeightBeforeKb: number;
    pageWeightAfterKb: number;
    domNodeReductionPercent: number;
    dbQueriesReductionPercent: number;
    ttfbImprovementMs: number;
  };
  incompatibilitiesResolved: string[];
  mappedItems: MappedFieldItem[];
  pluginReplacements: LegacyPluginReplacement[];
  resultingConfig: ThemeOptionsConfig;
  phpBridgeSnippet: string;
  migrationNotes: string[];
}

export interface ThemeMigrationHistoryItem {
  id: string;
  sourceThemeName: string;
  timestamp: string;
  fieldsCount: number;
  speedBoost: string;
  status: 'applied' | 'backed_up' | 'rolled_back';
  author: string;
  configSnapshot: ThemeOptionsConfig;
}

// ==========================================
// A/B CONTENT TESTING MODULE TYPES
// ==========================================

export type ABSectionType = 'hero_section' | 'product_spotlight' | 'lead_capture' | 'pricing_matrix' | 'cta_banner';

export interface ABSectionVariant {
  id: 'A' | 'B';
  name: string;
  headline: string;
  subheadline: string;
  badgeText: string;
  badgeColor: string;
  ctaText: string;
  ctaSubtext?: string;
  ctaColor: string;
  ctaBgGradient: string;
  secondaryCtaText?: string;
  priceTag?: string;
  discountTag?: string;
  urgencyText?: string;
  urgencyTimerMinutes?: number;
  socialProofText: string;
  guaranteeBadgeText: string;
  bulletPoints: string[];
  visualStyle: 'gradient_dark' | 'glassmorphism' | 'high_contrast' | 'vibrant_warm' | 'minimal_clean';
  mediaPlaceholderText: string;
  mediaBadge: string;
}

export interface ABVariantMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  bounceCount: number;
  totalTimeSeconds: number;
  revenueToman: number;
  ctr: number; // percentage
  conversionRate: number; // percentage
  bounceRate: number; // percentage
  avgTimeSeconds: number;
}

export interface ABExperiment {
  id: string;
  title: string;
  sectionType: ABSectionType;
  status: 'draft' | 'running' | 'paused' | 'concluded';
  trafficSplitRatio: number; // 50 means 50/50
  autoPromoteWinner: boolean;
  minConfidenceThreshold: number; // e.g. 95%
  variantA: ABSectionVariant;
  variantB: ABSectionVariant;
  metricsA: ABVariantMetrics;
  metricsB: ABVariantMetrics;
  winnerVariant: 'A' | 'B' | 'inconclusive' | null;
  confidenceLevel: number; // e.g. 98.6%
  upliftPercentage: number;
  pValue: number;
  aiCoreAnalysis: {
    summaryFa: string;
    winningFactors: string[];
    psychologicalTriggersA: string[];
    psychologicalTriggersB: string[];
    recommendations: string[];
    heatDistribution: {
      headlineAttention: { A: number; B: number };
      ctaAttention: { A: number; B: number };
      socialProofAttention: { A: number; B: number };
    };
  };
  createdAt: string;
  updatedAt: string;
}


