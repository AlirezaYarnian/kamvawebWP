<?php
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
