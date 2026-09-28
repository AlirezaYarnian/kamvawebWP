<?php
/**
 * KamvaWeb High-Speed Engine & Asset Dequeue Optimizer
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Speed_Booster {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'dequeue_unneeded_plugin_assets'), 9999);
        add_action('init', array($this, 'clean_wordpress_core_bloat'));
        add_filter('script_loader_tag', array($this, 'add_defer_attribute'), 10, 2);
    }

    public function dequeue_unneeded_plugin_assets() {
        if (!is_page() || (is_page() && !has_shortcode(get_post()->post_content ?? '', 'contact-form-7'))) {
            wp_dequeue_style('contact-form-7');
            wp_dequeue_script('contact-form-7');
        }

        if (function_exists('is_woocommerce')) {
            if (!is_woocommerce() && !is_cart() && !is_checkout() && !is_account_page()) {
                wp_dequeue_style('woocommerce-general');
                wp_dequeue_style('woocommerce-layout');
                wp_dequeue_style('woocommerce-smallscreen');
                wp_dequeue_script('wc-cart-fragments');
            }
        }
    }

    public function clean_wordpress_core_bloat() {
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');
        remove_action('wp_head', 'wp_shortlink_wp_head');
    }

    public function add_defer_attribute($tag, $handle) {
        $defer_scripts = array('kamvaweb-sales-bot', 'swiper');
        if (in_array($handle, $defer_scripts) && strpos($tag, 'defer') === false) {
            return str_replace(' src', ' defer="defer" src', $tag);
        }
        return $tag;
    }
}

KamvaWeb_Speed_Booster::get_instance();
