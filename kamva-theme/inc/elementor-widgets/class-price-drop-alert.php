<?php
/**
 * Elementor Widget: KamvaWeb Price Drop Alert & History
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Price_Drop_Alert_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_price_drop_alert';
    }

    public function get_title() {
        return esc_html__('نمودار تاریخچه قیمت و اطلاع از افت قیمت کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-price-list';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات افت قیمت', 'kamvaweb'))
        );

        $this->add_control(
            'alert_button_label',
            array(
                'label'   => esc_html__('متن دکمه اطلاع‌رسانی', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'ارزان شد به من خبر بده 🔔',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-price-drop-widget p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div>
                <span class="text-slate-400 block text-[11px]">کمترین قیمت ۳۰ روز گذشته</span>
                <span class="text-emerald-400 font-bold font-mono text-sm">۲۸,۵۰۰,۰۰۰ تومان</span>
            </div>
            <button class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer">
                <?php echo esc_html($settings['alert_button_label']); ?>
            </button>
        </div>
        <?php
    }
}
