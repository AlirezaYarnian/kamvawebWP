<?php
/**
 * KamvaWeb Mobile Floating Sticky Quick Cart Bar Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Sticky_Mobile_Cart_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_sticky_mobile_cart';
    }

    public function get_title() {
        return esc_html__('نوار چسبان خرید سریع موبایل (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-price-table';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_cart_settings',
            array('label' => esc_html__('تنظیمات نوار موبایل', 'kamvaweb'))
        );

        $this->add_control(
            'product_name',
            array(
                'label' => esc_html__('نام محصول نمونه', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('گوشی موبایل آیفون ۱۵ پرو مکس - ۲۵۶ گیگابایت', 'kamvaweb'),
            )
        );

        $this->add_control(
            'product_price',
            array(
                'label' => esc_html__('قیمت با تخفیف (تومان)', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => '۶۸,۵۰۰,۰۰۰',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamva-sticky-cart-bar fixed bottom-0 left-0 right-0 z-50 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-100 shadow-2xl block md:hidden" dir="rtl">
            <div class="flex items-center justify-between gap-3 max-w-md mx-auto">
                <div class="flex items-center gap-2.5 overflow-hidden">
                    <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0 flex items-center justify-center text-amber-400 font-bold">
                        📱
                    </div>
                    <div class="truncate">
                        <h5 class="text-xs font-bold truncate text-slate-100"><?php echo esc_html($settings['product_name']); ?></h5>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-xs font-extrabold text-amber-400"><?php echo esc_html($settings['product_price']); ?></span>
                            <span class="text-[10px] text-slate-400">تومان</span>
                        </div>
                    </div>
                </div>

                <button class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5">
                    <span>🛒</span>
                    <span>خرید سریع</span>
                </button>
            </div>
        </div>
        <?php
    }
}
