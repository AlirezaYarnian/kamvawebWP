<?php
/**
 * Elementor Widget: KamvaWeb Product Visual Hotspots
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Product_Hotspots_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_product_hotspots';
    }

    public function get_title() {
        return esc_html__('نقاط داغ تعاملی محصول کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-hotspot';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات نقاط داغ', 'kamvaweb'))
        );

        $this->add_control(
            'hotspot_title',
            array(
                'label'   => esc_html__('عنوان تصویر', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'بررسی جزئیات فنی و قطعات لپ‌تاپ کامواوب',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-hotspots-widget p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
            <h4 class="font-bold text-white text-xs mb-2"><?php echo esc_html($settings['hotspot_title']); ?></h4>
            <div class="h-32 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center">
                <span class="text-slate-500 text-xs">تصویر محصول همراه با Hotspots</span>
                <span class="absolute top-4 left-8 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center animate-ping">●</span>
                <span class="absolute bottom-6 right-12 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-ping">●</span>
            </div>
        </div>
        <?php
    }
}
