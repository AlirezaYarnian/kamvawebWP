<?php
/**
 * Elementor Widget: KamvaWeb AI Product Advisor
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Product_Advisor_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_ai_product_advisor';
    }

    public function get_title() {
        return esc_html__('پیشنهاد دهنده هوشمند کالای مکمل کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-product-related';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات پیشنهادات هوشمند', 'kamvaweb'))
        );

        $this->add_control(
            'advisor_title',
            array(
                'label'   => esc_html__('عنوان بخش', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('مکمل‌های خریداران این محصول با تخفیف ویژه', 'kamvaweb'),
            )
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'item_title',
            array(
                'label'       => esc_html__('عنوان محصول مکمل', 'kamvaweb'),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => esc_html__('لوازم جانبی و بسته محافظتی', 'kamvaweb'),
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'discount_badge',
            array(
                'label'   => esc_html__('برچسب تخفیف یا ویژگی', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('تخفیف همراهی', 'kamvaweb'),
            )
        );

        $repeater->add_control(
            'item_link',
            array(
                'label'   => esc_html__('لینک محصول (اختیاری)', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::URL,
                'default' => array('url' => '#'),
            )
        );

        $this->add_control(
            'custom_items',
            array(
                'label'       => esc_html__('کالاهای مکمل دستی (در صورت عدم انتخاب خودکار)', 'kamvaweb'),
                'type'        => \Elementor\Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ item_title }}}',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        global $product;
        $items = array();

        // واکشی خودکار کالاهای مرتبط یا مکمل از ووکامرس
        if (is_a($product, 'WC_Product') && function_exists('wc_get_product')) {
            $related_ids = array_merge(
                $product->get_cross_sell_ids(),
                $product->get_upsell_ids()
            );

            if (empty($related_ids) && function_exists('wc_get_related_products')) {
                $related_ids = wc_get_related_products($product->get_id(), 2);
            }

            if (!empty($related_ids)) {
                foreach (array_slice($related_ids, 0, 2) as $rel_id) {
                    $rel_prod = wc_get_product($rel_id);
                    if ($rel_prod) {
                        $items[] = array(
                            'title'    => $rel_prod->get_name(),
                            'badge'    => $rel_prod->is_on_sale() ? esc_html__('تخفیف ویژه', 'kamvaweb') : esc_html__('پیشنهاد مکمل', 'kamvaweb'),
                            'url'      => get_permalink($rel_id),
                        );
                    }
                }
            }
        }

        // در صورت عدم وجود محصول ووکامرس، استفاده از آیتم‌های ریپیتر
        if (empty($items) && !empty($settings['custom_items'])) {
            foreach ($settings['custom_items'] as $c_item) {
                $items[] = array(
                    'title' => $c_item['item_title'],
                    'badge' => $c_item['discount_badge'],
                    'url'   => $c_item['item_link']['url'] ?? '#',
                );
            }
        }
        ?>
        <div class="kamvaweb-elementor-advisor-card p-5 bg-slate-900 border border-slate-800 rounded-2xl" dir="rtl">
            <h4 class="font-bold text-white text-sm mb-3"><?php echo esc_html($settings['advisor_title']); ?></h4>
            <?php if (!empty($items)) : ?>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <?php foreach ($items as $item) : ?>
                        <a href="<?php echo esc_url($item['url']); ?>" class="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all flex justify-between items-center group">
                            <span class="text-slate-200 group-hover:text-white transition-colors"><?php echo esc_html($item['title']); ?></span>
                            <span class="text-emerald-400 font-bold font-mono"><?php echo esc_html($item['badge']); ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else : ?>
                <p class="text-xs text-slate-400"><?php esc_html_e('محصولات مکمل پس از تنظیم در ووکامرس نمایش داده می‌شوند.', 'kamvaweb'); ?></p>
            <?php endif; ?>
        </div>
        <?php
    }
}
