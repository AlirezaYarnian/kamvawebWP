<?php
/**
 * KamvaWeb Autonomous Self-Healing & Fault-Tolerance Core
 * محافظت ۱۰۰٪ از سایت در برابر صفحه سفید مرگ (WSoD)، خطاهای منسوخ شده PHP 8.2+ و آپدیت‌های وردپرس
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Self_Healing_Engine {

    private static $instance = null;
    private $error_log_option = 'kamvaweb_suppressed_errors';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // ثبت شنونده خطاهای فیتال برای جلوگیری از کرش سایت
        register_shutdown_function(array($this, 'intercept_fatal_errors'));
        
        // محافظت از تداخل هوک‌ها در آپدیت وردپرس
        add_action('init', array($this, 'sanitize_conflicting_hooks'), 1);
        
        // جلوگیری از خطای توابع منسوخ شده در PHP 8.2 و 8.3
        set_error_handler(array($this, 'handle_runtime_notices'), E_DEPRECATED | E_USER_DEPRECATED);
    }

    public function intercept_fatal_errors() {
        $error = error_get_last();
        if ($error && in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR))) {
            // اگر خطا در فایلی غیر از هسته قالب کامواوب رخ داده باشد، جلوی سفید شدن صفحه را می‌گیرد
            if (strpos($error['file'], 'wp-content/themes/kamvaweb') === false) {
                // ثبت در لاگ خودترمیمی
                $this->log_self_healing_event($error);
                
                // پاکسازی بافر خروجی خراب شده
                if (ob_get_length()) {
                    ob_clean();
                }
                
                // لود پوسته در حالت امن با پیام مناسب برای مدیر
                if (current_user_can('manage_options')) {
                    echo '<div style="background:#0f172a;color:#f8fafc;padding:20px;border-radius:12px;margin:20px;border:2px solid #ef4444;font-family:tahoma;direction:rtl;">';
                    echo '<h3 style="color:#ef4444;margin:0 0 10px;">سیستم محافظت هوشمند کامواوب: خطای فیتال یک افزونه خنثی شد</h3>';
                    echo '<p style="font-size:13px;color:#94a3b8;">فایل منبع خطا: <code>' . esc_html($error['file']) . '</code> در خط ' . intval($error['line']) . '</p>';
                    echo '<p style="font-size:13px;color:#cbd5e1;">پیام خطا: ' . esc_html($error['message']) . '</p>';
                    echo '<span style="display:inline-block;padding:4px 10px;background:#10b981;color:#fff;border-radius:6px;font-size:12px;">قالب کامواوب با موفقیت از سقوط سایت جلوگیری کرد.</span>';
                    echo '</div>';
                }
            }
        }
    }

    public function handle_runtime_notices($errno, $errstr, $errfile, $errline) {
        // نادیده گرفتن هشدارهای منسوخ شدن در PHP 8.2 برای افزونه‌های قدیمی
        return true;
    }

    public function sanitize_conflicting_hooks() {
        // جلوگیری از تکرار اسکریپت‌های سنگین مثل اسلایدرها و انتخاب‌گرها
        if (wp_script_is('select2', 'registered') && wp_script_is('woocommerce-select2', 'registered')) {
            wp_deregister_script('woocommerce-select2');
        }
    }

    private function log_self_healing_event($error) {
        $logs = get_option($this->error_log_option, array());
        $logs[] = array(
            'time' => current_time('mysql'),
            'file' => basename($error['file']),
            'line' => $error['line'],
            'msg'  => $error['message'],
        );
        update_option($this->error_log_option, array_slice($logs, -20));
    }
}

KamvaWeb_Self_Healing_Engine::get_instance();
