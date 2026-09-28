<?php
/**
 * Elementor Widget: KamvaWeb Interactive Product Stories
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_Elementor_Interactive_Stories_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'kamvaweb_interactive_stories';
    }

    public function get_title() {
        return esc_html__('استوری‌های تصویری و ویدیویی محصول کامواوب', 'kamvaweb');
    }

    public function get_icon() {
        return 'eicon-play-icon';
    }

    public function get_categories() {
        return array('kamvaweb-elements');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array('label' => esc_html__('تنظیمات استوری‌های محصول', 'kamvaweb'))
        );

        $this->add_control(
            'story_title',
            array(
                'label'   => esc_html__('عنوان بخش استوری‌ها', 'kamvaweb'),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'هایلایت‌ها و بررسی ویدیویی محصولات',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div class="kamvaweb-elementor-stories-widget p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h4 class="font-bold text-white text-xs mb-3"><?php echo esc_html($settings['story_title']); ?></h4>
            <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <div class="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-500 ring-2 ring-indigo-500/50">
                        <div class="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs">
                            📱
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-300 font-medium">آنباکس X15</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <div class="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-500 ring-2 ring-indigo-500/50">
                        <div class="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs">
                            🎧
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-300 font-medium">تست ANC</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <div class="w-14 h-14 rounded-full p-0.5 bg-slate-800">
                        <div class="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs">
                            🔥
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium">تخفیف ویژه</span>
                </div>
            </div>
        </div>
        <?php
    }
}
