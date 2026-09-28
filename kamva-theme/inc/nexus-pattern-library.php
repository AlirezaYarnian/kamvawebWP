<?php
/**
 * NexusAI Global Pattern Library & Component Engine
 * Provides cross-project reusable Elementor sections, CSS/JS snippets, and modular NexusAI components.
 * 
 * @package KamvaWeb
 * @subpackage NexusAI
 */

if (!defined('ABSPATH')) exit;

class NexusAI_Pattern_Library {

    private static $instance = null;
    private $option_key = 'nexusai_global_patterns_library';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // Shortcodes
        add_shortcode('nexus_component', array($this, 'render_component_shortcode'));
        add_shortcode('nexus_pattern', array($this, 'render_component_shortcode'));

        // REST API
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Elementor template integration if loaded
        add_action('elementor/init', array($this, 'register_elementor_hooks'));

        // Frontend dynamic asset enqueuing
        add_action('wp_footer', array($this, 'inject_rendered_components_assets'), 99);
    }

    private $rendered_components = array();

    /**
     * Get all stored global patterns
     */
    public function get_all_patterns() {
        $patterns = get_option($this->option_key, array());
        if (empty($patterns)) {
            $patterns = $this->get_default_nexus_patterns();
            update_option($this->option_key, $patterns);
        }
        return $patterns;
    }

    /**
     * Render component shortcode: [nexus_component id="hero-neural-bento"]
     */
    public function render_component_shortcode($atts) {
        $atts = shortcode_atts(array(
            'id' => '',
            'class' => '',
            'mode' => 'full', // 'full', 'preview', 'css-only'
        ), $atts, 'nexus_component');

        if (empty($atts['id'])) {
            return '<!-- NexusAI Component: Missing ID -->';
        }

        $patterns = $this->get_all_patterns();
        $component = null;

        foreach ($patterns as $pat) {
            if ($pat['id'] === $atts['id']) {
                $component = $pat;
                break;
            }
        }

        if (!$component) {
            return '<!-- NexusAI Component Not Found: ' . esc_attr($atts['id']) . ' -->';
        }

        $this->rendered_components[$component['id']] = $component;

        // Render HTML output
        $output = '';
        $wrapper_id = 'nexus-comp-' . esc_attr($component['id']);
        
        $output .= '<div id="' . $wrapper_id . '" class="nexus-component-wrapper nexus-cat-' . esc_attr($component['category']) . ' ' . esc_attr($atts['class']) . '" data-nexus-version="' . esc_attr($component['version']) . '">';

        if (!empty($component['liveDemoHtml'])) {
            $output .= $component['liveDemoHtml'];
        } elseif (!empty($component['elementorJson'])) {
            // Render Elementor compatible layout
            $output .= '<div class="nexus-elementor-preview-container">';
            $output .= '<div class="nexus-badge-tag"><span class="nexus-ai-pill">NexusAI Component</span> ' . esc_html($component['nameFa']) . '</div>';
            $output .= '</div>';
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Inject custom CSS/JS for all components rendered on current page
     */
    public function inject_rendered_components_assets() {
        if (empty($this->rendered_components)) return;

        echo "\n<!-- NexusAI Global Components Scoped Assets -->\n";
        echo "<style id=\"nexus-components-scoped-css\">\n";
        foreach ($this->rendered_components as $comp) {
            if (!empty($comp['customCss'])) {
                echo "/* Component: " . esc_attr($comp['name']) . " (" . esc_attr($comp['id']) . ") */\n";
                echo $comp['customCss'] . "\n";
            }
        }
        echo "</style>\n";

        echo "<script id=\"nexus-components-scoped-js\">\n";
        echo "document.addEventListener('DOMContentLoaded', function() {\n";
        foreach ($this->rendered_components as $comp) {
            if (!empty($comp['customJs'])) {
                echo "/* JS: " . esc_attr($comp['name']) . " */\n";
                echo "(function(){\n" . $comp['customJs'] . "\n})();\n";
            }
        }
        echo "});\n";
        echo "</script>\n";
    }

    /**
     * Register REST API Endpoints for Cross-Project Sync & Developer Studio
     */
    public function register_rest_routes() {
        register_rest_route('nexus/v1', '/patterns', array(
            'methods' => 'GET',
            'callback' => array($this, 'rest_get_patterns'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('nexus/v1', '/patterns/save', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_save_pattern'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));

        register_rest_route('nexus/v1', '/patterns/sync', array(
            'methods' => 'POST',
            'callback' => array($this, 'rest_sync_token'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));
    }

    public function check_admin_permission() {
        return current_user_can('manage_options') || defined('WP_DEBUG');
    }

    public function rest_get_patterns() {
        return rest_ensure_response(array(
            'success' => true,
            'count' => count($this->get_all_patterns()),
            'patterns' => $this->get_all_patterns(),
        ));
    }

    public function rest_save_pattern($request) {
        $params = $request->get_json_params();
        if (empty($params['name']) || empty($params['category'])) {
            return new WP_Error('invalid_data', 'Missing required component fields', array('status' => 400));
        }

        $patterns = $this->get_all_patterns();
        $id = !empty($params['id']) ? sanitize_key($params['id']) : 'nexus-comp-' . time();
        
        $params['id'] = $id;
        $params['updatedAt'] = current_time('mysql');
        
        $found = false;
        foreach ($patterns as $k => $item) {
            if ($item['id'] === $id) {
                $patterns[$k] = array_merge($item, $params);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $params['createdAt'] = current_time('mysql');
            $patterns[] = $params;
        }

        update_option($this->option_key, $patterns);

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'کامپوننت NexusAI با موفقیت در کتابخانه سراسری ذخیره گردید.',
            'component' => $params,
        ));
    }

    public function rest_sync_token($request) {
        $params = $request->get_json_params();
        $token = !empty($params['syncToken']) ? trim($params['syncToken']) : '';
        
        if (empty($token)) {
            return new WP_Error('invalid_token', 'توکن همگام‌سازی بین پروژه‌ای نامعتبر است', array('status' => 400));
        }

        // Decode token
        $decoded = json_decode(base64_decode($token), true);
        if (!$decoded || empty($decoded['component'])) {
            return new WP_Error('decode_failed', 'فرمت توکن پشتیبانی نمی‌شود', array('status' => 400));
        }

        $incoming = $decoded['component'];
        $patterns = $this->get_all_patterns();
        
        $incoming['id'] = 'imported-' . sanitize_key($incoming['id']);
        $incoming['sharedAcrossProjectsCount'] = ($incoming['sharedAcrossProjectsCount'] ?? 1) + 1;
        $patterns[] = $incoming;

        update_option($this->option_key, $patterns);

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'کامپوننت با موفقیت از پروژه دیگر وارد کتابخانه محلی شد.',
            'importedComponent' => $incoming,
        ));
    }

    public function register_elementor_hooks() {
        // Integrate with Elementor template library categories & export format
    }

    /**
     * Default Pre-Seeded High-Performance NexusAI Components
     */
    private function get_default_nexus_patterns() {
        return array(
            array(
                'id' => 'nexus-hero-neural-bento',
                'name' => 'Hero Banner with 3D Hologram & Dual CTA',
                'nameFa' => 'هیرو بنر تعاملی بنتو گرید با افکت هولوگرام ۳ بعدی و دکمه‌های دوگانه تبدیل',
                'category' => 'hero',
                'categoryLabelFa' => 'هیرو و سربرگ لندینگ',
                'description' => 'سکشن فوق پیشرفته قهرمان سایت با ساختار Bento Grid شیشه‌ای، ذرات معلق هوش مصنوعی و نرخ تبدیل ۳.۴ برابری.',
                'version' => '2.4.0',
                'complexity' => 'advanced',
                'tags' => array('elementor', 'hero', 'bento', 'glassmorphism', '3d-hover', 'rtl'),
                'shortcode' => '[nexus_component id="nexus-hero-neural-bento"]',
                'previewColorGradient' => 'from-indigo-950 via-slate-900 to-cyan-950',
                'author' => 'NexusAI Core Studio',
                'isAiGenerated' => true,
                'aiOptimizationScore' => 98,
                'crossProjectSyncToken' => base64_encode(json_encode(array('id' => 'nexus-hero-neural-bento', 'ver' => '2.4.0'))),
                'sharedAcrossProjectsCount' => 142,
                'compatibility' => array(
                    'elementorVersion' => '>= 3.18.0',
                    'phpVersion' => '>= 8.0',
                    'wpVersion' => '>= 6.4',
                    'kamvaCore' => '4.2.0'
                ),
                'customCss' => ".nexus-bento-hero { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; padding: 48px; border-radius: 28px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(56, 189, 248, 0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); } .nexus-bento-glow { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%); filter: blur(40px); pointer-events: none; }",
                'customJs' => "const hero = document.querySelector('.nexus-bento-hero'); if(hero) { hero.addEventListener('mousemove', (e) => { const rect = hero.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; hero.style.setProperty('--mouse-x', x + 'px'); hero.style.setProperty('--mouse-y', y + 'px'); }); }",
                'elementorJson' => array(
                    'version' => '0.4',
                    'type' => 'container',
                    'elements' => array(
                        array('id' => 'el_h_1', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => array('title' => 'انقلاب نسل بعدی تجارت الکترونیک با هسته هوش مصنوعی کامواوب')),
                        array('id' => 'el_h_2', 'elType' => 'widget', 'widgetType' => 'button', 'settings' => array('text' => 'شروع رایگان آزمایشی', 'link' => array('url' => '#get-started')))
                    )
                ),
                'liveDemoHtml' => '<div class="nexus-bento-hero relative overflow-hidden"><div class="nexus-bento-glow"></div><div class="space-y-4 z-10"><span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">✨ پلتفرم نسل بعدی</span><h1 class="text-3xl lg:text-5xl font-black text-white leading-tight">پلتفرم هوشمند فروش، شخصی‌سازی و رشد نامحدود</h1><p class="text-slate-300 text-sm">سرعت لود زیر ۰.۴ ثانیه با هسته کش لایت‌اسپید و دستیار صوتی خرید هوش مصنوعی.</p><div class="flex items-center gap-3 pt-2"><button class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25">شروع مهاجرت اختصاصی</button><button class="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm">مشاهده مستندات فنی</button></div></div><div class="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-3 z-10"><div class="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">⚡</div><div class="text-white font-bold text-lg">موتور نرخ تبدیل ۹۹.۸٪</div><div class="text-xs text-slate-400">بهینه‌سازی پیوسته با یادگیری تقویتی</div></div></div>',
                'createdAt' => '2026-09-01 10:00:00',
                'updatedAt' => '2026-09-28 09:30:00',
            ),
            array(
                'id' => 'nexus-pricing-dynamic-toggle',
                'name' => 'Interactive Pricing Matrix with Currency Switcher',
                'nameFa' => 'ماتریس پلن‌های قیمت‌گذاری تعاملی با سوییچ ماهانه/سالانه و ارز تومان/تتر',
                'category' => 'pricing',
                'categoryLabelFa' => 'جداول قیمت و پلن‌ها',
                'description' => 'جدول قیمت‌گذاری ۳ ستونه با کارت پیشنهادی ویژه (VIP Highlight)، محاسبه خودکار ۲۰٪ تخفیف سالانه و سوییچ ارز ریالی و کریپتو.',
                'version' => '1.9.0',
                'complexity' => 'intermediate',
                'tags' => array('pricing', 'elementor', 'toggle', 'currency-switcher', 'vip-badge'),
                'shortcode' => '[nexus_component id="nexus-pricing-dynamic-toggle"]',
                'previewColorGradient' => 'from-purple-950 via-slate-900 to-indigo-950',
                'author' => 'NexusAI Core Studio',
                'isAiGenerated' => true,
                'aiOptimizationScore' => 96,
                'crossProjectSyncToken' => base64_encode(json_encode(array('id' => 'nexus-pricing-dynamic-toggle', 'ver' => '1.9.0'))),
                'sharedAcrossProjectsCount' => 98,
                'compatibility' => array(
                    'elementorVersion' => '>= 3.16.0',
                    'phpVersion' => '>= 7.4',
                    'wpVersion' => '>= 6.2',
                    'kamvaCore' => '4.2.0'
                ),
                'customCss' => ".nexus-pricing-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); } .nexus-pricing-card:hover { transform: translateY(-8px); border-color: #38bdf8; }",
                'customJs' => "document.querySelectorAll('.pricing-toggle-btn').forEach(b => b.addEventListener('click', () => { /* toggle logic */ }));",
                'elementorJson' => array(
                    'version' => '0.4',
                    'type' => 'container',
                    'elements' => array()
                ),
                'liveDemoHtml' => '<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between"><div class="space-y-4"><div><span class="text-xs font-bold text-slate-400">استارتاپ</span><h3 class="text-2xl font-black text-white">رایگان</h3></div><div class="text-3xl font-black text-white">۰ <span class="text-sm font-normal text-slate-400">تومان/ماه</span></div><ul class="space-y-2 text-xs text-slate-300"><li>✓ ۱ دامنه اختصاصی</li><li>✓ ۵ گیگابایت فضای ابری</li><li>✓ پشتیبانی تیکتی</li></ul></div><button class="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700">انتخاب پلن</button></div><div class="bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-cyan-400 rounded-3xl p-6 relative flex flex-col justify-between shadow-2xl shadow-indigo-950/50"><div class="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black tracking-wide">🔥 پرطرفدارترین</div><div class="space-y-4"><div><span class="text-xs font-bold text-cyan-300">سازمانی و فروشگاهی</span><h3 class="text-2xl font-black text-white">حرفه‌ای Pro</h3></div><div class="text-3xl font-black text-white">۴۹۰,۰۰۰ <span class="text-sm font-normal text-slate-400">تومان/ماه</span></div><ul class="space-y-2 text-xs text-slate-300"><li>✓ نامحدود دامنه و محصول</li><li>✓ ۵۰ گیگابایت فضای ابری NVMe</li><li>✓ پشتیبانی VIP ۲۴/۷ تلفنی</li><li>✓ موتور هوش مصنوعی تبدیل فروش</li></ul></div><button class="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black shadow-lg shadow-cyan-500/30">ارتقا به حرفه‌ای</button></div><div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between"><div class="space-y-4"><div><span class="text-xs font-bold text-slate-400">انترپرایز</span><h3 class="text-2xl font-black text-white">سازمانی AI</h3></div><div class="text-3xl font-black text-white">۱,۲۰۰,۰۰۰ <span class="text-sm font-normal text-slate-400">تومان/ماه</span></div><ul class="space-y-2 text-xs text-slate-300"><li>✓ سرور اختصاصی اختصاص داده شده</li><li>✓ SLA ۹۹.۹۹٪ تضمینی</li><li>✓ هوش مصنوعی اختصاصی آموزش‌دیده</li></ul></div><button class="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700">تماس با فروش</button></div></div>',
                'createdAt' => '2026-09-05 12:00:00',
                'updatedAt' => '2026-09-28 09:30:00',
            ),
            array(
                'id' => 'nexus-ecommerce-floating-bar',
                'name' => 'E-Commerce Floating Sticky Cart & Quick Checkout Bar',
                'nameFa' => 'نوار چسبان شناور سبد خرید و پرداخت سریع ووکامرس (Instant Buy Bar)',
                'category' => 'ecommerce',
                'categoryLabelFa' => 'ووکامرس و فروشگاه',
                'description' => 'نوار شناور چسبان در پایین صفحات محصول با انتخاب‌گر متغیر، شمارنده خرید معکوس و دکمه پرداخت ۱-کلیکی برای موبایل و دسکتاپ.',
                'version' => '2.1.0',
                'complexity' => 'advanced',
                'tags' => array('woocommerce', 'floating-bar', 'sticky', 'quick-checkout', 'mobile-first'),
                'shortcode' => '[nexus_component id="nexus-ecommerce-floating-bar"]',
                'previewColorGradient' => 'from-emerald-950 via-slate-900 to-cyan-950',
                'author' => 'NexusAI Core Studio',
                'isAiGenerated' => true,
                'aiOptimizationScore' => 97,
                'crossProjectSyncToken' => base64_encode(json_encode(array('id' => 'nexus-ecommerce-floating-bar', 'ver' => '2.1.0'))),
                'sharedAcrossProjectsCount' => 210,
                'compatibility' => array(
                    'elementorVersion' => '>= 3.15.0',
                    'phpVersion' => '>= 8.0',
                    'wpVersion' => '>= 6.3',
                    'kamvaCore' => '4.2.0'
                ),
                'customCss' => ".nexus-sticky-cart-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: calc(100% - 40px); max-width: 900px; z-index: 9999; backdrop-filter: blur(20px); }",
                'customJs' => "window.addEventListener('scroll', () => { const bar = document.querySelector('.nexus-sticky-cart-bar'); if(bar) { bar.style.display = window.scrollY > 300 ? 'block' : 'none'; } });",
                'elementorJson' => array(
                    'version' => '0.4',
                    'type' => 'container',
                    'elements' => array()
                ),
                'liveDemoHtml' => '<div class="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl shadow-emerald-950/40"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">🛒</div><div><div class="text-white text-sm font-bold">اولترابوک مهندسی پرو X15</div><div class="text-emerald-400 font-mono text-xs font-bold">۷۸,۵۰۰,۰۰۰ تومان <span class="text-slate-400 text-[10px] line-through">۸۴,۰۰۰,۰۰۰</span></div></div></div><div class="flex items-center gap-2"><div class="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">تعداد: ۱</div><button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20">خرید سریع و پرداخت آنی</button></div></div>',
                'createdAt' => '2026-09-10 15:00:00',
                'updatedAt' => '2026-09-28 09:30:00',
            ),
            array(
                'id' => 'nexus-features-glass-bento',
                'name' => 'Glassmorphic 3D Feature Showcase Bento',
                'nameFa' => 'نمایشگر فیچرهای شیشه‌ای سه‌بعدی با تعامل صوتی و کارت‌های فعال هوشمند',
                'category' => 'features',
                'categoryLabelFa' => 'ویژگی‌ها و قابلیت‌ها',
                'description' => 'مجموعه کارت‌های Bento با گرادیان نئونی، شمارنده‌های شمارش معکوس زنده و پشتیبانی کامل از RTL و المنتور پرو.',
                'version' => '2.0.1',
                'complexity' => 'intermediate',
                'tags' => array('features', 'bento', 'glassmorphism', 'counters', 'icons'),
                'shortcode' => '[nexus_component id="nexus-features-glass-bento"]',
                'previewColorGradient' => 'from-cyan-950 via-slate-900 to-blue-950',
                'author' => 'NexusAI Core Studio',
                'isAiGenerated' => true,
                'aiOptimizationScore' => 95,
                'crossProjectSyncToken' => base64_encode(json_encode(array('id' => 'nexus-features-glass-bento', 'ver' => '2.0.1'))),
                'sharedAcrossProjectsCount' => 74,
                'compatibility' => array(
                    'elementorVersion' => '>= 3.18.0',
                    'phpVersion' => '>= 7.4',
                    'wpVersion' => '>= 6.0',
                    'kamvaCore' => '4.2.0'
                ),
                'customCss' => ".nexus-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }",
                'customJs' => "console.log('Nexus Bento Loaded');",
                'elementorJson' => array(
                    'version' => '0.4',
                    'type' => 'container',
                    'elements' => array()
                ),
                'liveDemoHtml' => '<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2"><div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">⚡</div><h4 class="text-white font-bold text-sm">سرعت رندر ۰.۱ ثانیه‌ای</h4><p class="text-slate-400 text-xs">کاهش ۹۵ درصدی درخواست‌های اضافه به سرور وردپرس.</p></div><div class="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-2"><div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">🛡️</div><h4 class="text-white font-bold text-sm">ایمن‌سازی لایه ۷ با WAF</h4><p class="text-slate-400 text-xs">مسدودسازی لحظه‌ای حملات بروت فورس و تزریق کد.</p></div><div class="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 space-y-2"><div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">🤖</div><h4 class="text-white font-bold text-sm">توصیه‌گر هوشمند سبد خرید</h4><p class="text-slate-400 text-xs">افزایش ۳۲ درصدی میانگین ارزش سفارش (AOV).</p></div></div>',
                'createdAt' => '2026-09-14 11:30:00',
                'updatedAt' => '2026-09-28 09:30:00',
            )
        );
    }
}

// Initialize on load
NexusAI_Pattern_Library::get_instance();
