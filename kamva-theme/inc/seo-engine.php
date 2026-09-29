<?php
/**
 * KamvaWeb Autonomous SEO & Schema Engine
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_SEO_Engine {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_head', array($this, 'inject_json_ld_schema'), 2);
    }

    public function inject_json_ld_schema() {
        $schema = array();
        if (is_front_page()) {
            $custom_logo_id = get_theme_mod('custom_logo');
            $logo_url = $custom_logo_id ? wp_get_attachment_image_url($custom_logo_id, 'full') : (get_template_directory_uri() . '/assets/logo.png');

            $schema = array(
                '@context' => 'https://schema.org',
                '@type'    => 'Organization',
                'name'     => get_bloginfo('name'),
                'url'      => home_url(),
                'logo'     => $logo_url,
                'potentialAction' => array(
                    '@type'       => 'SearchAction',
                    'target'      => home_url('/?s={search_term_string}'),
                    'query-input' => 'required name=search_term_string',
                ),
            );
        } elseif (is_product()) {
            global $product;
            if ($product) {
                $image_url = wp_get_attachment_url($product->get_image_id());
                if (!$image_url && function_exists('wc_placeholder_img_src')) {
                    $image_url = wc_placeholder_img_src();
                }

                $schema = array(
                    '@context' => 'https://schema.org',
                    '@type'    => 'Product',
                    'name'     => $product->get_name(),
                    'image'    => $image_url,
                    'description' => wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
                    'sku'      => $product->get_sku() ?: 'KW-' . $product->get_id(),
                    'brand'    => array(
                        '@type' => 'Brand',
                        'name'  => get_bloginfo('name'),
                    ),
                    'aggregateRating' => array(
                        '@type'       => 'AggregateRating',
                        'ratingValue' => $product->get_average_rating() ?: '5.0',
                        'reviewCount' => max(1, $product->get_review_count()),
                    ),
                    'offers'   => array(
                        '@type'         => 'Offer',
                        'price'         => $product->get_price(),
                        'priceCurrency' => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'IRR',
                        'availability'  => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                        'hasMerchantReturnPolicy' => array(
                            '@type'                  => 'MerchantReturnPolicy',
                            'applicableCountry'      => 'IR',
                            'returnPolicyCategory'   => 'https://schema.org/MerchantReturnFiniteReturnWindow',
                            'merchantReturnDays'     => 7,
                            'returnFees'             => 'https://schema.org/FreeReturn',
                        ),
                    ),
                );
            }
        }

        if (!empty($schema)) {
            echo "
" . '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "
";
        }
    }

    /**
     * اجرای زمان‌بندی هفتگی کران جاب ارسال ترندهای گوگل به مدیر سایت (Weekly Trends Cron)
     */
    public function schedule_weekly_trends_digest() {
        if (!wp_next_scheduled('kamvaweb_weekly_trends_event')) {
            wp_schedule_event(time(), 'weekly', 'kamvaweb_weekly_trends_event');
        }
    }
}

KamvaWeb_SEO_Engine::get_instance();
