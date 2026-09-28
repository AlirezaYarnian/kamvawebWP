<?php
/**
 * Elementor Widget: KamvaWeb Gamified Spin Wheel Coupon
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Gamified_Spin_Wheel_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_gamified_spin_wheel';
    }

    public function get_title() {
        return esc_html__('گردونه شانس و تخفیف خریداران کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-wheel';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات گردونه شانس', 'kamvaweb'))
        );

        $this->add_control(
            'wheel_title',
            array(
                'label'   => esc_html__('عنوان گردونه', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'شانست رو امتحان کن و کوپن تخفیف آنی برنده شو!',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-spin-wheel p-5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-800/50 rounded-2xl text-center space-y-3">
            <h4 class="font-bold text-white text-sm"><?php echo esc_html($settings['wheel_title']); ?></h4>
            <div class="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 px-4 py-2 rounded-xl border border-purple-500/30 text-xs font-bold cursor-pointer hover:bg-purple-500/30 transition-all">
                <span>🎯 چرخاندن گردونه شانس</span>
            </div>
        </div>
        <?php
    }
}
