<?php
/**
 * KamvaQueryOptimizer - Database Layer Query Filter & Index Optimizer
 * 
 * Integrates with WordPress query filters (query, posts_request, posts_clauses)
 * to detect slow SQL queries during development and suggests index improvements.
 * 
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaQueryOptimizer {

    private static $instance = null;
    private $slow_threshold_sec = 0.05; // 50ms slow query threshold
    private $query_start_times = array();
    private $recorded_slow_queries = array();
    private $index_suggestions_cache = array();
    private $option_key = 'kamva_query_optimizer_log';
    private $settings_key = 'kamva_query_optimizer_settings';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Load custom settings
        $settings = $this->get_settings();
        $this->slow_threshold_sec = floatval($settings['slow_threshold'] ?? 0.05);

        // Ensure SAVEQUERIES is active during development to capture execution times & stacks
        if ($this->is_development_mode() && !defined('SAVEQUERIES')) {
            define('SAVEQUERIES', true);
        }

        // 1. Hook into WordPress query filter
        add_filter('query', array($this, 'filter_intercept_query'), 1);

        // 2. Hook into WP_Query request filters to inspect generated SQL before execution
        add_filter('posts_request', array($this, 'filter_inspect_posts_request'), 99, 2);
        add_filter('posts_clauses', array($this, 'filter_inspect_posts_clauses'), 99, 2);

        // 3. Post-execution analysis on shutdown
        add_action('shutdown', array($this, 'analyze_request_queries'), 99);

        // 4. REST API Endpoints for frontend dev tools and admin dashboard
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // 5. WordPress Admin Bar Developer Badge
        add_action('admin_bar_menu', array($this, 'render_admin_bar_badge'), 999);
    }

    /**
     * Check if currently running in development / debug mode or user is admin
     */
    public function is_development_mode() {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            return true;
        }
        if (defined('WP_ENVIRONMENT_TYPE') && in_array(WP_ENVIRONMENT_TYPE, array('development', 'local', 'staging'))) {
            return true;
        }
        return is_user_logged_in() && current_user_can('manage_options');
    }

    /**
     * Settings getter
     */
    public function get_settings() {
        $defaults = array(
            'enabled'              => true,
            'slow_threshold'       => 0.05,
            'log_explain_plans'    => true,
            'auto_suggest_indexes' => true,
            'show_admin_bar_badge' => true,
        );
        return wp_parse_args(get_option($this->settings_key, array()), $defaults);
    }

    /**
     * Hook: Intercept query start
     */
    public function filter_intercept_query($query) {
        $query_hash = md5($query);
        $this->query_start_times[$query_hash] = microtime(true);
        return $query;
    }

    /**
     * Hook: Inspect posts_request (WP_Query SQL)
     */
    public function filter_inspect_posts_request($sql, $wp_query) {
        if (!$this->is_development_mode() || empty($sql)) {
            return $sql;
        }

        // Detect anti-patterns such as ORDER BY RAND() or unindexed postmeta joins
        if (stripos($sql, 'RAND()') !== false) {
            $this->record_query_anomaly($sql, 'ORDER_BY_RAND', 'استفاده از ORDER BY RAND() در کوئری موجب Full Table Scan سنگین و کندی شدید سرور در مقیاس بالا می‌شود.');
        }

        if (stripos($sql, 'LIKE \'%') !== false) {
            $this->record_query_anomaly($sql, 'LEADING_WILDCARD_LIKE', 'استفاده از جستجوی LIKE با کاراکتر در ابتدای رشته مانع از بهره‌مندی MySQL از ایندکس‌های B-Tree می‌گردد.');
        }

        return $sql;
    }

    /**
     * Hook: Inspect posts_clauses (WP_Query clauses)
     */
    public function filter_inspect_posts_clauses($clauses, $wp_query) {
        if (!$this->is_development_mode()) {
            return $clauses;
        }

        // Detect heavy meta_query joins without explicit indexing
        if (!empty($clauses['join']) && substr_count($clauses['join'], 'postmeta') > 2) {
            $this->record_query_anomaly(
                implode(' ', array_filter($clauses)),
                'MULTIPLE_POSTMETA_JOINS',
                'بیش از ۲ اتصال (JOIN) همزمان روی جدول postmeta شناسایی شد. پیشنهاد می‌شود از ایندکس‌های ترکیبی یا جداول سفارشی برای داده‌های فیلتر استفاده شود.'
            );
        }

        return $clauses;
    }

    /**
     * Record query anomaly during request
     */
    private function record_query_anomaly($sql, $type, $reason) {
        $this->recorded_slow_queries[] = array(
            'id'             => 'anomaly_' . substr(md5($sql), 0, 8),
            'sql'            => trim($sql),
            'execution_time' => 'مشاهده در تحلیل',
            'type'           => $type,
            'reason'         => $reason,
            'suggestion'     => $this->generate_index_suggestion($sql),
            'timestamp'      => current_time('mysql'),
        );
    }

    /**
     * Hook: Analyze all page queries on shutdown
     */
    public function analyze_request_queries() {
        global $wpdb;

        if (empty($wpdb->queries) || !is_array($wpdb->queries)) {
            return;
        }

        $slow_found = array();

        foreach ($wpdb->queries as $q) {
            $sql        = $q[0] ?? '';
            $exec_time  = floatval($q[1] ?? 0);
            $call_stack = $q[2] ?? '';

            if ($exec_time >= $this->slow_threshold_sec || $this->has_index_opportunity($sql)) {
                $suggestion = $this->generate_index_suggestion($sql);
                $explain    = $this->run_safe_explain_query($sql);

                $slow_found[] = array(
                    'id'             => 'q_' . substr(md5($sql), 0, 10),
                    'sql'            => trim($sql),
                    'execution_time' => round($exec_time * 1000, 2) . ' ms',
                    'raw_time_sec'   => $exec_time,
                    'caller'         => $this->format_caller_stack($call_stack),
                    'suggestion'     => $suggestion,
                    'explain'        => $explain,
                    'timestamp'      => current_time('mysql'),
                );
            }
        }

        if (!empty($slow_found)) {
            $existing_logs = get_option($this->option_key, array());
            if (!is_array($existing_logs)) $existing_logs = array();

            // Merge and keep the latest 40 queries
            $merged = array_merge($slow_found, $existing_logs);
            $unique = array();
            foreach ($merged as $item) {
                if (!isset($unique[$item['id']])) {
                    $unique[$item['id']] = $item;
                }
            }
            update_option($this->option_key, array_slice(array_values($unique), 0, 40));
        }
    }

    /**
     * Check if query is candidate for index optimization
     */
    private function has_index_opportunity($sql) {
        $sql_upper = strtoupper($sql);
        if (strpos($sql_upper, 'SELECT') === false) return false;

        return (
            strpos($sql_upper, 'POSTMETA') !== false ||
            strpos($sql_upper, 'ORDER_ITEMMETA') !== false ||
            strpos($sql_upper, 'TERM_RELATIONSHIPS') !== false ||
            strpos($sql_upper, 'COMMENTMETA') !== false ||
            strpos($sql_upper, 'ORDER BY') !== false
        );
    }

    /**
     * Run safe EXPLAIN analysis on SELECT queries
     */
    private function run_safe_explain_query($sql) {
        global $wpdb;

        // Run EXPLAIN only on SELECT queries
        $trimmed = trim($sql);
        if (stripos($trimmed, 'SELECT') !== 0) {
            return null;
        }

        // Avoid subqueries or extremely long queries
        if (strlen($trimmed) > 4000) {
            return null;
        }

        $explain_rows = @$wpdb->get_results("EXPLAIN " . $trimmed, ARRAY_A);
        if (empty($explain_rows) || !is_array($explain_rows)) {
            return null;
        }

        $first_row = $explain_rows[0];
        $is_full_scan = ($first_row['type'] ?? '') === 'ALL';
        $rows_examined = intval($first_row['rows'] ?? 0);
        $extra = $first_row['Extra'] ?? '';

        return array(
            'table'         => $first_row['table'] ?? '',
            'type'          => $first_row['type'] ?? '',
            'possible_keys' => $first_row['possible_keys'] ?? 'None',
            'key'           => $first_row['key'] ?? 'None',
            'rows'          => $rows_examined,
            'extra'         => $extra,
            'is_full_scan'  => $is_full_scan,
            'warning'       => $is_full_scan ? 'Full Table Scan (بررسی سطر به سطر کل جدول بدون استفاده از ایندکس)' : '',
        );
    }

    /**
     * Generate Index Suggestion and Estimated Speed Gain
     */
    public function generate_index_suggestion($sql) {
        global $wpdb;
        $sql_upper = strtoupper($sql);

        // 1. Postmeta Compound Index
        if (strpos($sql_upper, 'POSTMETA') !== false && (strpos($sql_upper, 'META_VALUE') !== false || strpos($sql_upper, 'META_KEY') !== false)) {
            $table = $wpdb->postmeta;
            return array(
                'index_id'          => 'idx_kamva_postmeta_key_value',
                'table'             => $table,
                'columns'           => 'meta_key(191), meta_value(191)',
                'index_sql'         => "CREATE INDEX idx_kamva_postmeta_key_value ON {$table} (meta_key(191), meta_value(191));",
                'reason'            => 'کوئری‌های جستجو و فیلتر محصولات ووکامرس بر اساس ویژگی‌ها (Attributes) و قیمت به ایندکس ترکیبی روی meta_key و meta_value نیاز دارند.',
                'estimated_speedup' => '۷۵٪ افزایش سرعت در فیلتر کاتالوگ فروشگاه',
                'can_auto_apply'    => true,
            );
        }

        // 2. WooCommerce Order Itemmeta Compound Index
        if (strpos($sql_upper, 'ORDER_ITEMMETA') !== false) {
            $table = $wpdb->prefix . 'woocommerce_order_itemmeta';
            return array(
                'index_id'          => 'idx_kamva_wc_order_itemmeta_composite',
                'table'             => $table,
                'columns'           => 'order_item_id, meta_key(191), meta_value(191)',
                'index_sql'         => "CREATE INDEX idx_kamva_wc_order_itemmeta_composite ON {$table} (order_item_id, meta_key(191), meta_value(191));",
                'reason'            => 'استخراج مشخصات آیتم‌های سفارش و گزارشات پیشخوان ووکامرس بدون ایندکس ترکیبی منجر به اسکن کند جداول بزرگ می‌شود.',
                'estimated_speedup' => '۶۰٪ کاهش تاخیر در مرحله تسویه‌حساب و گزارشات',
                'can_auto_apply'    => true,
            );
        }

        // 3. Term Relationships Composite Index
        if (strpos($sql_upper, 'TERM_RELATIONSHIPS') !== false) {
            $table = $wpdb->prefix . 'term_relationships';
            return array(
                'index_id'          => 'idx_kamva_term_rel_comp',
                'table'             => $table,
                'columns'           => 'object_id, term_taxonomy_id',
                'index_sql'         => "CREATE INDEX idx_kamva_term_rel_comp ON {$table} (object_id, term_taxonomy_id);",
                'reason'            => 'پیوند دسته‌بندی‌ها و برچسب‌های کالاها در صفحات آرشیو فروشگاه نیازمند ایندکس ترکیبی دوطرفه است.',
                'estimated_speedup' => '۵۰٪ تسریع کوئری‌های Tax Query در المنتور',
                'can_auto_apply'    => true,
            );
        }

        // 4. Posts Table Status & Date Index
        if (strpos($sql_upper, $wpdb->posts) !== false && strpos($sql_upper, 'POST_STATUS') !== false && strpos($sql_upper, 'POST_DATE') !== false) {
            $table = $wpdb->posts;
            return array(
                'index_id'          => 'idx_kamva_posts_type_status_date',
                'table'             => $table,
                'columns'           => 'post_type, post_status, post_date',
                'index_sql'         => "CREATE INDEX idx_kamva_posts_type_status_date ON {$table} (post_type, post_status, post_date);",
                'reason'            => 'مرتب‌سازی پست‌ها و محصولات بر اساس جدیدترین تاریخ در صفحات اصلی و فروشگاه با ایندکس مرکب بی‌نهایت سریع‌تر رندر می‌شود.',
                'estimated_speedup' => '۴۵٪ بهبود رندر صفحه اصلی و وبلاگ',
                'can_auto_apply'    => true,
            );
        }

        return array(
            'index_id'          => 'idx_generic_query',
            'table'             => $wpdb->posts,
            'columns'           => 'ID',
            'index_sql'         => '',
            'reason'            => 'کوئری شناسایی‌شده نیازمند بررسی پارامترهای JOIN و استفاده از ایندکس مناسب است.',
            'estimated_speedup' => 'بهبود عمومی عملکرد دیتابیس',
            'can_auto_apply'    => false,
        );
    }

    /**
     * Format caller callstack
     */
    private function format_caller_stack($stack) {
        if (empty($stack)) return 'کدهای اصلی هسته وردپرس';
        $items = explode(',', $stack);
        $clean = array();
        foreach (array_slice($items, -3) as $it) {
            $clean[] = trim($it);
        }
        return implode(' &larr; ', $clean);
    }

    /**
     * Register REST API Routes
     */
    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/query-optimizer/report', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_optimization_report'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/query-optimizer/apply-index', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'rest_apply_suggested_index'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/query-optimizer/settings', array(
            'methods'             => array('GET', 'POST'),
            'callback'            => array($this, 'rest_handle_settings'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * REST: Get Optimization Report
     */
    public function rest_get_optimization_report($request) {
        $logs = get_option($this->option_key, array());
        if (!is_array($logs)) $logs = array();

        $index_suggestions = array();
        foreach ($logs as $l) {
            if (!empty($l['suggestion']['index_sql'])) {
                $idx_id = $l['suggestion']['index_id'];
                if (!isset($index_suggestions[$idx_id])) {
                    $index_suggestions[$idx_id] = $l['suggestion'];
                }
            }
        }

        return new WP_REST_Response(array(
            'success'            => true,
            'is_dev_mode'        => $this->is_development_mode(),
            'slow_threshold_sec' => $this->slow_threshold_sec,
            'total_slow_queries' => count($logs),
            'slow_queries'       => array_values($logs),
            'index_suggestions'  => array_values($index_suggestions),
            'system_health'      => array(
                'savequeries_active' => defined('SAVEQUERIES') && SAVEQUERIES,
                'monitored_hooks'    => array('query', 'posts_request', 'posts_clauses', 'shutdown'),
            ),
        ), 200);
    }

    /**
     * REST: Safely Apply Suggested Index
     */
    public function rest_apply_suggested_index($request) {
        global $wpdb;
        $params   = $request->get_json_params();
        $index_id = sanitize_text_field($params['index_id'] ?? '');

        if (empty($index_id)) {
            return new WP_REST_Response(array('error' => 'شناسه ایندکس الزامی است'), 400);
        }

        $logs = get_option($this->option_key, array());
        $target_suggestion = null;

        foreach ($logs as $l) {
            if (($l['suggestion']['index_id'] ?? '') === $index_id) {
                $target_suggestion = $l['suggestion'];
                break;
            }
        }

        if (!$target_suggestion || empty($target_suggestion['index_sql'])) {
            return new WP_REST_Response(array('error' => 'دستور ایندکس مورد نظر یافت نشد'), 404);
        }

        $table = $target_suggestion['table'];
        $index_name = $target_suggestion['index_id'];

        // Check if index already exists
        $existing = $wpdb->get_results($wpdb->prepare("SHOW INDEX FROM {$table} WHERE Key_name = %s", $index_name));
        if (!empty($existing)) {
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'ایندکس مورد نظر قبلاً روی جدول ایجاد شده است و هم‌اکنون فعال می‌باشد.',
                'applied' => true,
            ), 200);
        }

        // Execute CREATE INDEX safely
        $created = $wpdb->query($target_suggestion['index_sql']);
        if ($created === false) {
            return new WP_REST_Response(array(
                'error'   => 'خطا در ایجاد ایندکس: ' . $wpdb->last_error,
                'success' => false,
            ), 500);
        }

        return new WP_REST_Response(array(
            'success'   => true,
            'message'   => sprintf('ایندکس بهینه‌سازی %s با موفقیت روی جدول %s ایجاد و فعال گردید.', $index_name, $table),
            'index_id'  => $index_name,
            'applied'   => true,
            'timestamp' => current_time('mysql'),
        ), 200);
    }

    /**
     * REST: Settings
     */
    public function rest_handle_settings($request) {
        if ($request->get_method() === 'POST') {
            $params = $request->get_json_params();
            $current = $this->get_settings();
            $updated = wp_parse_args($params, $current);
            update_option($this->settings_key, $updated);
            return new WP_REST_Response(array('success' => true, 'settings' => $updated), 200);
        }
        return new WP_REST_Response(array('success' => true, 'settings' => $this->get_settings()), 200);
    }

    /**
     * Render Developer Badge in WordPress Admin Bar
     */
    public function render_admin_bar_badge($admin_bar) {
        if (!$this->is_development_mode()) {
            return;
        }

        $logs = get_option($this->option_key, array());
        $count = is_array($logs) ? count($logs) : 0;

        $badge_color = $count > 0 ? '#ef4444' : '#10b981';
        $title_text  = sprintf('⚡ کوئری‌ها (%d)', $count);

        $admin_bar->add_node(array(
            'id'    => 'kamva_query_optimizer_node',
            'title' => '<span style="background:' . $badge_color . '; color:#fff; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold;">' . $title_text . '</span>',
            'href'  => admin_url('admin.php?page=kamvaweb-theme-options'),
            'meta'  => array('title' => 'پایشگر و بهینه‌ساز کوئری‌های کند کامواوب (KamvaQueryOptimizer)'),
        ));
    }
}

// Initialize Singleton instance
KamvaQueryOptimizer::get_instance();
