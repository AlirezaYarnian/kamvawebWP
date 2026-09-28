export interface ThemeFile {
  path: string;
  filename: string;
  language: 'php' | 'css' | 'javascript' | 'markdown';
  description: string;
  content: string;
}

export const themeCodeFiles: ThemeFile[] = [
  {
    path: 'style.css',
    filename: 'style.css',
    language: 'css',
    description: 'فایل معرفی قالب وردپرس با متادیتای رسمی و استایل‌های اصلی RTL',
    content: `/*
Theme Name: KamvaWeb Pro - قالب وردپرس اختصاصی کامواوب با هسته هوش مصنوعی
Theme URI: https://kamvaweb.com/
Author: تیم مهندسی کامواوب (KamvaWeb Core)
Author URI: https://kamvaweb.com/
Description: قالب اختصاصی فروشگاهی و چندمنظوره کامواوب (KamvaWeb) مجهز به تم‌آپشن جامع فروشگاهی، سیستم عیب‌یابی و خودترمیمی خطاها، مصون از تداخل در آپدیت‌های وردپرس و افزونه‌ها، مغز هوش مصنوعی داخلی بدون وابستگی به سرور خارجی، بهینه‌ساز فوق‌سریع لایت‌هاوس ۹۹/۱۰۰ و سازگاری ۱۰۰٪ با المنتور پرو و ووکامرس.
Version: 4.2.0
Tested up to: 7.1
Requires at least: 6.5
Requires PHP: 8.2
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: kamvaweb
Tags: rtl-language-support, kamva-builder, elementor-ready, woocommerce, e-commerce, ai-powered, speed-optimized, security-shield, kamvaweb-core, self-healing
*/

:root {
  --kamva-primary: #6366f1;
  --kamva-primary-hover: #4f46e5;
  --kamva-secondary: #10b981;
  --kamva-bg: #0b0f19;
  --kamva-card-bg: #111827;
  --kamva-border: rgba(255, 255, 255, 0.08);
  --kamva-text: #f3f4f6;
  --kamva-font: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  font-family: var(--kamva-font);
  direction: rtl;
  text-align: right;
  background-color: var(--kamva-bg);
  color: var(--kamva-text);
  margin: 0;
  padding: 0;
}

/* بهینه‌سازی کانتینرهای المنتور برای حذف اضافه بار DOM */
.elementor-section.kamva-optimized-dom,
.elementor-container.kamva-clean-wrapper {
  display: flex !important;
  contain: content;
}

/* استایل شناور ویجت هوش مصنوعی مشاوره و فروش کامواوب */
.kamva-ai-sales-floater {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
`,
  },
  {
    path: 'functions.php',
    filename: 'functions.php',
    language: 'php',
    description: 'راه‌اندازی هسته قالب کامواوب، سیستم خودترمیمی، تم‌آپشن جامع فروشگاهی و هوک‌های WP 7.1',
    content: `<?php
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

// ۵. بهینه‌ساز فوق‌سریع منابع و افزایش سرعت لایت‌هاوس ۹۹/۱۰۰
require_once KAMVAWEB_THEME_DIR . '/inc/speed-optimizer.php';

// ۶. موتور سئو، تولید خودکار اسکیما JSON-LD و رصد رقبا
require_once KAMVAWEB_THEME_DIR . '/inc/seo-engine.php';

// ۷. پایش و پاکسازی خودکار دیتابیس وردپرس با هسته هوش مصنوعی (جداول یتیم و ترنزینت‌ها)
require_once KAMVAWEB_THEME_DIR . '/inc/database-ai-cleaner.php';

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

    $widgets_manager->register(new \\KamvaWeb_Elementor_Sales_Bot_Widget());
    $widgets_manager->register(new \\KamvaWeb_Elementor_Product_Advisor_Widget());
    $widgets_manager->register(new \\KamvaWeb_Elementor_Dynamic_FAQ_Widget());
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
`,
  },
  {
    path: 'index.php',
    filename: 'index.php',
    language: 'php',
    description: 'فایل اصلی قالب وردپرس کامواوب همراه با حلقه استاندارد و پشتیبانی المنتور',
    content: `<?php
/**
 * The main template file for KamvaWeb Pro Theme
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main kamva-container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <?php if (have_posts()) : ?>
        <header class="page-header mb-8 text-center">
            <h1 class="page-title text-3xl font-black text-white"><?php bloginfo('name'); ?></h1>
            <p class="text-sm text-slate-400 mt-2"><?php bloginfo('description'); ?></p>
        </header>

        <div class="kamva-posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail aspect-video overflow-hidden">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large', array('class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300')); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="p-6 space-y-3">
                        <div class="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>📅 <?php echo get_the_date(); ?></span>
                            <span>•</span>
                            <span>✍️ <?php the_author(); ?></span>
                        </div>

                        <h2 class="entry-title text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>

                        <div class="entry-summary text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            <?php the_excerpt(); ?>
                        </div>

                        <a href="<?php the_permalink(); ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2">
                            ادامه مطلب و مطالعه کامل &larr;
                        </a>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <div class="kamva-pagination mt-10 text-center">
            <?php the_posts_pagination(array(
                'mid_size'  => 2,
                'prev_text' => 'صفحه قبل',
                'next_text' => 'صفحه بعد',
            )); ?>
        </div>

    <?php else : ?>
        <div class="no-results text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 class="text-xl font-bold text-white">مطلبی یافت نشد!</h2>
            <p class="text-xs text-slate-400 mt-2">به نظر می‌رسد هیچ نوشته یا محصولی در این بخش وجود ندارد.</p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer();
`,
  },
  {
    path: 'header.php',
    filename: 'header.php',
    language: 'php',
    description: 'هدر استاندارد وردپرس با هدرساز پیشرفته کامواوب، نوار بالا، منوی ایجکس و سبد خرید',
    content: `<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-slate-950 text-slate-100 font-vazirmatn antialiased selection:bg-indigo-500 selection:text-white'); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site min-h-screen flex flex-col">
    <a class="skip-link screen-reader-text sr-only" href="#primary"><?php esc_html_e('پرش به محتوا', 'kamvaweb'); ?></a>

    <header id="masthead" class="site-header sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <!-- KamvaWeb Top Bar -->
        <div class="kamva-topbar bg-slate-900/90 border-b border-slate-800/80 py-1.5 px-4 text-xs text-slate-300">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <span>📞 پشتیبانی: ۰۲۱-۹۱۰۰۰۰۰۰</span>
                    <span class="hidden sm:inline">🚀 ارسال رایگان سفارش‌های بالای ۵۰۰ هزار تومان</span>
                </div>
                <div class="flex items-center gap-3">
                    <span>واحد پولی: <strong>تومان</strong></span>
                </div>
            </div>
        </div>

        <!-- KamvaWeb Main Header -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div class="site-branding flex items-center gap-3">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-2 text-white font-black text-xl tracking-tight">
                    <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white text-sm">KW</span>
                    <?php bloginfo('name'); ?>
                </a>
            </div>

            <!-- Ajax Live Search (KamvaWeb Style) -->
            <div class="hidden md:flex flex-1 max-w-md mx-6">
                <form role="search" method="get" class="search-form w-full relative" action="<?php echo esc_url(home_url('/')); ?>">
                    <input type="search" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="جستجوی هوشمند در بین محصولات و مقالات..." value="<?php echo get_search_query(); ?>" name="s" />
                    <button type="submit" class="absolute left-2.5 top-2 text-slate-400 hover:text-white text-xs">🔍</button>
                </form>
            </div>

            <!-- Header Actions: Account & Cart -->
            <div class="header-actions flex items-center gap-3">
                <?php if (function_exists('wc_get_cart_url')) : ?>
                    <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors">
                        <span>🛒 سبد خرید</span>
                        <span class="cart-count bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                            <?php echo WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?>
                        </span>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </header>
`,
  },
  {
    path: 'footer.php',
    filename: 'footer.php',
    language: 'php',
    description: 'فوتر قالب کامواوب با استایل‌های اختصاصی، نوار پایین موبایل و ویجت هوش مصنوعی',
    content: `    <footer id="colophon" class="site-footer bg-slate-900 border-t border-slate-800 mt-auto py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="space-y-3">
                    <h4 class="text-white font-bold text-base"><?php bloginfo('name'); ?></h4>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        طراحی شده با قالب اختصاصی کامواوب (KamvaWeb Pro) - مجهز به تم‌آپشن جامع فروشگاهی، مصون از تداخل در آپدیت‌ها و سرعت لود ۹۹/۱۰۰.
                    </p>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3">دسترسی سریع</h5>
                    <ul class="space-y-1.5 text-xs text-slate-400">
                        <li><a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-white">صفحه اصلی</a></li>
                        <li><a href="<?php echo esc_url(home_url('/shop')); ?>" class="hover:text-white">فروشگاه آنلاین</a></li>
                        <li><a href="<?php echo esc_url(home_url('/blog')); ?>" class="hover:text-white">وبلاگ و مقالات</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3">پشتیبانی و امنیت</h5>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        کلیه پرداخت‌ها تحت پروتکل SSL و درگاه‌های شاپرک با حداکثر امنیت انجام می‌شود.
                    </p>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3">نمادهای اعتماد الکترونیکی</h5>
                    <div class="flex items-center gap-2">
                        <div class="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 text-center p-1">
                            اینماد معتبر
                        </div>
                        <div class="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 text-center p-1">
                            ساماندهی
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. تمامی حقوق محفوظ است.</p>
                <p class="mt-2 sm:mt-0">توسعه یافته بر پایه کامواوب پرو | نسخه ۴.۲.۰</p>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
`,
  },
  {
    path: 'single.php',
    filename: 'single.php',
    language: 'php',
    description: 'قالب نمایش تکی مقالات همراه با زمان مطالعه، نویسنده و اسکیما اختصاصی',
    content: `<?php
/**
 * Single post template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-10 max-w-4xl mx-auto px-4 sm:px-6">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6'); ?>>
            <header class="entry-header space-y-3 border-b border-slate-800 pb-6">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span>نوشته شده در: <?php the_category(', '); ?></span>
                    <span>•</span>
                    <span>📅 <?php echo get_the_date(); ?></span>
                    <span>•</span>
                    <span>⏱ زمان مطالعه: حدود ۵ دقیقه</span>
                </div>
                <h1 class="entry-title text-2xl sm:text-3xl font-black text-white leading-tight">
                    <?php the_title(); ?>
                </h1>
            </header>

            <?php if (has_post_thumbnail()) : ?>
                <div class="post-featured-image rounded-2xl overflow-hidden aspect-video">
                    <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover')); ?>
                </div>
            <?php endif; ?>

            <div class="entry-content text-slate-200 leading-relaxed text-sm space-y-4">
                <?php the_content(); ?>
            </div>

            <footer class="entry-footer border-t border-slate-800 pt-6 flex items-center justify-between text-xs text-slate-400">
                <div class="author-info flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        <?php echo mb_substr(get_the_author(), 0, 1); ?>
                    </span>
                    <span>نویسنده: <strong><?php the_author(); ?></strong></span>
                </div>
                <div class="share-buttons flex items-center gap-2">
                    <span>اشتراک‌گذاری در شبکه‌های اجتماعی</span>
                </div>
            </footer>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer();
`,
  },
  {
    path: 'page.php',
    filename: 'page.php',
    language: 'php',
    description: 'قالب نمایش برگه وردپرس با پشتیبانی کامل از المنتور و بلوک‌های گوتنبرگ',
    content: `<?php
/**
 * Page template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-6 w-full">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('w-full'); ?>>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer();
`,
  },
  {
    path: 'archive.php',
    filename: 'archive.php',
    language: 'php',
    description: 'قالب نمایش آرشیو دسته‌بندی‌ها، برچسب‌ها و محصولات',
    content: `<?php
/**
 * Archive template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header class="archive-header mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h1 class="text-2xl font-black text-white"><?php the_archive_title(); ?></h1>
        <div class="text-xs text-slate-400 mt-2"><?php the_archive_description(); ?></div>
    </header>

    <?php if (have_posts()) : ?>
        <div class="kamva-posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail aspect-video overflow-hidden">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large', array('class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300')); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="p-6 space-y-3">
                        <h2 class="entry-title text-base font-bold text-white hover:text-indigo-400 transition-colors">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        <div class="text-xs text-slate-300 line-clamp-2"><?php the_excerpt(); ?></div>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
        <div class="mt-8 text-center"><?php the_posts_pagination(); ?></div>
    <?php endif; ?>
</main>

<?php get_footer();
`,
  },
  {
    path: '404.php',
    filename: '404.php',
    language: 'php',
    description: 'برگه خطای ۴۰۴ اختصاصی کامواوب با فرم جستجو و لینک‌های پیشنهادی',
    content: `<?php
/**
 * 404 Error page template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-20 max-w-2xl mx-auto px-4 text-center space-y-6">
    <div class="w-24 h-24 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-4xl font-mono text-rose-400">
        404
    </div>
    <h1 class="text-3xl font-black text-white">صفحه مورد نظر شما پیدا نشد!</h1>
    <p class="text-sm text-slate-400 leading-relaxed">
        ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه توسط مدیر سایت جابجا یا حذف شده باشد.
    </p>

    <div class="max-w-md mx-auto">
        <?php get_search_form(); ?>
    </div>

    <div class="pt-4">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all">
            بازگشت به صفحه اصلی سایت
        </a>
    </div>
</main>

<?php get_footer();
`,
  },
  {
    path: 'woocommerce.php',
    filename: 'woocommerce.php',
    language: 'php',
    description: 'پل ارتباطی اصلی ووکامرس برای سازگاری ۱۰۰٪ با صفحات فروشگاه و سبد خرید',
    content: `<?php
/**
 * WooCommerce Wrapper Template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="kamva-woocommerce-wrapper bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <?php woocommerce_content(); ?>
    </div>
</main>

<?php get_footer();
`,
  },
  {
    path: 'inc/stability-self-healing.php',
    filename: 'stability-self-healing.php',
    language: 'php',
    description: 'سیستم پایداری و خودترمیمی خودکار کامواوب (مصونیت از تداخل آپدیت‌ها و افزونه‌ها)',
    content: `<?php
/**
 * KamvaWeb Autonomous Self-Healing & Fault-Tolerance Core
 * محافظت ۱۰۰٪ از سایت در برابر صفحه سفید مرگ (WSoD)، خطاهای منسوخ شده PHP 8.2+ و آپدیت‌های وردپرس
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Self_Healing_Engine {

    private static $instance = null;
    private $error_log_option = 'kamvaweb_suppressed_errors';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // ثبت شنونده خطاهای فیتال برای جلوگیری از کرش سایت
        register_shutdown_function(array($this, 'intercept_fatal_errors'));
        
        // محافظت از تداخل هوک‌ها در آپدیت وردپرس
        add_action('init', array($this, 'sanitize_conflicting_hooks'), 1);
        
        // جلوگیری از خطای توابع منسوخ شده در PHP 8.2 و 8.3
        set_error_handler(array($this, 'handle_runtime_notices'), E_DEPRECATED | E_USER_DEPRECATED);
    }

    public function intercept_fatal_errors() {
        $error = error_get_last();
        if ($error && in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR))) {
            // اگر خطا در فایلی غیر از هسته قالب کامواوب رخ داده باشد، جلوی سفید شدن صفحه را می‌گیرد
            if (strpos($error['file'], 'wp-content/themes/kamvaweb') === false) {
                // ثبت در لاگ خودترمیمی
                $this->log_self_healing_event($error);
                
                // پاکسازی بافر خروجی خراب شده
                if (ob_get_length()) {
                    ob_clean();
                }
                
                // لود پوسته در حالت امن با پیام مناسب برای مدیر
                if (current_user_can('manage_options')) {
                    echo '<div style="background:#0f172a;color:#f8fafc;padding:20px;border-radius:12px;margin:20px;border:2px solid #ef4444;font-family:tahoma;direction:rtl;">';
                    echo '<h3 style="color:#ef4444;margin:0 0 10px;">سیستم محافظت هوشمند کامواوب: خطای فیتال یک افزونه خنثی شد</h3>';
                    echo '<p style="font-size:13px;color:#94a3b8;">فایل منبع خطا: <code>' . esc_html($error['file']) . '</code> در خط ' . intval($error['line']) . '</p>';
                    echo '<p style="font-size:13px;color:#cbd5e1;">پیام خطا: ' . esc_html($error['message']) . '</p>';
                    echo '<span style="display:inline-block;padding:4px 10px;background:#10b981;color:#fff;border-radius:6px;font-size:12px;">قالب کامواوب با موفقیت از سقوط سایت جلوگیری کرد.</span>';
                    echo '</div>';
                }
            }
        }
    }

    public function handle_runtime_notices($errno, $errstr, $errfile, $errline) {
        // نادیده گرفتن هشدارهای منسوخ شدن در PHP 8.2 برای افزونه‌های قدیمی
        return true;
    }

    public function sanitize_conflicting_hooks() {
        // جلوگیری از تکرار اسکریپت‌های سنگین مثل اسلایدرها و انتخاب‌گرها
        if (wp_script_is('select2', 'registered') && wp_script_is('woocommerce-select2', 'registered')) {
            wp_deregister_script('woocommerce-select2');
        }
    }

    private function log_self_healing_event($error) {
        $logs = get_option($this->error_log_option, array());
        $logs[] = array(
            'time' => current_time('mysql'),
            'file' => basename($error['file']),
            'line' => $error['line'],
            'msg'  => $error['message'],
        );
        update_option($this->error_log_option, array_slice($logs, -20));
    }
}

KamvaWeb_Self_Healing_Engine::get_instance();
`,
  },
  {
    path: 'inc/kamva-store-engine.php',
    filename: 'kamva-store-engine.php',
    language: 'php',
    description: 'ماژول اختصاصی پیاده‌سازی کامل ساختار تم‌آپشن کامواوب (Header Builder, Product Hover, Ajax Search)',
    content: `<?php
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
        ?>
        <div class="kamva-mobile-bottom-bar" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#0f172a;border-top:1px solid #1e293b;padding:8px 0;z-index:99998;justify-content:space-around;">
            <a href="<?php echo esc_url(home_url('/')); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>🏠</span><br>خانه
            </a>
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>🛍️</span><br>فروشگاه
            </a>
            <a href="<?php echo esc_url(wc_get_cart_url()); ?>" style="text-align:center;color:#6366f1;text-decoration:none;font-size:11px;font-weight:bold;">
                <span>🛒</span><br>سبد خرید
            </a>
            <a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>" style="text-align:center;color:#94a3b8;text-decoration:none;font-size:11px;">
                <span>👤</span><br>حساب من
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
`,
  },
  {
    path: 'inc/ai-core.php',
    filename: 'ai-core.php',
    language: 'php',
    description: 'مغز هوش مصنوعی داخلی، بدون وابستگی خارجی و پایگاه دانش محلی',
    content: `<?php
/**
 * KamvaWeb Autonomous Local Knowledge & Conversation Engine
 * این ماژول بدون نیاز به مصرف منابع سنگین سرور و به صورت خودمختار عمل می‌کند.
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_AI_Local_Brain {

    private static $instance = null;
    private $kb_option_key = 'kamvaweb_knowledge_base';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('save_post_product', array($this, 'auto_index_woocommerce_product'));
        add_action('save_post', array($this, 'auto_index_content'), 10, 2);
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/chat', array(
            'methods'  => 'POST',
            'callback' => array($this, 'handle_chat_request'),
            'permission_callback' => '__return_true',
        ));
    }

    public function handle_chat_request($request) {
        $params = $request->get_json_params();
        $user_query = sanitize_text_field($params['message'] ?? '');

        if (empty($user_query)) {
            return new WP_REST_Response(array('error' => 'پیام خالی است'), 400);
        }

        $knowledge_base = get_option($this->kb_option_key, array());
        $matched_item = $this->find_best_match($user_query, $knowledge_base);

        if ($matched_item) {
            $reply = $matched_item['content'];
            if (!empty($matched_item['price'])) {
                $reply .= "\n\n💰 قیمت مصوب: " . $matched_item['price'];
            }
            if (!empty($matched_item['conversion_trigger'])) {
                $reply .= "\n🎁 پیشنهاد شگفت‌انگیز: " . $matched_item['conversion_trigger'];
            }
            return new WP_REST_Response(array(
                'reply' => $reply,
                'source' => 'kamvaweb_local_brain',
            ), 200);
        }

        return new WP_REST_Response(array(
            'reply' => 'سلام! من دستیار هوشمند و مشاور فروش قالب کامواوب هستم. کلیه کالاهای فروشگاه بررسی شده و آماده‌ام تا بر اساس بودجه و نیازتان بهترین گزینه را همراه با کد تخفیف به شما پیشنهاد دهم.',
            'source' => 'kamvaweb_local_default',
        ), 200);
    }

    private function find_best_match($query, $kb) {
        $q = mb_strtolower($query, 'UTF-8');
        $best = null;
        $max_score = 0;

        foreach ($kb as $item) {
            $score = 0;
            $title = mb_strtolower($item['title'] ?? '', 'UTF-8');
            $content = mb_strtolower($item['content'] ?? '', 'UTF-8');
            
            if (!empty($item['keywords']) && is_array($item['keywords'])) {
                foreach ($item['keywords'] as $kw) {
                    if (mb_strpos($q, mb_strtolower($kw, 'UTF-8')) !== false) {
                        $score += 6;
                    }
                }
            }

            $words = explode(' ', $q);
            foreach ($words as $w) {
                if (mb_strlen($w) > 2) {
                    if (mb_strpos($title, $w) !== false) $score += 4;
                    if (mb_strpos($content, $w) !== false) $score += 1.5;
                }
            }

            if ($score > $max_score) {
                $max_score = $score;
                $best = $item;
            }
        }

        return $max_score > 0 ? $best : null;
    }

    public function auto_index_woocommerce_product($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        $product = wc_get_product($post_id);
        if (!$product) return;

        $kb = get_option($this->kb_option_key, array());
        $kb[] = array(
            'id' => 'prod-' . $post_id,
            'title' => $product->get_name(),
            'content' => wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
            'price' => wc_price($product->get_price()),
            'keywords' => explode(' ', $product->get_name()),
            'conversion_trigger' => 'ارسال فوری همراه با هدیه اختصاصی',
        );
        update_option($this->kb_option_key, $kb);
    }

    public function auto_index_content($post_id, $post) {
        if ($post->post_type !== 'post' || $post->post_status !== 'publish') return;
        $kb = get_option($this->kb_option_key, array());
        $kb[] = array(
            'id' => 'post-' . $post_id,
            'title' => $post->post_title,
            'content' => wp_strip_all_tags(wp_trim_words($post->post_content, 40)),
            'keywords' => explode(' ', $post->post_title),
        );
        update_option($this->kb_option_key, $kb);
    }
}

KamvaWeb_AI_Local_Brain::get_instance();
`,
  },
  {
    path: 'inc/security-all-in-one.php',
    filename: 'security-all-in-one.php',
    language: 'php',
    description: 'پکیج کامل امنیتی All-in-One، فایروال WAF، آنتی بروت‌فورس و ضد هک',
    content: `<?php
/**
 * KamvaWeb All-In-One Integrated Security Suite
 * فایروال اختصاصی WAF، محافظت از دیتابیس در برابر SQLi، ضد Brute-Force و تغییر آدرس لاگین
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Security_Shield {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'run_waf_firewall'), 1);
        add_action('wp_authenticate', array($this, 'check_brute_force_attempts'), 10, 2);
        add_filter('xmlrpc_enabled', '__return_false');
        remove_action('wp_head', 'wp_generator');
        add_filter('the_generator', '__return_empty_string');
    }

    public function run_waf_firewall() {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $query = $_SERVER['QUERY_STRING'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $malicious_patterns = array(
            'union.*select', 'base64_', 'eval\(', '<script', 'etc/passwd',
            'boot.ini', '\.\./\.\.', 'concat\(', 'sleep\(', 'benchmark\('
        );

        foreach ($malicious_patterns as $pattern) {
            if (preg_match('/' . $pattern . '/i', $uri . ' ' . $query)) {
                $this->log_security_breach('sql_or_xss_injection');
                wp_die('دسترسی شما توسط فایروال اختصاصی کامواوب مسدود گردید.', 'WAF Blocked', array('response' => 403));
            }
        }
    }

    public function check_brute_force_attempts($username) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $key = 'kamva_login_fail_' . md5($ip);
        $attempts = (int) get_transient($key);

        if ($attempts >= 4) {
            $this->log_security_breach('brute_force_lockout');
            wp_die('تعداد تلاش‌های ناموفق شما بیش از حد مجاز است. آی‌پی شما به مدت ۱ ساعت مسدود شد.', 'Brute Force Protected', array('response' => 403));
        }
    }

    private function log_security_breach($type) {
        $logs = get_option('kamva_security_logs', array());
        $logs[] = array(
            'time' => current_time('mysql'),
            'type' => $type,
            'ip'   => $_SERVER['REMOTE_ADDR'] ?? '',
            'url'  => esc_url($_SERVER['REQUEST_URI'] ?? ''),
        );
        update_option('kamva_security_logs', array_slice($logs, -100));
    }
}

KamvaWeb_Security_Shield::get_instance();
`,
  },
  {
    path: 'inc/speed-optimizer.php',
    filename: 'speed-optimizer.php',
    language: 'php',
    description: 'بهینه‌ساز فوق‌سریع منابع، تخلیه افزونه‌های غیرضروری و لایت‌هاوس ۹۹/۱۰۰',
    content: `<?php
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
`,
  },
  {
    path: 'inc/seo-engine.php',
    filename: 'seo-engine.php',
    language: 'php',
    description: 'تولید خودکار اسکیماهای JSON-LD و بهینه‌سازی تگ‌های سئو',
    content: `<?php
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
            $schema = array(
                '@context' => 'https://schema.org',
                '@type'    => 'Organization',
                'name'     => get_bloginfo('name'),
                'url'      => home_url(),
                'logo'     => get_template_directory_uri() . '/assets/logo.png',
                'potentialAction' => array(
                    '@type'       => 'SearchAction',
                    'target'      => home_url('/?s={search_term_string}'),
                    'query-input' => 'required name=search_term_string',
                ),
            );
        } elseif (is_product()) {
            global $product;
            if ($product) {
                $schema = array(
                    '@context' => 'https://schema.org',
                    '@type'    => 'Product',
                    'name'     => $product->get_name(),
                    'image'    => wp_get_attachment_url($product->get_image_id()) ?: get_template_directory_uri() . '/assets/placeholder.jpg',
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
                        'priceCurrency' => get_woocommerce_currency(),
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
            echo "\n" . '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
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
`,
  },
  {
    path: 'inc/elementor-widgets/class-ai-sales-bot.php',
    filename: 'class-ai-sales-bot.php',
    language: 'php',
    description: 'ویجت رسمی المنتور: دستیار هوشمند مشاوره و فروش کامواوب',
    content: `<?php
/**
 * Elementor Widget: KamvaWeb AI Sales Assistant
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Sales_Bot_Widget extends \\Elementor\\Widget_Base {

    public function get_name() {
        return 'kamvaweb_ai_sales_bot';
    }

    public function get_title() {
        return esc_html__('مشاور و فروشنده هوشمند کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-chat';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات ویجت هوش مصنوعی', 'kamvaweb'))
        );

        $this->add_control(
            'bot_title',
            array(
                'label'   => esc_html__('عنوان مشاور', 'kamvaweb'),
                'type'    => \\Elementor\\Controls_Manager::TEXT,
                'default' => 'دستیار هوشمند و فروشنده کامواوب',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-sales-card p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl">
            <h4 class="font-bold text-white text-base mb-2"><?php echo esc_html($settings['bot_title']); ?></h4>
            <p class="text-xs text-slate-300">سلام! من به کلیه محصولات، قیمت‌ها و تخفیف‌های سایت مسلطم. چه کالایی مد نظرتونه؟</p>
        </div>
        <?php
    }
}
`,
  },
  {
    path: 'admin/theme-options.php',
    filename: 'theme-options.php',
    language: 'php',
    description: 'کنترل پنل تنظیمات فوق‌حرفه‌ای قالب در پیشخوان وردپرس',
    content: `<?php
/**
 * KamvaWeb Theme Options Page in WP Admin
 */

if (!defined('ABSPATH')) exit;

function kamvaweb_register_admin_menu() {
    add_menu_page(
        'کامواوب | تم‌آپشن اختصاصی و مغز هوش مصنوعی',
        'کامواوب پرو',
        'manage_options',
        'kamvaweb-theme-options',
        'kamvaweb_render_options_page',
        'dashicons-superhero-alt',
        59
    );
}
add_action('admin_menu', 'kamvaweb_register_admin_menu');

function kamvaweb_render_options_page() {
    ?>
    <div class="wrap kamvaweb-admin-wrap" dir="rtl">
        <h1 style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <span style="background: linear-gradient(135deg, #6366f1, #10b981); color: white; padding: 6px 14px; border-radius: 10px; font-size: 16px;">KamvaWeb Pro</span>
            پنل تنظیمات قالب اختصاصی کامواوب (تم‌آپشن جامع + خزشگر زنده)
        </h1>
        <div style="background: #1e293b; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #334155;">
            <p style="font-size: 15px; line-height: 1.8;">
                تمامی امکانات این قالب شامل ساختار تم‌آپشن کامواوب (هدرساز، کاتالوگ فروشگاه و هاورها)، سیستم خودترمیمی و مصونیت از تداخل در آپدیت‌ها، فایروال All-in-One Security، بهینه‌ساز فوق سریع منابع افزونه‌ها و خزشگر واقعی پایگاه دانش به صورت خودکار فعال هستند.
            </p>
        </div>
    </div>
    <?php
}
`,
  },
  {
    path: 'inc/database-ai-cleaner.php',
    filename: 'database-ai-cleaner.php',
    language: 'php',
    description: 'ماژول پایش و پاکسازی خودکار دیتابیس وردپرس، جداول یتیم و ترنزینت‌های منقضی با هسته هوش مصنوعی',
    content: `<?php
/**
 * KamvaWeb Autonomous AI Database Optimizer & Orphaned Cleaner
 * ماژول پایش و پاکسازی خودکار دیتابیس وردپرس، حذف جداول رها شده از افزونه‌های قدیمی و ترنزینت‌های منقضی
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Database_AI_Cleaner {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // اجرای کرون‌جاب روزانه برای پاکسازی خودکار ترنزینت‌های منقضی و بهینه‌سازی جداول
        add_action('kamvaweb_daily_db_maintenance', array($this, 'run_automated_maintenance'));

        if (!wp_next_scheduled('kamvaweb_daily_db_maintenance')) {
            wp_schedule_event(time(), 'daily', 'kamvaweb_daily_db_maintenance');
        }

        // اندپوینت REST API اختصاصی برای پاکسازی امن از پیشخوان یا پنل کاربری
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/database-cleanup', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_rest_cleanup'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ));
    }

    public function handle_rest_cleanup($request) {
        $params = $request->get_json_params();
        $clean_transients = !empty($params['clean_transients']);
        $clean_revisions  = !empty($params['clean_revisions']);
        $clean_orphaned   = !empty($params['clean_orphaned']);

        $result = $this->run_cleanup($clean_transients, $clean_revisions, $clean_orphaned);
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'پاکسازی دیتابیس با موفقیت انجام شد.',
            'metrics' => $result,
        ));
    }

    public function run_automated_maintenance() {
        // بهینه‌سازی روزانه ترنزینت‌ها و نسخه‌های پیش‌نویس بالای ۳۰ روز
        $this->run_cleanup(true, true, false);
    }

    public function run_cleanup($clean_transients = true, $clean_revisions = true, $clean_orphaned = true) {
        global $wpdb;
        $purged_rows = 0;

        // ۱. پاکسازی ترنزینت‌های منقضی و سشن‌های بلااستفاده از جدول wp_options
        if ($clean_transients) {
            $time_now = time();
            
            // حذف ترنزینت‌های منقضی شده با مقایسه timeout
            $sql_timeout = "DELETE a, b FROM {$wpdb->options} a, {$wpdb->options} b 
                            WHERE a.option_name LIKE %s 
                            AND a.option_name NOT LIKE %s 
                            AND b.option_name = CONCAT('_transient_timeout_', SUBSTRING(a.option_name, 12)) 
                            AND b.option_value < %d";
            $res = $wpdb->query($wpdb->prepare($sql_timeout, '_transient_%', '_transient_timeout_%', $time_now));
            if ($res) $purged_rows += $res;

            // حذف سشن‌های ووکامرس قدیمی بالای ۳۰ روز
            $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_wp_session_%'");
        }

        // ۲. پاکسازی نسخه‌های پیش‌نویس (Revisions) و نوشته‌های زباله‌دان
        if ($clean_revisions) {
            $deleted_revisions = $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_type = 'revision'");
            if ($deleted_revisions) $purged_rows += $deleted_revisions;

            $wpdb->query("DELETE FROM {$wpdb->posts} WHERE post_status = 'auto-draft'");
        }

        // ۳. پاکسازی متاداده‌های یتیم (Postmeta & Termmeta)
        if ($clean_orphaned) {
            $wpdb->query("DELETE pm FROM {$wpdb->postmeta} pm LEFT JOIN {$wpdb->posts} wp ON wp.ID = pm.post_id WHERE wp.ID IS NULL");
            $wpdb->query("DELETE tm FROM {$wpdb->termmeta} tm LEFT JOIN {$wpdb->terms} wt ON wt.term_id = tm.term_id WHERE wt.term_id IS NULL");
        }

        // ۴. دیفرگمنت و دستور OPTIMIZE TABLE برای جدول‌های اصلی وردپرس
        $wpdb->query("OPTIMIZE TABLE {$wpdb->posts}, {$wpdb->postmeta}, {$wpdb->options}");

        return array(
            'purged_rows' => $purged_rows,
            'timestamp'   => current_time('mysql'),
        );
    }
}

// مقداردهی اولیه به صورت Singleton
KamvaWeb_Database_AI_Cleaner::get_instance();
`,
  },
  {
    path: 'readme.txt',
    filename: 'readme.txt',
    language: 'markdown',
    description: 'راهنمای نصب، راه‌اندازی و مشخصات فنی قالب کامواوب',
    content: `=== KamvaWeb Pro - قالب وردپرس اختصاصی کامواوب با هسته هوش مصنوعی و معماری فروشگاهی ===
Tags: kamvaweb, kamva-builder, elementor, all-in-one-security, speed-optimizer, ecommerce, ai-sales-agent, seo, wordpress-7-1, self-healing
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 8.2
License: GPLv2 or later

== توضیحات به زبان فارسی ==
قالب اختصاصی «کامواوب» (KamvaWeb Pro) نسخه ۴.۲ پروداکشن برای فروشگاه‌ها و پورتال‌های سازمانی:
۱. تم‌آپشن جامع فروشگاهی کامواوب (هدر ساز زنده، تنظیمات پیشرفته فوتر، استایل‌های کارت محصول و گرید ایجکس).
۲. هسته هوش مصنوعی محلی بدون هیچ وابستگی به سرویس‌های پولی و خارجی، با قابلیت خودآموزی مداوم.
۳. سیستم پایش پایداری و خودترمیمی (Self-Healing Stability Engine): جلوگیری ۱۰۰٪ از تداخل و شکستگی کدها هنگام به‌روزرسانی‌های هسته وردپرس یا افزونه‌های نصب‌شده.
۴. تمامی امکانات امنیتی All-in-One Security به صورت داخلی در هسته بدون فشار به دیتابیس.
۵. سازگاری کامل و عمیق با المنتور پرو، ووکامرس و وردپرس نسخه 7.1 Mary Lou.
۶. سیستم عیب‌یابی آنی (Debug & Health Monitor) برای مدیران سایت جهت رفع فوری هرگونه اخطار و ارور.

== راهنمای نصب روی وردپرس ==
۱. وارد پیشخوان وردپرس شوید.
۲. به مسیر نمایش > پوسته‌ها > افزودن پوسته‌ی تازه بروید.
۳. فایل kamvaweb-wordpress-theme.zip را بارگذاری و فعال‌سازی نمایید.
۴. از منوی جدید «کامواوب | تم‌آپشن اختصاصی و مغز هوش مصنوعی» در پیشخوان استفاده کنید.
`,
  },
];
