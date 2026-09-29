<?php
/**
 * KamvaWeb Store & Site Architecture Engine
 * پیاده‌سازی کامل هدرساز کامواوب، کارت‌های فروشگاه، سوئیچرهای ویژگی، و خرید سریع
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Store_Engine {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // افزودن کلاس‌های هاور کارت محصول کامواوب به محصولات ووکامرس
        add_filter('post_class', array($this, 'add_kamva_product_classes'));
        
        // هوک دکمه خرید سریع (Buy Now) در صفحه محصول
        add_action('woocommerce_after_add_to_cart_button', array($this, 'render_buy_now_button'), 15);
        
        // هوک نوار چسبان خرید سریع در اسکرول (Sticky Add to Cart Bar)
        add_action('wp_footer', array($this, 'render_sticky_add_to_cart_bar'));
        
        // هوک نوار ثابت موبایل کامواوب (Mobile Bottom Navigation Bar)
        add_action('wp_footer', array($this, 'render_mobile_bottom_navbar'));
        
        // جستجوی زنده ایجکس محصولات
        add_action('wp_ajax_kamva_ajax_search', array($this, 'handle_ajax_search'));
        add_action('wp_ajax_nopriv_kamva_ajax_search', array($this, 'handle_ajax_search'));
    }

    public function add_kamva_product_classes($classes) {
        if (is_woocommerce() || is_shop() || is_product_category()) {
            $hover_style = get_option('kamva_product_hover_style', 'quick-shop');
            $classes[] = 'kamva-hover-' . esc_attr($hover_style);
            $classes[] = 'product-grid-item';
        }
        return $classes;
    }

    public function render_buy_now_button() {
        global $product;
        if (!$product) return;
        ?>
        <button type="submit" name="kamva_buy_now" value="1" class="button kamva-buy-now-btn" style="background:#10b981;color:#fff;border-radius:10px;margin-right:8px;padding:10px 20px;font-weight:bold;border:none;cursor:pointer;">
            ⚡ خرید مستقیم و پرداخت فوری
        </button>
        <?php
    }

    public function render_sticky_add_to_cart_bar() {
        if (!is_product()) return;
        global $product;
        if (!$product) return;
        ?>
        <div class="kamva-sticky-add-to-cart-bar" style="position:fixed;bottom:0;left:0;right:0;background:#0f172a;border-top:1px solid #334155;padding:12px 24px;display:flex;align-items:center;justify-content:between;z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.5);">
            <div style="display:flex;align-items:center;gap:12px;">
                <?php echo $product->get_image(array(45, 45)); ?>
                <div>
                    <h5 style="margin:0;color:#fff;font-size:14px;"><?php echo esc_html($product->get_name()); ?></h5>
                    <span style="color:#10b981;font-weight:bold;font-size:13px;"><?php echo $product->get_price_html(); ?></span>
                </div>
            </div>
            <a href="?add-to-cart=<?php echo $product->get_id(); ?>" class="button add_to_cart_button ajax_add_to_cart" style="background:#6366f1;color:#fff;padding:8px 18px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:bold;">
                افزودن سریع به سبد
            </a>
        </div>
        <?php
    }

    public function render_mobile_bottom_navbar() {
        $shop_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/');
        $cart_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/');
        $account_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : home_url('/');
        ?>
        <div class="kamva-mobile-bottom-bar" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#0f172a;border-top:1px solid #1e293b;padding:8px 0;z-index:99998;justify-content:space-around;">
            <a href="<?php echo esc_url(home_url('/')); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>🏠</span><br><?php esc_html_e('خانه', 'kamvaweb'); ?>
            </a>
            <a href="<?php echo esc_url($shop_url); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>🛍️</span><br><?php esc_html_e('فروشگاه', 'kamvaweb'); ?>
            </a>
            <a href="<?php echo esc_url($cart_url); ?>" style="text-align:center;color:#6366f1;text-decoration:none;font-size:11px;font-weight:bold;">
                <span>🛒</span><br><?php esc_html_e('سبد خرید', 'kamvaweb'); ?>
            </a>
            <a href="<?php echo esc_url($account_url); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>👤</span><br><?php esc_html_e('حساب من', 'kamvaweb'); ?>
            </a>
        </div>
        <style>
            @media (max-width: 768px) {
                .kamva-mobile-bottom-bar { display: flex !important; }
            }
        </style>
        <?php
    }

    public function handle_ajax_search() {
        check_ajax_referer('kamvaweb_security_nonce', 'nonce');
        $query = sanitize_text_field($_GET['query'] ?? '');
        
        $args = array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => 5,
            's'              => $query,
        );
        $posts = get_posts($args);
        $results = array();
        
        foreach ($posts as $p) {
            $prod = wc_get_product($p->ID);
            $results[] = array(
                'title' => $p->post_title,
                'url'   => get_permalink($p->ID),
                'price' => $prod ? $prod->get_price_html() : '',
                'image' => get_the_post_thumbnail_url($p->ID, 'thumbnail') ?: '',
            );
        }
        
        wp_send_json_success($results);
    }
}

KamvaWeb_Store_Engine::get_instance();
