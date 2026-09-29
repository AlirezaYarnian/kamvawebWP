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
                'default' => get_option('kamva_support_whatsapp', get_option('kamva_support_phone', '')),
                'description' => esc_html__('در صورت خالی بودن، از شماره تنظیم شده در تم‌آپشن کامواوب استفاده می‌شود.', 'kamvaweb'),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $whatsapp = !empty($settings['whatsapp_number']) ? $settings['whatsapp_number'] : get_option('kamva_support_whatsapp', get_option('kamva_support_phone', ''));
        $clean_num = preg_replace('/[^0-9]/', '', $whatsapp);
        ?>
        <div class="kamvaweb-elementor-multi-channel-widget p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs" dir="rtl">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-white font-bold"><?php esc_html_e('پشتیبانی آنلاین واتساپ و تلگرام', 'kamvaweb'); ?></span>
            </div>
            <?php if (!empty($clean_num)): ?>
                <a href="https://wa.me/<?php echo esc_attr($clean_num); ?>" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-1.5">
                    <span>💬</span>
                    <span><?php esc_html_e('چت در واتساپ', 'kamvaweb'); ?></span>
                </a>
            <?php else: ?>
                <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
                    <?php esc_html_e('تماس با پشتیبانی', 'kamvaweb'); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php
    }
}
