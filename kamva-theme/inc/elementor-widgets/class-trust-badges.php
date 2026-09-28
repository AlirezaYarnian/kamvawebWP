<?php
/**
 * KamvaWeb Conversion Trust Badges & Security Seals Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Trust_Badges_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_trust_badges';
    }

    public function get_title() {
        return esc_html__('نشان‌های اعتماد و نماد نماد الکترونیک (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-verified';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_trust_settings',
            array('label' => esc_html__('تنظیمات نمادها', 'kamvaweb'))
        );

        $this->add_control(
            'grid_columns',
            array(
                'label' => esc_html__('تعداد ستون‌ها', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '4',
                'options' => array(
                    '2' => '۲ ستون',
                    '3' => '۳ ستون',
                    '4' => '۴ ستون',
                    '6' => '۶ ستون',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $cols = intval($settings['grid_columns']);
        ?>
        <div class="kamva-trust-wrapper my-6 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-100" dir="rtl">
            <div class="grid grid-cols-2 md:grid-cols-<?php echo esc_attr($cols); ?> gap-4 text-center">
                <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all group">
                    <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🛡️</div>
                    <h5 class="font-bold text-sm text-slate-100">ضمانت اصالت کالای ۱۰۰٪</h5>
                    <p class="text-[11px] text-slate-400 mt-1">تضمین بازگشت وجه در صورت عدم اصالت</p>
                </div>
                <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all group">
                    <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                    <h5 class="font-bold text-sm text-slate-100">ارسال اکسپرس و سریع</h5>
                    <p class="text-[11px] text-slate-400 mt-1">تحویل همان‌روز در سراسر کشور</p>
                </div>
                <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
                    <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🔒</div>
                    <h5 class="font-bold text-sm text-slate-100">درگاه پرداخت امن SSL</h5>
                    <p class="text-[11px] text-slate-400 mt-1">رمزنگاری ۲۵۶ بیتی تایید شده بانک مرکزی</p>
                </div>
                <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all group">
                    <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🎧</div>
                    <h5 class="font-bold text-sm text-slate-100">پشتیبانی ۲۴/۷ تلفنی و چت</h5>
                    <p class="text-[11px] text-slate-400 mt-1">پاسخگویی سریع توسط کارشناسان مجرب</p>
                </div>
            </div>
        </div>
        <?php
    }
}
