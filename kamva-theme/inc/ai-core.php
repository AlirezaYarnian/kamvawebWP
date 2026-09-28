<?php
/**
 * KamvaWeb Autonomous Local Knowledge & Conversation Engine
 * این ماژول بدون نیاز به مصرف منابع سنگین سرور و به صورت خودمختار عمل می‌کند.
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_AI_Local_Brain {

    private static $instance = null;
    private $kb_option_key = 'kamvaweb_knowledge_base';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('save_post_product', array($this, 'auto_index_woocommerce_product'));
        add_action('save_post', array($this, 'auto_index_content'), 10, 2);
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/chat', array(
            'methods'  => 'POST',
            'callback' => array($this, 'handle_chat_request'),
            'permission_callback' => '__return_true',
        ));
    }

    public function handle_chat_request($request) {
        $params = $request->get_json_params();
        $user_query = sanitize_text_field($params['message'] ?? '');

        if (empty($user_query)) {
            return new WP_REST_Response(array('error' => 'پیام خالی است'), 400);
        }

        $knowledge_base = get_option($this->kb_option_key, array());
        $matched_item = $this->find_best_match($user_query, $knowledge_base);

        if ($matched_item) {
            $reply = $matched_item['content'];
            if (!empty($matched_item['price'])) {
                $reply .= "

💰 قیمت مصوب: " . $matched_item['price'];
            }
            if (!empty($matched_item['conversion_trigger'])) {
                $reply .= "
🎁 پیشنهاد شگفت‌انگیز: " . $matched_item['conversion_trigger'];
            }
            return new WP_REST_Response(array(
                'reply' => $reply,
                'source' => 'kamvaweb_local_brain',
            ), 200);
        }

        return new WP_REST_Response(array(
            'reply' => 'با سلام و نهایت احترام، پاسخ دقیق این پرسش تخصصی در پایگاه دانش محصولات ثبت نشده است. بسیار خوشحال می‌شوم اگر اجازه دهید شما را به **مشاور ارشد فروشگاه** وصل کنم تا راهنمایی کامل و کد تخفیف اختصاصی در اختیارتان قرار دهند. آیا مایل به برقراری ارتباط با مشاور فروش هستید؟',
            'source' => 'kamvaweb_local_consultant_referral',
            'connectToConsultant' => true,
            'consultantPhone' => '021-91000000',
        ), 200);
    }

    private function find_best_match($query, $kb) {
        $q = mb_strtolower($query, 'UTF-8');
        $best = null;
        $max_score = 0;

        foreach ($kb as $item) {
            $score = 0;
            $title = mb_strtolower($item['title'] ?? '', 'UTF-8');
            $content = mb_strtolower($item['content'] ?? '', 'UTF-8');
            
            if (!empty($item['keywords']) && is_array($item['keywords'])) {
                foreach ($item['keywords'] as $kw) {
                    if (mb_strpos($q, mb_strtolower($kw, 'UTF-8')) !== false) {
                        $score += 6;
                    }
                }
            }

            $words = explode(' ', $q);
            foreach ($words as $w) {
                if (mb_strlen($w) > 2) {
                    if (mb_strpos($title, $w) !== false) $score += 4;
                    if (mb_strpos($content, $w) !== false) $score += 1.5;
                }
            }

            if ($score > $max_score) {
                $max_score = $score;
                $best = $item;
            }
        }

        return $max_score > 0 ? $best : null;
    }

    public function auto_index_woocommerce_product($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        $product = wc_get_product($post_id);
        if (!$product) return;

        $kb = get_option($this->kb_option_key, array());
        $kb[] = array(
            'id' => 'prod-' . $post_id,
            'title' => $product->get_name(),
            'content' => wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
            'price' => wc_price($product->get_price()),
            'keywords' => explode(' ', $product->get_name()),
            'conversion_trigger' => 'ارسال فوری همراه با هدیه اختصاصی',
        );
        update_option($this->kb_option_key, $kb);
    }

    public function auto_index_content($post_id, $post) {
        if ($post->post_type !== 'post' || $post->post_status !== 'publish') return;
        $kb = get_option($this->kb_option_key, array());
        $kb[] = array(
            'id' => 'post-' . $post_id,
            'title' => $post->post_title,
            'content' => wp_strip_all_tags(wp_trim_words($post->post_content, 40)),
            'keywords' => explode(' ', $post->post_title),
        );
        update_option($this->kb_option_key, $kb);
    }
}

KamvaWeb_AI_Local_Brain::get_instance();
