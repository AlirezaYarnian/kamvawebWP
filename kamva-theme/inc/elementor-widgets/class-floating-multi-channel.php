<?php
/**
 * Elementor Widget: KamvaWeb Floating Multi-Channel Chat
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Floating_Multi_Channel_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_floating_multi_channel';
    }

    public function get_title() {
        return esc_html__('پشتیبانی شناور واتساپ و تلگرام کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-comments';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات اپراتورها', 'kamvaweb'))
        );

        $this->add_control(
            'whatsapp_number',
            array(
                'label'   => esc_html__('شماره واتساپ', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => '989123456789',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-multi-channel-widget p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-white font-bold">پشتیبانی آنلاین واتساپ و تلگرام</span>
            </div>
            <a href="https://wa.me/<?php echo esc_attr($settings['whatsapp_number']); ?>" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                چت در واتساپ
            </a>
        </div>
        <?php
    }
}
