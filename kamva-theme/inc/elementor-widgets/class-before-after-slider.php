<?php
/**
 * KamvaWeb Interactive Before & After Comparison Slider Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Before_After_Slider_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_before_after_slider';
    }

    public function get_title() {
        return esc_html__('اسلایدر مقایسه قبل و بعد (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-image-before-after';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_slider_settings',
            array('label' => esc_html__('تنظیمات قبل و بعد', 'kamvaweb'))
        );

        $this->add_control(
            'before_label',
            array(
                'label' => esc_html__('برچسب تصویر قبل', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('قبل از بهینه‌سازی', 'kamvaweb'),
            )
        );

        $this->add_control(
            'after_label',
            array(
                'label' => esc_html__('برچسب تصویر بعد', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('بعد با هوش مصنوعی کامواوب', 'kamvaweb'),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamva-before-after-box my-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-xl" dir="rtl">
            <div class="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 select-none group">
                <!-- After Background (Right Side) -->
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 flex items-center justify-center">
                    <div class="text-center p-6">
                        <span class="text-3xl mb-2 block">✨</span>
                        <h4 class="font-extrabold text-emerald-400 text-lg"><?php echo esc_html($settings['after_label']); ?></h4>
                        <p class="text-xs text-slate-300 mt-1">سرعت لود زیر ۰.۴ ثانیه + امتیاز لایت‌هاوس ۹۹/۱۰۰</p>
                    </div>
                </div>

                <!-- Before Foreground Overlay (Left Side) -->
                <div class="before-layer absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-slate-900 via-rose-950 to-red-950 border-r-2 border-amber-400 flex items-center justify-center overflow-hidden transition-all">
                    <div class="text-center p-6 min-w-[280px]">
                        <span class="text-3xl mb-2 block">🐌</span>
                        <h4 class="font-bold text-rose-400 text-lg"><?php echo esc_html($settings['before_label']); ?></h4>
                        <p class="text-xs text-slate-400 mt-1">لود سنگین ۶ ثانیه‌ای و افت رتبه در گوگل</p>
                    </div>
                </div>

                <!-- Labels Overlay -->
                <span class="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold rounded-lg">
                    <?php echo esc_html($settings['after_label']); ?>
                </span>
                <span class="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 border border-rose-500/40 text-rose-400 text-[11px] font-bold rounded-lg">
                    <?php echo esc_html($settings['before_label']); ?>
                </span>
            </div>
        </div>
        <?php
    }
}
