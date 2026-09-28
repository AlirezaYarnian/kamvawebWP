<?php
/**
 * KamvaWeb Pro - Smart Config Generator Helper
 *
 * @package KamvaWeb
 * @version 4.2.0
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Smart_Config_Presets {
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_ajax_kamva_apply_smart_config', array($this, 'ajax_apply_smart_config'));
    }

    public function apply_preset_for_niche($niche_name, $custom_options = array()) {
        $current = get_option('kamvaweb_theme_options', array());
        $merged = array_merge($current, $custom_options);
        update_option('kamvaweb_theme_options', $merged);

        // Trigger dynamic stylesheet generation
        do_action('kamvaweb_after_theme_options_saved', $merged);

        return true;
    }

    public function ajax_apply_smart_config() {
        check_ajax_referer('kamva_smart_config_nonce', 'security');
        if (!current_user_can('manage_options')) {
            wp_send_json_error('دسترسی غیرمجاز');
        }

        $niche = isset($_POST['niche']) ? sanitize_text_field($_POST['niche']) : '';
        $options_json = isset($_POST['options']) ? wp_unslash($_POST['options']) : '';
        $options = json_decode($options_json, true);

        if (!is_array($options)) {
            wp_send_json_error('قالب داده‌های ارسالی نامعتبر است');
        }

        $this->apply_preset_for_niche($niche, $options);
        wp_send_json_success(array('message' => 'پیکربندی هوشمند با موفقیت روی قالب وردپرس اعمال شد.'));
    }
}

KamvaWeb_Smart_Config_Presets::get_instance();
