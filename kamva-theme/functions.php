<?php
/**
 * KamvaWeb Pro Theme Functions & Definitions
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

define('KAMVAWEB_THEME_VERSION', '4.2.0');
define('KAMVAWEB_WP_TARGET_VERSION', '7.1');
define('KAMVAWEB_THEME_DIR', get_template_directory());
define('KAMVAWEB_THEME_URI', get_template_directory_uri());

// ۱. سیستم پایداری، ایزوله‌سازی خطا و خودترمیمی (Self-Healing)
require_once KAMVAWEB_THEME_DIR . '/inc/stability-self-healing.php';

// ۲. تم‌آپشن جامع فروشگاهی کامواوب (هدرساز، کاتالوگ فروشگاه، ۱۰ استایل هاور و سبد خرید کشویی)
require_once KAMVAWEB_THEME_DIR . '/inc/kamva-store-engine.php';

// ۳. مغز هوش مصنوعی داخلی، خزشگر و دستیار فروش
require_once KAMVAWEB_THEME_DIR . '/inc/ai-core.php';

// ۴. پکیج کامل امنیتی All-in-One Security
require_once KAMVAWEB_THEME_DIR . '/inc/security-all-in-one.php';

// ۴.۱. اسکنر امنیتی فایل‌ها و مدیا و آنتی وب‌شل
require_once KAMVAWEB_THEME_DIR . '/inc/file-media-security-scanner.php';

// ۵. بهینه‌ساز فوق‌سریع منابع و افزایش سرعت لایت‌هاوس ۹۹/۱۰۰
require_once KAMVAWEB_THEME_DIR . '/inc/speed-optimizer.php';

// ۶. موتور سئو، تولید خودکار اسکیما JSON-LD و رصد رقبا
require_once KAMVAWEB_THEME_DIR . '/inc/seo-engine.php';

// ۷. پایش و پاکسازی خودکار دیتابیس وردپرس با هسته هوش مصنوعی (جداول یتیم و ترنزینت‌ها)
require_once KAMVAWEB_THEME_DIR . '/inc/database-ai-cleaner.php';

// ۸. موتور چیدمان هوشمند ویجت‌ها، پایش هیت‌مپ و بازچینی دینامیک جایگاه‌ها با یادگیری ماشین
require_once KAMVAWEB_THEME_DIR . '/inc/class-smart-widget-engine.php';

// ۹. بریج و موتور مهاجرت هوشمند از قالب‌های قدیمی به NexusAI / کامواوب
require_once KAMVAWEB_THEME_DIR . '/inc/theme-migrator-bridge.php';

// راه‌اندازی کنترل‌پنل تم‌آپشن در پیشخوان وردپرس
if (is_admin()) {
    require_once KAMVAWEB_THEME_DIR . '/admin/theme-options.php';
}

/**
 * پیکربندی پایه‌ای قالب، ووکامرس، وردپرس ۷.۱ و اینتراکتیویتی API
 */
function kamvaweb_theme_setup() {
    load_theme_textdomain('kamvaweb', KAMVAWEB_THEME_DIR . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('interactivity-api');
    add_theme_support('block-template-parts');
}
add_action('after_setup_theme', 'kamvaweb_theme_setup');

/**
 * بارگذاری اسکریپت‌ها و استایل‌ها به صورت مینیمایز و سبک
 */
function kamvaweb_enqueue_scripts() {
    wp_enqueue_style('kamvaweb-main-style', get_stylesheet_uri(), array(), KAMVAWEB_THEME_VERSION);
    
    wp_enqueue_script(
        'kamvaweb-sales-bot',
        KAMVAWEB_THEME_URI . '/assets/js/kamva-sales-bot.js',
        array('jquery'),
        KAMVAWEB_THEME_VERSION,
        true
    );

    wp_localize_script('kamvaweb-sales-bot', 'kamvaWebData', array(
        'ajaxUrl'   => admin_url('admin-ajax.php'),
        'restUrl'   => esc_url_raw(rest_url('kamvaweb/v1/')),
        'nonce'     => wp_create_nonce('kamvaweb_security_nonce'),
        'botName'   => get_option('kamvaweb_bot_name', 'دستیار هوشمند کامواوب'),
        'welcome'   => get_option('kamvaweb_welcome_msg', 'سلام! چطور می‌تونم برای بهترین انتخاب به شما کمک کنم؟'),
        'themeUrl'  => KAMVAWEB_THEME_URI,
    ));
}
add_action('wp_enqueue_scripts', 'kamvaweb_enqueue_scripts');

/**
 * ثبت دسته‌بندی و ویجت‌های اختصاصی هوش مصنوعی در المنتور
 */
function kamvaweb_register_elementor_ai_widgets($widgets_manager) {
    if (!did_action('elementor/loaded')) return;

    require_once KAMVAWEB_THEME_DIR . '/inc/elementor-widgets/class-ai-sales-bot.php';
    require_once KAMVAWEB_THEME_DIR . '/inc/elementor-widgets/class-ai-product-advisor.php';
    require_once KAMVAWEB_THEME_DIR . '/inc/elementor-widgets/class-ai-dynamic-faq.php';

    $widgets_manager->register(new \KamvaWeb_Elementor_Sales_Bot_Widget());
    $widgets_manager->register(new \KamvaWeb_Elementor_Product_Advisor_Widget());
    $widgets_manager->register(new \KamvaWeb_Elementor_Dynamic_FAQ_Widget());
}
add_action('elementor/widgets/register', 'kamvaweb_register_elementor_ai_widgets');

function kamvaweb_add_elementor_category($elements_manager) {
    $elements_manager->add_category(
        'kamvaweb-elements',
        array(
            'title' => esc_html__('ویجت‌های هوش مصنوعی کامواوب', 'kamvaweb'),
            'icon'  => 'fa fa-brain',
        )
    );
}
add_action('elementor/elements/categories_registered', 'kamvaweb_add_elementor_category');
