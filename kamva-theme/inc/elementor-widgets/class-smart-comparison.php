<?php
/**
 * KamvaWeb Smart Product Comparison Matrix Widget for Elementor
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Smart_Comparison_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_smart_comparison';
    }

    public function get_title() {
        return esc_html__('جدول مقایسه هوشمند محصولات (Kamva)', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-table-plugin';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات جدول مقایسه', 'kamvaweb'))
        );

        $this->add_control(
            'table_title',
            array(
                'label' => esc_html__('عنوان جدول', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('مقایسه هوشمند و سریع مشخصات فنی', 'kamvaweb'),
            )
        );

        $this->add_control(
            'highlight_diff',
            array(
                'label' => esc_html__('دکمه برجسته‌سازی تفاوت‌ها', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'default' => 'yes',
            )
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'feature_name',
            array(
                'label' => esc_html__('نام ویژگی / مشخصه', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('پردازنده / موتور', 'kamvaweb'),
            )
        );

        $repeater->add_control(
            'item_val_1',
            array(
                'label' => esc_html__('مقدار محصول ۱', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('هوش مصنوعی M3 Pro', 'kamvaweb'),
            )
        );

        $repeater->add_control(
            'item_val_2',
            array(
                'label' => esc_html__('مقدار محصول ۲', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('هوش مصنوعی M2 Ultra', 'kamvaweb'),
            )
        );

        $repeater->add_control(
            'item_val_3',
            array(
                'label' => esc_html__('مقدار محصول ۳', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('هوش مصنوعی Snapdragon X', 'kamvaweb'),
            )
        );

        $this->add_control(
            'features_list',
            array(
                'label' => esc_html__('ردیف‌های مقایسه', 'kamvaweb'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'default' => array(
                    array(
                        'feature_name' => esc_html__('پردازنده اصلی', 'kamvaweb'),
                        'item_val_1' => esc_html__('M3 Pro (12 Cores)', 'kamvaweb'),
                        'item_val_2' => esc_html__('M2 Ultra (24 Cores)', 'kamvaweb'),
                        'item_val_3' => esc_html__('Snapdragon X Elite', 'kamvaweb'),
                    ),
                    array(
                        'feature_name' => esc_html__('حافظه رم (RAM)', 'kamvaweb'),
                        'item_val_1' => esc_html__('36GB Unified', 'kamvaweb'),
                        'item_val_2' => esc_html__('64GB Unified', 'kamvaweb'),
                        'item_val_3' => esc_html__('32GB LPDDR5X', 'kamvaweb'),
                    ),
                    array(
                        'feature_name' => esc_html__('شارژدهی باتری', 'kamvaweb'),
                        'item_val_1' => esc_html__('۱۸ ساعت کاربرد مداوم', 'kamvaweb'),
                        'item_val_2' => esc_html__('۱۴ ساعت کاربرد مداوم', 'kamvaweb'),
                        'item_val_3' => esc_html__('۲۲ ساعت کاربرد مداوم', 'kamvaweb'),
                    ),
                    array(
                        'feature_name' => esc_html__('گارانتی و تضمین کیفیت', 'kamvaweb'),
                        'item_val_1' => esc_html__('۱۸ ماه گارانتی طلایی کامواوب', 'kamvaweb'),
                        'item_val_2' => esc_html__('۱۸ ماه گارانتی طلایی کامواوب', 'kamvaweb'),
                        'item_val_3' => esc_html__('۲۴ ماه گارانتی ویژه', 'kamvaweb'),
                    ),
                ),
                'title_field' => '{{{ feature_name }}}',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamva-comparison-wrapper my-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-xl" dir="rtl">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <h3 class="text-xl font-bold text-amber-400 flex items-center gap-2">
                    <span class="p-2 bg-amber-500/10 rounded-lg text-amber-400">⚖️</span>
                    <?php echo esc_html($settings['table_title']); ?>
                </h3>
                <?php if ('yes' === $settings['highlight_diff']) : ?>
                    <button onclick="this.closest('.kamva-comparison-wrapper').classList.toggle('highlight-differences')" class="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5">
                        <span>💡</span>
                        <span>برجسته‌سازی تفاوت‌ها</span>
                    </button>
                <?php endif; ?>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-right border-collapse min-w-[600px]">
                    <thead>
                        <tr class="bg-slate-950/60 border-b border-slate-800 text-slate-300">
                            <th class="p-3.5 font-semibold text-sm w-1/4">مشخصات فنی</th>
                            <th class="p-3.5 font-semibold text-sm text-center text-amber-400">مدل A (پیشنهاد هوشمند)</th>
                            <th class="p-3.5 font-semibold text-sm text-center text-emerald-400">مدل B (پرفروش‌ترین)</th>
                            <th class="p-3.5 font-semibold text-sm text-center text-cyan-400">مدل C (اقتصادی)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60 text-sm">
                        <?php foreach ($settings['features_list'] as $index => $item) : ?>
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-3.5 font-medium text-slate-300 bg-slate-950/30"><?php echo esc_html($item['feature_name']); ?></td>
                                <td class="p-3.5 text-center text-slate-200"><?php echo esc_html($item['item_val_1']); ?></td>
                                <td class="p-3.5 text-center text-slate-200"><?php echo esc_html($item['item_val_2']); ?></td>
                                <td class="p-3.5 text-center text-slate-200"><?php echo esc_html($item['item_val_3']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <tfoot>
                        <tr class="bg-slate-950/40">
                            <td class="p-3.5 text-xs text-slate-400">عملیات خرید</td>
                            <td class="p-3.5 text-center">
                                <a href="#" class="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all">افزودن مدل A به سبد</a>
                            </td>
                            <td class="p-3.5 text-center">
                                <a href="#" class="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all">افزودن مدل B به سبد</a>
                            </td>
                            <td class="p-3.5 text-center">
                                <a href="#" class="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-all">مشاهده جزییات</a>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <?php
    }
}
