<?php
/**
 * KamvaWeb Autonomous AI Database Optimizer & Orphaned Cleaner
 * ماژول پایش و پاکسازی خودکار دیتابیس وردپرس، حذف جداول رها شده از افزونه‌های قدیمی و ترنزینت‌های منقضی
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Database_AI_Cleaner {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // اجرای کرون‌جاب روزانه برای پاکسازی خودکار ترنزینت‌های منقضی و بهینه‌سازی جداول
        add_action('kamvaweb_daily_db_maintenance', array($this, 'run_automated_maintenance'));

        if (!wp_next_scheduled('kamvaweb_daily_db_maintenance')) {
            wp_schedule_event(time(), 'daily', 'kamvaweb_daily_db_maintenance');
        }

        // اندپوینت REST API اختصاصی برای پاکسازی امن از پیشخوان یا پنل کاربری
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/database-cleanup', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_rest_cleanup'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ));
    }

    public function handle_rest_cleanup($request) {
        $params = $request->get_json_params();
        $clean_transients = !empty($params['clean_transients']);
        $clean_revisions  = !empty($params['clean_revisions']);
        $clean_orphaned   = !empty($params['clean_orphaned']);

        $result = $this->run_cleanup($clean_transients, $clean_revisions, $clean_orphaned);
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'پاکسازی دیتابیس با موفقیت انجام شد.',
            'metrics' => $result,
        ));
    }

    public function run_automated_maintenance() {
        // بهینه‌سازی روزانه ترنزینت‌ها و نسخه‌های پیش‌نویس بالای ۳۰ روز
        $this->run_cleanup(true, true, false);
    }

    public function run_cleanup($clean_transients = true, $clean_revisions = true, $clean_orphaned = true) {
        global $wpdb;
        $purged_rows = 0;

        // ۱. پاکسازی ترنزینت‌های منقضی و سشن‌های بلااستفاده از جدول wp_options
        if ($clean_transients) {
            $time_now = time();
            
            // حذف ترنزینت‌های منقضی شده با مقایسه timeout
            $sql_timeout = "DELETE a, b FROM {$wpdb->options} a, {$wpdb->options} b 
                            WHERE a.option_name LIKE %s 
                            AND a.option_name NOT LIKE %s 
                            AND b.option_name = CONCAT('_transient_timeout_', SUBSTRING(a.option_name, 12)) 
                            AND b.option_value < %d";
            $res = $wpdb->query($wpdb->prepare($sql_timeout, '_transient_%', '_transient_timeout_%', $time_now));
            if ($res) $purged_rows += $res;

            // حذف سشن‌های ووکامرس قدیمی بالای ۳۰ روز
            $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_wp_session_%'");
        }

        // ۲. پاکسازی نسخه‌های پیش‌نویس (Revisions) و نوشته‌های زباله‌دان
        if ($clean_revisions) {
            $deleted_revisions = $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_type = 'revision'");
            if ($deleted_revisions) $purged_rows += $deleted_revisions;

            $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_status = 'auto-draft'");
        }

        // ۳. پاکسازی متاداده‌های یتیم (Postmeta & Termmeta)
        if ($clean_orphaned) {
            $wpdb->query("DELETE pm FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} wp ON wp.ID = pm.post_id WHERE wp.ID IS NULL");
            $wpdb->query("DELETE tm FROM {$wpdb->termmeta} tm LEFT JOIN {$wpdb->terms} wt ON wt.term_id = tm.term_id WHERE wt.term_id IS NULL");
        }

        // ۴. دیفرگمنت و دستور OPTIMIZE TABLE برای جدول‌های اصلی وردپرس
        $wpdb->query("OPTIMIZE TABLE {$wpdb->posts}, {$wpdb->postmeta}, {$wpdb->options}");

        return array(
            'purged_rows' => $purged_rows,
            'timestamp'   => current_time('mysql'),
        );
    }
}

// مقداردهی اولیه به صورت Singleton
KamvaWeb_Database_AI_Cleaner::get_instance();
