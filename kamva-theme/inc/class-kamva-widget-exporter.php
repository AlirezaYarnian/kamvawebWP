<?php
/**
 * KamvaWidgetExporter - NexusAI & Elementor Component to Standard WordPress Widget Exporter
 * 
 * Automatically converts saved NexusAI Components and Elementor layouts into:
 * 1. Standard Classic WordPress Widget code (WP_Widget class).
 * 2. Elementor Custom Widget code (\Elementor\Widget_Base class).
 * 3. Standalone Deployable Custom Theme Plugin file (with plugin headers & asset enqueuing).
 * 
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWidgetExporter {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/widget-exporter/list', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_exportable_components'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/widget-exporter/convert', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_convert_request'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/widget-exporter/generate-plugin', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_generate_plugin_request'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * واکشی لیست کامپوننت‌های نکسوس قابل تبدیل به ویجت
     */
    public function get_exportable_components() {
        if (class_exists('NexusAI_Pattern_Library')) {
            $patterns = NexusAI_Pattern_Library::get_instance()->get_all_patterns();
        } else {
            $patterns = get_option('nexusai_global_patterns_library', array());
        }

        $list = array();
        foreach ($patterns as $p) {
            $list[] = array(
                'id'          => $p['id'],
                'name'        => $p['name'],
                'nameFa'      => $p['nameFa'] ?? $p['name'],
                'category'    => $p['category'] ?? 'general',
                'description' => $p['descriptionFa'] ?? ($p['description'] ?? ''),
                'version'     => $p['version'] ?? '1.0.0',
                'hasCss'      => !empty($p['customCss']),
                'hasJs'       => !empty($p['customJs']),
            );
        }

        return new WP_REST_Response(array('success' => true, 'components' => $list), 200);
    }

    /**
     * پردازش تبدیل کامپوننت به کد PHP استاندارد وردپرس
     */
    public function handle_convert_request($request) {
        $params = $request->get_json_params() ?: $_POST;
        $component_id = sanitize_text_field($params['componentId'] ?? '');
        $target_format = sanitize_text_field($params['targetFormat'] ?? 'elementor'); // 'elementor' or 'wp_widget'

        if (empty($component_id)) {
            return new WP_REST_Response(array('error' => 'شناسه کامپوننت الزامی است'), 400);
        }

        $component = $this->find_component_by_id($component_id);
        if (!$component) {
            return new WP_REST_Response(array('error' => 'کامپوننت مورد نظر یافت نشد'), 404);
        }

        if ($target_format === 'wp_widget') {
            $code = $this->generate_classic_wp_widget_code($component);
            $filename = 'class-widget-' . sanitize_title($component['id']) . '.php';
        } else {
            $code = $this->generate_elementor_widget_code($component);
            $filename = 'class-elementor-' . sanitize_title($component['id']) . '.php';
        }

        return new WP_REST_Response(array(
            'success'      => true,
            'componentId'  => $component['id'],
            'componentName'=> $component['nameFa'] ?? $component['name'],
            'targetFormat' => $target_format,
            'phpCode'      => $code,
            'filename'     => $filename,
            'lineCount'    => substr_count($code, "\n") + 1,
        ), 200);
    }

    /**
     * تولید کد افزونه مستقل و کامل وردپرس برای انتشار در سایر سایت‌ها
     */
    public function handle_generate_plugin_request($request) {
        $params = $request->get_json_params() ?: $_POST;
        $component_ids = (array)($params['componentIds'] ?? array());
        $plugin_name = sanitize_text_field($params['pluginName'] ?? 'Kamva NexusAI Widget Suite');
        $plugin_desc = sanitize_text_field($params['pluginDesc'] ?? 'مجموعه ویجت‌های فوق‌سریع و هوشمند صادر شده از کامواوب پرو');

        if (empty($component_ids)) {
            return new WP_REST_Response(array('error' => 'حداقل یک کامپوننت باید انتخاب شود'), 400);
        }

        $components = array();
        foreach ($component_ids as $cid) {
            $comp = $this->find_component_by_id($cid);
            if ($comp) {
                $components[] = $comp;
            }
        }

        $plugin_php = $this->generate_full_plugin_package_code($components, $plugin_name, $plugin_desc);
        $slug = sanitize_title($plugin_name);

        return new WP_REST_Response(array(
            'success'       => true,
            'pluginName'    => $plugin_name,
            'pluginSlug'    => $slug,
            'mainFile'      => $slug . '.php',
            'fullPluginCode'=> $plugin_php,
            'bundledCount'  => count($components),
        ), 200);
    }

    /**
     * تولید کد ویجت المنتور (\Elementor\Widget_Base)
     */
    public function generate_elementor_widget_code($comp) {
        $class_name = 'Kamva_Elementor_' . str_replace(' ', '_', ucwords(str_replace('-', ' ', $comp['id']))) . '_Widget';
        $widget_name = 'kamva_' . str_replace('-', '_', $comp['id']);
        $title_fa = $comp['nameFa'] ?? $comp['name'];
        $html_escaped = addslashes($comp['liveDemoHtml'] ?? '<div>محتوای ویجت</div>');
        $css_escaped = addslashes($comp['customCss'] ?? '');
        $js_escaped = addslashes($comp['customJs'] ?? '');

        $code = "<?php\n";
        $code .= "/**\n";
        $code .= " * Auto-Generated Elementor Widget: {$comp['name']}\n";
        $code .= " * Exported via KamvaWidgetExporter from KamvaWeb Pro Theme\n";
        $code .= " * @package KamvaWeb\n";
        $code .= " */\n\n";
        $code .= "if (!defined('ABSPATH')) exit;\n\n";
        $code .= "class {$class_name} extends \\Elementor\\Widget_Base {\n\n";
        $code .= "    public function get_name() {\n";
        $code .= "        return '{$widget_name}';\n";
        $code .= "    }\n\n";
        $code .= "    public function get_title() {\n";
        $code .= "        return esc_html__('{$title_fa}', 'kamvaweb');\n";
        $code .= "    }\n\n";
        $code .= "    public function get_icon() {\n";
        $code .= "        return 'eicon-star';\n";
        $code .= "    }\n\n";
        $code .= "    public function get_categories() {\n";
        $code .= "        return array('kamvaweb-elements', 'general');\n";
        $code .= "    }\n\n";
        $code .= "    protected function register_controls() {\n";
        $code .= "        \$this->start_controls_section(\n";
        $code .= "            'section_content',\n";
        $code .= "            array('label' => esc_html__('تنظیمات محتوا', 'kamvaweb'))\n";
        $code .= "        );\n\n";
        $code .= "        \$this->add_control(\n";
        $code .= "            'widget_title',\n";
        $code .= "            array(\n";
        $code .= "                'label'   => esc_html__('عنوان ویجت', 'kamvaweb'),\n";
        $code .= "                'type'    => \\Elementor\\Controls_Manager::TEXT,\n";
        $code .= "                'default' => esc_html__('{$title_fa}', 'kamvaweb'),\n";
        $code .= "            )\n";
        $code .= "        );\n\n";
        $code .= "        \$this->end_controls_section();\n";
        $code .= "    }\n\n";
        $code .= "    protected function render() {\n";
        $code .= "        \$settings = \$this->get_settings_for_display();\n";
        $code .= "        ?>\n";
        if (!empty($css_escaped)) {
            $code .= "        <style>\n";
            $code .= "        {$comp['customCss']}\n";
            $code .= "        </style>\n";
        }
        $code .= "        <div class=\"kamva-nexus-widget-container kamva-{$comp['id']}\" dir=\"rtl\">\n";
        $code .= "            " . trim($comp['liveDemoHtml'] ?? '') . "\n";
        $code .= "        </div>\n";
        if (!empty($js_escaped)) {
            $code .= "        <script>\n";
            $code .= "        (function() {\n";
            $code .= "            {$comp['customJs']}\n";
            $code .= "        })();\n";
            $code .= "        </script>\n";
        }
        $code .= "        <?php\n";
        $code .= "    }\n";
        $code .= "}\n";

        return $code;
    }

    /**
     * تولید کد ویجت کلاسیک وردپرس (WP_Widget)
     */
    public function generate_classic_wp_widget_code($comp) {
        $class_name = 'Kamva_WP_' . str_replace(' ', '_', ucwords(str_replace('-', ' ', $comp['id']))) . '_Widget';
        $widget_id = 'kamva_classic_' . str_replace('-', '_', $comp['id']);
        $title_fa = $comp['nameFa'] ?? $comp['name'];

        $code = "<?php\n";
        $code .= "/**\n";
        $code .= " * Auto-Generated Classic WordPress Widget: {$comp['name']}\n";
        $code .= " * Exported via KamvaWidgetExporter\n";
        $code .= " */\n\n";
        $code .= "if (!defined('ABSPATH')) exit;\n\n";
        $code .= "class {$class_name} extends WP_Widget {\n\n";
        $code .= "    public function __construct() {\n";
        $code .= "        parent::__construct(\n";
        $code .= "            '{$widget_id}',\n";
        $code .= "            esc_html__('کامواوب: {$title_fa}', 'kamvaweb'),\n";
        $code .= "            array('description' => esc_html__('{$comp['descriptionFa']}', 'kamvaweb'))\n";
        $code .= "        );\n";
        $code .= "    }\n\n";
        $code .= "    public function widget(\$args, \$instance) {\n";
        $code .= "        echo \$args['before_widget'];\n";
        $code .= "        if (!empty(\$instance['title'])) {\n";
        $code .= "            echo \$args['before_title'] . apply_filters('widget_title', \$instance['title']) . \$args['after_title'];\n";
        $code .= "        }\n";
        $code .= "        ?>\n";
        if (!empty($comp['customCss'])) {
            $code .= "        <style>{$comp['customCss']}</style>\n";
        }
        $code .= "        <div class=\"kamva-classic-widget-content\" dir=\"rtl\">\n";
        $code .= "            " . trim($comp['liveDemoHtml'] ?? '') . "\n";
        $code .= "        </div>\n";
        $code .= "        <?php\n";
        $code .= "        echo \$args['after_widget'];\n";
        $code .= "    }\n\n";
        $code .= "    public function form(\$instance) {\n";
        $code .= "        \$title = !empty(\$instance['title']) ? \$instance['title'] : esc_html__('{$title_fa}', 'kamvaweb');\n";
        $code .= "        ?>\n";
        $code .= "        <p>\n";
        $code .= "            <label for=\"<?php echo esc_attr(\$this->get_field_id('title')); ?>\"><?php esc_html_e('عنوان:', 'kamvaweb'); ?></label>\n";
        $code .= "            <input class=\"widefat\" id=\"<?php echo esc_attr(\$this->get_field_id('title')); ?>\" name=\"<?php echo esc_attr(\$this->get_field_name('title')); ?>\" type=\"text\" value=\"<?php echo esc_attr(\$title); ?>\">\n";
        $code .= "        </p>\n";
        $code .= "        <?php\n";
        $code .= "    }\n\n";
        $code .= "    public function update(\$new_instance, \$old_instance) {\n";
        $code .= "        \$instance = array();\n";
        $code .= "        \$instance['title'] = (!empty(\$new_instance['title'])) ? sanitize_text_field(\$new_instance['title']) : '';\n";
        $code .= "        return \$instance;\n";
        $code .= "    }\n";
        $code .= "}\n\n";
        $code .= "add_action('widgets_init', function() {\n";
        $code .= "    register_widget('{$class_name}');\n";
        $code .= "});\n";

        return $code;
    }

    /**
     * تولید کل ساختار افزونه استاندارد وردپرس
     */
    public function generate_full_plugin_package_code($components, $name, $desc) {
        $code = "<?php\n";
        $code .= "/**\n";
        $code .= " * Plugin Name:       {$name}\n";
        $code .= " * Plugin URI:        https://kamvaweb.com/\n";
        $code .= " * Description:       {$desc}\n";
        $code .= " * Version:           1.0.0\n";
        $code .= " * Author:            KamvaWeb Neural Systems\n";
        $code .= " * Author URI:        https://kamvaweb.com/\n";
        $code .= " * Text Domain:       kamva-nexus-addon\n";
        $code .= " * Domain Path:       /languages\n";
        $code .= " */\n\n";
        $code .= "if (!defined('ABSPATH')) exit;\n\n";
        $code .= "define('KAMVA_NEXUS_ADDON_VERSION', '1.0.0');\n\n";

        // هوک ثبت المنتور
        $code .= "add_action('elementor/widgets/register', function(\$widgets_manager) {\n";
        $code .= "    if (!did_action('elementor/loaded')) return;\n\n";

        foreach ($components as $comp) {
            $class_name = 'Kamva_Elementor_' . str_replace(' ', '_', ucwords(str_replace('-', ' ', $comp['id']))) . '_Widget';
            $code .= "    // ثبت ویجت: {$comp['name']}\n";
            $code .= "    if (class_exists('{$class_name}')) {\n";
            $code .= "        \$widgets_manager->register(new {$class_name}());\n";
            $code .= "    }\n";
        }

        $code .= "});\n\n";

        // تعریف کلاس‌های ویجت المنتور درون بدنه افزونه
        foreach ($components as $comp) {
            $widget_subcode = $this->generate_elementor_widget_code($comp);
            // حذف تگ شروع PHP
            $widget_subcode = preg_replace('/^<\?php\s*/', '', $widget_subcode);
            $code .= "\n" . $widget_subcode . "\n";
        }

        return $code;
    }

    private function find_component_by_id($id) {
        if (class_exists('NexusAI_Pattern_Library')) {
            $patterns = NexusAI_Pattern_Library::get_instance()->get_all_patterns();
        } else {
            $patterns = get_option('nexusai_global_patterns_library', array());
        }

        foreach ($patterns as $p) {
            if ($p['id'] === $id) {
                return $p;
            }
        }
        return null;
    }
}

KamvaWidgetExporter::get_instance();
