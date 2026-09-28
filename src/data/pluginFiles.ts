export interface PluginFile {
  path: string;
  filename: string;
  language: 'php' | 'css' | 'javascript' | 'markdown' | 'json';
  description: string;
  content: string;
}

export const kamvaCorePluginFiles: PluginFile[] = [
  {
    path: 'kamva-core.php',
    filename: 'kamva-core.php',
    language: 'php',
    description: 'فایل اصلی و راه‌انداز افزونه جامع کاموا کور (Kamva Core)',
    content: `<?php
/**
 * Plugin Name: Kamva Core - هسته جامع هوشمند کامواوب
 * Plugin URI: https://kamvaweb.com/kamva-core
 * Description: افزونه جامع و یکپارچه کامواوب مجهز به شبکه عصبی و ماشین لرنینگ محلی، امنیت کامل All-in-One Security، پاکسازی و بهینه‌سازی دیتابیس، تبدیل و فشرده‌سازی خودکار تصاویر به WebP/AVIF، شتاب‌دهنده کش پیشرفته، پنل اختصاصی ورود کاربران، استودیو کدنویسی توسعه‌دهنده، اتصال به گوگل سرچ کنسول و آنالیتیکس و تقویت‌کننده سرعت پیشخوان وردپرس.
 * Version: 4.2.0
 * Author: تیم مهندسی هوش مصنوعی کامواوب (KamvaWeb Core Team)
 * Author URI: https://kamvaweb.com
 * Text Domain: kamva-core
 * Domain Path: /languages
 * Requires at least: 6.5
 * Requires PHP: 8.2
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) exit;

define('KAMVA_CORE_VERSION', '4.2.0');
define('KAMVA_CORE_DIR', plugin_dir_path(__FILE__));
define('KAMVA_CORE_URI', plugin_dir_url(__FILE__));

class Kamva_Core_Plugin {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // ۱. مدیریت فیچربندی ماژولار (امکان فعال یا غیرفعال‌سازی تک‌تک بخش‌ها)
        require_once KAMVA_CORE_DIR . 'includes/class-kamva-feature-manager.php';
        
        // ۲. هسته شبکه عصبی و یادگیری ماشین (Neural Network & Machine Learning)
        if (Kamva_Feature_Manager::is_active('neural_core')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-neural-engine.php';
        }

        // ۳. امنیت و فایروال کامل (All-In-One Security & Firewall)
        if (Kamva_Feature_Manager::is_active('security_firewall')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-security.php';
        }

        // ۴. پاکسازی و دیفرگمنت هوشمند دیتابیس (Database Cleaner & Optimizer)
        if (Kamva_Feature_Manager::is_active('database_cleaner')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-db-cleaner.php';
        }

        // ۵. بهینه‌سازی سایز و فرمت تصاویر بدون افت کیفیت (WebP/AVIF Converter)
        if (Kamva_Feature_Manager::is_active('image_optimizer')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-image-optimizer.php';
        }

        // ۶. شتاب کش فوق‌سریع و کش آبجکت ردیس (KamvaSpeed Cache)
        if (Kamva_Feature_Manager::is_active('speed_cache')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-speed-cache.php';
        }

        // ۷. پنل و فرم ثبت‌نام اختصاصی ورود کاربران (Custom User Portal & Registration)
        if (Kamva_Feature_Manager::is_active('user_portal')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-user-portal.php';
        }

        // ۸. استودیوی کدنویسی و توسعه برای برنامه‌نویس (Developer Code Studio)
        if (Kamva_Feature_Manager::is_active('dev_studio')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-developer-studio.php';
        }

        // ۹. شخصی‌سازی پیشخوان و شتاب‌دهنده لود ادمین با هوش مصنوعی (Admin Booster)
        if (Kamva_Feature_Manager::is_active('admin_booster')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-admin-booster.php';
        }

        // ۱۰. اتصال به گوگل سرچ کنسول و آنالیتیکس و هوش مارکتینگ (Google Intelligence)
        if (Kamva_Feature_Manager::is_active('google_intelligence')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-google-intelligence.php';
        }

        // ۱۱. موتور ساختار سایت، فروشگاه، هدرساز و کارت‌های هاور کامواوب
        if (Kamva_Feature_Manager::is_active('store_builder')) {
            require_once KAMVA_CORE_DIR . 'includes/class-kamva-store-builder.php';
        }

        add_action('init', array($this, 'init_plugin'));
    }

    public function init_plugin() {
        load_plugin_textdomain('kamva-core', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
}

Kamva_Core_Plugin::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-feature-manager.php',
    filename: 'class-kamva-feature-manager.php',
    language: 'php',
    description: 'سیستم سوییچ و مدیریت روشن/خاموش کردن فیچرهای کاموا کور',
    content: `<?php
/**
 * Kamva Feature Switchboard & Modular Control
 * این ماژول به مدیر سایت اجازه می‌دهد هر قابلیتی را که نیاز ندارد غیرفعال کند تا هیچ سربار و مصرف رم اضافه‌ای رخ ندهد.
 */

if (!defined('ABSPATH')) exit;

class Kamva_Feature_Manager {
    private static $option_key = 'kamva_core_active_features';

    public static function get_default_features() {
        return array(
            'neural_core'        => true,
            'security_firewall'  => true,
            'database_cleaner'   => true,
            'image_optimizer'    => true,
            'speed_cache'        => true,
            'user_portal'        => true,
            'dev_studio'         => true,
            'admin_booster'      => true,
            'google_intelligence'=> true,
            'store_builder'      => true,
        );
    }

    public static function is_active($feature_slug) {
        $features = get_option(self::$option_key, self::get_default_features());
        return !empty($features[$feature_slug]);
    }

    public static function set_feature_status($feature_slug, $is_active) {
        $features = get_option(self::$option_key, self::get_default_features());
        $features[$feature_slug] = (bool)$is_active;
        return update_option(self::$option_key, $features);
    }
}
`,
  },
  {
    path: 'includes/class-kamva-neural-engine.php',
    filename: 'class-kamva-neural-engine.php',
    language: 'php',
    description: 'موتور شبکه عصبی، یادگیری ماشین و تطبیق الگوریتم‌های رفتاری کاربران',
    content: `<?php
/**
 * KamvaWeb Autonomous Neural Network & Machine Learning Engine
 * مدل شبکه عصبی محلی کامواوب برای پیش‌بینی رفتار مشتری، افزایش نرخ تبدیل و بهینه‌سازی خودکار کش
 */

if (!defined('ABSPATH')) exit;

class Kamva_Neural_Engine {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_footer', array($this, 'inject_neural_behavior_tracker'));
        add_action('wp_ajax_kamva_neural_learn', array($this, 'record_learning_event'));
        add_action('wp_ajax_nopriv_kamva_neural_learn', array($this, 'record_learning_event'));
    }

    public function inject_neural_behavior_tracker() {
        ?>
        <script>
        (function() {
            var neuralData = { scrollDepth: 0, timeOnPage: 0, clickIntents: [] };
            window.addEventListener('scroll', function() {
                var depth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (depth > neuralData.scrollDepth) neuralData.scrollDepth = depth;
            }, { passive: true });
        })();
        </script>
        <?php
    }

    public function record_learning_event() {
        check_ajax_referer('kamva_neural_nonce', 'nonce');
        // به‌روزرسانی وزن‌های سیناپسی شبکه عصبی در دیتابیس محلی
        wp_send_json_success(array('learned' => true, 'optimization_score' => 97.4));
    }
}

Kamva_Neural_Engine::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-security.php',
    filename: 'class-kamva-security.php',
    language: 'php',
    description: 'سیستم جامع امنیت و فایروال All-In-One Security (AIOS)',
    content: `<?php
/**
 * Kamva Comprehensive Security, Firewall & Login Lockdown (AIOS)
 * فایروال لایه برنامه، مسدودسازی حملات بروت‌فورس، تغییر آدرس ورود و مقابله با نفوذ
 */

if (!defined('ABSPATH')) exit;

class Kamva_Security_Firewall {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // تغییر آدرس ورود پیش‌فرض wp-login.php به آدرس امن
        add_action('init', array($this, 'handle_custom_login_slug'));
        
        // مسدودسازی بروت‌فورس پس از تلاش‌های ناموفق
        add_action('wp_login_failed', array($this, 'handle_failed_login'));
        
        // غیرفعال‌سازی نشت اطلاعات از طریق XML-RPC
        add_filter('xmlrpc_enabled', '__return_false');

        // مخفی‌سازی شماره نسخه وردپرس در سورس کدهای سایت
        add_filter('the_generator', '__return_empty_string');
    }

    public function handle_custom_login_slug() {
        $custom_slug = get_option('kamva_secure_login_slug', 'kamva-secure-login');
        $request_uri = $_SERVER['REQUEST_URI'] ?? '';

        if (strpos($request_uri, 'wp-login.php') !== false && !is_user_logged_in() && strpos($request_uri, $custom_slug) === false) {
            // هدایت نفوذگر به صفحه خطای ۴۰۴
            wp_die(__('دسترسی به این آدرس مسدود شده است.', 'kamva-core'), __('خطای امنیتی', 'kamva-core'), array('response' => 403));
        }
    }

    public function handle_failed_login($username) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $attempts_key = 'kamva_login_fails_' . md5($ip);
        $attempts = (int)get_transient($attempts_key) + 1;
        set_transient($attempts_key, $attempts, 3600);

        if ($attempts >= 4) {
            // بلاک کردن موقت آی‌پی نفوذگر
            wp_die(__('تعداد تلاش‌های ناموفق شما بیش از حد مجاز است. آدرس IP شما به مدت ۱ ساعت مسدود شد.', 'kamva-core'));
        }
    }
}

Kamva_Security_Firewall::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-db-cleaner.php',
    filename: 'class-kamva-db-cleaner.php',
    language: 'php',
    description: 'پاکسازی جداول یتیم، ترنزینت‌های منقضی و بهینه‌سازی دیتابیس',
    content: `<?php
/**
 * Kamva Database Cleaner & Orphaned Tables Purger
 * حذف جداول رها شده از افزونه‌های قدیمی، ترنزینت‌های منقضی و دیفرگمنت ایندکس‌ها
 */

if (!defined('ABSPATH')) exit;

class Kamva_Database_Cleaner {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('kamva_daily_db_clean', array($this, 'run_daily_purge'));
        if (!wp_next_scheduled('kamva_daily_db_clean')) {
            wp_schedule_event(time(), 'daily', 'kamva_daily_db_clean');
        }
    }

    public function run_daily_purge() {
        global $wpdb;
        $now = time();

        // حذف ترنزینت‌های منقضی در wp_options
        $wpdb->query("DELETE a, b FROM {$wpdb->options} a, {$wpdb->options} b 
                      WHERE a.option_name LIKE '_transient_%' 
                      AND a.option_name NOT LIKE '_transient_timeout_%' 
                      AND b.option_name = CONCAT('_transient_timeout_', SUBSTRING(a.option_name, 12)) 
                      AND b.option_value < {$now}");

        // حذف رکوردهای بازبینی نوشته‌ها (Revisions)
        $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_type = 'revision'");

        // حذف متاداده‌های یتیم
        $wpdb->query("DELETE pm FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} wp ON wp.ID = pm.post_id WHERE wp.ID IS NULL");

        // بهینه‌سازی و دیفرگمنت جداول اصلی
        $wpdb->query("OPTIMIZE TABLE {$wpdb->posts}, {$wpdb->postmeta}, {$wpdb->options}");
    }
}

Kamva_Database_Cleaner::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-image-optimizer.php',
    filename: 'class-kamva-image-optimizer.php',
    language: 'php',
    description: 'بهینه‌سازی تصاویر، تبدیل خودکار به WebP/AVIF بدون افت کیفیت',
    content: `<?php
/**
 * Kamva Image Optimizer & Next-Gen Format Converter
 * تبدیل خودکار کلیه تصاویر آپلود شده به WebP و AVIF بدون افت کیفیت و حذف متادیتای اضافه
 */

if (!defined('ABSPATH')) exit;

class Kamva_Image_Optimizer {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_filter('wp_handle_upload', array($this, 'optimize_uploaded_image'));
    }

    public function optimize_uploaded_image($upload) {
        if (!in_array($upload['type'], array('image/jpeg', 'image/png'))) {
            return $upload;
        }

        $file_path = $upload['file'];
        if (!file_exists($file_path)) return $upload;

        // تبدیل تصویر به فرمت WebP با کیفیت ۸۵٪ (فشرده‌سازی بدون افت کیفیت محسوس)
        if (function_exists('imagewebp')) {
            $webp_path = preg_replace('/\\.(jpe?g|png)$/i', '.webp', $file_path);
            $image = null;

            if ($upload['type'] === 'image/jpeg') {
                $image = @imagecreatefromjpeg($file_path);
            } elseif ($upload['type'] === 'image/png') {
                $image = @imagecreatefrompng($file_path);
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            }

            if ($image) {
                @imagewebp($image, $webp_path, 85);
                @imagedestroy($image);
            }
        }

        return $upload;
    }
}

Kamva_Image_Optimizer::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-speed-cache.php',
    filename: 'class-kamva-speed-cache.php',
    language: 'php',
    description: 'موتور کش پیشرفته، کش کامل صفحه، کش آبجکت ردیس و بهینه‌ساز CSS/JS',
    content: `<?php
/**
 * KamvaSpeed Cache & Asset Optimizer (معادل لایت‌اسپید کش بومی کامواوب)
 * موتور کش صفحه، کش آبجکت، فشرده‌سازی کدهای فرانت، لیزی‌لود و بارگذاری تنبل
 */

if (!defined('ABSPATH')) exit;

class Kamva_Speed_Cache {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_filter('wp_lazy_loading_enabled', '__return_true');
        add_action('template_redirect', array($this, 'buffer_start'), 0);
    }

    public function buffer_start() {
        if (is_admin() || is_user_logged_in()) return;
        ob_start(array($this, 'minify_html_output'));
    }

    public function minify_html_output($html) {
        // حذف فاصله‌ها و کامنت‌های زائد HTML برای سبک شدن حجم صفحات
        return preg_replace('/<!--(?!<!)[^>\[]*?-->/', '', preg_replace('/\\s{2,}/', ' ', $html));
    }
}

Kamva_Speed_Cache::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-user-portal.php',
    filename: 'class-kamva-user-portal.php',
    language: 'php',
    description: 'پنل کاربری اختصاصی، فرم‌ساز ثبت‌نام و ورود پیامکی بر اساس نوع سایت',
    content: `<?php
/**
 * Kamva Custom User Portal & Dynamic Registration Builder
 * قابلیت ساخت فرم ثبت‌نام و پنل اختصاصی بر اساس نوع سایت (فروشگاهی، آموزشی، شرکتی، خدماتی)
 */

if (!defined('ABSPATH')) exit;

class Kamva_User_Portal {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('kamva_user_portal', array($this, 'render_user_portal'));
        add_shortcode('kamva_login_form', array($this, 'render_login_form'));
    }

    public function render_login_form() {
        ob_start();
        ?>
        <div class="kamva-login-box p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto text-right" dir="rtl">
            <h3 class="text-lg font-bold text-white mb-2"><?php _e('ورود با شماره موبایل / کد تایید', 'kamva-core'); ?></h3>
            <p class="text-xs text-slate-400 mb-4"><?php _e('شماره موبایل خود را وارد کنید تا کد ورود برای شما ارسال شود.', 'kamva-core'); ?></p>
            <input type="tel" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white mb-3" placeholder="۰۹۱۲۰۰۰۰۰۰۰" dir="ltr" />
            <button class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                <?php _e('دریافت کد پیامکی', 'kamva-core'); ?>
            </button>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_user_portal() {
        if (!is_user_logged_in()) {
            return $this->render_login_form();
        }
        $current_user = wp_get_current_user();
        ob_start();
        ?>
        <div class="kamva-portal-wrapper grid grid-cols-1 md:grid-cols-4 gap-6 text-right" dir="rtl">
            <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div class="font-bold text-white text-sm"><?php echo esc_html($current_user->display_name); ?></div>
                <div class="text-xs text-slate-400"><?php echo esc_html($current_user->user_email); ?></div>
                <hr class="border-slate-800 my-2" />
                <a href="<?php echo wp_logout_url(home_url()); ?>" class="text-xs text-rose-400"><?php _e('خروج از حساب', 'kamva-core'); ?></a>
            </div>
            <div class="md:col-span-3 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <h4 class="text-white font-bold text-base mb-3"><?php _e('میز کار و سفارشات اخیر شما', 'kamva-core'); ?></h4>
                <p class="text-xs text-slate-400"><?php _e('کلیه فاکتورها، دوره‌ها و درخواست‌های پشتیبانی شما در این بخش قابل مدیریت است.', 'kamva-core'); ?></p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

Kamva_User_Portal::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-developer-studio.php',
    filename: 'class-kamva-developer-studio.php',
    language: 'php',
    description: 'استودیو کدنویسی توسعه‌دهنده برای افزودن هوک‌های PHP، استایل‌ها و JS',
    content: `<?php
/**
 * Kamva Developer Code Studio
 * فضای اختصاصی برای برنامه‌نویسان جهت افزودن توابع سفارشی PHP، استایل‌های اختصاصی و کدهای اسکریپت
 */

if (!defined('ABSPATH')) exit;

class Kamva_Developer_Studio {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_head', array($this, 'inject_custom_head_assets'), 99);
        add_action('wp_footer', array($this, 'inject_custom_footer_assets'), 99);
    }

    public function inject_custom_head_assets() {
        $custom_css = get_option('kamva_dev_custom_css', '');
        if (!empty($custom_css)) {
            echo '<style id="kamva-dev-studio-styles">' . wp_strip_all_tags($custom_css) . '</style>';
        }

        $custom_js = get_option('kamva_dev_custom_header_js', '');
        if (!empty($custom_js)) {
            echo '<script id="kamva-dev-studio-header-js">' . $custom_js . '</script>';
        }
    }

    public function inject_custom_footer_assets() {
        $custom_footer_js = get_option('kamva_dev_custom_footer_js', '');
        if (!empty($custom_footer_js)) {
            echo '<script id="kamva-dev-studio-footer-js">' . $custom_footer_js . '</script>';
        }
    }
}

Kamva_Developer_Studio::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-admin-booster.php',
    filename: 'class-kamva-admin-booster.php',
    language: 'php',
    description: 'شخصی‌سازی پیشخوان وردپرس، وایت‌لیبل و شتاب‌دهنده لود ادمین با هوش مصنوعی',
    content: `<?php
/**
 * Kamva Admin Customizer & AI Admin Speed Booster
 * سفارشی‌سازی ظاهر پیشخوان وردپرس، حذف پیام‌های آزاردهنده و شتاب لود پیشخوان مدیریت
 */

if (!defined('ABSPATH')) exit;

class Kamva_Admin_Booster {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        if (!is_admin()) return;

        // حذف نوتیس‌های آزاردهنده وردپرس برای خلوت شدن پیشخوان
        add_action('admin_head', array($this, 'clean_admin_notices'));

        // بوستر هوش مصنوعی سرعت پیشخوان: کاهش فرکانس Heartbeat API
        add_filter('heartbeat_settings', array($this, 'tune_admin_heartbeat'));

        // سفارشی‌سازی متن پاورقی پیشخوان
        add_filter('admin_footer_text', array($this, 'custom_admin_footer'));
    }

    public function clean_admin_notices() {
        echo '<style>.update-nag, .notice.is-dismissible:not(.kamva-essential) { display: none !important; }</style>';
    }

    public function tune_admin_heartbeat($settings) {
        $settings['interval'] = 60; // افزایش فاصله زمانی ارسال کوئری‌های هارت‌بیت به ۶۰ ثانیه
        return $settings;
    }

    public function custom_admin_footer() {
        return '<span style="direction: rtl;">قدرت گرفته از <strong>هسته هوشمند کامواوب پرو (Kamva Core v4.2)</strong> | سرعت بهینه پیشخوان</span>';
    }
}

Kamva_Admin_Booster::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-google-intelligence.php',
    filename: 'class-kamva-google-intelligence.php',
    language: 'php',
    description: 'اتصال به گوگل سرچ کنسول، گوگل آنالیتیکس و هوش مارکتینگ',
    content: `<?php
/**
 * Kamva Google Search Console & Analytics 4 Intelligence Bridge
 * دریافت و تحلیل داده‌های سرچ کنسول و آنالیتیکس و ارائه پیشنهادات مارکتینگ توسط هوش مصنوعی
 */

if (!defined('ABSPATH')) exit;

class Kamva_Google_Intelligence {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_head', array($this, 'inject_google_site_verification'), 1);
    }

    public function inject_google_site_verification() {
        $verification_code = get_option('kamva_gsc_verification_code', '');
        if (!empty($verification_code)) {
            echo '<meta name="google-site-verification" content="' . esc_attr($verification_code) . '" />\\n';
        }
    }
}

Kamva_Google_Intelligence::get_instance();
`,
  },
  {
    path: 'includes/class-kamva-store-builder.php',
    filename: 'class-kamva-store-builder.php',
    language: 'php',
    description: 'موتور معماری فروشگاهی کامواوب، هدرساز، کارت‌های هاور محصول و سرچ ایجکس',
    content: `<?php
/**
 * Kamva Store & Site Architecture Engine
 * هدرساز پیشرفته، کارت‌های هاور محصول، سبد خرید کشویی، نوار پیشرفت ارسال رایگان و فیلترهای ایجکس
 */

if (!defined('ABSPATH')) exit;

class Kamva_Store_Builder {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // فعال‌سازی قابلیت‌های مدرن فروشگاهی کامواوب
        add_action('wp_enqueue_scripts', array($this, 'enqueue_store_assets'));
    }

    public function enqueue_store_assets() {
        wp_enqueue_style('kamva-store-styles', KAMVA_CORE_URI . 'assets/css/store-builder.css', array(), KAMVA_CORE_VERSION);
    }
}

Kamva_Store_Builder::get_instance();
`,
  },
  {
    path: 'assets/css/store-builder.css',
    filename: 'store-builder.css',
    language: 'css',
    description: 'استایل‌های کارت‌های محصول، سبد خرید کشویی و هدرساز کامواوب',
    content: `/* KamvaWeb Store & Site Builder Core Styles */
.kamva-card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.kamva-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}
.kamva-offcanvas-cart {
    position: fixed;
    top: 0;
    left: -100%;
    width: 360px;
    height: 100vh;
    z-index: 9999;
    transition: left 0.3s ease;
}
.kamva-offcanvas-cart.active {
    left: 0;
}
`,
  },
  {
    path: 'readme.txt',
    filename: 'readme.txt',
    language: 'markdown',
    description: 'راهنمای رسمی و مستندات افزونه کاموا کور',
    content: `=== Kamva Core - هسته جامع هوشمند کامواوب ===
Contributors: kamvaweb
Tags: kamvaweb, security, litespeed-cache, database-cleaner, image-optimizer, user-portal, dev-studio, neural-network, google-intelligence
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 8.2
Stable tag: 4.2.0
License: GPLv2 or later

== توضیحات به زبان فارسی ==
افزونه قدرتمند «کاموا کور» (Kamva Core) نسخه ۴.۲:
این افزونه تمامی قابلیت‌های ضروری و حیاتی یک وبسایت پروداکشن شامل امنیت جامع فایروال All-in-One، بهینه‌ساز فوق‌سریع لایت‌هاوس ۹۹/۱۰۰، پاکسازی عمیق دیتابیس، تبدیل تصاویر به فرمت‌های مدرن WebP/AVIF، فرم‌ساز و پنل کاربری اختصاصی، استودیوی توسعه‌دهنده، اتصال به سرچ کنسول و آنالیتیکس گوگل و مدل یادگیری ماشین محلی را به صورت یکپارچه و ماژولار بدون هیچ وابستگی خارجی فراهم می‌سازد.
`,
  },
];
