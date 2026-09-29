<?php
/**
 * Elementor Widget: KamvaWeb AI Sales Assistant
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Sales_Bot_Widget extends \Elementor\Widget_Base {

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
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => get_option('kamvaweb_bot_name', esc_html__('دستیار هوشمند و فروشنده کامواوب', 'kamvaweb')),
            )
        );

        $this->add_control(
            'bot_welcome',
            array(
                'label'   => esc_html__('پیام خوش‌آمدگویی', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXTAREA,
                'default' => get_option('kamvaweb_welcome_msg', esc_html__('سلام! من به کلیه محصولات، ویژگی‌ها و تخفیف‌های سایت مسلطم. چه کالایی مد نظرتان است؟', 'kamvaweb')),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-sales-card p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl relative overflow-hidden" dir="rtl">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
                    🤖
                </div>
                <div>
                    <h4 class="font-bold text-white text-base"><?php echo esc_html($settings['bot_title']); ?></h4>
                    <span class="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <?php esc_html_e('آماده پاسخگویی هوشمند', 'kamvaweb'); ?>
                    </span>
                </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <?php echo esc_html($settings['bot_welcome']); ?>
            </p>
        </div>
        <?php
    }
}
