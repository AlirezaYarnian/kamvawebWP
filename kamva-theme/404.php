<?php
/**
 * 404 Error page template
 * @package KamvaWeb
 */

get_header(); ?>

<main id="primary" class="site-main py-20 max-w-2xl mx-auto px-4 text-center space-y-6" dir="rtl">
    <div class="w-24 h-24 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-4xl font-mono text-rose-400">
        404
    </div>
    <h1 class="text-3xl font-black text-white"><?php esc_html_e('صفحه مورد نظر شما پیدا نشد!', 'kamvaweb'); ?></h1>
    <p class="text-sm text-slate-400 leading-relaxed">
        <?php esc_html_e('ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه توسط مدیر سایت جابجا یا حذف شده باشد.', 'kamvaweb'); ?>
    </p>

    <div class="max-w-md mx-auto">
        <?php get_search_form(); ?>
    </div>

    <div class="pt-4">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all">
            <?php esc_html_e('بازگشت به صفحه اصلی سایت', 'kamvaweb'); ?>
        </a>
    </div>
</main>

<?php get_footer();
