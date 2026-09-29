<?php
/**
 * KamvaWeb WooCommerce Installment & Credit Payment Calculator Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Installment_Calculator_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_installment_calculator';
    }

    public function get_title() {
        return esc_html__('محاسبه‌گر اقساط و خرید اعتباری (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-calculator';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_calculator_settings',
            array('label' => esc_html__('تنظیمات محاسبه‌گر', 'kamvaweb'))
        );

        $this->add_control(
            'default_price',
            array(
                'label' => esc_html__('مبلغ پایه محصول (تومان)', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => 12500000,
            )
        );

        $this->add_control(
            'prepayment_percent',
            array(
                'label' => esc_html__('درصد پیش‌پرداخت پیش‌فرض (%)', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => array('%'),
                'range' => array(
                    '%' => array('min' => 0, 'max' => 70, 'step' => 5),
                ),
                'default' => array('unit' => '%', 'size' => 20),
            )
        );

        $this->add_control(
            'interest_rate',
            array(
                'label' => esc_html__('نرخ کارمزد ماهیانه (%)', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => 2.2,
                'step' => 0.1,
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        global $product;

        $currency = function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : 'تومان';
        $base_price = floatval($settings['default_price']);

        if (is_a($product, 'WC_Product') && floatval($product->get_price()) > 0) {
            $base_price = floatval($product->get_price());
        }

        $prepayment_percent = floatval($settings['prepayment_percent']['size']);
        $interest_rate = floatval($settings['interest_rate']);

        $prepayment_amount = $base_price * ($prepayment_percent / 100);
        $remaining_amount = $base_price - $prepayment_amount;

        $monthly_4 = ($remaining_amount * (1 + ($interest_rate * 4 / 100))) / 4;
        $monthly_6 = ($remaining_amount * (1 + ($interest_rate * 6 / 100))) / 6;
        $monthly_12 = ($remaining_amount * (1 + ($interest_rate * 12 / 100))) / 12;
        ?>
        <div class="kamva-installment-box my-6 p-6 bg-slate-900 border border-amber-500/30 rounded-2xl text-slate-100 shadow-xl" dir="rtl">
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        💳
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-100 text-lg">خرید اقساطی آسان و بدون ضامن</h4>
                        <p class="text-xs text-slate-400">طرف قرارداد با اسنپ‌پی، دیجی‌پی و ترنم</p>
                    </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">تایید آنی</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div class="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center">
                    <span class="text-xs text-slate-400 block mb-1">اقساط ۴ ماهه (بدون چک)</span>
                    <span class="text-lg font-bold text-amber-400"><?php echo number_format(round($monthly_4)); ?></span>
                    <span class="text-xs text-slate-400 mr-1">تومان / ماه</span>
                </div>
                <div class="p-4 bg-slate-950/70 rounded-xl border border-amber-500/30 text-center relative overflow-hidden">
                    <span class="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-br-lg">پیشنهادی</span>
                    <span class="text-xs text-slate-400 block mb-1">اقساط ۶ ماهه</span>
                    <span class="text-lg font-bold text-emerald-400"><?php echo number_format(round($monthly_6)); ?></span>
                    <span class="text-xs text-slate-400 mr-1">تومان / ماه</span>
                </div>
                <div class="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center">
                    <span class="text-xs text-slate-400 block mb-1">اقساط ۱۲ ماهه (اعتباری)</span>
                    <span class="text-lg font-bold text-cyan-400"><?php echo number_format(round($monthly_12)); ?></span>
                    <span class="text-xs text-slate-400 mr-1">تومان / ماه</span>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                    <span class="text-amber-400 font-bold">مبلغ پیش‌پرداخت (<?php echo esc_html($prepayment_percent); ?>%):</span>
                    <span class="font-bold text-slate-100"><?php echo number_format(round($prepayment_amount)); ?> تومان</span>
                </div>
                <a href="#" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center w-full sm:w-auto">
                    درخواست اعتبار و خرید اقساطی
                </a>
            </div>
        </div>
        <?php
    }
}
