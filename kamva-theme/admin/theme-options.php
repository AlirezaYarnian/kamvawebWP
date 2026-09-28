<?php
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
