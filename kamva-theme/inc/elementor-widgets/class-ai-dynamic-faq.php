<?php
/**
 * Elementor Widget: KamvaWeb AI Dynamic FAQ
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Dynamic_FAQ_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_ai_dynamic_faq';
    }

    public function get_title() {
        return esc_html__('سوالات متداول پویا و هوشمند کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-accordion';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات سوالات متداول', 'kamvaweb'))
        );

        $this->add_control(
            'faq_title',
            array(
                'label'   => esc_html__('عنوان آکاردئون', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'پرسش‌های متداول خریداران و نحوه ارسال',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-faq-card p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <h4 class="font-bold text-white text-sm"><?php echo esc_html($settings['faq_title']); ?></h4>
            <details class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <summary class="font-bold text-white cursor-pointer">زمان ارسال سفارشات چقدر است؟</summary>
                <p className="mt-2 text-slate-400">سفارشات تهران همان روز با پیک و سایر شهرستان‌ها ظرف ۲۴ تا ۴۸ ساعت با پست پیشتاز ارسال می‌شوند.</p>
            </details>
        </div>
        <?php
    }
}
