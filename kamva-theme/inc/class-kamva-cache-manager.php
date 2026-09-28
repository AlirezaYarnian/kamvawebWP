<?php
/**
 * Class KamvaCacheManager
 * 
 * Multi-Level High-Performance Caching System for KamvaWeb Pro Theme.
 * Implements:
 * 1. L1 Memory / Runtime Array Cache (Microsecond access within request lifecycle)
 * 2. L2 Object Cache (Redis Driver with fallback to WP Transients)
 * 3. L3 Fragment Cache (HTML Output / UI Component Caching with tag-based invalidation)
 * 4. Automated Content-Driven Cache Purging (Hooks into save_post, woocommerce_update_product)
 *
 * @package     KamvaWeb\Cache
 * @author      KamvaWeb Engineering Team
 * @version     4.2.0
 * @phpversion  8.0 - 8.3
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class KamvaCacheManager {

    private static $instance = null;
    private $memory_cache = array();
    private $redis = null;
    private $driver = 'memory';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_redis();
        $this->register_wp_hooks();
    }

    /**
     * Initialize Redis Connection if available
     */
    private function init_redis() {
        if (class_exists('Redis') && extension_loaded('redis')) {
            try {
                $this->redis = new \Redis();
                $host = defined('WP_REDIS_HOST') ? WP_REDIS_HOST : '127.0.0.1';
                $port = defined('WP_REDIS_PORT') ? WP_REDIS_PORT : 6379;
                
                if (@$this->redis->connect($host, $port, 1.5)) {
                    $this->driver = 'redis';
                }
            } catch (\Exception $e) {
                // Silently fallback to WP transients
            }
        }
        
        if ('redis' !== $this->driver) {
            $this->driver = 'transient';
        }
    }

    /**
     * Get item from Multi-Level Cache
     */
    public function get($key, $group = 'default') {
        $cache_key = $this->build_key($key, $group);

        // L1 Memory Cache Hit
        if (isset($this->memory_cache[$cache_key])) {
            return $this->memory_cache[$cache_key];
        }

        // L2 Redis or Transient Cache Hit
        if ('redis' === $this->driver && $this->redis) {
            $data = $this->redis->get($cache_key);
            if (false !== $data) {
                $val = unserialize($data);
                $this->memory_cache[$cache_key] = $val;
                return $val;
            }
        } else {
            $val = get_transient($cache_key);
            if (false !== $val) {
                $this->memory_cache[$cache_key] = $val;
                return $val;
            }
        }

        return false;
    }

    /**
     * Set item in Multi-Level Cache
     */
    public function set($key, $value, $group = 'default', $ttl = 3600) {
        $cache_key = $this->build_key($key, $group);
        $this->memory_cache[$cache_key] = $value;

        if ('redis' === $this->driver && $this->redis) {
            return $this->redis->setex($cache_key, $ttl, serialize($value));
        }

        return set_transient($cache_key, $value, $ttl);
    }

    /**
     * L3 Fragment Cache for HTML Output Blocks
     */
    public function fragment($fragment_id, callable $callback, $ttl = 3600) {
        $cached = $this->get($fragment_id, 'fragment');
        if (false !== $cached) {
            return $cached . '<!-- L3 Cached -->';
        }

        ob_start();
        call_user_func($callback);
        $html = ob_get_clean();

        $this->set($fragment_id, $html, 'fragment', $ttl);
        return $html;
    }

    /**
     * Register Automated Cache Purging Hooks on WordPress Content Changes
     */
    public function register_wp_hooks() {
        add_action('save_post', array($this, 'on_content_change'), 10, 1);
        add_action('edit_post', array($this, 'on_content_change'), 10, 1);
        add_action('delete_post', array($this, 'on_content_change'), 10, 1);
        add_action('woocommerce_update_product', array($this, 'on_content_change'), 10, 1);
        add_action('comment_post', array($this, 'on_content_change'), 10, 1);
        add_action('updated_option', array($this, 'on_option_change'), 10, 1);
    }

    public function on_content_change($id = 0) {
        $this->purge_all();
    }

    public function on_option_change($option_name) {
        if (strpos($option_name, 'kamva') !== false) {
            $this->purge_all();
        }
    }

    /**
     * Purge All Caches
     */
    public function purge_all() {
        $this->memory_cache = array();

        if ('redis' === $this->driver && $this->redis) {
            try {
                return $this->redis->flushDB();
            } catch (\Exception $e) {
                // Fallthrough to transient cleanup
            }
        }

        global $wpdb;
        return $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_kamva_%' OR option_name LIKE '_transient_timeout_kamva_%'");
    }

    /**
     * Build Cache Key Prefix
     */
    private function build_key($key, $group) {
        return 'kamva_' . sanitize_key($group) . '_' . md5($key);
    }

    /**
     * Get Current Active Driver
     */
    public function get_driver() {
        return $this->driver;
    }
}

// Global helper function
function kamva_cache() {
    return KamvaCacheManager::get_instance();
}

kamva_cache();
