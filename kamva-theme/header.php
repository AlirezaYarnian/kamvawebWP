<!DOCTYPE html>
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
