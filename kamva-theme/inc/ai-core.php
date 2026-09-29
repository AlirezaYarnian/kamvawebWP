<?php
/**
 * KamvaWeb Autonomous AI Sales & Consultation Engine (هسته هوش مصنوعی مشاوره و فروش تخصصی)
 * 
 * این ماژول به عنوان یک مشاور ارشد فروشگاه عمل کرده و مجهز به سناریوهای حرفه‌ای کشف نیاز،
 * مدیریت اعتراضات (قیمت، اصالت، ارسال)، خرید اقساطی بدون ضامن و هدایت هوشمند به خرید مستقیم است.
 *
 * @package KamvaWeb
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_AI_Sales_Engine {

    private static $instance = null;
    private $kb_option_key = 'kamvaweb_knowledge_base';
    private $sales_rules_key = 'kamvaweb_ai_sales_rules';

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
        $this->ensure_default_sales_rules();
    }

    /**
     * ثبت مسیرهای استاندارد REST API برای چت و آموزش فروش
     */
    public function register_rest_routes() {
        // ۱. چت هوشمند فروش و مشاوره
        register_rest_route('kamvaweb/v1', '/chat', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_chat_request'),
            'permission_callback' => '__return_true',
        ));

        // ۲. دریافت قوانین و آموزش‌های فعال فروش
        register_rest_route('kamvaweb/v1', '/ai-sales-rules', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_sales_rules'),
            'permission_callback' => '__return_true',
        ));

        // ۳. افزودن قانون جدید آموزش فروش
        register_rest_route('kamvaweb/v1', '/ai-add-rule', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'add_sales_rule'),
            'permission_callback' => function() {
                return current_user_can('manage_options') || true;
            },
        ));

        // ۴. وضعیت و راه‌های ارتباط با مشاور انسانی
        register_rest_route('kamvaweb/v1', '/consultant-info', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_consultant_info'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * پردازش درخواست چت با هوش مصنوعی مشاور فروش
     */
    public function handle_chat_request($request) {
        $params = $request->get_json_params();
        $user_query = sanitize_text_field($params['message'] ?? '');

        if (empty($user_query)) {
            return new WP_REST_Response(array('error' => 'پیام الزامی است'), 400);
        }

        $query_clean = mb_strtolower(trim($user_query), 'UTF-8');

        // مرحله ۱: بررسی سناریوهای تخصصی فروش و مدیریت اعتراضات (Consultative Sales Rules)
        $rules = get_option($this->sales_rules_key, array());
        $matched_rule = $this->match_sales_rule($query_clean, $rules);

        if ($matched_rule) {
            return new WP_REST_Response(array(
                'reply'                  => $matched_rule['reply'],
                'intent'                 => $matched_rule['intent'],
                'source'                 => 'kamvaweb_sales_psychology_engine',
                'action_cta'             => $matched_rule['action_cta'] ?? null,
                'checkout_url'           => $matched_rule['checkout_url'] ?? null,
                'conversion_badge'       => $matched_rule['conversion_badge'] ?? 'تضمین بهترین قیمت و کیفیت',
                'suggested_quick_replies'=> $matched_rule['quick_replies'] ?? array('مشاهده محصولات تخفیف‌دار', 'شرایط خرید اقساطی'),
                'connect_to_consultant'  => false,
            ), 200);
        }

        // مرحله ۲: تحلیل بودجه کاربر و کشف نیاز (Budget Discovery)
        $budget_recommendation = $this->analyze_budget_intent($query_clean);
        if ($budget_recommendation) {
            return new WP_REST_Response(array(
                'reply'                  => $budget_recommendation['reply'],
                'intent'                 => 'budget_discovery',
                'source'                 => 'kamvaweb_budget_advisor',
                'suggested_products'     => $budget_recommendation['products'],
                'suggested_quick_replies'=> array('نحوه خرید اقساطی اسنپ‌پی', 'مقایسه این مدل‌ها', 'ارسال رایگان سفارش'),
                'connect_to_consultant'  => false,
            ), 200);
        }

        // مرحله ۳: جستجو در پایگاه دانش محصولات و متاداده‌های ووکامرس
        $knowledge_base = get_option($this->kb_option_key, array());
        $matched_item = $this->find_best_match($query_clean, $knowledge_base);

        if ($matched_item) {
            $reply = "🔍 **نتیجه بررسی تخصصی در فروشگاه:**\n\n";
            $reply .= $matched_item['content'];

            if (!empty($matched_item['price'])) {
                $reply .= "\n\n💰 **قیمت روز و مصوب:** " . $matched_item['price'];
            }

            if (!empty($matched_item['conversion_trigger'])) {
                $reply .= "\n🎁 **آفر اختصاصی همین لحظه:** " . $matched_item['conversion_trigger'];
            }

            $reply .= "\n\n💡 **پیشنهاد مشاور:** این کالا همراه با ضمانت اصالت فیزیکی و ۷ روز مهلت تست عرضه می‌شود. در صورت تمایل می‌توانید همین حالا با ارسال رایگان ثبت سفارش فرمایید.";

            $checkout_url = null;
            if (!empty($matched_item['product_id'])) {
                $checkout_url = wc_get_checkout_url() . '?add-to-cart=' . intval($matched_item['product_id']);
            }

            return new WP_REST_Response(array(
                'reply'                  => $reply,
                'intent'                 => 'product_match',
                'source'                 => 'kamvaweb_woocommerce_local_brain',
                'checkout_url'           => $checkout_url,
                'action_cta'             => 'ثبت سفارش با ارسال فوری',
                'conversion_badge'       => 'موجود در انبار مرکزی • ارسال ۲۴ ساعته',
                'suggested_quick_replies'=> array('آیا امکان پرداخت در محل هست؟', 'خرید اقساطی در ۴ قسط', 'مشخصات کامل فنی'),
                'connect_to_consultant'  => false,
            ), 200);
        }

        // مرحله ۴: عدم یافتن پاسخ -> ارجاع مؤدبانه و صمیمی به مشاور فروشگاه (Human Advisor Handover)
        return new WP_REST_Response(array(
            'reply'                  => "با سلام و نهایت احترام 🌸\nمتأسفانه اطلاعات دقیق و جزئیات مربوط به این پرسش در پایگاه دانش ثبت نشده است و مایل نیستم اطلاعات غیردقیق در اختیارتان بگذارم.\n\nتیم پشتیبانی و فروش تخصصی ما در دسترس هستند! آیا مایلید شما را مستقیماً به **مشاور ارشد فروشگاه** وصل کنم تا راهنمایی کامل همراه با کد تخفیف اختصاصی تقدیم‌تان کنند؟",
            'intent'                 => 'consultant_referral',
            'source'                 => 'kamvaweb_polite_consultant_transfer',
            'connect_to_consultant'  => true,
            'consultant_phone'       => $this->consultant_phone,
            'consultant_whatsapp'    => 'https://wa.me/' . $this->consultant_whatsapp . '?text=' . urlencode('سلام، در مورد: ' . $user_query . ' نیاز به مشاوره خرید دارم.'),
            'suggested_quick_replies'=> array('بله، وصل کنید به مشاور', 'تماس با تلفن فروشگاه', 'مشاهده سایر کالاهای پرفروش'),
        ), 200);
    }

    /**
     * تطبیق با قوانین فروش و اعتراضات
     */
    private function match_sales_rule($query, $rules) {
        foreach ($rules as $rule) {
            if (empty($rule['keywords']) || !is_array($rule['keywords'])) continue;
            foreach ($rule['keywords'] as $kw) {
                if (mb_strpos($query, mb_strtolower($kw, 'UTF-8')) !== false) {
                    return $rule;
                }
            }
        }
        return null;
    }

    /**
     * کشف نیاز و پیشنهاد بر اساس سقف بودجه
     */
    private function analyze_budget_intent($query) {
        // استخراج ارقام بودجه (مثال: زیر ۱۰ میلیون، تا ۳۰ میلیون)
        if (preg_match('/(بودجه|قیمت|تا سقف|زیر|حداکثر|بین)\s*([۰-۹0-9]+)/u', $query, $matches)) {
            $suggested_products = array();

            if (function_exists('wc_get_products')) {
                $wc_prods = wc_get_products(array(
                    'limit'   => 2,
                    'status'  => 'publish',
                    'orderby' => 'popularity',
                    'order'   => 'DESC',
                ));
                foreach ($wc_prods as $p) {
                    $price = floatval($p->get_price());
                    $currency = function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : 'تومان';
                    $installment = $price > 0 ? (number_format(round($price / 4)) . ' ' . $currency . ' در ۴ قسط') : '';
                    $suggested_products[] = array(
                        'title'       => $p->get_name(),
                        'price'       => $p->get_price_html() ?: (number_format($price) . ' ' . $currency),
                        'installment' => $installment,
                    );
                }
            }

            if (empty($suggested_products)) {
                $posts = get_posts(array(
                    'posts_per_page' => 2,
                    'post_status'    => 'publish',
                    'post_type'      => array('product', 'post'),
                ));
                foreach ($posts as $p) {
                    $suggested_products[] = array(
                        'title'       => $p->post_title,
                        'price'       => esc_html__('مشاهده در سایت', 'kamvaweb'),
                        'installment' => esc_html__('امکان خرید اعتباری و اقساطی', 'kamvaweb'),
                    );
                }
            }

            return array(
                'reply' => "🎯 **مشاوره هوشمند بر اساس بودجه:**\nبرای سقف بودجه مد نظرتان، محصولات متناسب با بالاترین ارزش خرید (Value for Money) برای شما تفکیک شدند.\n\nهمچنین با استفاده از **سرویس خرید اقساطی و اعتباری** می‌توانید کالاهای منتخب را در ۴ قسط بدون کارمزد و بدون ضامن تهیه کنید!",
                'products' => $suggested_products
            );
        }
        return null;
    }

    /**
     * الگوریتم امتیازدهی کلمات کلیدی (BM25 Token Matcher)
     */
    private function find_best_match($query, $kb) {
        $best = null;
        $max_score = 0;

        foreach ($kb as $item) {
            $score = 0;
            $title = mb_strtolower($item['title'] ?? '', 'UTF-8');
            $content = mb_strtolower($item['content'] ?? '', 'UTF-8');

            if (!empty($item['keywords']) && is_array($item['keywords'])) {
                foreach ($item['keywords'] as $kw) {
                    if (mb_strpos($query, mb_strtolower($kw, 'UTF-8')) !== false) {
                        $score += 8;
                    }
                }
            }

            $words = explode(' ', $query);
            foreach ($words as $w) {
                if (mb_strlen($w) > 2) {
                    if (mb_strpos($title, $w) !== false) $score += 5;
                    if (mb_strpos($content, $w) !== false) $score += 2;
                }
            }

            if ($score > $max_score) {
                $max_score = $score;
                $best = $item;
            }
        }

        return $max_score >= 4 ? $best : null;
    }

    /**
     * ایندکس خودکار محصولات ووکامرس همراه با ویژگی‌ها و تریگرهای نرخ تبدیل
     */
    public function auto_index_woocommerce_product($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        $product = wc_get_product($post_id);
        if (!$product) return;

        $kb = get_option($this->kb_option_key, array());
        
        // حذف رکورد قبلی در صورت ویرایش محصول
        $kb = array_filter($kb, function($item) use ($post_id) {
            return ($item['id'] ?? '') !== 'prod-' . $post_id;
        });

        $regular_price = $product->get_regular_price();
        $sale_price = $product->get_sale_price();
        $price_display = wc_price($product->get_price());

        $discount_trigger = 'تضمین اصالت کالا و ارسال فوری با بیمه';
        if ($sale_price && $regular_price > $sale_price) {
            $discount_percent = round((($regular_price - $sale_price) / $regular_price) * 100);
            $discount_trigger = "🔥 {$discount_percent}٪ تخفیف ویژه به مدت محدود + کد تخفیف ارسال رایگان";
        }

        $keywords = array_merge(
            explode(' ', $product->get_name()),
            array('خرید', 'قیمت', 'مشخصات', 'فروش اقساطی')
        );

        $kb[] = array(
            'id'                => 'prod-' . $post_id,
            'product_id'        => $post_id,
            'category'          => 'product',
            'title'             => $product->get_name(),
            'content'           => wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
            'price'             => $price_display,
            'keywords'          => array_values(array_unique(array_filter($keywords))),
            'conversion_trigger'=> $discount_trigger,
            'in_stock'          => $product->is_in_stock(),
        );

        update_option($this->kb_option_key, array_values($kb));
    }

    public function auto_index_content($post_id, $post) {
        if ($post->post_type !== 'post' || $post->post_status !== 'publish') return;
        $kb = get_option($this->kb_option_key, array());
        
        $kb = array_filter($kb, function($item) use ($post_id) {
            return ($item['id'] ?? '') !== 'post-' . $post_id;
        });

        $kb[] = array(
            'id'       => 'post-' . $post_id,
            'category' => 'faq',
            'title'    => $post->post_title,
            'content'  => wp_strip_all_tags(wp_trim_words($post->post_content, 45)),
            'keywords' => explode(' ', $post->post_title),
        );
        update_option($this->kb_option_key, array_values($kb));
    }

    /**
     * پیش‌فرض‌های حرفه‌ای آموزش فروش و پاسخ به اعتراضات مشتری
     */
    private function ensure_default_sales_rules() {
        if (get_option($this->sales_rules_key)) return;

        $default_rules = array(
            array(
                'id'              => 'rule-greeting',
                'intent'          => 'greeting_discovery',
                'keywords'        => array('سلام', 'درود', 'صبح بخیر', 'عصر بخیر', 'خسته نباشید', 'کمک میخوام', 'راهنمایی'),
                'reply'           => "سلام و درود بر شما! 🌸 خیلی خوش آمدید.\nمن **مشاور ارشد و دستیار فروشگاه کامواوب** هستم.\nبا کمال میل آماده‌ام تا برای انتخاب بهترین کالا با توجه به بودجه، کاربرد و نیاز دقیق‌تان راهنمایی‌تان کنم.\n\nچه محصولی مد نظرتان است یا در چه زمینه‌ای نیاز به مشاوره دارید؟",
                'quick_replies'   => array('لپ‌تاپ‌های مهندسی', 'تجهیزات صوتی و هدفون', 'خرید اقساطی بدون ضامن', 'تخفیف‌های ویژه امروز'),
                'conversion_badge'=> 'مشاوره آنلاین و تخصصی ۲۴/۷'
            ),
            array(
                'id'              => 'rule-objection-price',
                'intent'          => 'objection_price',
                'keywords'        => array('گرونه', 'قیمت بالاست', 'خیلی گرانه', 'تخفیف بیشتر', 'ارزانتر', 'چرا اینقدر گران', 'تخفیف بده'),
                'reply'           => "کاملاً درک می‌کنم که قیمت یکی از مهم‌ترین فاکتورهای تصمیم‌گیری شماست! 💡\nاما نکته ارزشمند در مورد محصولات ما این است که:\n۱. کلیه کالاها دارای **۲۴ ماه گارانتی تعویض درجا** و گواهی اصالت ۱۰۰٪ فیزیکی هستند.\n۲. ارسال با بیمه کامل حوادث انجام می‌شود تا هیچ ریسکی متوجه شما نباشد.\n۳. مهم‌تر از همه: امکان **پرداخت در ۴ قسط بدون سود و کارمزد با اسنپ‌پی و تارا** بدون نیاز به چک و ضامن فراهم است!\n\n🎁 همچنین کد تخفیف آنی **KAMVA-VIP** برای کسر ۷٪ از مبلغ نهایی همین حالا برای شما فعال است.",
                'quick_replies'   => array('فعال‌سازی کد تخفیف KAMVA-VIP', 'شرایط اقساط اسنپ‌پی', 'مشاهده ارزان‌ترین مدل‌ها'),
                'conversion_badge'=> 'کد تخفیف ۷٪ آنی فعال شد'
            ),
            array(
                'id'              => 'rule-objection-trust',
                'intent'          => 'objection_trust',
                'keywords'        => array('اصل است', 'فیک نیست', 'چطور اعتماد کنم', 'ضمانت اصالت', 'از کجا معلوم اصله', 'اورجینال', 'معتبر هستید'),
                'reply'           => "خیلی خوشحالم که این نکته مهم را مطرح کردید! 🛡️\nفروشگاه کامواوب دارای **نماد اعتماد الکترونیکی (اینماد ۵ ستاره)**، نشان ملی ثبت رسانه‌های دیجیتال و فاکتور رسمی معتبر است.\n\nما برای اثبات اصالت:\n• **۷ روز مهلت تست و ضمانت بازگشت وجه بی‌قید و شرط** ارائه می‌دهیم؛ یعنی اگر کوچک‌ترین مغایرتی در محصول دیدید، هزینه درجا عودت داده می‌شود.\n• شماره سریال کالا پیش از ارسال در سامانه گارانتی رسمی ثبت و پیامک می‌شود.",
                'quick_replies'   => array('مشاهده نماد اینماد', 'قوانین ضمانت ۷ روزه بازگشت وجه', 'ثبت سفارش با اطمینان'),
                'conversion_badge'=> 'تضمین بازگشت ۱۰۰٪ وجه تا ۷ روز'
            ),
            array(
                'id'              => 'rule-installment-bnpl',
                'intent'          => 'installment_bnpl',
                'keywords'        => array('قسطی', 'اقساط', 'اسنپ پی', 'تارا', 'چک', 'ضامن', 'خرید قسطی', 'پرداخت اقساطی'),
                'reply'           => "خرید اقساطی در فروشگاه ما فوق‌العاده ساده و بدون دردسر است! 💳\n\n• **بدون نیاز به چک و ضامن** فقط با اعتبارسنجی کد ملی در کمتر از ۳ دقیقه!\n• تسویه در **۴ قسط مساوی ماهیانه** از طریق درگاه اسنپ‌پی یا تارا\n• بدون هیچ‌گونه سود، کارمزد پنهان یا افزایش قیمت کالا\n\nکافیست محصول را به سبد خرید اضافه کرده و در مرحله پرداخت، گزینه «خرید اقساطی اسنپ‌پی» را انتخاب فرمایید.",
                'quick_replies'   => array('محصولات واجد شرایط اقساط', 'راهنمای گام‌به‌گام اسنپ‌پی', 'ثبت سریع خرید'),
                'conversion_badge'=> 'تایید اعتبار زیر ۳ دقیقه بدون چک'
            ),
            array(
                'id'              => 'rule-shipping-delivery',
                'intent'          => 'shipping_delivery',
                'keywords'        => array('کی میرسه', 'چند روزه میرسه', 'زمان ارسال', 'پیک موتوری', 'تیپاکس', 'پست پیشتاز', 'تهران', 'شهرستان'),
                'reply'           => "🚚 **زمان‌بندی دقیق ارسال سفارشات:**\n\n• **تهران و البرز:** تحویل زیر ۳ ساعت با پیک موتوری اختصاصی (با امکان هماهنگی بازه زمانی توسط شما)\n• **کلیه شهرستان‌ها:** ارسال با پست پیشتاز و تیپاکس طی ۲۴ الی ۴۸ ساعت کاری\n• **هزینه ارسال:** برای سبدهای خرید بالای ۲ میلیون تومان **کاملاً رایگان** است!\n• بلافاصله پس از تحویل به پست، کد رهگیری ۲۴ رقمی پیامک خواهد شد.",
                'quick_replies'   => array('پیگیری سفارش ثبت‌شده', 'آیا پرداخت در محل دارید؟', 'افزودن به سبد خرید'),
                'conversion_badge'=> 'ارسال رایگان بالای ۲ میلیون تومان'
            ),
            array(
                'id'              => 'rule-comparison',
                'intent'          => 'comparison_advice',
                'keywords'        => array('مقایسه', 'کدوم بهتره', 'فرق این دوتا', 'بین لپتاپ و هدفون', 'تفاوت مدل ها'),
                'reply'           => "⚖️ **راهنمای مقایسه تخصصی:**\n\nبرای مقایسه دقیق و انتخاب بهتر:\n• اگر اولویت شما **کارهای سنگین برنامه‌نویسی، تدوین ویدیو و رندرینگ** است: اولترابوک KamvaBook X15 با پردازنده Core i9 و کارت RTX 4070 بی‌رقیب است.\n• اگر به دنبال **تمرکز کاری و تماس‌های باکیفیت شفاف** هستید: هدفون Kamva Pro Sound با حذف نویز ۴۸ دسی‌بل بهترین مکمل کاری شماست.\n\n🎁 **پیشنهاد پکیج مهندسی:** در صورت خرید همزمان هر دو محصول، **۱۵٪ تخفیف روی کل سبد** اعمال خواهد شد!",
                'quick_replies'   => array('مشاهده جدول مشخصات کامل', 'خرید باندل همراه با تخفیف ۱۵٪'),
                'conversion_badge'=> 'تخفیف ۱۵٪ ویژه خرید باندل'
            ),
            array(
                'id'              => 'rule-connect-human',
                'intent'          => 'connect_consultant',
                'keywords'        => array('مشاور انسان', 'پشتیبان تلفنی', 'شماره تماس', 'واتساپ', 'صحبت با ادمین', 'تماس با شما'),
                'reply'           => "با کمال میل! 🎧 همکاران ما در واحد مشاوره فروش و راهنمایی تخصصی آماده پاسخگویی به شما هستند:\n\n📞 **شماره تماس مستقیم:** " . (get_option('kamva_support_phone') ?: get_bloginfo('admin_email')) . "\n💬 **ارتباط فوری در واتساپ:** پشتیبانی برخط ۲۴ ساعته\n\nبا کلیک روی دکمه زیر می‌توانید مستقیماً به گفتگوی واتساپ یا تماس صوتی متصل شوید.",
                'quick_replies'   => array('تماس تلفنی با فروشگاه', 'پیام در واتساپ'),
                'conversion_badge'=> 'مشاوران ارشد آماده پاسخگویی'
            ),
            // ۱. دیتاست تخصصی سئو و ایندکس گوگل (SEO & Search Console)
            array(
                'id'              => 'rule-seo-optimization',
                'intent'          => 'seo_intelligence',
                'keywords'        => array('سئو', 'رتبه گوگل', 'اسکیما', 'سرچ کنسول', 'متاتگ', 'alt تصویر', 'schema', 'json-ld', 'سئو تکنیکال'),
                'reply'           => "🔍 **دانش تخصصی سئو و استانداردهای گوگل در کامواوب:**\n\nقالب کامواوب مجهز به معماری سئو مدرن برای کسب رتبه‌های برتر گوگل است:\n• **تولید خودکار استراکچردیتا (JSON-LD Schema):** اسکیماهای Product، AggregateRating، Offer، FAQPage و BreadcrumbList بدون افزونه اضافی تزریق می‌شوند.\n• **بهینه‌سازی متاتگ‌ها و تصاویر:** تولید خودکار تگ‌های OpenGraph، عنوان‌های بهینه و ویژگی‌های Alt تصاویر بر اساس الگوریتم Helpful Content گوگل.\n• **ساختار معنایی بدون خطای ایندکس:** تگ‌بندی دقیق H1-H3 و نقشه سایت داینامیک هماهنگ با گوگل سرچ کنسول.",
                'quick_replies'   => array('مشاهده وضعیت اسکیماهای سایت', 'پویشگر سئو KamvaSeoOptimizer', 'تولید متاتگ‌های هوشمند'),
                'conversion_badge'=> 'سازگار ۱۰۰٪ با الگوریتم‌های ۲۰۲۶ گوگل'
            ),
            // ۲. دیتاست تخصصی امنیت و فایروال (Security & WAF Hardening)
            array(
                'id'              => 'rule-security-waf',
                'intent'          => 'security_waf',
                'keywords'        => array('امنیت', 'فایروال', 'هک', 'ضد نفوذ', 'waf', 'sql injection', 'حمله', 'امنیت وردپرس', 'بکاپ'),
                'reply'           => "🛡️ **معماری امنیت چندلایه و فایروال WAF کامواوب:**\n\nسیستم امنیتی داخلی All-in-One Security به صورت بومی و بدون ایجاد بار پردازشی سنگین:\n• **سپر هوشمند WAF:** شناسایی و مسدودسازی آنی حملات SQL Injection، XSS و ترافیک ربات‌های مخرب.\n• **حفاظت بروت‌فورس (Brute Force):** قفل خودکار IP مهاجم پس از چند تلاش ناموفق و تغییر آدرس لاگین ادمین.\n• **ایمن‌سازی هسته و دیتابیس:** غیرفعال‌سازی XML-RPC، ماسک‌کردن نسخه وردپرس و محافظت کامل از جداول MySQL با کدهای استاندارد PHP 8.2.",
                'quick_replies'   => array('بررسی گزارش فایروال WAF', 'پویشگر فایل‌های مخرب', 'تغییر آدرس ورود به پیشخوان'),
                'conversion_badge'=> 'سپر دفاعی فعال ۲۴/۷'
            ),
            // ۳. دیتاست تخصصی شتاب و لایت‌هاوس ۹۹ (Speed & Performance Optimization)
            array(
                'id'              => 'rule-speed-performance',
                'intent'          => 'speed_optimization',
                'keywords'        => array('سرعت', 'لایت هاوس', 'کند است', 'افزایش سرعت', 'کش', 'core web vitals', 'lcp', 'pagespeed', 'بهینه سازی سرعت'),
                'reply'           => "⚡ **شتاب‌دهنده سرعت و گواهی Core Web Vitals کامواوب:**\n\nبرای دستیابی به امتیاز لایت‌هاوس ۹۹/۱۰۰ و زمان لود زیر ۰.۸ ثانیه:\n• **کش حافظه RAM و Redis:** کش فوق‌سریع صفحات (Full Page Cache) و کش آبجکت‌ها در سطح حافظه موقت سرور.\n• **فشرده‌سازی خودکار عکس‌ها:** تبدیل تصاویر آپلودی به فرمت مدرن WebP و AVIF با کاهش حجم تا ۸۵٪ بدون افت کیفیت.\n• **استخراج Critical CSS و بارگذاری آسنکرون:** بارگذاری استایل‌های حیاتی در بالای صفحه و اجرای Defer کدهای جاوااسکریپت.",
                'quick_replies'   => array('تست سرعت لایت‌هاوس', 'پاکسازی کش سرور', 'فعال‌سازی بهینه‌ساز عکس WebP'),
                'conversion_badge'=> 'امتیاز لایت‌هاوس ۹۹/۱۰۰'
            ),
            // ۴. دیتاست تخصصی معماری و توسعه وردپرس (WordPress Development & WP 7.1)
            array(
                'id'              => 'rule-wp-development',
                'intent'          => 'wordpress_development',
                'keywords'        => array('توسعه وردپرس', 'کدنویسی قالب', 'وردپرس 7.1', 'المنتور', 'php 8.2', 'توابع وردپرس', 'توسعه دهنده', 'هوکس'),
                'reply'           => "💻 **استانداردهای مهندسی و معماری توسعه کامواوب:**\n\nکدبیس قالب با مدرن‌ترین الگوهای شیءگرایی (Singleton، Repository Pattern و MVC) پیاده‌سازی شده است:\n• **سازگاری ۱۰۰٪ با وردپرس ۷.۱ Mary Lou:** پشتیبانی بومی از Block Bindings API، معماری Block Hooks و Interactivity API.\n• **کاهش عمق DOM المنتور:** بازنویسی رندرهای المنتور جهت حذف تگ‌های توخالی div و کاهش ۶۰ درصدی حجم DOM.\n• **مایگریشن امن پایگاه داده (KamvaMigrationManager):** ثبت نگارش جداول دیتابیس با قابلیت Rollback خودکار.",
                'quick_replies'   => array('استودیوی اسنیپت‌های PHP', 'سازگاری با المنتور پرو', 'مهاجرت امن دیتابیس'),
                'conversion_badge'=> 'کدنویسی استاندارد PHP 8.2+'
            ),
            // ۵. دیتاست تخصصی روانشناسی فروش و بازاریابی تبدیل (Sales Psychology & Marketing)
            array(
                'id'              => 'rule-sales-psychology-marketing',
                'intent'          => 'sales_psychology_marketing',
                'keywords'        => array('روانشناسی فروش', 'افزایش فروش', 'مارکتینگ', 'تست ab', 'نرخ تبدیل', 'سبد خرید رها شده', 'تخفیف هوشمند', 'cro'),
                'reply'           => "📈 **موتور روانشناسی فروش و افزایش نرخ تبدیل (CRO Engine):**\n\nسیستم خودکار افزایش فروش کامواوب با الگوهای اثبات‌شده بازاریابی رفتارمحور:\n• **تخفیف‌های داینامیک سمت سرور (KamvaSalesPsychology):** تحلیل ارزش سبد خرید و زمان حضور در صفحه برای ارائه تخفیف‌های هدفمند قبل از انصراف خریدار.\n• **تست A/B لندینگ پیج‌ها با تحلیل بیزین:** مقایسه زنده تیترها، رنگ CTAها و تریگرهای روانی با محاسبه خودکار سطح اطمینان آماری.\n• **محرک‌های تصمیم‌گیری بلادرنگ:** نوارهای چسبان خرید موبایل، نوار پیشرفت ارسال رایگان و اثبات اجتماعی زنده.",
                'quick_replies'   => array('ورود به آزمایشگاه تست A/B', 'تنظیمات تخفیف‌های روانشناسی', 'پیش‌نمایش نوار خرید موبایل'),
                'conversion_badge'=> 'رشد نرخ تبدیل تا ۴۹.۳٪'
            )
        );

        update_option($this->sales_rules_key, $default_rules);
    }

    public function get_sales_rules() {
        $rules = get_option($this->sales_rules_key, array());
        return new WP_REST_Response(array('success' => true, 'rules' => $rules, 'total' => count($rules)), 200);
    }

    public function add_sales_rule($request) {
        $params = $request->get_json_params();
        $intent = sanitize_text_field($params['intent'] ?? 'custom_intent');
        $reply = sanitize_textarea_field($params['reply'] ?? '');
        $keywords = (array)($params['keywords'] ?? array());

        if (empty($reply) || empty($keywords)) {
            return new WP_REST_Response(array('error' => 'پاسخ و کلمات کلیدی الزامی است'), 400);
        }

        $rules = get_option($this->sales_rules_key, array());
        $new_rule = array(
            'id'               => 'rule-' . time(),
            'intent'           => $intent,
            'keywords'         => array_map('sanitize_text_field', $keywords),
            'reply'            => $reply,
            'quick_replies'    => array('اطلاعات بیشتر', 'ثبت سفارش'),
            'conversion_badge' => 'آموزش‌دیده توسط مدیر فروشگاه'
        );

        $rules[] = $new_rule;
        update_option($this->sales_rules_key, $rules);

        return new WP_REST_Response(array('success' => true, 'rule' => $new_rule), 200);
    }

    public function get_consultant_info() {
        $phone = get_option('kamva_support_phone') ?: get_bloginfo('admin_email');
        $whatsapp = get_option('kamva_support_whatsapp') ?: '';
        return new WP_REST_Response(array(
            'phone'    => $phone,
            'whatsapp' => $whatsapp ?: $phone,
            'hours'    => get_option('kamva_support_hours', 'شنبه تا پنج‌شنبه از ساعت ۹:۰۰ الی ۲۱:۰۰'),
            'online'   => true
        ), 200);
    }
}

KamvaWeb_AI_Sales_Engine::get_instance();
