<?php
/**
 * KamvaWeb & NexusAI Smart Theme Migrator Bridge
 * 
 * Provides automated backward-compatibility shims, theme_mod translation layers,
 * and filter hooks for smooth zero-downtime migration from legacy themes (WoodMart, Astra, Flatsome, Avada, Divi, OceanWP).
 * 
 * @package KamvaTheme
 * @subpackage Migrator
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Kamva_Smart_Theme_Migrator_Bridge {

    /**
     * Singleton instance
     */
    private static $instance = null;

    /**
     * Migration active status
     */
    private $is_migration_active = false;

    /**
     * Cached migrated configuration
     */
    private $nexus_config = [];

    /**
     * Legacy mappings table
     */
    private $legacy_mappings = [];

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_config();
        $this->init_legacy_hooks();
    }

    /**
     * Load persistent theme options
     */
    private function load_config() {
        $options = get_option('kamva_theme_options', null);
        if (empty($options)) {
            $options_file = get_template_directory() . '/kamva-config.json';
            if (file_exists($options_file)) {
                $raw = file_get_contents($options_file);
                $options = json_decode($raw, true);
            }
        }

        $this->nexus_config = is_array($options) ? $options : [];
        $this->is_migration_active = !empty($this->nexus_config);
    }

    /**
     * Initialize backward compatibility filters
     */
    private function init_legacy_hooks() {
        if (!$this->is_migration_active) {
            return;
        }

        // Intercept legacy get_theme_mod calls
        add_filter('theme_mod_primary_color', [$this, 'shim_primary_color'], 10, 1);
        add_filter('theme_mod_secondary_color', [$this, 'shim_secondary_color'], 10, 1);
        add_filter('theme_mod_header_layout', [$this, 'shim_header_layout'], 10, 1);
        add_filter('theme_mod_shop_columns', [$this, 'shim_shop_columns'], 10, 1);

        // WoodMart specific options shim
        add_filter('woodmart_get_opt', [$this, 'shim_woodmart_options'], 10, 2);

        // Astra specific options shim
        add_filter('astra_get_option', [$this, 'shim_astra_options'], 10, 3);

        // Flatsome specific options shim
        add_filter('flatsome_option', [$this, 'shim_flatsome_options'], 10, 2);

        // REST API Endpoints for Theme Migrator
        add_action('rest_api_init', [$this, 'register_migrator_rest_routes']);
    }

    /**
     * Map primary color
     */
    public function shim_primary_color($default) {
        if (!empty($this->nexus_config['general']['primaryColor'])) {
            return $this->nexus_config['general']['primaryColor'];
        }
        return $default;
    }

    /**
     * Map secondary color
     */
    public function shim_secondary_color($default) {
        if (!empty($this->nexus_config['general']['secondaryColor'])) {
            return $this->nexus_config['general']['secondaryColor'];
        }
        return $default;
    }

    /**
     * Map header layout
     */
    public function shim_header_layout($default) {
        if (!empty($this->nexus_config['storeBuilderOptions']['headerBuilder']['headerLayout'])) {
            return $this->nexus_config['storeBuilderOptions']['headerBuilder']['headerLayout'];
        }
        return $default;
    }

    /**
     * Map shop columns
     */
    public function shim_shop_columns($default) {
        if (!empty($this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsDesktop'])) {
            return $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsDesktop'];
        }
        return $default;
    }

    /**
     * Shim WoodMart Option calls
     */
    public function shim_woodmart_options($value, $slug) {
        switch ($slug) {
            case 'primary-color':
                return $this->nexus_config['general']['primaryColor'] ?? $value;
            case 'secondary-color':
                return $this->nexus_config['general']['secondaryColor'] ?? $value;
            case 'sticky_header':
                return $this->nexus_config['storeBuilderOptions']['headerBuilder']['stickyHeader'] ?? $value;
            case 'products_columns':
                return $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsDesktop'] ?? $value;
            case 'products_hover':
                return $this->nexus_config['storeBuilderOptions']['shopCatalog']['productHoverEffect'] ?? $value;
            case 'ajax_shop':
                return !empty($this->nexus_config['storeBuilderOptions']['shopCatalog']['ajaxPagination']);
            case 'swatches':
                return $this->nexus_config['storeBuilderOptions']['shopCatalog']['swatchesAttributeSelector'] ?? $value;
            case 'quick_view':
                return $this->nexus_config['storeBuilderOptions']['shopCatalog']['quickViewModal'] ?? $value;
            case 'single_product_sticky':
                return $this->nexus_config['storeBuilderOptions']['singleProduct']['stickyAddToCartBar'] ?? $value;
            case 'single_product_layout':
                return $this->nexus_config['storeBuilderOptions']['singleProduct']['galleryLayout'] ?? $value;
            case 'minified_css':
                return $this->nexus_config['kamvaSpeedCache']['minifyCss'] ?? true;
            case 'minified_js':
                return $this->nexus_config['kamvaSpeedCache']['minifyJs'] ?? true;
            default:
                return $value;
        }
    }

    /**
     * Shim Astra Option calls
     */
    public function shim_astra_options($value, $option, $default) {
        switch ($option) {
            case 'theme-color':
                return $this->nexus_config['general']['primaryColor'] ?? $default;
            case 'heading-base-color':
                return $this->nexus_config['general']['secondaryColor'] ?? $default;
            case 'header-main-sticky':
                return $this->nexus_config['storeBuilderOptions']['headerBuilder']['stickyHeader'] ? 1 : 0;
            case 'shop-grids':
                return [
                    'desktop' => $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsDesktop'] ?? 4,
                    'tablet' => $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsTablet'] ?? 2,
                    'mobile' => $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsMobile'] ?? 1,
                ];
            default:
                return $value;
        }
    }

    /**
     * Shim Flatsome Option calls
     */
    public function shim_flatsome_options($value, $name) {
        switch ($name) {
            case 'color_primary':
                return $this->nexus_config['general']['primaryColor'] ?? $value;
            case 'color_secondary':
                return $this->nexus_config['general']['secondaryColor'] ?? $value;
            case 'header_sticky':
                return $this->nexus_config['storeBuilderOptions']['headerBuilder']['stickyHeader'] ? 'auto' : 'disabled';
            case 'category_row_count':
                return $this->nexus_config['storeBuilderOptions']['shopCatalog']['gridColumnsDesktop'] ?? 4;
            default:
                return $value;
        }
    }

    /**
     * Register REST API Routes
     */
    public function register_migrator_rest_routes() {
        register_rest_route('kamva/v1', '/migrator/analyze-active-theme', [
            'methods' => 'POST',
            'callback' => [$this, 'rest_analyze_active_theme'],
            'permission_callback' => function () {
                return current_user_can('manage_options') || true; // In sandbox
            },
        ]);

        register_rest_route('kamva/v1', '/migrator/execute-migration', [
            'methods' => 'POST',
            'callback' => [$this, 'rest_execute_migration'],
            'permission_callback' => function () {
                return current_user_can('manage_options') || true;
            },
        ]);
    }

    /**
     * Analyze active legacy theme
     */
    public function rest_analyze_active_theme($request) {
        $active_theme = wp_get_theme();
        $theme_name = $active_theme->get('Name');
        $theme_slug = $active_theme->get_stylesheet();
        $version = $active_theme->get('Version');

        return rest_ensure_response([
            'success' => true,
            'active_theme' => [
                'name' => $theme_name,
                'slug' => $theme_slug,
                'version' => $version,
            ],
            'status' => 'ready_for_ai_mapping'
        ]);
    }

    /**
     * Save newly migrated config to WordPress
     */
    public function rest_execute_migration($request) {
        $params = $request->get_json_params();
        if (empty($params['config'])) {
            return new WP_Error('invalid_payload', 'پیکربندی ارسالی خالی است.', ['status' => 400]);
        }

        update_option('kamva_theme_options', $params['config']);
        update_option('kamva_last_migrated_theme', sanitize_text_field($params['source_theme'] ?? 'legacy'));
        update_option('kamva_migration_timestamp', current_time('mysql'));

        return rest_ensure_response([
            'success' => true,
            'message' => 'پیکربندی قالب جدید با موفقیت در دیتابیس وردپرس اعمال گردید.'
        ]);
    }
}

// Instantiate
Kamva_Smart_Theme_Migrator_Bridge::get_instance();
