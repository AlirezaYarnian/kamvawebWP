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
                'default' => esc_html__('پرسش‌های متداول خریداران و شرایط خرید', 'kamvaweb'),
            )
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'question',
            array(
                'label'       => esc_html__('سوال', 'kamvaweb'),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => esc_html__('زمان ارسال سفارشات چقدر است؟', 'kamvaweb'),
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'answer',
            array(
                'label'   => esc_html__('پاسخ', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXTAREA,
                'default' => esc_html__('سفارشات تهران در کوتاه‌ترین زمان با پیک اختصاصی و سایر شهرها با پست پیشتاز و تیپاکس ارسال می‌شوند.', 'kamvaweb'),
            )
        );

        $this->add_control(
            'faq_items',
            array(
                'label'       => esc_html__('آیتم‌های سوالات متداول', 'kamvaweb'),
                'type'        => \Elementor\Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'default'     => array(
                    array(
                        'question' => esc_html__('زمان تحویل سفارشات چگونه است؟', 'kamvaweb'),
                        'answer'   => esc_html__('تحویل در تهران روزانه و سراسر کشور طی ۲۴ الی ۴۸ ساعت کاری با کد رهگیری پستی انجام می‌شود.', 'kamvaweb'),
                    ),
                    array(
                        'question' => esc_html__('آیا امکان پرداخت اعتباری یا اقساطی وجود دارد؟', 'kamvaweb'),
                        'answer'   => esc_html__('بله، کلیه سفارشات واجد شرایط امکان پرداخت اقساطی ۴ ماهه بدون ضامن و کارمزد را دارند.', 'kamvaweb'),
                    ),
                    array(
                        'question' => esc_html__('ضمانت بازگشت و اصالت کالا به چه صورت است؟', 'kamvaweb'),
                        'answer'   => esc_html__('تمامی کالاها با گارانتی معتبر و مهلت تست ۷ روزه با تضمین ۱۰۰٪ اصالت ارائه می‌شوند.', 'kamvaweb'),
                    ),
                ),
                'title_field' => '{{{ question }}}',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $faq_items = $settings['faq_items'] ?? array();
        ?>
        <div class="kamvaweb-elementor-faq-card p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3" dir="rtl">
            <h4 class="font-bold text-white text-sm"><?php echo esc_html($settings['faq_title']); ?></h4>
            <?php if (!empty($faq_items)) : ?>
                <?php foreach ($faq_items as $index => $item) : ?>
                    <details class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300" <?php echo $index === 0 ? 'open' : ''; ?>>
                        <summary class="font-bold text-white cursor-pointer select-none"><?php echo esc_html($item['question']); ?></summary>
                        <p class="mt-2.5 text-slate-400 leading-relaxed"><?php echo esc_html($item['answer']); ?></p>
                    </details>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <?php
    }
}
