<footer id="colophon" class="site-footer bg-slate-900 border-t border-slate-800 mt-auto py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="space-y-3">
                    <h4 class="text-white font-bold text-base"><?php bloginfo('name'); ?></h4>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        طراحی شده با قالب اختصاصی کامواوب (KamvaWeb Pro) - مجهز به تم‌آپشن جامع فروشگاهی، مصون از تداخل در آپدیت‌ها و سرعت لود ۹۹/۱۰۰.
                    </p>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3"><?php esc_html_e('دسترسی سریع', 'kamvaweb'); ?></h5>
                    <?php if (has_nav_menu('footer')) : ?>
                        <?php wp_nav_menu(array(
                            'theme_location' => 'footer',
                            'menu_class'     => 'space-y-1.5 text-xs text-slate-400',
                            'container'      => false,
                            'fallback_cb'    => false,
                        )); ?>
                    <?php else : ?>
                        <ul class="space-y-1.5 text-xs text-slate-400">
                            <li><a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-white"><?php esc_html_e('صفحه اصلی', 'kamvaweb'); ?></a></li>
                            <?php if (function_exists('wc_get_page_permalink')) : ?>
                                <li><a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="hover:text-white"><?php esc_html_e('فروشگاه آنلاین', 'kamvaweb'); ?></a></li>
                            <?php endif; ?>
                            <li><a href="<?php echo esc_url(get_permalink(get_option('page_for_posts')) ?: home_url('/')); ?>" class="hover:text-white"><?php esc_html_e('وبلاگ و مقالات', 'kamvaweb'); ?></a></li>
                        </ul>
                    <?php endif; ?>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3"><?php esc_html_e('پشتیبانی و امنیت', 'kamvaweb'); ?></h5>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        <?php echo esc_html(get_option('kamva_footer_security_text', esc_html__('کلیه پرداخت‌ها تحت پروتکل امن SSL و درگاه‌های شاپرک با حداکثر امنیت انجام می‌شود.', 'kamvaweb'))); ?>
                    </p>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs mb-3"><?php esc_html_e('نمادهای اعتماد الکترونیکی', 'kamvaweb'); ?></h5>
                    <?php 
                    $enamad_html = get_option('kamva_enamad_html');
                    if (!empty($enamad_html)) :
                        echo wp_kses_post($enamad_html);
                    else :
                    ?>
                        <div class="flex items-center gap-2">
                            <div class="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 text-center p-1">
                                <?php esc_html_e('اینماد معتبر', 'kamvaweb'); ?>
                            </div>
                            <div class="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 text-center p-1">
                                <?php esc_html_e('ساماندهی', 'kamvaweb'); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
                <p>&copy; <?php echo esc_html(date('Y')); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('تمامی حقوق محفوظ است.', 'kamvaweb'); ?></p>
                <p class="mt-2 sm:mt-0"><?php printf(esc_html__('توسعه یافته بر پایه کامواوب پرو | نسخه %s', 'kamvaweb'), esc_html(KAMVAWEB_THEME_VERSION)); ?></p>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
