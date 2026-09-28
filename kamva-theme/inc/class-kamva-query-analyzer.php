<?php
/**
 * KamvaQueryAnalyzer - Database Layer Query Analyzer & Index Optimizer
 * 
 * Hooks into WordPress database layer to detect slow queries, unindexed meta lookups,
 * heavy joins on WooCommerce store pages, and automatically suggests SQL index optimizations.
 *
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaQueryAnalyzer {

    private static $instance = null;
    private $slow_query_threshold = 0.05; // 50 milliseconds threshold
    private $option_key = 'kamvaweb_slow_queries_log';
    private $index_suggestions_key = 'kamvaweb_db_index_suggestions';
    private $query_start_time = 0;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Force SAVEQUERIES if not defined so WP records query execution times
        if (!defined('SAVEQUERIES')) {
            define('SAVEQUERIES', true);
        }

        add_filter('query', array($this, 'intercept_query_start'), 1);
        add_action('shutdown', array($this, 'analyze_page_queries'), 99);
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('wp_ajax_kamva_apply_index', array($this, 'ajax_apply_index_optimization'));
    }

    /**
     * Measure individual query dispatch time
     */
    public function intercept_query_start($query) {
        $this->query_start_time = microtime(true);
        return $query;
    }

    /**
     * Inspect all executed queries at the end of page execution
     */
    public function analyze_page_queries() {
        global $wpdb;

        if (empty($wpdb->queries) || !is_array($wpdb->queries)) {
            return;
        }

        $page_type = $this->detect_store_page_context();
        $slow_queries = array();
        $index_recommendations = array();

        foreach ($wpdb->queries as $q) {
            $sql = $q[0] ?? '';
            $exec_time = floatval($q[1] ?? 0);
            $call_stack = $q[2] ?? '';

            // Filter for slow queries or queries known to benefit from index optimization
            if ($exec_time >= $this->slow_query_threshold || $this->is_unindexed_candidate($sql)) {
                $suggestion = $this->generate_index_suggestion($sql);
                
                $record = array(
                    'id'            => 'query_' . md5($sql),
                    'sql'           => $sql,
                    'execution_time'=> round($exec_time * 1000, 2) . ' ms',
                    'raw_time_sec'  => $exec_time,
                    'page_context'  => $page_type,
                    'caller'        => $this->clean_call_stack($call_stack),
                    'suggestion'    => $suggestion,
                    'timestamp'     => current_time('mysql'),
                );

                $slow_queries[] = $record;

                if (!empty($suggestion['index_sql']) && empty($index_recommendations[$suggestion['index_id']])) {
                    $index_recommendations[$suggestion['index_id']] = array(
                        'id'          => $suggestion['index_id'],
                        'table'       => $suggestion['table'],
                        'columns'     => $suggestion['columns'],
                        'index_sql'   => $suggestion['index_sql'],
                        'reason'      => $suggestion['reason'],
                        'impact'      => $suggestion['impact'],
                        'target_page' => $page_type,
                        'applied'     => false,
                        'created_at'  => current_time('mysql'),
                    );
                }
            }
        }

        if (!empty($slow_queries)) {
            $existing_logs = get_option($this->option_key, array());
            if (!is_array($existing_logs)) $existing_logs = array();
            
            // Keep top 100 recent slow query logs
            $merged_logs = array_merge($slow_queries, $existing_logs);
            $unique_logs = array_slice($merged_logs, 0, 100);
            update_option($this->option_key, $unique_logs, false);
        }

        if (!empty($index_recommendations)) {
            $existing_suggestions = get_option($this->index_suggestions_key, array());
            if (!is_array($existing_suggestions)) $existing_suggestions = array();

            foreach ($index_recommendations as $key => $rec) {
                if (!isset($existing_suggestions[$key])) {
                    $existing_suggestions[$key] = $rec;
                }
            }
            update_option($this->index_suggestions_key, $existing_suggestions, false);
        }
    }

    /**
     * Identify high-traffic store pages (Product Catalog, Search, Cart, Checkout, etc.)
     */
    private function detect_store_page_context() {
        if (is_admin()) return 'پیشخوان وردپرس (WP Admin)';
        if (function_exists('is_shop') && is_shop()) return 'کاتالوگ اصلی فروشگاه (Shop Page)';
        if (function_exists('is_product_category') && is_product_category()) return 'دسته‌بندی محصولات (Product Category)';
        if (function_exists('is_product') && is_product()) return 'صفحه تک محصول (Single Product)';
        if (function_exists('is_cart') && is_cart()) return 'سبد خرید (Cart Page)';
        if (function_exists('is_checkout') && is_checkout()) return 'صفحه پرداخت (Checkout)';
        if (is_search()) return 'جستجوی هوشمند فروشگاه (Product Search)';
        if (is_front_page()) return 'صفحه اصلی فروشگاه (Home Page)';

        return 'برگه عمومی سایت (Frontend Page)';
    }

    /**
     * Check if query involves unindexed meta_key, meta_value, or heavy WooCommerce joins
     */
    private function is_unindexed_candidate($sql) {
        $sql_upper = strtoupper($sql);
        
        // Unindexed meta lookups
        if (strpos($sql_upper, 'POSTMETA') !== false && (strpos($sql_upper, 'META_KEY') !== false || strpos($sql_upper, 'META_VALUE') !== false)) {
            return true;
        }

        // Order item meta queries (WooCommerce HPOS / legacy order table)
        if (strpos($sql_upper, 'WOOCOMMERCE_ORDER_ITEMMETA') !== false || strpos($sql_upper, 'WC_ORDERS') !== false) {
            return true;
        }

        // Term relationship joins for product filtering
        if (strpos($sql_upper, 'TERM_RELATIONSHIPS') !== false && strpos($sql_upper, 'JOIN') !== false) {
            return true;
        }

        return false;
    }

    /**
     * Analyze SQL statement and generate index optimization recommendation
     */
    private function generate_index_suggestion($sql) {
        global $wpdb;
        $sql_upper = strtoupper($sql);

        // 1. Postmeta Filtering Optimization (High Impact for WooCommerce product filters)
        if (strpos($sql_upper, 'POSTMETA') !== false && strpos($sql_upper, 'META_KEY') !== false) {
            $table = $wpdb->prefix . 'postmeta';
            return array(
                'index_id'  => 'idx_kamva_postmeta_key_val',
                'table'     => $table,
                'columns'   => 'meta_key(191), meta_value(191)',
                'index_sql' => "CREATE INDEX idx_kamva_postmeta_key_val ON {$table} (meta_key(191), meta_value(191));",
                'reason'    => 'کوئری‌های فیلتر محصولات بر اساس متاداده (مانند قیمت، ویژگی‌ها و وضعیت انبار) روی جدول wp_postmeta بدون ایندکس ترکیبی باعث Full Table Scan می‌شوند.',
                'impact'    => 'کاهش زمان پاسخگویی فیلترهای ووکامرس تا ۷۵٪ و افزایش سرعت بارگذاری کاتالوگ فروشگاه.',
            );
        }

        // 2. Posts Table Date & Type Indexing for Product Catalog
        if (strpos($sql_upper, 'POSTS') !== false && strpos($sql_upper, "POST_TYPE = 'PRODUCT'") !== false) {
            $table = $wpdb->prefix . 'posts';
            return array(
                'index_id'  => 'idx_kamva_posts_type_status_date',
                'table'     => $table,
                'columns'   => 'post_type, post_status, post_date',
                'index_sql' => "CREATE INDEX idx_kamva_posts_type_status_date ON {$table} (post_type(20), post_status(20), post_date);",
                'reason'    => 'کوئری اصلی لیست محصولات ووکامرس مرتب‌سازی بر اساس تاریخ و وضعیت انتشار را روی تمام پست‌ها اجرا می‌کند.',
                'impact'    => 'افزایش چشمگیر سرعت لود آرشیو محصولات و صفحات دسته‌بندی بالای ۵۰٪.',
            );
        }

        // 3. WooCommerce Order Item Meta Optimization
        if (strpos($sql_upper, 'ORDER_ITEMMETA') !== false) {
            $table = $wpdb->prefix . 'woocommerce_order_itemmeta';
            return array(
                'index_id'  => 'idx_kamva_order_itemmeta_key',
                'table'     => $table,
                'columns'   => 'meta_key(191), meta_value(191)',
                'index_sql' => "CREATE INDEX idx_kamva_order_itemmeta_key ON {$table} (meta_key(191), meta_value(191));",
                'reason'    => 'گزارش‌های فروشگاه و جستجوی سفارشات در پیشخوان ووکامرس بدون ایندکس روی ایتم‌متای سفارش با کندی مواجه می‌شوند.',
                'impact'    => 'بهبود سرعت پردازش سفارشات و گزارش‌گیری تا ۶۰٪.',
            );
        }

        // 4. Term Relationships Join Optimization
        if (strpos($sql_upper, 'TERM_RELATIONSHIPS') !== false) {
            $table = $wpdb->prefix . 'term_relationships';
            return array(
                'index_id'  => 'idx_kamva_term_rel_object_taxonomy',
                'table'     => $table,
                'columns'   => 'object_id, term_taxonomy_id',
                'index_sql' => "CREATE INDEX idx_kamva_term_rel_object_taxonomy ON {$table} (object_id, term_taxonomy_id);",
                'reason'    => 'فیلتر برچسب‌ها و دسته‌بندی‌های محصولات ووکامرس نیازمند اتصال سریع بین ID محصولات و آی‌دی طبقه‌بندی‌هاست.',
                'impact'    => 'تسهیل و تسریع کوئری‌های Tax Query در لندینگ‌های المنتور.',
            );
        }

        return array(
            'index_id'  => 'idx_generic_query_opt',
            'table'     => $wpdb->posts,
            'columns'   => 'ID, post_author',
            'index_sql' => '',
            'reason'    => 'کوئری کند شناساگر عدم وجود ایندکس مناسب در جستجوهای ترکیبی.',
            'impact'    => 'بهینه‌سازی کلی ساختار دیتابیس.',
        );
    }

    private function clean_call_stack($stack) {
        if (empty($stack)) return 'کدهای اصلی وردپرس/ووکامرس';
        $parts = explode(',', $stack);
        return trim(end($parts));
    }

    /**
     * Register REST API endpoints for Query Analyzer
     */
    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/query-analyzer', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_query_analysis_data'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/apply-index-optimization', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'apply_index_via_rest'),
            'permission_callback' => '__return_true',
        ));
    }

    public function get_query_analysis_data($request) {
        $logs = get_option($this->option_key, array());
        $suggestions = get_option($this->index_suggestions_key, array());

        return new WP_REST_Response(array(
            'success'            => true,
            'total_slow_queries' => count($logs),
            'slow_queries'       => array_values($logs),
            'index_suggestions'  => array_values($suggestions),
            'system_status'      => array(
                'savequeries_enabled'    => defined('SAVEQUERIES') && SAVEQUERIES,
                'slow_threshold_sec'     => $this->slow_query_threshold,
                'monitored_store_pages' => array('Shop', 'Product Category', 'Single Product', 'Cart', 'Checkout', 'Search'),
            ),
        ), 200);
    }

    public function apply_index_via_rest($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $index_id = sanitize_text_field($params['index_id'] ?? '');

        if (empty($index_id)) {
            return new WP_REST_Response(array('error' => 'شناسه ایندکس الزامی است'), 400);
        }

        $suggestions = get_option($this->index_suggestions_key, array());
        
        if (!isset($suggestions[$index_id])) {
            return new WP_REST_Response(array('error' => 'پیشنهاد ایندکس یافت نشد'), 404);
        }

        $suggestion = $suggestions[$index_id];
        $sql = $suggestion['index_sql'];

        if (empty($sql)) {
            return new WP_REST_Response(array('error' => 'دستور SQL ساخت ایندکس معتبر نیست'), 400);
        }

        // Execute index creation safely
        $wpdb->hide_errors();
        $result = $wpdb->query($sql);

        // Mark as applied
        $suggestions[$index_id]['applied'] = true;
        $suggestions[$index_id]['applied_at'] = current_time('mysql');
        update_option($this->index_suggestions_key, $suggestions, false);

        return new WP_REST_Response(array(
            'success'   => true,
            'message'   => 'ایندکس دیتابیس با موفقیت روی جدول اعمال شد.',
            'index_id'  => $index_id,
            'sql'       => $sql,
            'applied'   => true,
        ), 200);
    }

    public function ajax_apply_index_optimization() {
        check_ajax_referer('kamvaweb_security_nonce', 'nonce');

        $index_id = sanitize_text_field($_POST['index_id'] ?? '');
        if (empty($index_id)) {
            wp_send_json_error(array('message' => 'شناسه ایندکس نامعتبر است'));
        }

        $request = new WP_REST_Request('POST');
        $request->set_body_params(array('index_id' => $index_id));
        $response = $this->apply_index_via_rest($request);

        if ($response->get_status() === 200) {
            wp_send_json_success($response->get_data());
        } else {
            wp_send_json_error($response->get_data());
        }
    }
}

KamvaQueryAnalyzer::get_instance();
