<?php
/**
 * Elementor Widget: KamvaWeb AI Product Advisor
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Product_Advisor_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_ai_product_advisor';
    }

    public function get_title() {
        return esc_html__('پیشنهاد دهنده هوشمند کالای مکمل کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-product-related';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات پیشنهادات هوشمند', 'kamvaweb'))
        );

        $this->add_control(
            'advisor_title',
            array(
                'label'   => esc_html__('عنوان بخش', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'مکمل‌های خریداران این محصول با تخفیف ویژه',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-advisor-card p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <h4 class="font-bold text-white text-sm mb-3"><?php echo esc_html($settings['advisor_title']); ?></h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span class="text-slate-200">کاور محافظ نانو اختصاصی</span>
                    <span class="text-emerald-400 font-bold font-mono">۲۰٪ تخفیف</span>
                </div>
                <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span class="text-slate-200">پایه شارژ بی‌سیم سریع</span>
                    <span class="text-emerald-400 font-bold font-mono">۱۵٪ تخفیف</span>
                </div>
            </div>
        </div>
        <?php
    }
}
