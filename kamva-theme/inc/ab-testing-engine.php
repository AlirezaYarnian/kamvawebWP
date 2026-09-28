<?php
/**
 * KamvaWeb NexusAI - Elementor A/B Content Testing Engine
 * 
 * Provides server-side & client-side split testing for Elementor landing page sections,
 * sticky cookie allocation, zero layout shift (CLS 0.0), and conversion event tracking.
 *
 * @package KamvaTheme
 * @subpackage Core\CRO
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Kamva_Elementor_AB_Engine {

    private static $instance = null;
    private $active_experiments = array();

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'init_ab_engine'));
        add_action('rest_api_init', array($this, 'register_rest_endpoints'));
        add_shortcode('kamva_ab_section', array($this, 'render_ab_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_ab_assets'));
    }

    public function init_ab_engine() {
        // Load active experiments from option
        $experiments = get_option('kamva_ab_experiments', array());
        if (!is_array($experiments)) {
            $experiments = array();
        }
        $this->active_experiments = $experiments;
    }

    public function enqueue_ab_assets() {
        if (empty($this->active_experiments)) {
            return;
        }

        wp_enqueue_script(
            'kamva-ab-tracker',
            get_template_directory_uri() . '/assets/js/kamva-ab-tracker.js',
            array('jquery'),
            KAMVA_THEME_VERSION,
            true
        );

        wp_localize_script('kamva-ab-tracker', 'kamvaABConfig', array(
            'ajaxUrl'   => admin_url('admin-ajax.php'),
            'restUrl'   => esc_url_raw(rest_url('kamva/v1/ab-track/')),
            'nonce'     => wp_create_nonce('kamva_ab_nonce'),
            'cookieExp' => 30, // 30 days sticky cookie
        ));
    }

    public function get_user_variant($experiment_id, $split_ratio = 50) {
        $cookie_name = 'kamva_ab_var_' . sanitize_key($experiment_id);

        if (isset($_COOKIE[$cookie_name]) && in_array($_COOKIE[$cookie_name], array('A', 'B'), true)) {
            return $_COOKIE[$cookie_name];
        }

        // Deterministic split based on IP or random dice roll
        $random_seed = mt_rand(1, 100);
        $assigned_variant = ($random_seed <= $split_ratio) ? 'A' : 'B';

        // Set cookie on client or header
        if (!headers_sent()) {
            setcookie($cookie_name, $assigned_variant, time() + (30 * DAY_IN_SECONDS), COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
        }

        return $assigned_variant;
    }

    public function render_ab_shortcode($atts, $content = null) {
        $atts = shortcode_atts(array(
            'id' => '',
            'default' => 'A'
        ), $atts, 'kamva_ab_section');

        $exp_id = sanitize_text_field($atts['id']);
        if (empty($exp_id) || !isset($this->active_experiments[$exp_id])) {
            return do_shortcode($content);
        }

        $experiment = $this->active_experiments[$exp_id];
        if (isset($experiment['status']) && $experiment['status'] === 'concluded' && !empty($experiment['winnerVariant'])) {
            $variant = $experiment['winnerVariant'];
        } else {
            $split = isset($experiment['trafficSplitRatio']) ? intval($experiment['trafficSplitRatio']) : 50;
            $variant = $this->get_user_variant($exp_id, $split);
        }

        $section_data = ($variant === 'B') ? $experiment['variantB'] : $experiment['variantA'];
        return $this->render_variant_markup($exp_id, $variant, $section_data);
    }

    private function render_variant_markup($exp_id, $variant_code, $data) {
        ob_start();
        ?>
        <div class="kamva-ab-container kamva-ab-variant-<?php echo esc_attr(strtolower($variant_code)); ?>"
             data-ab-experiment="<?php echo esc_attr($exp_id); ?>"
             data-ab-variant="<?php echo esc_attr($variant_code); ?>"
             data-ab-type="<?php echo esc_attr($data['visualStyle'] ?? 'gradient_dark'); ?>">
            
            <div class="kamva-ab-content-wrapper p-6 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
                <?php if (!empty($data['badgeText'])): ?>
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
                         style="background-color: <?php echo esc_attr($data['badgeColor'] ?? '#6366f1'); ?>22; color: <?php echo esc_attr($data['badgeColor'] ?? '#818cf8'); ?>; border: 1px solid <?php echo esc_attr($data['badgeColor'] ?? '#6366f1'); ?>44;">
                        <span><?php echo esc_html($data['badgeText']); ?></span>
                    </div>
                <?php endif; ?>

                <h2 class="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                    <?php echo esc_html($data['headline']); ?>
                </h2>

                <p class="text-slate-300 text-sm md:text-base mb-5 leading-relaxed">
                    <?php echo esc_html($data['subheadline']); ?>
                </p>

                <?php if (!empty($data['bulletPoints']) && is_array($data['bulletPoints'])): ?>
                    <ul class="space-y-2 mb-6">
                        <?php foreach ($data['bulletPoints'] as $bullet): ?>
                            <li class="flex items-center gap-2 text-xs md:text-sm text-slate-200">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <?php echo esc_html($bullet); ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>

                <div class="flex flex-wrap items-center gap-4 pt-2">
                    <button class="kamva-ab-cta-btn px-6 py-3 rounded-2xl font-black text-sm text-white shadow-xl transition-all cursor-pointer transform hover:scale-105"
                            style="background-color: <?php echo esc_attr($data['ctaColor'] ?? '#10b981'); ?>;"
                            data-ab-action="conversion">
                        <?php echo esc_html($data['ctaText']); ?>
                    </button>

                    <?php if (!empty($data['secondaryCtaText'])): ?>
                        <button class="kamva-ab-sec-btn px-4 py-3 rounded-2xl font-bold text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                                data-ab-action="secondary_click">
                            <?php echo esc_html($data['secondaryCtaText']); ?>
                        </button>
                    <?php endif; ?>
                </div>

                <?php if (!empty($data['socialProofText'])): ?>
                    <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span><?php echo esc_html($data['socialProofText']); ?></span>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function register_rest_endpoints() {
        register_rest_route('kamva/v1', '/ab-track/event', array(
            'methods'  => 'POST',
            'callback' => array($this, 'handle_ab_track_event'),
            'permission_callback' => '__return_true',
        ));
    }

    public function handle_ab_track_event(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $exp_id = sanitize_text_field($params['experiment_id'] ?? '');
        $variant = sanitize_text_field($params['variant'] ?? 'A');
        $event_type = sanitize_text_field($params['event_type'] ?? 'impression'); // impression, click, conversion, dwell

        if (empty($exp_id)) {
            return new WP_REST_Response(array('success' => false, 'error' => 'Missing experiment ID'), 400);
        }

        // Store event in transient or database table
        $telemetry_key = 'kamva_ab_telemetry_' . $exp_id;
        $telemetry = get_transient($telemetry_key);
        if (!is_array($telemetry)) {
            $telemetry = array(
                'A' => array('impressions' => 0, 'clicks' => 0, 'conversions' => 0),
                'B' => array('impressions' => 0, 'clicks' => 0, 'conversions' => 0),
            );
        }

        if (isset($telemetry[$variant][$event_type . 's'])) {
            $telemetry[$variant][$event_type . 's']++;
        } elseif (isset($telemetry[$variant][$event_type])) {
            $telemetry[$variant][$event_type]++;
        }

        set_transient($telemetry_key, $telemetry, 30 * DAY_IN_SECONDS);

        return new WP_REST_Response(array(
            'success' => true,
            'experiment' => $exp_id,
            'variant' => $variant,
            'event' => $event_type
        ), 200);
    }
}

// Initialize on plugin/theme load
add_action('after_setup_theme', array('Kamva_Elementor_AB_Engine', 'get_instance'));
