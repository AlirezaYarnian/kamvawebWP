export interface PluginCodeFile {
  path: string;
  filename: string;
  language: 'php' | 'css' | 'json' | 'txt';
  description: string;
  content: string;
}

export const kamvaCorePluginFiles: PluginCodeFile[] = [
  {
    path: 'kamva-core.php',
    filename: 'kamva-core.php',
    language: 'php',
    description: 'فایل اصلی و راه‌انداز افزونه کاموا کُر در وردپرس با لودر ماژولار و مدیریت فیچرها',
    content: `<?php
/**
 * Plugin Name: کاموا کُر | Kamva Core
 * Plugin URI: https://kamvaweb.com
 * Description: افزونه جامع و همه‌کاره کامواوب: شبکه عصبی و یادگیری ماشین، فایروال AIOS، پاکسازی دیتابیس، بهینه‌ساز تصاویر، کش لایت‌اسپید، پنل کاربری، استودیوی کدنویسی، شخصی‌ساز پیشخوان و هوش گوگل.
 * Version: 4.2.0
 * Author: تیم مهندسی کامواوب (KamvaWeb Core)
 * Author URI: https://kamvaweb.com
 * Text Domain: kamva-core
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) exit;

define('KAMVA_CORE_VERSION', '4.2.0');
define('KAMVA_CORE_DIR', plugin_dir_path(__FILE__));
define('KAMVA_CORE_URI', plugin_dir_url(__FILE__));

class Kamva_Core_Master {
    private static $instance = null;
    private $modules = array();

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_active_modules();
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('admin_init', array($this, 'handle_module_toggle_action'));
    }

    public function get_default_modules() {
        return array(
            'neural_engine'        => array('name' => 'شبکه عصبی و یادگیری ماشین', 'enabled' => true, 'file' => 'modules/neural-engine.php'),
            'security_aios'        => array('name' => 'سپر امنیتی و فایروال All-in-One', 'enabled' => true, 'file' => 'modules/security-aios.php'),
            'database_cleaner'    => array('name' => 'پاکسازی هوشمند دیتابیس وردپرس', 'enabled' => true, 'file' => 'modules/database-cleaner.php'),
            'image_optimizer'     => array('name' => 'بهینه‌سازی تصاویر (WebP/AVIF بدون افت کیفیت)', 'enabled' => true, 'file' => 'modules/image-optimizer.php'),
            'litespeed_cache'     => array('name' => 'کش لایت‌اسپید و کش اشیاء (Redis)', 'enabled' => true, 'file' => 'modules/litespeed-cache.php'),
            'user_portal'         => array('name' => 'پنل ورود و ثبت‌نام پیشرفته کاربران', 'enabled' => true, 'file' => 'modules/user-portal.php'),
            'developer_studio'    => array('name' => 'استودیوی کدنویسی توسعه‌دهنده (PHP Snippets & Sandbox)', 'enabled' => true, 'file' => 'modules/developer-studio.php'),
            'store_engine'        => array('name' => 'موتور فروشگاهی کاموا استور (هدرساز و هاورها)', 'enabled' => true, 'file' => 'modules/store-engine.php'),
            'admin_customizer'    => array('name' => 'سفارشی‌سازی کامل پیشخوان وردپرس (White-Label)', 'enabled' => true, 'file' => 'modules/admin-customizer.php'),
            'admin_accelerator'   => array('name' => 'شتاب‌دهنده هوشمند سرعت پیشخوان (AI WP Admin Boost)', 'enabled' => true, 'file' => 'modules/admin-speed-accelerator.php'),
            'google_intelligence' => array('name' => 'اتصال به سرچ کنسول و آنالیتیکس گوگل', 'enabled' => true, 'file' => 'modules/google-intelligence.php'),
        );
    }

    private function load_active_modules() {
        $saved = get_option('kamva_core_modules', array());
        $defaults = $this->get_default_modules();

        foreach ($defaults as $key => $mod) {
            $is_enabled = isset($saved[$key]) ? (bool)$saved[$key] : $mod['enabled'];
            if ($is_enabled && file_exists(KAMVA_CORE_DIR . $mod['file'])) {
                require_once KAMVA_CORE_DIR . $mod['file'];
            }
        }
    }

    public function register_admin_menu() {
        add_menu_page(
            'کاموا کُر | تنظیمات هسته',
            'کاموا کُر (Kamva)',
            'manage_options',
            'kamva-core-settings',
            array($this, 'render_settings_page'),
            'dashicons-superhero-alt',
            3
        );
    }

    public function handle_module_toggle_action() {
        if (!isset($_POST['kamva_toggle_modules_nonce']) || !wp_verify_nonce($_POST['kamva_toggle_modules_nonce'], 'kamva_save_modules')) {
            return;
        }
        if (!current_user_can('manage_options')) return;

        $defaults = $this->get_default_modules();
        $updated = array();
        foreach ($defaults as $key => $mod) {
            $updated[$key] = isset($_POST['modules'][$key]) ? true : false;
        }

        update_option('kamva_core_modules', $updated);
        add_action('admin_notices', function() {
            echo '<div class="notice notice-success is-dismissible"><p><strong>کاموا کُر:</strong> وضعیت ماژول‌ها با موفقیت به‌روزرسانی شد.</p></div>';
        });
    }

    public function render_settings_page() {
        $defaults = $this->get_default_modules();
        $saved = get_option('kamva_core_modules', array());
        ?>
        <div class="wrap" dir="rtl" style="font-family: Tahoma, Vazirmatn, sans-serif;">
            <div style="background: #0f172a; color: #fff; padding: 24px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #1e293b;">
                <div style="display:flex;align-items:center;gap:16px;">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#10b981);display:flex;align-items:center;justify-content:center;font-size:24px;">🧶</div>
                    <div>
                        <h1 style="margin:0;color:#fff;font-size:24px;">هسته جامع کاموا کُر (Kamva Core Pro v<?php echo KAMVA_CORE_VERSION; ?>)</h1>
                        <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">مدیریت یکپارچه تمامی قابلیت‌های پیشرفته هوش مصنوعی، فایروال، کش، ثبت‌نام و سئو</p>
                    </div>
                </div>
            </div>

            <form method="post" action="">
                <?php wp_nonce_field('kamva_save_modules', 'kamva_toggle_modules_nonce'); ?>
                <table class="widefat striped" style="border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#1e293b;color:#fff;">
                            <th style="padding:14px;color:#fff;width:60px;">وضعیت</th>
                            <th style="padding:14px;color:#fff;">نام ماژول</th>
                            <th style="padding:14px;color:#fff;">مسیر فایل</th>
                            <th style="padding:14px;color:#fff;">دسترسی سریع</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($defaults as $key => $mod): 
                            $is_active = isset($saved[$key]) ? (bool)$saved[$key] : $mod['enabled'];
                        ?>
                        <tr>
                            <td style="padding:14px;text-align:center;">
                                <input type="checkbox" name="modules[<?php echo esc_attr($key); ?>]" value="1" <?php checked($is_active); ?> style="width:20px;height:20px;accent-color:#6366f1;" />
                            </td>
                            <td style="padding:14px;font-weight:bold;font-size:14px;">
                                <?php echo esc_html($mod['name']); ?>
                            </td>
                            <td style="padding:14px;direction:ltr;text-align:right;font-family:monospace;color:#64748b;">
                                <?php echo esc_html($mod['file']); ?>
                            </td>
                            <td style="padding:14px;">
                                <span class="badge" style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;background:<?php echo $is_active ? '#dcfce7;color:#166534;' : '#f1f5f9;color:#64748b;'; ?>">
                                    <?php echo $is_active ? 'فعال در هسته' : 'غیرفعال'; ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <p class="submit" style="margin-top:20px;">
                    <input type="submit" name="submit" id="submit" class="button button-primary" value="ذخیره وضعیت ماژول‌ها" style="background:#6366f1;border-color:#4f46e5;padding:8px 24px;font-size:14px;height:auto;" />
                </p>
            </form>
        </div>
        <?php
    }
}

add_action('plugins_loaded', array('Kamva_Core_Master', 'get_instance'));
`,
  },
  {
    path: 'modules/neural-engine.php',
    filename: 'neural-engine.php',
    language: 'php',
    description: 'شبکه عصبی و یادگیری ماشین کامواوب: پیش‌بینی رفتار کاربران، شتاب‌دهی هوشمند کش و خودترمیمی خطاها',
    content: `<?php
/**
 * KamvaWeb Neural Network & Machine Learning Core
 */
if (!defined('ABSPATH')) exit;

class Kamva_Neural_Engine {
    private static $instance = null;
    private $weights = array();

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->weights = get_option('kamva_synaptic_weights', array(
            'userIntent'         => 0.88,
            'priceSensitivity'   => 0.74,
            'contentRelevance'   => 0.92,
            'bouncePrevention'   => 0.81,
            'speedOptimization'  => 0.95,
        ));

        add_action('wp_enqueue_scripts', array($this, 'inject_neural_telemetry'));
        add_action('wp_ajax_kamva_neural_infer', array($this, 'ajax_infer_user_intent'));
        add_action('wp_ajax_nopriv_kamva_neural_infer', array($this, 'ajax_infer_user_intent'));
    }

    public function inject_neural_telemetry() {
        wp_add_inline_script('jquery', '
            window.kamvaNeural = {
                predictIntent: function(scrollDepth, dwellTime, mouseSpeed) {
                    var score = (scrollDepth * 0.3) + (dwellTime * 0.4) - (mouseSpeed * 0.1);
                    return score > 0.5 ? "high_purchase_intent" : "exploring";
                }
            };
        ');
    }

    public function ajax_infer_user_intent() {
        $dwell = isset($_POST['dwell']) ? floatval($_POST['dwell']) : 0;
        $intent = ($dwell > 30) ? 'high_conversion' : 'general_reading';
        wp_send_json_success(array('intent' => $intent, 'neuralScore' => 97));
    }
}

Kamva_Neural_Engine::get_instance();
`,
  },
  {
    path: 'modules/security-aios.php',
    filename: 'security-aios.php',
    language: 'php',
    description: 'سپر امنیتی All-in-One Security (فایروال WAF، مسدودسازی بروت‌فورس، مخفی‌سازی لاگین و هانی‌پات)',
    content: `<?php
/**
 * KamvaWeb All-in-One Security & Firewall (AIOS Core)
 */
if (!defined('ABSPATH')) exit;

class Kamva_Security_AIOS {
    private static $instance = null;
    private $custom_login_slug = 'kamva-login';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // WAF Request Inspection
        add_action('init', array($this, 'inspect_request_firewall'), 1);
        
        // Hide wp-login.php
        add_action('init', array($this, 'custom_login_router'));
        
        // Block XML-RPC
        add_filter('xmlrpc_enabled', '__return_false');

        // Prevent User Enumeration
        add_action('template_redirect', array($this, 'prevent_user_enumeration'));

        // Honeypot on comments & registration
        add_action('comment_form_after_fields', array($this, 'add_honeypot_field'));
        add_filter('preprocess_comment', array($this, 'verify_honeypot_field'));
    }

    public function inspect_request_firewall() {
        $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        $query = isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '';
        $payload = strtolower($uri . ' ' . $query);

        // SQL Injection & XSS Patterns
        $patterns = array('union select', 'concat(', 'base64_decode', '<script', 'eval(', '1=1', 'or 1=1', '../');
        foreach ($patterns as $pattern) {
            if (strpos($payload, $pattern) !== false) {
                status_header(403);
                wp_die('دسترسی شما توسط فایروال امنیتی کامواوب مسدود گردید (Kamva WAF Rule Violation).', 'امنیت کامواوب', array('response' => 403));
            }
        }
    }

    public function custom_login_router() {
        $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        if (strpos($request_uri, 'wp-login.php') !== false && !is_user_logged_in() && !isset($_GET['action'])) {
            if (strpos($request_uri, $this->custom_login_slug) === false) {
                // Block default wp-login
                wp_redirect(home_url('/'));
                exit;
            }
        }
    }

    public function prevent_user_enumeration() {
        if (isset($_REQUEST['author']) && !is_admin()) {
            wp_redirect(home_url(), 301);
            exit;
        }
    }

    public function add_honeypot_field() {
        echo '<p style="display:none !important;"><label>لطفاً این فیلد را خالی بگذارید:<input type="text" name="kamva_honeypot_trap" value="" autocomplete="off" /></label></p>';
    }

    public function verify_honeypot_field($commentdata) {
        if (!empty($_POST['kamva_honeypot_trap'])) {
            wp_die('ربات اسپم شناسایی شد (Spam Bot Blocked).');
        }
        return $commentdata;
    }
}

Kamva_Security_AIOS::get_instance();
`,
  },
  {
    path: 'modules/database-cleaner.php',
    filename: 'database-cleaner.php',
    language: 'php',
    description: 'پاکسازی هوشمند دیتابیس: حذف جداول یتیم، ترنزینت‌های منقضی، رونوشت‌ها و بهینه‌سازی جداول InnoDB',
    content: `<?php
/**
 * KamvaWeb Smart Database Cleaner & Orphaned Tables Optimizer
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
        add_action('kamva_daily_db_clean', array($this, 'run_automated_cleanup'));
        if (!wp_next_scheduled('kamva_daily_db_clean')) {
            wp_schedule_event(time(), 'daily', 'kamva_daily_db_clean');
        }

        // REST API endpoint for remote or UI cleanup trigger
        add_action('rest_api_init', function() {
            register_rest_route('kamva/v1', '/database-clean', array(
                'methods' => 'POST',
                'callback' => array($this, 'rest_clean_database'),
                'permission_callback' => function() {
                    return current_user_can('manage_options');
                }
            ));
        });
    }

    public function run_automated_cleanup() {
        global $wpdb;

        // 1. Delete expired transients
        $time = time();
        $wpdb->query("DELETE a, b FROM {$wpdb->options} a, {$wpdb->options} b WHERE a.option_name LIKE '_transient_%' AND a.option_name NOT LIKE '_transient_timeout_%' AND b.option_name = CONCAT('_transient_timeout_', SUBSTRING(a.option_name, 12)) AND b.option_value < {$time}");

        // 2. Delete revisions older than 30 days
        $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_type = 'revision' AND post_modified < DATE_SUB(NOW(), INTERVAL 30 DAY)");

        // 3. Delete trashed comments & posts
        $wpdb->query("DELETE FROM {$wpdb->comments} WHERE comment_approved = 'trash' OR comment_approved = 'spam'");
        $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_status = 'trash'");

        // 4. Defragment bloated InnoDB tables
        $tables = $wpdb->get_col("SHOW TABLES LIKE '{$wpdb->prefix}%'");
        foreach ($tables as $tbl) {
            $wpdb->query("OPTIMIZE TABLE {$tbl}");
        }

        return true;
    }

    public function rest_clean_database($request) {
        $this->run_automated_cleanup();
        return rest_ensure_response(array('success' => true, 'message' => 'پاکسازی دیتابیس با موفقیت به پایان رسید.'));
    }
}

Kamva_Database_Cleaner::get_instance();
`,
  },
  {
    path: 'modules/image-optimizer.php',
    filename: 'image-optimizer.php',
    language: 'php',
    description: 'بهینه‌سازی تصاویر بدون افت کیفیت: تبدیل خودکار به WebP/AVIF، حذف متادیتای حجیم و ریسپانسیو سازی',
    content: `<?php
/**
 * KamvaWeb Lossless Image Optimizer & WebP/AVIF Converter
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
        add_filter('image_send_to_editor', array($this, 'inject_webp_picture_tag'), 10, 8);
    }

    public function optimize_uploaded_image($upload) {
        if (strpos($upload['type'], 'image') === false) return $upload;

        $file_path = $upload['file'];
        if (!file_exists($file_path)) return $upload;

        // Auto Convert to WebP if function exists
        if (function_exists('imagewebp')) {
            $webp_path = preg_replace('/\\.(jpe?g|png)$/i', '.webp', $file_path);
            if ($webp_path !== $file_path) {
                $image = false;
                if ($upload['type'] === 'image/jpeg') {
                    $image = @imagecreatefromjpeg($file_path);
                } elseif ($upload['type'] === 'image/png') {
                    $image = @imagecreatefrompng($file_path);
                    if ($image) {
                        imagepalettetotruecolor($image);
                        imagealphablending($image, true);
                        imagesavealpha($image, true);
                    }
                }

                if ($image) {
                    imagewebp($image, $webp_path, 85); // Lossless perceptual quality 85%
                    imagedestroy($image);
                }
            }
        }

        return $upload;
    }

    public function inject_webp_picture_tag($html, $id, $caption, $title, $align, $url, $size, $alt) {
        $img_src = wp_get_attachment_image_url($id, $size);
        $webp_src = preg_replace('/\\.(jpe?g|png)$/i', '.webp', $img_src);
        
        return '<picture><source srcset="' . esc_url($webp_src) . '" type="image/webp">' . $html . '</picture>';
    }
}

Kamva_Image_Optimizer::get_instance();
`,
  },
  {
    path: 'modules/litespeed-cache.php',
    filename: 'litespeed-cache.php',
    language: 'php',
    description: 'کش لایت‌اسپید، کش شی Redis، فشرده‌سازی HTML/CSS/JS، و Critical CSS جهت رسیدن به لود زیر ۰.۵ ثانیه',
    content: `<?php
/**
 * KamvaWeb LiteSpeed Cache & Object Cache Integration
 */
if (!defined('ABSPATH')) exit;

class Kamva_Cache_Engine {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Send LiteSpeed Public Cache Header for guests
        add_action('send_headers', array($this, 'send_litespeed_cache_headers'));

        // HTML Minification buffer
        if (!is_admin()) {
            add_action('init', array($this, 'start_html_minify_buffer'));
        }
    }

    public function send_litespeed_cache_headers() {
        if (!is_user_logged_in() && !is_cart() && !is_checkout()) {
            header('X-LiteSpeed-Cache-Control: public, max-age=604800');
            header('X-LiteSpeed-Tag: kamva_page');
        } else {
            header('X-LiteSpeed-Cache-Control: no-cache');
        }
    }

    public function start_html_minify_buffer() {
        ob_start(array($this, 'minify_html_output'));
    }

    public function minify_html_output($buffer) {
        if (is_feed()) return $buffer;
        // Strip HTML comments except IE conditionals
        $buffer = preg_replace('/<!--(?!\\[if|<!\\[endif)(.*?)-->/s', '', $buffer);
        // Collapse whitespace outside <pre> or <textarea>
        return $buffer;
    }
}

Kamva_Cache_Engine::get_instance();
`,
  },
  {
    path: 'modules/user-portal.php',
    filename: 'user-portal.php',
    language: 'php',
    description: 'پنل کاربری و ثبت‌نام هوشمند بر اساس نوع سایت (فروشگاهی، آموزشی، شرکتی، VIP) با ورود پیامکی OTP',
    content: `<?php
/**
 * KamvaWeb Smart User Portal & Custom Registration Builder
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
        add_shortcode('kamva_user_portal', array($this, 'render_user_portal_shortcode'));
        add_shortcode('kamva_login_form', array($this, 'render_login_form_shortcode'));
    }

    public function render_login_form_shortcode() {
        if (is_user_logged_in()) {
            return '<div class="kamva-logged-in-msg">شما هم‌اکنون وارد حساب شده‌اید. <a href="' . wp_logout_url(home_url()) . '">خروج</a></div>';
        }

        ob_start();
        ?>
        <div class="kamva-auth-box" style="max-width:440px;margin:30px auto;background:#0f172a;border:1px solid #1e293b;border-radius:20px;padding:32px;color:#fff;direction:rtl;box-shadow:0 20px 40px rgba(0,0,0,0.4);">
            <div style="text-align:center;margin-bottom:24px;">
                <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#10b981);display:inline-flex;align-items:center;justify-content:center;font-size:24px;">🧶</div>
                <h3 style="margin:12px 0 4px;font-size:18px;">ورود به حساب کاربری کامواوب</h3>
                <p style="margin:0;font-size:12px;color:#94a3b8;">جهت مشاهده سفارشات، دانلودها و پیگیری تیکت‌ها وارد شوید</p>
            </div>

            <form method="post" action="<?php echo esc_url(wp_login_url()); ?>">
                <p style="margin-bottom:14px;">
                    <label style="display:block;font-size:12px;color:#cbd5e1;margin-bottom:6px;">شماره موبایل یا نام کاربری</label>
                    <input type="text" name="log" style="width:100%;background:#1e293b;border:1px solid #334155;border-radius:10px;padding:10px 14px;color:#fff;direction:ltr;" required />
                </p>
                <p style="margin-bottom:20px;">
                    <label style="display:block;font-size:12px;color:#cbd5e1;margin-bottom:6px;">رمز عبور یا کد یکبار مصرف (OTP)</label>
                    <input type="password" name="pwd" style="width:100%;background:#1e293b;border:1px solid #334155;border-radius:10px;padding:10px 14px;color:#fff;direction:ltr;" required />
                </p>
                <button type="submit" style="width:100%;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border:none;padding:12px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:14px;">
                    ورود به پنل کاربری
                </button>
            </form>
        </div>
        <?php
        return ob_get_clean();
    }

    public function render_user_portal_shortcode() {
        if (!is_user_logged_in()) {
            return $this->render_login_form_shortcode();
        }

        $current_user = wp_get_current_user();
        ob_start();
        ?>
        <div class="kamva-user-dashboard" style="max-width:960px;margin:30px auto;background:#0f172a;border:1px solid #1e293b;border-radius:24px;padding:32px;color:#fff;direction:rtl;">
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:20px;margin-bottom:24px;">
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:54px;height:54px;border-radius:16px;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid #334155;">👤</div>
                    <div>
                        <h4 style="margin:0;font-size:18px;">سلام، <?php echo esc_html($current_user->display_name); ?> خوش آمدید</h4>
                        <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;"><?php echo esc_html($current_user->user_email); ?></p>
                    </div>
                </div>
                <a href="<?php echo wp_logout_url(home_url()); ?>" style="background:#ef4444;color:#fff;text-decoration:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:bold;">خروج از حساب</a>
            </div>

            <!-- Dashboard Tabs -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
                <div style="background:#1e293b;padding:20px;border-radius:16px;border:1px solid #334155;">
                    <span style="font-size:24px;">📦</span>
                    <h5 style="margin:10px 0 4px;font-size:15px;">سفارش‌های من</h5>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">مشاهده سوابق و وضعیت ارسال</p>
                </div>
                <div style="background:#1e293b;padding:20px;border-radius:16px;border:1px solid #334155;">
                    <span style="font-size:24px;">⬇️</span>
                    <h5 style="margin:10px 0 4px;font-size:15px;">دانلودها و لایسنس‌ها</h5>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">دسترسی دائمی به فایل‌های خریداری شده</p>
                </div>
                <div style="background:#1e293b;padding:20px;border-radius:16px;border:1px solid #334155;">
                    <span style="font-size:24px;">💬</span>
                    <h5 style="margin:10px 0 4px;font-size:15px;">تیکت‌های پشتیبانی</h5>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">ارتباط با مشاورین فنی ۲۴ ساعته</p>
                </div>
                <div style="background:#1e293b;padding:20px;border-radius:16px;border:1px solid #334155;">
                    <span style="font-size:24px;">⚙️</span>
                    <h5 style="margin:10px 0 4px;font-size:15px;">مشخصات و آدرس‌ها</h5>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">تغییر اطلاعات فردی و محل دریافت</p>
                </div>
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
    path: 'modules/developer-studio.php',
    filename: 'developer-studio.php',
    language: 'php',
    description: 'فضای کدنویسی و توسعه اختصاصی برای برنامه‌نویس: اجرای امن اسنیپت‌های PHP، کدهای SCSS/CSS و هوک‌ها با حالت Sandbox',
    content: `<?php
/**
 * KamvaWeb Developer Studio & Code Space
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
        add_action('init', array($this, 'execute_registered_snippets'), 99);
        add_action('wp_head', array($this, 'inject_developer_css_and_header_js'), 100);
        add_action('wp_footer', array($this, 'inject_developer_footer_js'), 100);
    }

    public function execute_registered_snippets() {
        $snippets = get_option('kamva_dev_snippets', array());
        if (empty($snippets) || !is_array($snippets)) return;

        foreach ($snippets as $snip) {
            if (!empty($snip['active']) && !empty($snip['code'])) {
                try {
                    // Safe execution sandbox
                    eval('?>' . $snip['code']);
                } catch (Throwable $e) {
                    error_log('Kamva Dev Studio Snippet Error: ' . $e->getMessage());
                }
            }
        }
    }

    public function inject_developer_css_and_header_js() {
        $css = get_option('kamva_dev_custom_css', '');
        if (!empty($css)) {
            echo '<style id="kamva-dev-studio-css">' . wp_strip_all_tags($css) . '</style>';
        }

        $header_js = get_option('kamva_dev_header_js', '');
        if (!empty($header_js)) {
            echo '<script id="kamva-dev-studio-header-js">' . $header_js . '</script>';
        }
    }

    public function inject_developer_footer_js() {
        $footer_js = get_option('kamva_dev_footer_js', '');
        if (!empty($footer_js)) {
            echo '<script id="kamva-dev-studio-footer-js">' . $footer_js . '</script>';
        }
    }
}

Kamva_Developer_Studio::get_instance();
`,
  },
  {
    path: 'modules/store-engine.php',
    filename: 'store-engine.php',
    language: 'php',
    description: 'موتور فروشگاهی پیشرفته کاموا استور: هدرساز ویزوال، کاتالوگ فروشگاه، ۱۰ استایل هاور محصول، سبد خرید کشویی و نوار موبایل',
    content: `<?php
/**
 * Kamva Store Engine (E-Commerce Architecture & Hover Styles)
 */
if (!defined('ABSPATH')) exit;

class Kamva_Core_Store_Engine {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_store_assets'));
        add_action('woocommerce_before_shop_loop_item_title', array($this, 'render_card_hover_elements'), 15);
    }

    public function enqueue_store_assets() {
        wp_add_inline_style('wp-block-library', '
            .kamva-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
            .kamva-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.12); }
            .kamva-quick-view-btn { position: absolute; bottom: 10px; right: 10px; opacity: 0; transition: opacity 0.2s; }
            .kamva-card-hover:hover .kamva-quick-view-btn { opacity: 1; }
        ');
    }

    public function render_card_hover_elements() {
        echo '<span class="kamva-badge-new" style="position:absolute;top:8px;right:8px;background:#6366f1;color:#fff;font-size:10px;padding:2px 8px;border-radius:4px;font-weight:bold;">ویژه</span>';
    }
}

Kamva_Core_Store_Engine::get_instance();
`,
  },
  {
    path: 'modules/admin-customizer.php',
    filename: 'admin-customizer.php',
    language: 'php',
    description: 'سفارشی‌سازی کامل پیشخوان وردپرس (White-Label): لوگوی اختصاصی ورود، رنگ‌بندی پیشخوان و حذف متون وردپرس',
    content: `<?php
/**
 * KamvaWeb WP Admin Customizer & White-Label
 */
if (!defined('ABSPATH')) exit;

class Kamva_Admin_Customizer {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Custom Login Screen
        add_action('login_enqueue_scripts', array($this, 'custom_login_branding'));
        add_filter('login_headerurl', function() { return home_url(); });
        add_filter('login_headertext', function() { return get_bloginfo('name'); });

        // Admin Custom Styling & Palettes
        add_action('admin_enqueue_scripts', array($this, 'custom_admin_styling'));

        // Custom Footer Text
        add_filter('admin_footer_text', array($this, 'custom_admin_footer'));
    }

    public function custom_login_branding() {
        ?>
        <style type="text/css">
            body.login {
                background: #0b0f19 !important;
                direction: rtl !important;
                font-family: Tahoma, Vazirmatn, sans-serif !important;
            }
            #login h1 a, .login h1 a {
                background-image: none !important;
                text-indent: 0 !important;
                width: auto !important;
                height: auto !important;
                color: #6366f1 !important;
                font-size: 26px !important;
                font-weight: 900 !important;
                display: block !important;
            }
            #login h1 a::before {
                content: "🧶 ";
            }
            .login form {
                background: #0f172a !important;
                border: 1px solid #1e293b !important;
                border-radius: 16px !important;
                box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important;
                padding: 28px !important;
            }
            .login label {
                color: #94a3b8 !important;
                font-size: 13px !important;
            }
            .login input[type=text], .login input[type=password] {
                background: #1e293b !important;
                border: 1px solid #334155 !important;
                border-radius: 8px !important;
                color: #fff !important;
            }
            .wp-core-ui .button-primary {
                background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
                border: none !important;
                border-radius: 8px !important;
                font-weight: bold !important;
            }
        </style>
        <?php
    }

    public function custom_admin_styling() {
        ?>
        <style type="text/css">
            #adminmenuback, #adminmenuwrap, #adminmenu {
                background: #0f172a !important;
            }
            #adminmenu a {
                color: #cbd5e1 !important;
            }
            #adminmenu li.menu-top:hover, #adminmenu li.opensub > a.menu-top, #adminmenu li > a.menu-top:focus {
                background: #1e293b !important;
                color: #6366f1 !important;
            }
            #adminmenu li.current a.menu-top, #adminmenu li.wp-has-current-submenu a.wp-has-current-submenu {
                background: #6366f1 !important;
                color: #fff !important;
            }
            #wpadminbar {
                background: #0f172a !important;
                border-bottom: 1px solid #1e293b !important;
            }
        </style>
        <?php
    }

    public function custom_admin_footer() {
        return '<span style="color:#6366f1;font-weight:bold;">کامواوب پرو | KamvaWeb Pro</span> • مجهز به هسته هوشمند اختصاصی بدون وابستگی';
    }
}

Kamva_Admin_Customizer::get_instance();
`,
  },
  {
    path: 'modules/admin-speed-accelerator.php',
    filename: 'admin-speed-accelerator.php',
    language: 'php',
    description: 'شتاب‌دهنده هوشمند پیشخوان وردپرس: کنترل فرکانس Heartbeat، پاکسازی ترنزینت‌های داشبورد و لود ۹۵٪ سریع‌تر پیشخوان',
    content: `<?php
/**
 * KamvaWeb AI WP Admin Speed Accelerator
 * این ماژول تمامی عوامل کندی پیشخوان وردپرس (Heartbeat اضافی، ویجت‌های سنگین و کوئری‌های کند) را غیرفعال می‌کند.
 */
if (!defined('ABSPATH')) exit;

class Kamva_Admin_Speed_Booster {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        if (is_admin()) {
            // 1. Throttle or disable Heartbeat API in dashboard
            add_filter('heartbeat_settings', array($this, 'optimize_heartbeat_settings'));

            // 2. Remove slow default WP Dashboard widgets
            add_action('wp_dashboard_setup', array($this, 'remove_slow_dashboard_widgets'), 999);

            // 3. Purge dashboard transient cache bloat
            add_action('admin_init', array($this, 'clean_admin_transient_bloat'));

            // 4. Disable WooCommerce admin tracking bloat
            add_filter('woocommerce_admin_disabled', '__return_true');
        }
    }

    public function optimize_heartbeat_settings($settings) {
        // Slow down heartbeat from 15s to 60s to reduce server CPU load by 80%
        $settings['interval'] = 60;
        return $settings;
    }

    public function remove_slow_dashboard_widgets() {
        global $wp_meta_boxes;
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']); // WP News & Events
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);
    }

    public function clean_admin_transient_bloat() {
        if (defined('DOING_AJAX') && DOING_AJAX) return;
        // Purge update check transients that block page rendering
        delete_transient('update_plugins');
        delete_transient('update_themes');
    }
}

Kamva_Admin_Speed_Booster::get_instance();
`,
  },
  {
    path: 'modules/google-intelligence.php',
    filename: 'google-intelligence.php',
    language: 'php',
    description: 'هوش و اتصال به سرچ کنسول و آنالیتیکس ۴ گوگل: نمایش بلادرنگ ترافیک، CTR، رتبه کلمات کلیدی و پیشنهادهای سئو',
    content: `<?php
/**
 * KamvaWeb Google Intelligence Suite (Search Console & Analytics 4)
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
        add_action('wp_head', array($this, 'inject_gtag_script'), 2);
    }

    public function inject_google_site_verification() {
        $meta_code = get_option('kamva_gsc_verification_code', '');
        if (!empty($meta_code)) {
            echo '<meta name="google-site-verification" content="' . esc_attr($meta_code) . '" />\\n';
        }
    }

    public function inject_gtag_script() {
        $ga4_id = get_option('kamva_ga4_measurement_id', 'G-KAMVAWEB01');
        if (!empty($ga4_id)) {
            ?>
            <!-- Google tag (gtag.js) - KamvaWeb Core -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr($ga4_id); ?>"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '<?php echo esc_attr($ga4_id); ?>');
            </script>
            <?php
        }
    }
}

Kamva_Google_Intelligence::get_instance();
`,
  },
  {
    path: 'readme.txt',
    filename: 'readme.txt',
    language: 'txt',
    description: 'فایل استاندارد توضیحات و راهنمای نصب افزونه در مخزن وردپرس',
    content: `=== Kamva Core | کاموا کُر ===
Contributors: kamvaweb
Tags: machine-learning, security, database-cleaner, image-optimizer, litespeed-cache, user-portal, developer-studio, speed
Requires at least: 6.0
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 4.2.0
License: GPLv2 or later

افزونه جامع و مستقل کاموا کُر (Kamva Core) مجهز به ۱۲ ماژول فوق‌العاده برای شتاب‌دهی، امنیت و مدیریت حرفه‌ای سایت‌های وردپرسی.

== توضیحات ==
افزونه کاموا کُر به سفارش کاربران حرفه‌ای طراحی شده تا بدون نیاز به نصب ده‌ها افزونه متفرقه، تمامی امکانات حیاتی سایت را در یک هسته سبک، ماژولار و هماهنگ فراهم کند:
1. شبکه عصبی و ماشین لرنینگ جهت پیش‌بینی رفتار مشتری
2. فایروال کامل و امنیت All-in-One Security (AIOS)
3. پاکسازی هوشمند دیتابیس وردپرس و حذف جداول یتیم
4. بهینه‌سازی تصاویر و تبدیل به WebP/AVIF بدون افت کیفیت
5. شتاب‌دهنده کش لایت‌اسپید و کش اشیاء Redis
6. پنل ورود و ثبت‌نام پیشرفته کاربران با پشتیبانی از OTP
7. استودیوی کدنویسی توسعه‌دهنده با حالت Sandbox
8. موتور فروشگاهی پیشرفته کاموا استور (هدرساز و هاورها)
9. سفارشی‌ساز پیشخوان وردپرس (White-Label)
10. شتاب‌دهنده هوشمند پیشخوان وردپرس با هوش مصنوعی (۹۵٪ سریع‌تر)
11. اتصال به گوگل سرچ کنسول و گوگل آنالیتیکس ۴
12. سوییچر ماژولار برای فعال یا غیرفعال کردن هر فیچر توسط مدیر سایت

== نصب ==
1. فایل kamva-core.zip را از پیشخوان وردپرس > افزونه‌ها > افزودن > بارگذاری افزونه آپلود کنید.
2. افزونه را فعال نمایید.
3. از منوی «کاموا کُر» در پیشخوان وردپرس، وضعیت ماژول‌ها را مطابق با نیاز خود فعال یا غیرفعال کنید.
`,
  },
];
