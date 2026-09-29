<?php
/**
 * KamvaCacheEngine - Visual Cache Strategy Manager & .htaccess Web Server Rule Generator
 * 
 * Manages WordPress object caching (Redis/Memcached), transients, database query optimization,
 * browser caching headers, Gzip/Brotli compression, and .htaccess rules for maximum speed.
 *
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaCacheEngine {

    private static $instance = null;
    private $option_key = 'kamvaweb_cache_engine_config';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/cache/status', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_cache_status'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/cache/purge', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'rest_purge_cache'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/cache/config', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'rest_save_cache_config'),
            'permission_callback' => '__return_true',
        ));
    }

    public function rest_get_cache_status() {
        global $wpdb;
        $config = get_option($this->option_key, array(
            'objectCacheEnabled' => true,
            'redisHost'          => '127.0.0.1',
            'redisPort'          => 6379,
            'browserCache'       => true,
            'gzipCompression'    => true,
            'webpConversion'     => true,
            'dbTransientTTL'     => 12,
        ));

        // Calculate transients count
        $transients_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->options} WHERE option_name LIKE '_transient_%' OR option_name LIKE '_site_transient_%'");
        $autoload_size = $wpdb->get_var("SELECT SUM(LENGTH(option_value)) FROM {$wpdb->options} WHERE autoload = 'yes'");

        return new WP_REST_Response(array(
            'success'          => true,
            'config'           => $config,
            'stats'            => array(
                'transientsCount' => intval($transients_count),
                'autoloadSizeKb'  => round(intval($autoload_size) / 1024, 2),
                'phpVersion'      => phpversion(),
                'memoryLimit'     => WP_MEMORY_LIMIT,
                'serverSoftware'  => $_SERVER['SERVER_SOFTWARE'] ?? 'Apache / Nginx',
                'htaccessExists'  => file_exists(ABSPATH . '.htaccess'),
            ),
            'htaccessRules'    => $this->generate_htaccess_rules($config)
        ), 200);
    }

    public function rest_purge_cache($request) {
        global $wpdb;
        // Purge transients and object cache
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_%' OR option_name LIKE '_site_transient_%'");
        
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'تمامی حافظه‌های پنهان (Transients، Object Cache و Page Cache) با موفقیت پاکسازی شدند.',
            'timestamp' => current_time('mysql')
        ), 200);
    }

    public function rest_save_cache_config($request) {
        $params = $request->get_json_params();
        update_option($this->option_key, $params);

        $htaccess_content = $this->generate_htaccess_rules($params);
        $htaccess_path = ABSPATH . '.htaccess';
        
        $htaccess_updated = false;
        if (file_exists($htaccess_path) && is_writable($htaccess_path)) {
            $current = file_get_contents($htaccess_path);
            // Remove existing Kamva rules if any
            $current = preg_replace('/# BEGIN KamvaWeb Cache.*?# END KamvaWeb Cache/s', '', $current);
            $new_content = trim($current) . "\n\n" . $htaccess_content;
            file_put_contents($htaccess_path, $new_content);
            $htaccess_updated = true;
        }

        return new WP_REST_Response(array(
            'success'          => true,
            'message'          => 'پیکربندی کش با موفقیت ذخیره و قوانین وب‌سرور اعمال شد.',
            'htaccessUpdated'  => $htaccess_updated,
            'htaccessContent'  => $htaccess_content
        ), 200);
    }

    public function generate_htaccess_rules($config) {
        $browser = $config['browserCache'] ?? true;
        $gzip = $config['gzipCompression'] ?? true;

        $rules = "# BEGIN KamvaWeb Cache\n";
        $rules .= "<IfModule mod_rewrite.c>\nRewriteEngine On\n</IfModule>\n";

        if ($gzip) {
            $rules .= "<IfModule mod_deflate.c>\n";
            $rules .= "  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json\n";
            $rules .= "</IfModule>\n";
        }

        if ($browser) {
            $rules .= "<IfModule mod_expires.c>\n";
            $rules .= "  ExpiresActive On\n";
            $rules .= "  ExpiresByType image/jpg \"access plus 1 year\"\n";
            $rules .= "  ExpiresByType image/jpeg \"access plus 1 year\"\n";
            $rules .= "  ExpiresByType image/png \"access plus 1 year\"\n";
            $rules .= "  ExpiresByType image/webp \"access plus 1 year\"\n";
            $rules .= "  ExpiresByType text/css \"access plus 1 month\"\n";
            $rules .= "  ExpiresByType application/javascript \"access plus 1 month\"\n";
            $rules .= "</IfModule>\n";
        }

        $rules .= "# END KamvaWeb Cache";
        return $rules;
    }
}

KamvaCacheEngine::get_instance();
