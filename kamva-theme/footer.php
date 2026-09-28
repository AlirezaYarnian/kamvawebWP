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
