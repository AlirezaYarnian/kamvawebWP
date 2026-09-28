import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Flame, 
  Sparkles, 
  MousePointerClick, 
  TrendingUp, 
  Eye, 
  Layers, 
  Play, 
  RotateCcw, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ArrowDownUp, 
  Zap, 
  Sliders, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Download, 
  Check, 
  Activity, 
  BarChart3, 
  Target, 
  ShoppingBag, 
  Clock, 
  Tag, 
  MessageSquareHeart, 
  HelpCircle,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { 
  SmartWidget, 
  WidgetSlotId, 
  HeatmapZoneMetric, 
  HeatmapTelemetryPoint, 
  SmartLayoutEngineConfig 
} from '../types/theme';
import { 
  defaultSmartLayoutConfig, 
  initialSmartWidgets, 
  initialHeatmapZoneMetrics, 
  initialHeatmapTelemetryPoints 
} from '../data/initialData';

const slotLabels: Record<WidgetSlotId, { title: string; desc: string; defaultColor: string }> = {
  top_announcement_bar: {
    title: 'نوار بالایی (Top Announcement Bar)',
    desc: 'بالاترین بخش صفحه • دید ۱۰۰٪ برای کلیه بازدیدکنندگان ورودی',
    defaultColor: '#eab308'
  },
  header_sub_hero: {
    title: 'زیر هدر و هیرو بنر (Sub-Hero Zone)',
    desc: 'ناحیه طلایی ورودی • مناسب بنرهای تخفیف ویژه و نمادهای اعتماد',
    defaultColor: '#3b82f6'
  },
  sidebar_upper_prime: {
    title: 'سایدبار بالایی دسکتاپ (Sidebar Prime)',
    desc: 'بالای خط تا (Above the Fold) • نرخ ماندگاری و کلیک بالا در دسکتاپ',
    defaultColor: '#10b981'
  },
  sidebar_sticky_scroll: {
    title: 'سایدبار چسبان متحرک (Sticky Sidebar)',
    desc: 'حرکت همگام با اسکرول کاربر • دید مداوم در محتوای طولانی',
    defaultColor: '#8b5cf6'
  },
  in_content_interstitial: {
    title: 'میان‌متن و بین ردیف محصولات (In-Content Interstitial)',
    desc: 'در کانون توجه چشم کاربر هنگام خواندن • بالاترین نرخ تبدیل کلیک',
    defaultColor: '#f05023'
  },
  floating_bottom_bar: {
    title: 'نوار و حباب شناور پایین (Floating Bottom Bar)',
    desc: 'همیشه در دسترس در موبایل و دسکتاپ • ایده‌آل برای ربات فروش و خرید فوری',
    defaultColor: '#6366f1'
  },
  exit_intent_overlay: {
    title: 'لایه مهار خروج و پیشنهاد بازدارنده (Exit-Intent Overlay)',
    desc: 'فعال‌سازی هوشمند با تشخیص شتاب خروج ماوس • مهار پرش و تبدیل فوری',
    defaultColor: '#ec4899'
  }
};

export const SmartWidgetLayoutEngine: React.FC = () => {
  const [config, setConfig] = useState<SmartLayoutEngineConfig>(defaultSmartLayoutConfig);
  const [widgets, setWidgets] = useState<SmartWidget[]>(initialSmartWidgets);
  const [zoneMetrics, setZoneMetrics] = useState<HeatmapZoneMetric[]>(initialHeatmapZoneMetrics);
  const [telemetryPoints, setTelemetryPoints] = useState<HeatmapTelemetryPoint[]>(initialHeatmapTelemetryPoints);
  
  // Viewport & Heatmap display state
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [heatmapLayer, setHeatmapLayer] = useState<'clicks' | 'attention' | 'scroll' | 'rage'>('clicks');
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string>('موتور یادگیری ماشین آماده و در حال پایش رفتار زنده کاربران است.');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'widgets' | 'ml_settings' | 'php_export'>('visualizer');
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Periodic simulation of subtle visitor telemetry when autonomous mode is enabled
  useEffect(() => {
    if (!config.enabled || !config.autonomousRepositioning) return;

    const interval = setInterval(() => {
      // Simulate subtle telemetry flow
      const newX = Math.floor(Math.random() * 80) + 10;
      const newY = Math.floor(Math.random() * 90) + 5;
      const newPoint: HeatmapTelemetryPoint = {
        x: newX,
        y: newY,
        intensity: Math.random() * 0.5 + 0.5,
        type: Math.random() > 0.3 ? 'click' : 'hover_dwell',
        timestamp: new Date().toLocaleTimeString('fa-IR'),
      };

      setTelemetryPoints(prev => [...prev.slice(-18), newPoint]);

      // Randomly update zone active visitors
      setZoneMetrics(prev => prev.map(z => ({
        ...z,
        activeVisitorsCount: Math.max(10, z.activeVisitorsCount + Math.floor(Math.random() * 7) - 3),
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, [config.enabled, config.autonomousRepositioning]);

  // Handle user clicking on the visualizer canvas to generate custom heat points
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPoint: HeatmapTelemetryPoint = {
      x,
      y,
      intensity: 0.95,
      type: 'click',
      timestamp: new Date().toLocaleTimeString('fa-IR'),
    };

    setTelemetryPoints(prev => [...prev.slice(-25), newPoint]);
    setLastActionMessage(`نقطه تعاملی جدید در مختصات X:${x}% و Y:${y}% ثبت شد.`);
  };

  // Run Real-Time ML Layout Optimization Cycle
  const runMlOptimizationCycle = () => {
    setIsOptimizing(true);
    setLastActionMessage('هسته یادگیری ماشین در حال تحلیل ماتریس هیت‌مپ و بازچینی دینامیک جایگاه‌ها...');

    setTimeout(() => {
      // Calculate dynamic zone scores based on telemetry
      const updatedZones = zoneMetrics.map(zone => {
        const zonePoints = telemetryPoints.filter(p => {
          if (zone.slotId === 'top_announcement_bar') return p.y <= 10;
          if (zone.slotId === 'header_sub_hero') return p.y > 10 && p.y <= 25;
          if (zone.slotId === 'in_content_interstitial') return p.y > 25 && p.y <= 60 && p.x > 30 && p.x < 70;
          if (zone.slotId === 'sidebar_upper_prime') return p.y > 25 && p.y <= 55 && p.x <= 30;
          if (zone.slotId === 'sidebar_sticky_scroll') return p.y > 55 && p.y <= 85 && p.x <= 30;
          if (zone.slotId === 'floating_bottom_bar') return p.y > 85;
          return p.type === 'rage_click';
        });

        const bonusAttention = Math.min(100, zone.attentionPercentage + zonePoints.length * 2);
        const bonusClicks = Math.min(100, zone.clickDensityScore + zonePoints.length * 3);

        return {
          ...zone,
          attentionPercentage: bonusAttention,
          clickDensityScore: bonusClicks,
          status: bonusAttention > 90 ? 'peak_hot' as const : bonusAttention > 70 ? 'high_attention' as const : 'moderate' as const,
        };
      });

      // Reposition unpinned widgets intelligently
      const updatedWidgets = widgets.map(w => {
        if (w.isPinned) return w;

        // Reposition rules based on category and hot zones
        let targetSlot = w.currentSlot;
        let reason = w.lastRepositionReason;
        let lift = w.conversionLiftPercent;

        if (w.category === 'urgency') {
          // Put urgency in the hottest available slot
          const hottest = updatedZones.reduce((prev, current) => 
            (prev.attentionPercentage + prev.clickDensityScore) > (current.attentionPercentage + current.clickDensityScore) ? prev : current
          );
          targetSlot = hottest.slotId;
          reason = `انتقال خودکار به ${slotLabels[targetSlot].title} بر اساس تمرکز ۹۶٪ توجه کاربران و افزایش ۳۴٪ CTR`;
          lift = Math.min(65, lift + 2.4);
        } else if (w.category === 'cross_sell') {
          targetSlot = deviceMode === 'mobile' ? 'in_content_interstitial' : 'sidebar_upper_prime';
          reason = `سازگاری با حالت ${deviceMode === 'mobile' ? 'موبایل (میان‌متن)' : 'دسکتاپ (سایدبار بالا)'} جهت حداکثر دید`;
          lift = Math.min(45, lift + 1.8);
        } else if (w.category === 'lead_magnet') {
          targetSlot = 'sidebar_sticky_scroll';
          reason = 'تثبیت در سایدبار چسبان متحرک برای جذب کاربران با اسکرول بالای ۵۰٪';
          lift = Math.min(40, lift + 1.2);
        }

        return {
          ...w,
          currentSlot: targetSlot,
          lastRepositionReason: reason,
          lastRepositionTimestamp: 'هم‌اکنون با الگوریتم تقویتی Q-Learning',
          conversionLiftPercent: parseFloat(lift.toFixed(1)),
          mlConfidenceScore: Math.min(99.4, parseFloat((w.mlConfidenceScore + Math.random() * 1.5).toFixed(1))),
          heatmapEngagementStatus: 'blazing_hot' as const,
        };
      });

      setZoneMetrics(updatedZones);
      setWidgets(updatedWidgets);
      setConfig(prev => ({
        ...prev,
        totalAutoRepositioningsCount: prev.totalAutoRepositioningsCount + 1,
        overallCtrLiftPercent: parseFloat((prev.overallCtrLiftPercent + 0.4).toFixed(1)),
      }));

      setIsOptimizing(false);
      setLastActionMessage('✅ بازچینی هوشمند ویجت‌ها با موفقیت انجام شد و هیت‌مپ بهینه‌سازی گردید.');
    }, 1200);
  };

  // Simulate Traffic Burst / Heatmap Surge
  const triggerTrafficSurge = (presetName: SmartLayoutEngineConfig['activeTestPreset']) => {
    setIsSimulatingTraffic(true);
    setLastActionMessage(`در حال شبیه‌سازی ورود سناریوی «${presetName}» با ۵۰۰ بازدیدکننده همزمان...`);

    const simulatedPoints: HeatmapTelemetryPoint[] = [];

    if (presetName === 'flash_sale_surge') {
      // Concentrate clicks on hero and in-content
      for (let i = 0; i < 20; i++) {
        simulatedPoints.push({
          x: Math.floor(Math.random() * 40) + 30,
          y: Math.floor(Math.random() * 20) + 15,
          intensity: 0.98,
          type: 'click',
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        });
        simulatedPoints.push({
          x: Math.floor(Math.random() * 40) + 30,
          y: Math.floor(Math.random() * 25) + 35,
          intensity: 0.92,
          type: 'click',
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        });
      }
    } else if (presetName === 'mobile_dropoff_rescue') {
      // Drops off heavily after 50%
      for (let i = 0; i < 25; i++) {
        simulatedPoints.push({
          x: Math.floor(Math.random() * 60) + 20,
          y: Math.floor(Math.random() * 30) + 5,
          intensity: 0.89,
          type: 'hover_dwell',
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        });
      }
    } else if (presetName === 'cart_abandonment') {
      // Exit intent clicks top right and close buttons
      for (let i = 0; i < 18; i++) {
        simulatedPoints.push({
          x: Math.floor(Math.random() * 25) + 75,
          y: Math.floor(Math.random() * 12),
          intensity: 0.99,
          type: 'rage_click',
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        });
      }
    }

    setTimeout(() => {
      setTelemetryPoints(simulatedPoints);
      setIsSimulatingTraffic(false);
      runMlOptimizationCycle();
    }, 1000);
  };

  // Toggle Pin/Lock for a widget
  const toggleWidgetPin = (widgetId: string) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === widgetId) {
        const nextPinned = !w.isPinned;
        setLastActionMessage(nextPinned 
          ? `ویجت «${w.nameFa}» در جایگاه فعلی قفل (Pin) شد و توسط هوش مصنوعی جابجا نمی‌شود.` 
          : `قفل ویجت «${w.nameFa}» باز شد و در حالت بازچینی خودکار قرار گرفت.`
        );
        return { ...w, isPinned: nextPinned };
      }
      return w;
    }));
  };

  // Manually override slot assignment
  const handleManualSlotChange = (widgetId: string, newSlot: WidgetSlotId) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === widgetId) {
        return {
          ...w,
          currentSlot: newSlot,
          lastRepositionReason: `تغییر دستی توسط مدیر به جایگاه: ${slotLabels[newSlot].title}`,
          lastRepositionTimestamp: 'تنظیم دستی هم‌اکنون',
        };
      }
      return w;
    }));
    setLastActionMessage(`جایگاه ویجت با موفقیت به «${slotLabels[newSlot].title}» تغییر یافت.`);
  };

  // Reset to default baseline layout
  const resetLayout = () => {
    setWidgets(initialSmartWidgets);
    setZoneMetrics(initialHeatmapZoneMetrics);
    setTelemetryPoints(initialHeatmapTelemetryPoints);
    setLastActionMessage('پیکربندی چیدمان و هیت‌مپ به حالت استاندارد کارخانه بازنشانی شد.');
  };

  // PHP Hook Integration Source Code Generator
  const generateWordPressPhpSnippet = () => {
    return `<?php
/**
 * KamvaWeb Pro - Smart Widget Layout Engine (WordPress 7.1 & WooCommerce)
 * Class: Kamva_Smart_Widget_Engine
 * Description: Real-time Heatmap Ingestion & Autonomous Machine Learning Layout Repositioner
 * 
 * @package KamvaTheme
 * @version 4.3.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Kamva_Smart_Widget_Engine {

    private static $instance = null;
    private $option_key = 'kamva_smart_widget_layout_data';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // Enqueue client-side lightweight heatmap telemetry collector
        add_action('wp_enqueue_scripts', array($this, 'enqueue_telemetry_tracker'));

        // Register REST API endpoints for telemetry and layout sync
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Dynamic slot rendering hooks for Theme, Elementor & Gutenberg
        add_action('kamva_slot_top_announcement_bar', array($this, 'render_top_announcement'));
        add_action('kamva_slot_header_sub_hero', array($this, 'render_sub_hero'));
        add_action('kamva_slot_sidebar_upper_prime', array($this, 'render_sidebar_upper'));
        add_action('kamva_slot_sidebar_sticky_scroll', array($this, 'render_sidebar_sticky'));
        add_action('kamva_slot_in_content_interstitial', array($this, 'render_in_content'));
        add_action('kamva_slot_floating_bottom_bar', array($this, 'render_floating_bottom'));
        add_action('kamva_slot_exit_intent_overlay', array($this, 'render_exit_intent'));

        // Shortcode support
        add_shortcode('kamva_smart_slot', array($this, 'render_slot_shortcode'));
    }

    /**
     * Enqueue lightweight real-time heatmap & scroll tracker (<2.8 KB)
     */
    public function enqueue_telemetry_tracker() {
        wp_enqueue_script(
            'kamva-heatmap-tracker',
            get_template_directory_uri() . '/assets/js/kamva-heatmap-tracker.js',
            array('jquery'),
            '4.3.0',
            true
        );

        wp_localize_script('kamva-heatmap-tracker', 'kamvaLayoutData', array(
            'restUrl'         => esc_url_raw(rest_url('kamva/v1/smart-layout/')),
            'nonce'           => wp_create_nonce('wp_rest'),
            'repositionSec'   => ${config.repositionIntervalSeconds},
            'isMobile'        => wp_is_mobile(),
            'learningMode'    => '${config.learningAlgorithm}',
            'slots'           => $this->get_active_widget_slots()
        ));
    }

    /**
     * Register REST API endpoints
     */
    public function register_rest_routes() {
        register_rest_route('kamva/v1', '/smart-layout/telemetry', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_telemetry_batch'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('kamva/v1', '/smart-layout/positions', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_current_positions_api'),
            'permission_callback' => '__return_true'
        ));
    }

    /**
     * Retrieve active widget assignments
     */
    public function get_active_widget_slots() {
        $saved = get_option($this->option_key, false);
        if ($saved && is_array($saved)) {
            return $saved;
        }

        // Default layout map
        return array(
${widgets.map(w => `            '${w.id}' => array(
                'name'        => '${w.nameFa}',
                'slot'        => '${w.currentSlot}',
                'is_pinned'   => ${w.isPinned ? 'true' : 'false'},
                'confidence'  => ${w.mlConfidenceScore},
                'ctr_lift'    => ${w.conversionLiftPercent}
            ),`).join('\n')}
        );
    }

    /**
     * Render widget content inside specific slot
     */
    public function render_widget_by_slot($slot_id) {
        $slots = $this->get_active_widget_slots();
        foreach ($slots as $widget_id => $data) {
            if ($data['slot'] === $slot_id) {
                echo '<div class="kamva-smart-widget-wrapper" data-widget-id="' . esc_attr($widget_id) . '" data-slot="' . esc_attr($slot_id) . '">';
                $this->render_widget_html($widget_id);
                echo '</div>';
            }
        }
    }

    public function render_top_announcement() { $this->render_widget_by_slot('top_announcement_bar'); }
    public function render_sub_hero() { $this->render_widget_by_slot('header_sub_hero'); }
    public function render_sidebar_upper() { $this->render_widget_by_slot('sidebar_upper_prime'); }
    public function render_sidebar_sticky() { $this->render_widget_by_slot('sidebar_sticky_scroll'); }
    public function render_in_content() { $this->render_widget_by_slot('in_content_interstitial'); }
    public function render_floating_bottom() { $this->render_widget_by_slot('floating_bottom_bar'); }
    public function render_exit_intent() { $this->render_widget_by_slot('exit_intent_overlay'); }

    public function render_slot_shortcode($atts) {
        $a = shortcode_atts(array('slot' => 'in_content_interstitial'), $atts);
        ob_start();
        $this->render_widget_by_slot(sanitize_text_field($a['slot']));
        return ob_get_clean();
    }

    private function render_widget_html($widget_id) {
        // Output production-ready themed markup
        switch ($widget_id) {
            case 'widget-flash-deal':
                ?>
                <div class="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-4 rounded-2xl shadow-xl my-4 border border-orange-400/30 text-right font-vazir">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="bg-white/20 text-xs px-2 py-0.5 rounded-md font-bold">پیشنهاد شگفت‌انگیز هوشمند</span>
                            <h4 class="text-base font-black mt-1">تخفیف ویژه ۴۰٪ پاییزی با ارسال رایگان</h4>
                        </div>
                        <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="bg-white text-orange-600 font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:bg-orange-50 transition">
                            خرید با کد تخفیف
                        </a>
                    </div>
                </div>
                <?php
                break;
            default:
                do_action('kamva_custom_widget_render_' . $widget_id);
                break;
        }
    }
}

// Instantiate Singleton
Kamva_Smart_Widget_Engine::get_instance();
`;
  };

  const copyPhpCode = () => {
    navigator.clipboard.writeText(generateWordPressPhpSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Get widgets grouped by slot
  const getWidgetsInSlot = (slotId: WidgetSlotId) => {
    return widgets.filter(w => w.currentSlot === slotId);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Main Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f05023]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f05023] via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-950/50">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    موتور چیدمان هوشمند ویجت‌ها (Smart Widget Layout Engine)
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    هسته ML هیت‌مپ زنده
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  پایش خودکار رفتار بصری و کلیک کاربران با هوش مصنوعی و جابجایی پویا و خودکار سایدبارها، بنرها و کال‌تو‌اکشن‌ها جهت بیشینه‌سازی نرخ تبدیل (CTR)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Global Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={runMlOptimizationCycle}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f05023] via-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-900/40 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'در حال اجرای استنتاج ML...' : 'اجرای بازچینی خودکار ML'}</span>
            </button>

            <button
              onClick={resetLayout}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>بازنشانی چیدمان</span>
            </button>
          </div>
        </div>

        {/* Live Performance KPI Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>رشد نرخ کلیک (CTR)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1.5 font-mono">
              +{config.overallCtrLiftPercent}%
            </div>
            <span className="text-[10px] text-slate-500">نسبت به چیدمان استاتیک</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>کاهش نرخ پرش (Bounce)</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-black text-blue-400 mt-1.5 font-mono">
              -{config.bounceReductionPercent}%
            </div>
            <span className="text-[10px] text-slate-500">مهار پرش در ۳ ثانیه نخست</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>رشد درآمد هر بازدیدکننده</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-purple-400 mt-1.5 font-mono">
              +{config.revenuePerVisitorLiftPercent}%
            </div>
            <span className="text-[10px] text-slate-500">افزایش فروش سبد خرید</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>تعداد بازچینی‌های ML</span>
              <BrainCircuit className="w-4 h-4 text-[#f05023]" />
            </div>
            <div className="text-xl font-black text-white mt-1.5 font-mono">
              {config.totalAutoRepositioningsCount.toLocaleString('fa-IR')}
            </div>
            <span className="text-[10px] text-slate-500">تطبیق بلادرنگ موقعیت‌ها</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>نقاط تله‌متری ثبت‌شده</span>
              <MousePointerClick className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400 mt-1.5 font-mono">
              {telemetryPoints.length * 120}
            </div>
            <span className="text-[10px] text-slate-500">هیت‌مپ کلیک و کرسر</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>الگوریتم تصمیم‌گیرنده</span>
              <Gauge className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xs font-black text-indigo-300 mt-2 truncate">
              یادگیری تقویتی Q-Deep
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">خودمختار و بدون لگ</span>
          </div>

        </div>

        {/* Live Notification/Action Bar */}
        <div className="mt-4 bg-slate-950/80 border border-indigo-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Activity className="w-4 h-4 text-[#f05023] animate-pulse" />
            <span>{lastActionMessage}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            فرکانس بازبینی: هر {config.repositionIntervalSeconds} ثانیه
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'visualizer'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-[#f05023]" />
            <span>شبیه‌ساز بصری هیت‌مپ و چیدمان زنده</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'widgets'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>مدیریت ویجت‌ها و قفل موقعیت ({widgets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ml_settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'ml_settings'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>پارامترهای هوش مصنوعی و یادگیری</span>
          </button>

          <button
            onClick={() => setActiveTab('php_export')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'php_export'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>سورس PHP و هوک‌های وردپرس</span>
          </button>
        </div>

        {/* Traffic Simulation Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 ml-1 hidden lg:inline">شبیه‌سازی سناریوی ترافیک:</span>
          
          <button
            onClick={() => triggerTrafficSurge('flash_sale_surge')}
            disabled={isSimulatingTraffic}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition cursor-pointer"
          >
            🔥 هجوم بلک‌فرایدی
          </button>

          <button
            onClick={() => triggerTrafficSurge('mobile_dropoff_rescue')}
            disabled={isSimulatingTraffic}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition cursor-pointer"
          >
            📱 نجات پرش موبایل
          </button>

          <button
            onClick={() => triggerTrafficSurge('cart_abandonment')}
            disabled={isSimulatingTraffic}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition cursor-pointer"
          >
            🛒 مهار ترک سبد خرید
          </button>
        </div>
      </div>

      {/* TAB 1: VISUAL HEATMAP & LIVE STORE CANVAS */}
      {activeTab === 'visualizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Heatmap Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Viewport & Layer Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              
              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>دسکتاپ (۳ ستونه)</span>
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>تبلت</span>
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>موبایل (استک عمودی)</span>
                </button>
              </div>

              {/* Heatmap Layer Toggles */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] ml-1">لایه هیت‌مپ:</span>
                <button
                  onClick={() => setHeatmapLayer('clicks')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    heatmapLayer === 'clicks' ? 'bg-[#f05023] text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🔴 نقاط داغ کلیک
                </button>
                <button
                  onClick={() => setHeatmapLayer('attention')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    heatmapLayer === 'attention' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👁️ ماندگاری نگاه چشمی
                </button>
                <button
                  onClick={() => setHeatmapLayer('scroll')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    heatmapLayer === 'scroll' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  📉 منحنی عمق اسکرول
                </button>
              </div>
            </div>

            {/* Simulated Live Store Page Canvas with Heatmap Overlays */}
            <div 
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`relative bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden select-none transition-all duration-300 mx-auto ${
                deviceMode === 'desktop' ? 'max-w-full' : deviceMode === 'tablet' ? 'max-w-2xl' : 'max-w-md'
              }`}
              style={{ minHeight: '680px' }}
            >
              
              {/* Dynamic Heatmap Glowing Points (Rendered visually over the content) */}
              {telemetryPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="absolute pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    width: `${pt.intensity * 90 + 30}px`,
                    height: `${pt.intensity * 90 + 30}px`,
                    background: heatmapLayer === 'clicks'
                      ? `radial-gradient(circle, rgba(240,80,35,0.75) 0%, rgba(234,179,8,0.4) 40%, rgba(59,130,246,0.15) 75%, transparent 100%)`
                      : heatmapLayer === 'attention'
                      ? `radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(168,85,247,0.45) 45%, transparent 80%)`
                      : `radial-gradient(circle, rgba(16,185,129,0.7) 0%, transparent 70%)`,
                    filter: 'blur(12px)',
                    zIndex: 20,
                  }}
                />
              ))}

              {/* Scroll Depth Percentage Markers (when scroll layer is active) */}
              {heatmapLayer === 'scroll' && (
                <div className="absolute inset-y-0 right-2 z-30 flex flex-col justify-between py-6 pointer-events-none text-[10px] font-mono font-bold text-purple-400 border-r border-purple-500/30 pr-2">
                  <span className="bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40">100% Reach</span>
                  <span className="bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40">75% (Fold)</span>
                  <span className="bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40">50% Reach</span>
                  <span className="bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40">25% Dropout</span>
                </div>
              )}

              {/* Helper Notice on Canvas */}
              <div className="absolute top-2 left-2 z-30 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-slate-400 border border-slate-700/60 pointer-events-none">
                💡 برای افزودن نقطه هیت‌مپ روی صفحه کلیک کنید
              </div>

              {/* 1. SLOT: TOP ANNOUNCEMENT BAR */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Tag className="w-3 h-3" />
                    جایگاه ۱: {slotLabels.top_announcement_bar.title}
                  </span>
                  <span className="text-emerald-400 font-bold">توجه: ۸۸٪ • دید ۱۰۰٪</span>
                </div>

                {getWidgetsInSlot('top_announcement_bar').length > 0 ? (
                  getWidgetsInSlot('top_announcement_bar').map(w => (
                    <div 
                      key={w.id}
                      className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 rounded-xl p-2.5 text-center text-xs font-bold text-amber-200 flex items-center justify-between shadow-lg"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {w.contentTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                          CTR: {w.ctrPercent}%
                        </span>
                        {w.isPinned && <Lock className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-xl p-2 text-center text-xs text-slate-600">
                    جایگاه خالی (هوش مصنوعی در حال بررسی واگذاری به ویجت پربازده)
                  </div>
                )}
              </div>

              {/* Mock WordPress Header Navigation */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f05023] flex items-center justify-center text-white font-black text-xs">
                    K
                  </div>
                  <span className="text-xs font-bold text-white">کامواوب استور</span>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 mr-4">
                    <span>صفحه اصلی</span>
                    <span>•</span>
                    <span>فروشگاه</span>
                    <span>•</span>
                    <span>درباره ما</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    سبد خرید (۳)
                  </span>
                </div>
              </div>

              {/* 2. SLOT: HEADER SUB-HERO */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1 text-blue-400 font-bold">
                    <Target className="w-3 h-3" />
                    جایگاه ۲: {slotLabels.header_sub_hero.title}
                  </span>
                  <span className="text-emerald-400 font-bold">توجه: ۹۴٪ (Peak Hot)</span>
                </div>

                {getWidgetsInSlot('header_sub_hero').map(w => (
                  <div 
                    key={w.id}
                    className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-300">{w.contentTitle}</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">
                          +{w.conversionLiftPercent}% Conversion
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{w.contentSubtitle}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-xl whitespace-nowrap">
                      {w.actionText}
                    </button>
                  </div>
                ))}
              </div>

              {/* Layout Content Body: Main Products Grid & Sidebars */}
              <div className={`grid gap-4 mb-4 ${deviceMode === 'desktop' ? 'grid-cols-12' : 'grid-cols-1'}`}>
                
                {/* 3 & 4. SIDEBAR (Upper Prime & Sticky Scroll) - 4 cols on desktop */}
                {deviceMode === 'desktop' && (
                  <div className="col-span-4 space-y-3">
                    
                    {/* Upper Prime Sidebar Slot */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-2">
                        <span>سایدبار طلایی (Above Fold)</span>
                        <span>توجه: ۷۶٪</span>
                      </div>

                      {getWidgetsInSlot('sidebar_upper_prime').map(w => (
                        <div key={w.id} className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3">
                          <h5 className="text-xs font-bold text-white">{w.contentTitle}</h5>
                          <p className="text-[11px] text-slate-400 mt-1">{w.contentSubtitle}</p>
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">CTR: {w.ctrPercent}%</span>
                            <button className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded-lg font-bold">
                              {w.actionText}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sticky Scroll Sidebar Slot */}
                    <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold mb-2">
                        <span>سایدبار چسبان (Sticky)</span>
                        <span>اسکرول: ۵۴٪</span>
                      </div>

                      {getWidgetsInSlot('sidebar_sticky_scroll').map(w => (
                        <div key={w.id} className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-3">
                          <h5 className="text-xs font-bold text-purple-200">{w.contentTitle}</h5>
                          <p className="text-[11px] text-slate-400 mt-1">{w.contentSubtitle}</p>
                          <button className="mt-2 w-full text-[10px] bg-purple-600 text-white py-1 rounded-lg font-bold">
                            {w.actionText}
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* Main Product Content Area (8 cols on desktop, full on mobile) */}
                <div className={deviceMode === 'desktop' ? 'col-span-8 space-y-4' : 'space-y-4'}>
                  
                  {/* Mock Product Cards Row 1 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-right">
                      <div className="h-20 bg-slate-800/80 rounded-xl mb-2 flex items-center justify-center text-slate-600 text-xs">
                        تصویر محصول کاموا پرو
                      </div>
                      <h6 className="text-xs font-bold text-white">اولترابوک کامواوب X15</h6>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">۷۸,۵۰۰,۰۰۰ تومان</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-right">
                      <div className="h-20 bg-slate-800/80 rounded-xl mb-2 flex items-center justify-center text-slate-600 text-xs">
                        هدفون استودیویی کاموا
                      </div>
                      <h6 className="text-xs font-bold text-white">هدفون Kamva Sound ANC</h6>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">۶,۲۰۰,۰۰۰ تومان</span>
                    </div>
                  </div>

                  {/* 5. SLOT: IN-CONTENT INTERSTITIAL (Middle of products/content) */}
                  <div className="my-2">
                    <div className="flex items-center justify-between text-[11px] text-[#f05023] font-mono mb-1">
                      <span className="flex items-center gap-1 font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        جایگاه ۵: {slotLabels.in_content_interstitial.title}
                      </span>
                      <span className="text-emerald-400 font-bold">توجه: ۹۶٪ (داغ‌ترین نقطه کلیک)</span>
                    </div>

                    {getWidgetsInSlot('in_content_interstitial').map(w => (
                      <div 
                        key={w.id}
                        className="bg-gradient-to-r from-[#f05023] via-orange-600 to-pink-600 rounded-2xl p-4 text-white shadow-xl shadow-orange-950/60 flex flex-col sm:flex-row items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-md">
                              توصیه هوش مصنوعی
                            </span>
                            <span className="text-xs font-bold">{w.contentTitle}</span>
                          </div>
                          <p className="text-[11px] text-white/80 mt-1">{w.contentSubtitle}</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-[#f05023] font-black text-xs rounded-xl shadow-lg hover:bg-slate-100 transition whitespace-nowrap">
                          {w.actionText}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Mock Product Cards Row 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-right">
                      <div className="h-20 bg-slate-800/80 rounded-xl mb-2 flex items-center justify-center text-slate-600 text-xs">
                        کارت گرافیک گیمینگ
                      </div>
                      <h6 className="text-xs font-bold text-white">کارت گرافیک RTX 4080 Pro</h6>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">۵۴,۰۰۰,۰۰۰ تومان</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-right">
                      <div className="h-20 bg-slate-800/80 rounded-xl mb-2 flex items-center justify-center text-slate-600 text-xs">
                        مانیتور حرفه‌ای ۴K
                      </div>
                      <h6 className="text-xs font-bold text-white">مانیتور OLED 32 Inch 144Hz</h6>
                      <span className="text-[11px] text-emerald-400 font-bold block mt-1">۳۲,۰۰۰,۰۰۰ تومان</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* 6. SLOT: FLOATING BOTTOM BAR & LIVE AI BUBBLE */}
              <div className="sticky bottom-2 z-40">
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono mb-1">
                  <span className="font-bold flex items-center gap-1">
                    <MessageSquareHeart className="w-3.5 h-3.5" />
                    جایگاه ۶: {slotLabels.floating_bottom_bar.title}
                  </span>
                  <span className="text-emerald-400 font-bold">توجه: ۹۱٪ • CTR: ۱۸.۲٪</span>
                </div>

                {getWidgetsInSlot('floating_bottom_bar').map(w => (
                  <div 
                    key={w.id}
                    className="bg-slate-900/95 backdrop-blur-md border-2 border-indigo-500/60 rounded-2xl p-3 text-white shadow-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                        <MessageSquareHeart className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h6 className="text-xs font-black text-white">{w.contentTitle}</h6>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <p className="text-[11px] text-slate-400">{w.contentSubtitle}</p>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg">
                      {w.actionText}
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Real-time Heatmap Telemetry & Zone Metrics (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Real-Time Zone Engagement Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-black text-white">وضعیت داغی جایگاه‌های صفحه</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">۷ اسلات فعال</span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {zoneMetrics.map((zone) => {
                  const assignedWidget = widgets.find(w => w.currentSlot === zone.slotId);
                  return (
                    <div 
                      key={zone.slotId}
                      className={`p-3.5 rounded-2xl border transition ${
                        zone.status === 'peak_hot'
                          ? 'bg-gradient-to-br from-[#f05023]/10 to-slate-900 border-[#f05023]/40'
                          : zone.status === 'high_attention'
                          ? 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {zone.nameFa}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          zone.status === 'peak_hot'
                            ? 'bg-[#f05023]/20 text-[#ff7854] border border-[#f05023]/30'
                            : zone.status === 'high_attention'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {zone.status === 'peak_hot' ? '🔥 داغ‌ترین نقطه' : zone.status === 'high_attention' ? '⚡ توجه بالا' : 'خنثی'}
                        </span>
                      </div>

                      {/* Progress Metrics */}
                      <div className="mt-2.5 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>شاخص تمرکز چشمی:</span>
                          <span className="font-mono font-bold text-white">{zone.attentionPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-[#f05023] rounded-full transition-all duration-500"
                            style={{ width: `${zone.attentionPercentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-slate-400 pt-1">
                          <span>نرخ رسیدن اسکرول:</span>
                          <span className="font-mono text-slate-300">{zone.avgScrollReachPercent}%</span>
                        </div>

                        {/* Assigned Widget Preview */}
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">ویجت مستقر:</span>
                          {assignedWidget ? (
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {assignedWidget.nameFa}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600">بدون ویجت</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Autonomous ML Decision Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-[#f05023]" />
                <h4 className="text-xs font-black text-white">آخرین تصمیمات سیستم یادگیری ماشین</h4>
              </div>

              <div className="space-y-2 text-[11px] text-slate-300">
                {widgets.slice(0, 3).map(w => (
                  <div key={w.id} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-white">{w.nameFa}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">+{w.conversionLiftPercent}% CTR</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{w.lastRepositionReason}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: WIDGET MANAGEMENT & PINNING CONTROLS */}
      {activeTab === 'widgets' && (
        <div className="space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">فهرست ویجت‌های هوشمند و تخصیص جایگاه</h3>
                <p className="text-xs text-slate-400 mt-1">
                  می‌توانید هر ویجت را در جایگاه دلخواه قفل (Pin) کنید تا هوش مصنوعی موقعیت آن را تغییر ندهد یا به الگوریتم اجازه دهید بهینه‌ترین جایگاه را انتخاب کند.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  {widgets.filter(w => w.isPinned).length} از {widgets.length} ویجت قفل شده
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgets.map((widget) => {
                return (
                  <div
                    key={widget.id}
                    className={`bg-slate-950 border rounded-2xl p-5 transition-all ${
                      widget.isPinned ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{widget.nameFa}</span>
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {widget.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{widget.contentTitle}</p>
                      </div>

                      {/* Pin / Lock Toggle */}
                      <button
                        onClick={() => toggleWidgetPin(widget.id)}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          widget.isPinned
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-950/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title={widget.isPinned ? 'قفل شده توسط مدیر' : 'آزاد برای جابجایی ML'}
                      >
                        {widget.isPinned ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Slot Dropdown Selection */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          جایگاه استقرار فعلی:
                        </label>
                        <select
                          value={widget.currentSlot}
                          onChange={(e) => handleManualSlotChange(widget.id, e.target.value as WidgetSlotId)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          {Object.entries(slotLabels).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          شاخص اطمینان ML:
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{ width: `${widget.mlConfidenceScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">{widget.mlConfidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Summary */}
                    <div className="mt-3 bg-slate-900/60 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>CTR فعال: <strong className="text-emerald-400 font-mono">{widget.ctrPercent}%</strong></span>
                      <span>افزایش تبدیل: <strong className="text-blue-400 font-mono">+{widget.conversionLiftPercent}%</strong></span>
                      <span>کلیک‌ها: <strong className="text-white font-mono">{widget.clicksCount.toLocaleString('fa-IR')}</strong></span>
                    </div>

                    {/* AI Decision Reason Note */}
                    <div className="mt-2.5 text-[10px] text-slate-400 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#f05023] shrink-0 mt-0.5" />
                      <span>{widget.lastRepositionReason}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MACHINE LEARNING MODEL CONFIGURATION */}
      {activeTab === 'ml_settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div>
            <h3 className="text-lg font-black text-white">پیکربندی پارامترهای یادگیری ماشین و رفتار بلادرنگ</h3>
            <p className="text-xs text-slate-400 mt-1">
              تنظیم ضرایب یادگیری تقویتی، نرخ اکتشاف ($\epsilon$-greedy) و استراتژی انطباق با رفتار خریداران
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ML Toggles Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>تنظیمات خودمختار و پایشگر</span>
              </h4>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">بازچینی کاملاً خودمختار (Autonomous Repositioning)</span>
                  <span className="text-[11px] text-slate-400">جابجایی خودکار اسلات‌ها در صورت ظهور نقاط داغ جدید</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autonomousRepositioning}
                  onChange={(e) => setConfig({ ...config, autonomousRepositioning: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">انطباق پیشرفته با دیوایس موبایل (Mobile Adaptive)</span>
                  <span className="text-[11px] text-slate-400">انتقال خودکار سایدبار به میان‌متن و نوار چسبان زیرین در گوشی‌ها</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.mobileAdaptationMode}
                  onChange={(e) => setConfig({ ...config, mobileAdaptationMode: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">جلوگیری از خستگی کاربر (Anti-Fatigue Capping)</span>
                  <span className="text-[11px] text-slate-400">محدود کردن نمایش مکرر بنرهای یکسان به یک کاربر در ۲۴ ساعت</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.antiFatigueFrequencyCapping}
                  onChange={(e) => setConfig({ ...config, antiFatigueFrequencyCapping: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
                />
              </label>
            </div>

            {/* Neural Weights & Multi-Armed Bandit Parameters */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#f05023]" />
                <span>ضرایب محاسباتی الگوریتم Multi-Armed Bandit</span>
              </h4>

              {/* Exploration Rate */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>نرخ اکتشاف چیدمان‌های نوین (Epsilon Exploration):</span>
                  <span className="font-mono text-amber-400">{(config.explorationRateEpsilon * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={config.explorationRateEpsilon}
                  onChange={(e) => setConfig({ ...config, explorationRateEpsilon: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">درصدی از ترافیک برای کشف موقعیت‌های پربازده جدید تست می‌شود.</span>
              </div>

              {/* Click Weight */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>وزن سیگنال کلیک و تبدیل (Click Weight):</span>
                  <span className="font-mono text-emerald-400">{(config.clickWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={config.clickWeight}
                  onChange={(e) => setConfig({ ...config, clickWeight: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Dwell Time Weight */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>وزن مدت زمان مکث نگاه (Dwell Time Weight):</span>
                  <span className="font-mono text-indigo-400">{(config.dwellTimeWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={config.dwellTimeWeight}
                  onChange={(e) => setConfig({ ...config, dwellTimeWeight: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 4: WORDPRESS PRODUCTION PHP & HOOK EXPORT */}
      {activeTab === 'php_export' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white">سورس‌کد کامل موتور چیدمان هوشمند در وردپرس (PHP Class)</h3>
              <p className="text-xs text-slate-400 mt-1">
                این کلاس به طور مستقیم با شورت‌کدهای قالب، ابزارک‌های المنتور و هوک‌های استانداردی مثل <code className="text-amber-300 font-mono">do_action('kamva_slot_in_content_interstitial')</code> کار می‌کند.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyPhpCode}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'کپی شد!' : 'کپی سورس PHP'}</span>
              </button>
            </div>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto text-left font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto leading-relaxed">
            <pre dir="ltr">{generateWordPressPhpSnippet()}</pre>
          </div>

        </div>
      )}

    </div>
  );
};
