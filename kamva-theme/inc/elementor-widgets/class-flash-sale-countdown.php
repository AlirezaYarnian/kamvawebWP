<?php
/**
 * KamvaWeb Flash Sale Urgency Bar & Stock Progress Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Flash_Sale_Countdown_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_flash_sale_countdown';
    }

    public function get_title() {
        return esc_html__('نوار تایمر فروش ویژه و موجودی لحظه‌ای (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-countdown';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_flash_sale',
            array('label' => esc_html__('تنظیمات فروش ویژه', 'kamvaweb'))
        );

        $this->add_control(
            'sale_title',
            array(
                'label' => esc_html__('عنوان پیشنهاد ویژه', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('⚡ حراج شگفت‌انگیز پاییزه - تخفیف تا ۵۰٪', 'kamvaweb'),
            )
        );

        $this->add_control(
            'items_left',
            array(
                'label' => esc_html__('تعداد باقی‌مانده در انبار', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => 4,
            )
        );

        $this->add_control(
            'total_items',
            array(
                'label' => esc_html__('کل تعداد تخفیف‌دار', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => 30,
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $left = intval($settings['items_left']);
        $total = intval($settings['total_items']);
        $percentage = max(5, min(100, round(($left / max(1, $total)) * 100)));
        ?>
        <div class="kamva-flash-sale my-6 p-5 bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl text-slate-100 shadow-2xl relative overflow-hidden" dir="rtl">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-red-500 text-white font-extrabold text-xs rounded-full animate-pulse">فروش ویژه</span>
                    <h4 class="font-extrabold text-slate-100 text-base md:text-lg"><?php echo esc_html($settings['sale_title']); ?></h4>
                </div>

                <div class="flex items-center gap-2 dir-ltr text-center">
                    <div class="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-red-500/30">
                        <span class="block text-sm font-extrabold text-red-400">08</span>
                        <span class="text-[9px] text-slate-400">ساعت</span>
                    </div>
                    <span class="text-red-400 font-bold">:</span>
                    <div class="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-red-500/30">
                        <span class="block text-sm font-extrabold text-red-400">42</span>
                        <span class="text-[9px] text-slate-400">دقیقه</span>
                    </div>
                    <span class="text-red-400 font-bold">:</span>
                    <div class="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-red-500/30">
                        <span class="block text-sm font-extrabold text-red-400">19</span>
                        <span class="text-[9px] text-slate-400">ثانیه</span>
                    </div>
                </div>
            </div>

            <!-- Stock Progress Bar -->
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs text-slate-300">
                    <span class="font-medium text-red-400">فقط <?php echo esc_html($left); ?> عدد در انبار با این قیمت باقی مانده!</span>
                    <span class="text-slate-400"><?php echo esc_html($left); ?> از <?php echo esc_html($total); ?> عدد</span>
                </div>
                <div class="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500" style="width: <?php echo esc_attr($percentage); ?>%;"></div>
                </div>
            </div>
        </div>
        <?php
    }
}
