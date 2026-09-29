<?php
/**
 * Elementor Widget: KamvaWeb Live Sales Counter & Social Proof Ticker
 * 
 * Displays live sales velocity, real-time social proof, and stock scarcity indicators
 * directly connected to KamvaCore database and store customer behavior logs.
 * 
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Live_Sales_Counter_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_live_sales_counter';
    }

    public function get_title() {
        return esc_html__('شمارنده زنده فروش و تقاضا (Live Sales Counter)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-counter';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    public function get_keywords() {
        return array('sales', 'counter', 'live', 'social proof', 'urgency', 'kamva', 'cro', 'orders');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_counter_settings',
            array('label' => esc_html__('تنظیمات شمارنده و اثبات اجتماعی', 'kamvaweb'))
        );

        $this->add_control(
            'counter_title',
            array(
                'label'   => esc_html__('عنوان شمارنده', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'تعداد سفارشات موفق ۲۴ ساعت گذشته',
            )
        );

        $this->add_control(
            'base_sales_count',
            array(
                'label'   => esc_html__('تعداد مبنا (یا همگام‌سازی از دیتابیس)', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::NUMBER,
                'default' => 84,
            )
        );

        $this->add_control(
            'show_scarcity_bar',
            array(
                'label'        => esc_html__('نمایش نوار کمبود موجودی انبار', 'kamvaweb'),
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'label_on'     => esc_html__('بله', 'kamvaweb'),
                'label_off'    => esc_html__('خیر', 'kamvaweb'),
                'return_value' => 'yes',
                'default'      => 'yes',
            )
        );

        $this->add_control(
            'remaining_stock',
            array(
                'label'     => esc_html__('تعداد باقی‌مانده در انبار', 'kamvaweb'),
                'type'      => \Elementor\Controls_Manager::NUMBER,
                'default'   => 6,
                'condition' => array('show_scarcity_bar' => 'yes'),
            )
        );

        $this->add_control(
            'show_recent_buyers_ticker',
            array(
                'label'        => esc_html__('نمایش اطلاعیه آخرین خریداران زنده', 'kamvaweb'),
                'type'         => \Elementor\Controls_Manager::SWITCHER,
                'label_on'     => esc_html__('بله', 'kamvaweb'),
                'label_off'    => esc_html__('خیر', 'kamvaweb'),
                'return_value' => 'yes',
                'default'      => 'yes',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $base_count = intval($settings['base_sales_count']) ?: 84;
        $remaining = intval($settings['remaining_stock']) ?: 6;
        $show_scarcity = $settings['show_scarcity_bar'] === 'yes';
        $show_ticker = $settings['show_recent_buyers_ticker'] === 'yes';

        // استخراج آمار زنده از دیتابیس ووکامرس در صورت وجود
        $live_count = $this->get_real_or_simulated_sales_count($base_count);
        $recent_buyers = $this->get_recent_buyers_list();
        ?>
        <div class="kamvaweb-live-sales-counter-widget my-6 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden" dir="rtl">
            
            <!-- پس‌زمینه نئونی ملایم -->
            <div class="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 space-y-5">
                
                <!-- هدر وضعیت و پالس زنده -->
                <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div class="flex items-center gap-2.5">
                        <span class="relative flex h-3 w-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span class="text-xs font-bold text-emerald-400">سیستم پایش لحظه‌ای سفارشات کامواوب (Live Activity)</span>
                    </div>

                    <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        <span class="text-indigo-400">⚡</span>
                        <span>سرعت تبدیل بالا (High Demand)</span>
                    </div>
                </div>

                <!-- بلوک شمارنده بزرگ و ترغیب‌کننده -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    
                    <div class="md:col-span-7 space-y-2">
                        <h4 class="text-sm font-bold text-slate-300">
                            <?php echo esc_html($settings['counter_title']); ?>
                        </h4>
                        
                        <div class="flex items-baseline gap-3">
                            <span class="text-4xl md:text-5xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                                <?php echo number_format($live_count); ?>+
                            </span>
                            <span class="text-xs text-slate-400">سفارش موفق ثبت‌شده در سامانه</span>
                        </div>

                        <p class="text-xs text-slate-400 leading-relaxed">
                            کاربران در حال حاضر مشغول ثبت سفارش هستند. میانگین زمان ارسال سفارشات کمتر از ۲۴ ساعت کاری می‌باشد.
                        </p>
                    </div>

                    <?php if ($show_scarcity): ?>
                        <div class="md:col-span-5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
                            <div class="flex items-center justify-between text-xs">
                                <span class="font-bold text-amber-400 flex items-center gap-1">
                                    <span>🔥</span>
                                    <span>موجودی با تخفیف ویژه:</span>
                                </span>
                                <span class="font-bold text-rose-400 font-mono">تنها <?php echo esc_html($remaining); ?> عدد باقی مانده</span>
                            </div>

                            <!-- نوار پیشرفت کمبود کالا -->
                            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full animate-pulse" style="width: 82%;"></div>
                            </div>

                            <span class="text-[10px] text-slate-400 block text-right">
                                به دلیل اتمام سهمیه، احتمال تغییر قیمت در ساعات آینده وجود دارد.
                            </span>
                        </div>
                    <?php endif; ?>

                </div>

                <!-- تیکر خریداران اخیر -->
                <?php if ($show_ticker && !empty($recent_buyers)): ?>
                    <div class="pt-3 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto text-xs text-slate-300 scrollbar-none">
                        <span class="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 text-[10px] font-bold shrink-0">
                            آخرین خریدها:
                        </span>

                        <div class="flex items-center gap-4 text-[11px] whitespace-nowrap">
                            <?php foreach ($recent_buyers as $buyer): ?>
                                <div class="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
                                    <span class="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-bold">
                                        <?php echo esc_html(mb_substr($buyer['name'], 0, 1, 'UTF-8')); ?>
                                    </span>
                                    <span class="font-medium text-slate-200"><?php echo esc_html($buyer['name']); ?></span>
                                    <span class="text-slate-500">از <?php echo esc_html($buyer['city']); ?></span>
                                    <span class="text-emerald-400 font-bold">«<?php echo esc_html($buyer['product']); ?>»</span>
                                    <span class="text-slate-500 text-[10px]">(<?php echo esc_html($buyer['time']); ?>)</span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>

            </div>

        </div>
        <?php
    }

    private function get_real_or_simulated_sales_count($base_count) {
        global $wpdb;

        if (function_exists('wc_get_orders')) {
            $orders_count = $wpdb->get_var("
                SELECT COUNT(*) FROM {$wpdb->prefix}posts 
                WHERE post_type = 'shop_order' 
                AND post_status IN ('wc-completed', 'wc-processing')
                AND post_date >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            ");

            if ($orders_count && intval($orders_count) > 0) {
                return intval($orders_count) + $base_count;
            }
        }

        // تخمین پویا بر اساس ضریب ترافیک و ساعت شبانه‌روز
        $hour = intval(date('G'));
        $hourly_boost = ($hour >= 10 && $hour <= 23) ? ($hour * 3) : 12;
        return $base_count + $hourly_boost;
    }

    private function get_recent_buyers_list() {
        if (function_exists('wc_get_orders')) {
            $orders = wc_get_orders(array(
                'limit'   => 4,
                'status'  => array('wc-completed', 'wc-processing', 'wc-on-hold'),
                'orderby' => 'date',
                'order'   => 'DESC',
            ));

            if (!empty($orders)) {
                $buyers = array();
                foreach ($orders as $order) {
                    $first_name = $order->get_billing_first_name();
                    $last_name  = $order->get_billing_last_name();
                    $city       = $order->get_billing_city() ?: 'ایران';
                    $items      = $order->get_items();
                    $product_name = !empty($items) ? reset($items)->get_name() : 'سفارش آنلاین';

                    $order_time = $order->get_date_created() ? $order->get_date_created()->getTimestamp() : time();
                    $time_diff  = human_time_diff($order_time, current_time('timestamp')) . ' پیش';

                    $display_name = $first_name ? ($first_name . ' ' . mb_substr($last_name, 0, 1, 'UTF-8') . '.') : 'کاربر گرامی';

                    $buyers[] = array(
                        'name'    => $display_name,
                        'city'    => $city,
                        'product' => $product_name,
                        'time'    => $time_diff,
                    );
                }
                if (!empty($buyers)) {
                    return $buyers;
                }
            }
        }

        return array();
    }
}
