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
                'default' => 'دستیار هوشمند و فروشنده کامواوب',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-sales-card p-6 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl">
            <h4 class="font-bold text-white text-base mb-2"><?php echo esc_html($settings['bot_title']); ?></h4>
            <p class="text-xs text-slate-300">سلام! من به کلیه محصولات، قیمت‌ها و تخفیف‌های سایت مسلطم. چه کالایی مد نظرتونه؟</p>
        </div>
        <?php
    }
}
