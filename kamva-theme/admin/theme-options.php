<?php
/**
 * KamvaWeb Theme Options Page in WP Admin
 * 
 * Provides an administrative dashboard to manage store contact info, topbar announcements,
 * AI sales bot preferences, and WooCommerce display options using standard WordPress Settings API.
 * 
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

/**
 * ثبت تنظیمات در Settings API وردپرس
 */
function kamvaweb_register_theme_settings() {
    register_setting('kamvaweb_options_group', 'kamva_support_phone', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => '',
    ));

    register_setting('kamvaweb_options_group', 'kamva_support_whatsapp', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => '',
    ));

    register_setting('kamvaweb_options_group', 'kamva_support_hours', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'شنبه تا پنج‌شنبه از ساعت ۹:۰۰ الی ۲۱:۰۰',
    ));

    register_setting('kamvaweb_options_group', 'kamva_topbar_announcement', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'ارسال رایگان سفارش‌های بالای ۵۰۰ هزار تومان',
    ));

    register_setting('kamvaweb_options_group', 'kamvaweb_bot_name', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'مشاور هوشمند فروش کامواوب',
    ));

    register_setting('kamvaweb_options_group', 'kamvaweb_welcome_msg', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_textarea_field',
        'default'           => 'سلام و احترام! 🌸 به فروشگاه خوش آمدید. چگونه می‌توانم در انتخاب و خرید کالای مناسب به شما کمک کنم؟',
    ));

    register_setting('kamvaweb_options_group', 'kamva_product_hover_style', array(
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => 'quick-shop',
    ));
}
add_action('admin_init', 'kamvaweb_register_theme_settings');

/**
 * ثبت منوی پیشخوان
 */
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

/**
 * رندر برگه تنظیمات قالب در پیشخوان وردپرس
 */
function kamvaweb_render_options_page() {
    if (!current_user_can('manage_options')) return;

    $support_phone = get_option('kamva_support_phone', get_bloginfo('admin_email'));
    $whatsapp      = get_option('kamva_support_whatsapp', '');
    $hours         = get_option('kamva_support_hours', 'شنبه تا پنج‌شنبه از ساعت ۹:۰۰ الی ۲۱:۰۰');
    $announcement  = get_option('kamva_topbar_announcement', 'ارسال رایگان سفارش‌های بالای ۵۰۰ هزار تومان');
    $bot_name      = get_option('kamvaweb_bot_name', 'مشاور هوشمند فروش کامواوب');
    $welcome_msg   = get_option('kamvaweb_welcome_msg', 'سلام و احترام! 🌸 به فروشگاه خوش آمدید. چگونه می‌توانم در انتخاب و خرید کالای مناسب به شما کمک کنم؟');
    $hover_style   = get_option('kamva_product_hover_style', 'quick-shop');
    ?>
    <div class="wrap kamvaweb-admin-wrap" dir="rtl" style="max-width: 900px; margin: 20px auto 40px auto; font-family: inherit;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #0f172a); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 24px; color: white; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="background: #6366f1; color: white; padding: 4px 10px; border-radius: 8px; font-weight: bold; font-size: 12px;">KamvaWeb Pro 4.2.0</span>
                    <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold;">هسته فعال وردپرس ۷.۱</span>
                </div>
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 900;">
                    تنظیمات اختصاصی قالب کامواوب و مغز هوش مصنوعی فروش
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                    کلیه تنظیمات ثبت شده در این بخش بدون تاخیر در سربرگ، فوتر، ویجت‌های المنتور و چت‌بات مشاور اعمال می‌شوند.
                </p>
            </div>
            <div style="text-align: left;">
                <span style="display: inline-block; padding: 8px 16px; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #cbd5e1;">
                    وضعیت سیستم: 🟢 پایدار و ۱۰۰٪ بهینه
                </span>
            </div>
        </div>

        <?php settings_errors(); ?>

        <form method="post" action="options.php">
            <?php settings_fields('kamvaweb_options_group'); ?>

            <!-- بخش ۱: اطلاعات ارتباطی و سربرگ فروشگاه -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h3 style="margin-top: 0; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: bold; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                    <span>📞</span> تنظیمات ارتباطی و نوار اعلان بالای سایت (TopBar)
                </h3>

                <table class="form-table" role="presentation" style="margin-top: 0;">
                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155; width: 220px;">
                            <label for="kamva_support_phone">شماره تلفن پشتیبانی:</label>
                        </th>
                        <td>
                            <input name="kamva_support_phone" type="text" id="kamva_support_phone" value="<?php echo esc_attr($support_phone); ?>" class="regular-text" style="width: 100%; max-width: 400px; direction: ltr; text-align: right; border-radius: 8px;" placeholder="مثال: 02191000000 یا ایمیل مدیر" />
                            <p class="description" style="font-size: 11px; color: #64748b;">در نوار بالای سایت و پیام ارجاع به مشاور انسانی چت‌بات نمایش داده می‌شود.</p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155;">
                            <label for="kamva_support_whatsapp">شماره واتساپ مشاور فروش:</label>
                        </th>
                        <td>
                            <input name="kamva_support_whatsapp" type="text" id="kamva_support_whatsapp" value="<?php echo esc_attr($whatsapp); ?>" class="regular-text" style="width: 100%; max-width: 400px; direction: ltr; text-align: right; border-radius: 8px;" placeholder="مثال: 989120000000" />
                            <p class="description" style="font-size: 11px; color: #64748b;">جهت اتصال یک‌کلیکی کاربران چت‌بات به گفتگوی برخط واتساپ.</p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155;">
                            <label for="kamva_support_hours">ساعات پاسخگویی مشاوران:</label>
                        </th>
                        <td>
                            <input name="kamva_support_hours" type="text" id="kamva_support_hours" value="<?php echo esc_attr($hours); ?>" class="regular-text" style="width: 100%; max-width: 400px; border-radius: 8px;" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155;">
                            <label for="kamva_topbar_announcement">متن بنر اعلان سربرگ:</label>
                        </th>
                        <td>
                            <input name="kamva_topbar_announcement" type="text" id="kamva_topbar_announcement" value="<?php echo esc_attr($announcement); ?>" class="large-text" style="width: 100%; max-width: 500px; border-radius: 8px;" />
                            <p class="description" style="font-size: 11px; color: #64748b;">مثال: «ارسال رایگان سفارش‌های بالای ۵۰۰ هزار تومان» یا «جشنواره تخفیف بهاره».</p>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- بخش ۲: تنظیمات هوش مصنوعی مشاور فروش -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h3 style="margin-top: 0; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: bold; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                    <span>🤖</span> تنظیمات چت‌بات و مشاور هوشمند فروش
                </h3>

                <table class="form-table" role="presentation" style="margin-top: 0;">
                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155; width: 220px;">
                            <label for="kamvaweb_bot_name">نام مشاور هوش مصنوعی:</label>
                        </th>
                        <td>
                            <input name="kamvaweb_bot_name" type="text" id="kamvaweb_bot_name" value="<?php echo esc_attr($bot_name); ?>" class="regular-text" style="width: 100%; max-width: 400px; border-radius: 8px;" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155;">
                            <label for="kamvaweb_welcome_msg">پیام خوش‌آمدگویی اولیه:</label>
                        </th>
                        <td>
                            <textarea name="kamvaweb_welcome_msg" id="kamvaweb_welcome_msg" rows="3" class="large-text" style="width: 100%; max-width: 550px; border-radius: 8px;"><?php echo esc_textarea($welcome_msg); ?></textarea>
                            <p class="description" style="font-size: 11px; color: #64748b;">این پیام در آغاز باز شدن پنجره مشاوره آنلاین به خریدار نمایش داده می‌شود.</p>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- بخش ۳: استایل هاور کاتالوگ فروشگاه ووکامرس -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h3 style="margin-top: 0; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: bold; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                    <span>🛍️</span> استایل تعاملی هاور کارت محصولات ووکامرس
                </h3>

                <table class="form-table" role="presentation" style="margin-top: 0;">
                    <tr>
                        <th scope="row" style="font-size: 13px; color: #334155; width: 220px;">
                            <label for="kamva_product_hover_style">استایل انیمیشن هاور:</label>
                        </th>
                        <td>
                            <select name="kamva_product_hover_style" id="kamva_product_hover_style" style="border-radius: 8px; padding: 6px 12px;">
                                <option value="quick-shop" <?php selected($hover_style, 'quick-shop'); ?>>دکمه خرید سریع با سواچ ویژگی‌ها (Quick Shop & Swatches)</option>
                                <option value="zoom-flip" <?php selected($hover_style, 'zoom-flip'); ?>>بزرگ‌نمایی گالری و عکس دوم (Gallery Flip)</option>
                                <option value="minimal-clean" <?php selected($hover_style, 'minimal-clean'); ?>>مینیمال مدرن با سایه نرم (Clean Shadow)</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 20px;">
                <?php submit_button('ذخیره تغییرات قالب کامواوب', 'primary', 'submit', false, array(
                    'style' => 'background: #6366f1; border-color: #4f46e5; border-radius: 10px; padding: 8px 24px; font-weight: bold; font-size: 13px; cursor: pointer;'
                )); ?>
            </div>
        </form>

    </div>
    <?php
}
