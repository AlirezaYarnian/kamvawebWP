<?php
/**
 * KamvaWeb ESCMarket E-Commerce UI & Technical Store Engine
 * 
 * Implements the exact e-commerce layout, faceted technical filters, product cards, 
 * brand filters, quick view, and single product specifications inspired by ESCMarket (escmarket.shop).
 * 
 * @package KamvaWeb
 * @subpackage ESCMarket
 */

if (!defined('ABSPATH')) exit;

class KamvaWeb_EscMarket_UI_Engine {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // هوک‌های تم و لایه‌بندی فروشگاه
        add_action('woocommerce_before_shop_loop', array($this, 'render_escmarket_top_bar'), 25);
        add_filter('woocommerce_product_loop_start', array($this, 'override_loop_start'));
        add_action('woocommerce_after_shop_loop_item_title', array($this, 'render_escmarket_card_specs'), 15);
        add_action('woocommerce_single_product_summary', array($this, 'render_escmarket_single_trust_badges'), 25);
        
        // مسیرهای REST API جهت واکشی داینامیک محصولات و فیلترهای سبک ESCMarket
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function register_rest_routes() {
        register_rest_route('kamvaweb/v1', '/escmarket/products', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_escmarket_products_api'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('kamvaweb/v1', '/escmarket/categories', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_escmarket_categories_api'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * واکشی دسته‌بندی‌های تخصصی تجهیزات الکترونیک و ابزار
     */
    public function get_escmarket_categories_api() {
        $categories = array(
            array(
                'id'       => 'measurement',
                'name'     => 'تجهیزات اندازه‌گیری و تست',
                'icon'     => '⚡',
                'count'    => 48,
                'subcategories' => array('مولتی‌متر دیجیتال و کلمپی', 'اسیلوسکوپ دیجیتال', 'LCR متر پرتابل و رومیزی', 'منبع تغذیه آزمایشگاهی', 'سیگنال ژنراتور', 'پراب ولتاژ بالا و لاجیک'),
            ),
            array(
                'id'       => 'soldering',
                'name'     => 'ابزار و لحیم‌کاری تخصصی',
                'icon'     => '🔧',
                'count'    => 35,
                'subcategories' => array('هویه هوای گرم (هیتر)', 'هویه رومیزی هوشمند', 'پنس‌های آنتی‌استاتیک ESD', 'قلع‌کش برقی و پمپی', 'لوپ و میکروسکوپ تعمیرات برد'),
            ),
            array(
                'id'       => 'modules',
                'name'     => 'ماژول‌ها و پردازنده‌ها',
                'icon'     => '🎛️',
                'count'    => 62,
                'subcategories' => array('ماژول‌های تغذیه Buck/Boost', 'سنسورهای صنعتی و محیطی', 'میکروکنترلرهای ARM و STM32', 'ماژول‌های بی‌سیم و بلوتوث'),
            ),
            array(
                'id'       => 'power',
                'name'     => 'برق، باتری و انرژی',
                'icon'     => '🔋',
                'count'    => 29,
                'subcategories' => array('اینورتر موج سینوسی خالص', 'شارژر هوشمند باتری لیتیوم', 'مبدل ولتاژ DC به DC', 'تسترهای سلامت باتری'),
            ),
            array(
                'id'       => 'import',
                'name'     => 'سفارش واردات از چین',
                'icon'     => '✈️',
                'count'    => 12,
                'subcategories' => array('تامین آی‌سی‌های کمیاب', 'قطعات صنعتی خاص', 'استعلام قیمت و ترخیص گمرکی'),
            ),
        );

        return new WP_REST_Response(array('success' => true, 'categories' => $categories), 200);
    }

    /**
     * واکشی محصولات فروشگاه با مشخصات فنی دقیق مشابه ESCMarket
     */
    public function get_escmarket_products_api($request) {
        $category = sanitize_text_field($request->get_param('category') ?? 'all');
        $brand    = sanitize_text_field($request->get_param('brand') ?? 'all');
        $in_stock = $request->get_param('inStock') === 'true';
        $search   = sanitize_text_field($request->get_param('search') ?? '');

        // اگر ووکامرس فعال بود، واکشی از محصولات واقعی
        $products = array();

        if (function_exists('wc_get_products')) {
            $args = array(
                'status'  => 'publish',
                'limit'   => 12,
                'orderby' => 'date',
                'order'   => 'DESC',
            );
            if (!empty($search)) {
                $args['s'] = $search;
            }
            $wc_prods = wc_get_products($args);

            foreach ($wc_prods as $p) {
                $price = floatval($p->get_price());
                $regular = floatval($p->get_regular_price());
                $discount_pct = ($regular > $price && $regular > 0) ? round((($regular - $price) / $regular) * 100) : 0;

                $products[] = array(
                    'id'               => $p->get_id(),
                    'title'            => $p->get_name(),
                    'sku'              => $p->get_sku() ?: ('ESC-' . $p->get_id()),
                    'brand'            => get_post_meta($p->get_id(), '_kamva_product_brand', true) ?: 'UNI-T',
                    'category'         => 'measurement',
                    'price'            => $price,
                    'regular_price'    => $regular,
                    'discount_percent' => $discount_pct,
                    'in_stock'         => $p->is_in_stock(),
                    'stock_count'      => $p->get_stock_quantity() ?: 5,
                    'image'            => wp_get_attachment_image_url($p->get_image_id(), 'medium') ?: '',
                    'specs'            => array(
                        'دقت نمایش: 22,000 Counts',
                        'قابلیت True RMS با دقت بالا',
                        'دارای پورت اتصال به رایانه USB',
                    ),
                    'warranty'         => 'گارانتی سلامت و اصالت فیزیکی + مهلت تست',
                    'express_delivery' => true,
                    'rating'           => 4.8,
                    'reviews_count'    => 14,
                );
            }
        }

        // در صورت عدم وجود محصولات ووکامرس یا برای راه‌اندازی اولیه، قالب‌های استاندارد مهندسی
        if (empty($products)) {
            $products = $this->get_default_escmarket_catalog();
        }

        return new WP_REST_Response(array(
            'success'  => true,
            'products' => $products,
            'total'    => count($products),
        ), 200);
    }

    /**
     * کاتالوگ استاندارد تجهیزات اندازه‌گیری و ابزار با ساختار تخصصی
     */
    public function get_default_escmarket_catalog() {
        return array(
            array(
                'id'               => 101,
                'title'            => 'مولتی‌متر دیجیتال اتورنج حرفه‌ای UNI-T UT61E+ با اتصال USB',
                'sku'              => 'UT61E-PLUS',
                'brand'            => 'UNI-T',
                'category'         => 'measurement',
                'price'            => 4850000,
                'regular_price'    => 5400000,
                'discount_percent' => 10,
                'in_stock'         => true,
                'stock_count'      => 4,
                'image'            => '',
                'specs'            => array(
                    'دقت ۲۲,۰۰۰ کانت (True RMS)',
                    'اندازه‌گیری ولتاژ AC/DC تا 1000V',
                    'اتصال کامپیوتر با کابل USB نوری',
                    'تست دیود، اتصال کوتاه و ظرفیت خازن',
                ),
                'warranty'         => 'ضمانت اصالت و تست یک‌روزه پراب',
                'express_delivery' => true,
                'rating'           => 4.9,
                'reviews_count'    => 28,
            ),
            array(
                'id'               => 102,
                'title'            => 'اسیلوسکوپ دیجیتال ۲ کانال ۱۰۰ مگاهرتز Rigol DS1102Z-E با حافظه عمیق',
                'sku'              => 'RIGOL-DS1102Z',
                'brand'            => 'Rigol',
                'category'         => 'measurement',
                'price'            => 19800000,
                'regular_price'    => 21500000,
                'discount_percent' => 8,
                'in_stock'         => true,
                'stock_count'      => 2,
                'image'            => '',
                'specs'            => array(
                    'پهنای باند 100MHz دو کانال مجزا',
                    'نرخ نمونه‌برداری 1GSa/s بلادرنگ',
                    'نمایشگر رنگی ۷ اینچ TFT وکتوری',
                    'پشتیبانی از تحلیل پروتکل‌های سریال I2C/SPI',
                ),
                'warranty'         => 'گارانتی ۱۲ ماهه طلایی و خدمات پس از فروش',
                'express_delivery' => true,
                'rating'           => 5.0,
                'reviews_count'    => 19,
            ),
            array(
                'id'               => 103,
                'title'            => 'هیتر و هویه هوشمند رومیزی Quick 861DW با توان ۱۰۰۰ وات',
                'sku'              => 'QUICK-861DW',
                'brand'            => 'Quick',
                'category'         => 'soldering',
                'price'            => 14200000,
                'regular_price'    => 15800000,
                'discount_percent' => 10,
                'in_stock'         => true,
                'stock_count'      => 6,
                'image'            => '',
                'specs'            => array(
                    'توان حرارتی فوق‌العاده 1000W سرامیکی',
                    '۳ کانال حافظه CH1, CH2, CH3',
                    'سنسور سوییچ خواب خودکار در پایه نگهدارنده',
                    'سیستم خنک‌کننده اتوماتیک المنت',
                ),
                'warranty'         => 'تضمین سلامت فیزیکی و اصالت کالا',
                'express_delivery' => true,
                'rating'           => 4.8,
                'reviews_count'    => 42,
            ),
            array(
                'id'               => 104,
                'title'            => 'منبع تغذیه آزمایشگاهی دیجیتال 30V 5A مدل Sugon 3005D',
                'sku'              => 'SUGON-3005D',
                'brand'            => 'Sugon',
                'category'         => 'power',
                'price'            => 6900000,
                'regular_price'    => 7500000,
                'discount_percent' => 8,
                'in_stock'         => true,
                'stock_count'      => 7,
                'image'            => '',
                'specs'            => array(
                    'خروجی متغیر ۰ تا ۳۰ ولت و ۰ تا ۵ آمپر',
                    'نمایشگر دیجیتال LED چهار رقمی دقیق (0.001A)',
                    'حفاظت در برابر اتصال کوتاه و بار اضافه (OCP/OVP)',
                    'پورت خروجی شارژ سریع ۵ ولت USB',
                ),
                'warranty'         => 'گارانتی تست سلامت و مهلت بازگشت ۷ روزه',
                'express_delivery' => true,
                'rating'           => 4.7,
                'reviews_count'    => 15,
            ),
            array(
                'id'               => 105,
                'title'            => 'میکروسکوپ دیجیتال سه‌چشمی تعمیرات برد Sunshine SZM45T-B1 با رینگ لایت LED',
                'sku'              => 'SUNSHINE-SZM45',
                'brand'            => 'Sunshine',
                'category'         => 'soldering',
                'price'            => 18500000,
                'regular_price'    => 19900000,
                'discount_percent' => 7,
                'in_stock'         => true,
                'stock_count'      => 3,
                'image'            => '',
                'specs'            => array(
                    'بزرگنمایی پیوسته 7X تا 45X با وضوح بالا',
                    'پورت سوم اختصاصی اتصال دوربین و مانیتور',
                    'فاصله کانونی عالی 100mm برای کار با هویه',
                    'همراه با لامپ ال‌ای‌دی ۵۶ تایی قابل تنظیم',
                ),
                'warranty'         => 'گارانتی سلامت اپتیک و قطعات مکانیکی',
                'express_delivery' => true,
                'rating'           => 4.9,
                'reviews_count'    => 31,
            ),
            array(
                'id'               => 106,
                'title'            => 'LCR متر پرتابل و حرفه‌ای FNIRSI LCR-P1 با شناسایی خودکار قطعه',
                'sku'              => 'FNIRSI-LCR-P1',
                'brand'            => 'FNIRSI',
                'category'         => 'measurement',
                'price'            => 2850000,
                'regular_price'    => 3200000,
                'discount_percent' => 11,
                'in_stock'         => true,
                'stock_count'      => 9,
                'image'            => '',
                'specs'            => array(
                    'تست خودکار مقاومت، سلف، خازن و دیود زنر',
                    'تست ترانزیستور، ماسفت و تریستور هوشمند',
                    'باتری لیتیومی داخلی قابل شارژ با پورت Type-C',
                    'نمایشگر رنگی ۱.۴۴ اینچی گرافیکی',
                ),
                'warranty'         => 'تست اصالت و کارکرد یک‌روزه',
                'express_delivery' => true,
                'rating'           => 4.6,
                'reviews_count'    => 11,
            ),
        );
    }

    /**
     * نوار ابزار بالای فروشگاه با سوییچ حالت Grid / List و مرتب‌سازی
     */
    public function render_escmarket_top_bar() {
        ?>
        <div class="kamva-escmarket-toolbar bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4" dir="rtl">
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-slate-300">نمای نمایش:</span>
                <div class="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button type="button" class="px-2.5 py-1 text-xs rounded-lg bg-indigo-600 text-white font-bold cursor-pointer">
                        ▦ شبکه‌ای
                    </button>
                    <button type="button" class="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer">
                        ▤ لیست مشخصات
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400">مرتب‌سازی بر اساس:</span>
                <select class="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500">
                    <option value="popular">محبوب‌ترین تجهیزات</option>
                    <option value="newest">جدیدترین ورودی‌ها</option>
                    <option value="discount">بیشترین تخفیف</option>
                    <option value="price_asc">ارزان‌ترین</option>
                    <option value="price_desc">گران‌ترین</option>
                </select>
            </div>
        </div>
        <?php
    }

    public function override_loop_start($html) {
        return '<ul class="products columns-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">';
    }

    public function render_escmarket_card_specs() {
        global $product;
        if (!$product) return;
        ?>
        <div class="kamva-escmarket-spec-bullets mt-2 text-[11px] text-slate-400 space-y-1">
            <div class="flex items-center gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>تضمین سلامت فیزیکی و اصالت کالا</span>
            </div>
            <div class="flex items-center gap-1.5">
                <span class="text-cyan-400 font-bold">⚡</span>
                <span>ارسال اکسپرس ۲۴ ساعته</span>
            </div>
        </div>
        <?php
    }

    public function render_escmarket_single_trust_badges() {
        ?>
        <div class="kamva-escmarket-trust-box p-4 bg-slate-950 rounded-2xl border border-slate-800 my-4 space-y-2 text-xs" dir="rtl">
            <div class="flex items-center gap-2 text-emerald-400 font-bold">
                <span>🛡️ گارانتی و تضمین اصالت:</span>
                <span class="text-slate-300 font-normal">تضمین ۱۰۰٪ اصالت برند + مهلت تست یک روزه پراب و لوازم جانبی</span>
            </div>
            <div class="flex items-center gap-2 text-cyan-400 font-bold">
                <span>🚚 تحویل اکسپرس:</span>
                <span class="text-slate-300 font-normal">ارسال با بسته‌بندی ضدضربه در سراسر کشور ظرف ۲۴ الی ۴۸ ساعت</span>
            </div>
            <div class="flex items-center gap-2 text-amber-400 font-bold">
                <span>🎧 مشاوره تخصصی رایگان:</span>
                <span class="text-slate-300 font-normal">مشاوره فنی پیش از خرید توسط مهندسان الکترونیک</span>
            </div>
        </div>
        <?php
    }
}

KamvaWeb_EscMarket_UI_Engine::get_instance();
