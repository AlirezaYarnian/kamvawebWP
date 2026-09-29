import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  SlidersHorizontal,
  Grid,
  List,
  CheckCircle2,
  ShieldCheck,
  Truck,
  PhoneCall,
  Clock,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Plus,
  Minus,
  X,
  Tag,
  Zap,
  Star,
  Check,
  Package,
  Layers,
  ExternalLink,
  Cpu,
  Flame
} from 'lucide-react';

interface ProductSpec {
  id: number;
  title: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  regular_price: number;
  discount_percent: number;
  in_stock: boolean;
  stock_count: number;
  specs: string[];
  warranty: string;
  express_delivery: boolean;
  rating: number;
  reviews_count: number;
  imageIcon: string;
}

export const EscMarketStoreStudio: React.FC = () => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState<number>(25000000);

  // Cart State
  const [cartItems, setCartItems] = useState<{ product: ProductSpec; quantity: number }[]>([
    {
      product: {
        id: 101,
        title: 'مولتی‌متر دیجیتال اتورنج حرفه‌ای UNI-T UT61E+ با اتصال USB',
        sku: 'UT61E-PLUS',
        brand: 'UNI-T',
        category: 'measurement',
        price: 4850000,
        regular_price: 5400000,
        discount_percent: 10,
        in_stock: true,
        stock_count: 4,
        specs: ['دقت ۲۲,۰۰۰ کانت (True RMS)', 'اندازه‌گیری ولتاژ AC/DC تا 1000V', 'اتصال کامپیوتر با کابل USB نوری'],
        warranty: 'ضمانت اصالت و تست یک‌روزه پراب',
        express_delivery: true,
        rating: 4.9,
        reviews_count: 28,
        imageIcon: '⚡',
      },
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<ProductSpec | null>(null);

  // Categories definition matching ESCMarket
  const categories = [
    { id: 'all', name: 'همه محصولات', icon: '⚡', count: 186 },
    { id: 'measurement', name: 'تجهیزات اندازه‌گیری و تست', icon: '📊', count: 48 },
    { id: 'soldering', name: 'ابزار و لحیم‌کاری تخصصی', icon: '🔧', count: 35 },
    { id: 'modules', name: 'ماژول‌ها و پردازنده‌ها', icon: '🎛️', count: 62 },
    { id: 'power', name: 'برق، باتری و انرژی', icon: '🔋', count: 29 },
    { id: 'import', name: 'سفارش واردات از چین', icon: '✈️', count: 12 },
  ];

  const brands = ['UNI-T', 'Rigol', 'Quick', 'Sugon', 'Sunshine', 'FNIRSI', 'Sanwa'];

  // Catalog Data
  const products: ProductSpec[] = [
    {
      id: 101,
      title: 'مولتی‌متر دیجیتال اتورنج حرفه‌ای UNI-T UT61E+ با اتصال USB',
      sku: 'UT61E-PLUS',
      brand: 'UNI-T',
      category: 'measurement',
      price: 4850000,
      regular_price: 5400000,
      discount_percent: 10,
      in_stock: true,
      stock_count: 4,
      specs: [
        'دقت ۲۲,۰۰۰ کانت (True RMS)',
        'اندازه‌گیری ولتاژ AC/DC تا 1000V',
        'اتصال کامپیوتر با کابل USB نوری',
        'تست دیود، اتصال کوتاه و ظرفیت خازن',
      ],
      warranty: 'ضمانت اصالت و تست یک‌روزه پراب',
      express_delivery: true,
      rating: 4.9,
      reviews_count: 28,
      imageIcon: '📟',
    },
    {
      id: 102,
      title: 'اسیلوسکوپ دیجیتال ۲ کانال ۱۰۰ مگاهرتز Rigol DS1102Z-E با حافظه عمیق',
      sku: 'RIGOL-DS1102Z',
      brand: 'Rigol',
      category: 'measurement',
      price: 19800000,
      regular_price: 21500000,
      discount_percent: 8,
      in_stock: true,
      stock_count: 2,
      specs: [
        'پهنای باند 100MHz دو کانال مجزا',
        'نرخ نمونه‌برداری 1GSa/s بلادرنگ',
        'نمایشگر رنگی ۷ اینچ TFT وکتوری',
        'تحلیل پروتکل‌های سریال I2C/SPI',
      ],
      warranty: 'گارانتی ۱۲ ماهه طلایی و خدمات پس از فروش',
      express_delivery: true,
      rating: 5.0,
      reviews_count: 19,
      imageIcon: '📈',
    },
    {
      id: 103,
      title: 'هیتر و هویه هوشمند رومیزی Quick 861DW با توان ۱۰۰۰ وات',
      sku: 'QUICK-861DW',
      brand: 'Quick',
      category: 'soldering',
      price: 14200000,
      regular_price: 15800000,
      discount_percent: 10,
      in_stock: true,
      stock_count: 6,
      specs: [
        'توان حرارتی فوق‌العاده 1000W سرامیکی',
        '۳ کانال حافظه سریع CH1, CH2, CH3',
        'سنسور سوییچ خواب خودکار در پایه نگهدارنده',
        'سیستم خنک‌کننده اتوماتیک المنت',
      ],
      warranty: 'تضمین سلامت فیزیکی و اصالت کالا',
      express_delivery: true,
      rating: 4.8,
      reviews_count: 42,
      imageIcon: '🔥',
    },
    {
      id: 104,
      title: 'منبع تغذیه آزمایشگاهی دیجیتال 30V 5A مدل Sugon 3005D چهار رقمی',
      sku: 'SUGON-3005D',
      brand: 'Sugon',
      category: 'power',
      price: 6900000,
      regular_price: 7500000,
      discount_percent: 8,
      in_stock: true,
      stock_count: 7,
      specs: [
        'خروجی متغیر ۰ تا ۳۰ ولت و ۰ تا ۵ آمپر',
        'نمایشگر دیجیتال LED چهار رقمی دقیق (0.001A)',
        'حفاظت اتصال کوتاه و بار اضافه (OCP/OVP)',
        'پورت خروجی شارژ سریع ۵ ولت USB',
      ],
      warranty: 'گارانتی تست سلامت و مهلت بازگشت ۷ روزه',
      express_delivery: true,
      rating: 4.7,
      reviews_count: 15,
      imageIcon: '🔌',
    },
    {
      id: 105,
      title: 'میکروسکوپ دیجیتال سه‌چشمی تعمیرات برد Sunshine SZM45T-B1 با رینگ لایت',
      sku: 'SUNSHINE-SZM45',
      brand: 'Sunshine',
      category: 'soldering',
      price: 18500000,
      regular_price: 19900000,
      discount_percent: 7,
      in_stock: true,
      stock_count: 3,
      specs: [
        'بزرگنمایی پیوسته 7X تا 45X با وضوح بالا',
        'پورت سوم اختصاصی اتصال دوربین و مانیتور',
        'فاصله کانونی عالی 100mm برای کار با هویه',
        'همراه با لامپ ال‌ای‌دی ۵۶ تایی قابل تنظیم',
      ],
      warranty: 'گارانتی سلامت اپتیک و قطعات مکانیکی',
      express_delivery: true,
      rating: 4.9,
      reviews_count: 31,
      imageIcon: '🔬',
    },
    {
      id: 106,
      title: 'LCR متر پرتابل و حرفه‌ای FNIRSI LCR-P1 با شناسایی خودکار قطعه',
      sku: 'FNIRSI-LCR-P1',
      brand: 'FNIRSI',
      category: 'measurement',
      price: 2850000,
      regular_price: 3200000,
      discount_percent: 11,
      in_stock: true,
      stock_count: 9,
      specs: [
        'تست خودکار مقاومت، سلف، خازن و دیود زنر',
        'تست ترانزیستور، ماسفت و تریستور هوشمند',
        'باتری لیتیومی داخلی با شارژ Type-C',
        'نمایشگر رنگی ۱.۴۴ اینچی گرافیکی',
      ],
      warranty: 'تست اصالت و کارکرد یک‌روزه',
      express_delivery: true,
      rating: 4.6,
      reviews_count: 11,
      imageIcon: '📟',
    },
  ];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        if (onlyInStock && !p.in_stock) return false;
        if (onlyDiscounted && p.discount_percent <= 0) return false;
        if (p.price > maxPrice) return false;
        if (
          searchQuery &&
          !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'discount') return b.discount_percent - a.discount_percent;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // Default popular
      });
  }, [selectedCategory, selectedBrands, onlyInStock, onlyDiscounted, searchQuery, sortBy, maxPrice]);

  const toggleBrand = (brandName: string) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  const addToCart = (product: ProductSpec) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 5000000;
  const freeShippingDiff = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans" dir="rtl">
      {/* 1. TOP ANNOUNCEMENT TICKER (ESCMarket Style) */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-cyan-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>مرجع تخصصی تجهیزات تست و اندازه‌گیری الکترونیک، ابزار تعمیرات و قطعات صنعتی</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>پاسخگویی و پشتیبانی: ۸ الی ۱۷</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ارسال ۲۴ الی ۴۸ ساعته به سراسر کشور</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (ESCMarket Branding & Mega Search) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/20">
              ESC
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>ESC MARKET</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  فروشگاه
                </span>
              </div>
              <p className="text-[10px] text-slate-400">تجهیزات اندازه‌گیری و ابزار مهندسی</p>
            </div>
          </div>

          {/* Mega Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی مدل (مثلاً UT61E+، هیتر Quick، اسیلوسکوپ، پراب)..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl py-2.5 pr-11 pl-28 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3" />
              <button className="absolute left-2 top-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[11px] rounded-xl shadow cursor-pointer">
                جستجو
              </button>
            </div>
          </div>

          {/* User & Quick Cart Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer">
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              <span className="w-5 h-5 rounded-full bg-slate-950 text-cyan-300 text-[10px] font-mono flex items-center justify-center font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Categories Bar Navigation */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. HERO SHOWCASE BANNERS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-black inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                حراج ویژه تجهیزات آزمایشگاهی
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                اسیلوسکوپ‌های پیشرفته و مولتی‌مترهای سری Pro
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                همراه با گارانتی اصالت کالا، مهلت تست یک روزه پراب‌ها و مشاوره فنی رایگان قبل از خرید.
              </p>
            </div>
            <div className="pt-6 relative z-10 flex items-center gap-3">
              <button
                onClick={() => setSelectedCategory('measurement')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 cursor-pointer hover:scale-105 transition-all"
              >
                مشاهده تجهیزات اندازه‌گیری
              </button>
              <button
                onClick={() => setSelectedCategory('soldering')}
                className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ابزار و هیترهای هویه
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                خدمات تخصصی واردات
              </span>
              <h3 className="text-lg font-black text-white">واردات مستقیم قطعات کمیاب از چین</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                استعلام قیمت، خرید، حمل و ترخیص انواع آی‌سی‌ها و ماژول‌های صنعتی با کمترین کارمزد.
              </p>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all cursor-pointer">
              ثبت درخواست استعلام واردات
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN STORE LAYOUT (Faceted Sidebar + Product Grid) */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR FILTERS (Faceted Filter Box) */}
          <aside className="space-y-6">
            {/* Filter Card 1: Brands Filter */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <span>برندهای معتبر و تخصصی</span>
                </h4>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    حذف فیلتر
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {brands.map((b) => {
                  const isChecked = selectedBrands.includes(b);
                  return (
                    <label
                      key={b}
                      onClick={() => toggleBrand(b)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 cursor-pointer transition-all text-xs"
                    >
                      <span className="font-bold text-slate-200">{b}</span>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Card 2: Price Range Slider */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>محدوده قیمت (تومان)</span>
              </h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min={1000000}
                  max={25000000}
                  step={500000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>تا سقف:</span>
                  <span className="font-bold text-cyan-300">{maxPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>

            {/* Filter Card 3: Switch Toggles */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
              <label className="flex items-center justify-between cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-300 font-bold">فقط کالاهای موجود در انبار</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-300 font-bold">فقط کالاهای تخفیف‌دار</span>
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Trust & Guarantee Box (ESCMarket Terms) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>شرایط گارانتی و اصالت کالا:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                کلیه تجهیزات با ضمانت سلامت فیزیکی و اصالت برند ارسال می‌شوند. پراب‌ها و لوازم جانبی دارای یک روز مهلت تست فنی می‌باشند.
              </p>
            </div>
          </aside>

          {/* MAIN PRODUCT CATALOG */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar (View switch, Sorting, Counts) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  نمایش <strong className="text-white font-mono">{filteredProducts.length}</strong> کالا
                </span>
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                      viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                      viewMode === 'list' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">مرتب‌سازی:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-bold cursor-pointer"
                >
                  <option value="popular">محبوب‌ترین تجهیزات</option>
                  <option value="price_asc">ارزان‌ترین</option>
                  <option value="price_desc">گران‌ترین</option>
                  <option value="discount">بیشترین تخفیف</option>
                  <option value="rating">بالاترین امتیاز فنی</option>
                </select>
              </div>
            </div>

            {/* Product Cards (Grid or List View) */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
                <Package className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">کالایی با این مشخصات یافت نشد</h4>
                <p className="text-xs text-slate-400">لطفاً فیلترها یا عبارت جستجو را تغییر دهید.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 font-bold">
                        {p.brand}
                      </span>
                      {p.discount_percent > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black font-mono">
                          {p.discount_percent}٪ تخفیف
                        </span>
                      )}
                    </div>

                    {/* Product Image Icon */}
                    <div
                      onClick={() => setSelectedProduct(p)}
                      className="aspect-square bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-5xl mb-4 cursor-pointer group-hover:scale-105 transition-transform"
                    >
                      {p.imageIcon}
                    </div>

                    {/* Title & SKU */}
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] text-slate-400 font-mono">پارت‌نامبر: {p.sku}</div>
                      <h4
                        onClick={() => setSelectedProduct(p)}
                        className="text-sm font-bold text-white line-clamp-2 cursor-pointer group-hover:text-cyan-300 transition-colors"
                      >
                        {p.title}
                      </h4>
                    </div>

                    {/* Spec Bullets */}
                    <div className="space-y-1 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 text-[11px] text-slate-300">
                      {p.specs.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="text-cyan-400 font-bold text-[10px]">●</span>
                          <span className="truncate">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-slate-400">قیمت نهایی:</span>
                        <div className="text-left">
                          {p.regular_price > p.price && (
                            <div className="text-[10px] text-slate-500 line-through font-mono">
                              {p.regular_price.toLocaleString('fa-IR')}
                            </div>
                          )}
                          <div className="text-base font-black text-cyan-400 font-mono">
                            {p.price.toLocaleString('fa-IR')}{' '}
                            <span className="text-[10px] font-normal text-slate-400">تومان</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          مشخصات فنی
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          className="py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>خرید سریع</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => setSelectedProduct(p)}
                        className="w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-4xl shrink-0 cursor-pointer"
                      >
                        {p.imageIcon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-[10px] font-mono font-bold">
                            {p.brand}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                        </div>
                        <h4
                          onClick={() => setSelectedProduct(p)}
                          className="text-base font-bold text-white cursor-pointer hover:text-cyan-300"
                        >
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                          {p.specs.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0 space-y-2 w-full sm:w-auto">
                      <div className="text-lg font-black text-cyan-400 font-mono">
                        {p.price.toLocaleString('fa-IR')}{' '}
                        <span className="text-xs font-normal text-slate-400">تومان</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                        >
                          دیتاشیت فنی
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer shadow-md"
                        >
                          افزودن به سبد
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 5. QUICK VIEW & TECHNICAL SPECIFICATION MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 left-6 text-slate-400 hover:text-white cursor-pointer text-lg"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-7xl">
                {selectedProduct.imageIcon}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                    {selectedProduct.brand}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">SKU: {selectedProduct.sku}</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-relaxed">{selectedProduct.title}</h3>

                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {selectedProduct.price.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-slate-400">تومان</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-slate-200">مشخصات فنی دستگاه:</div>
                  <ul className="space-y-1.5 text-slate-300 pr-4 list-disc">
                    {selectedProduct.specs.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 text-xs text-emerald-400 font-semibold">
                  <div>✓ {selectedProduct.warranty}</div>
                  <div>✓ ارسال فوری و تست ۲۴ ساعته</div>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  ⚡ افزودن به سبد و خرید فوری
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SLIDE-OVER QUICK CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-slideLeft">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">سبد خرید شما</h3>
                  <span className="text-xs text-slate-400 font-mono">({cartItems.length} آیتم)</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              </div>

              {/* Free shipping status */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-4 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">ارسال رایگان سفارشات:</span>
                  <span className="text-cyan-400 font-bold">سقف ۵ میلیون تومان</span>
                </div>
                {freeShippingDiff > 0 ? (
                  <p className="text-[11px] text-amber-400">
                    فقط {freeShippingDiff.toLocaleString('fa-IR')} تومان تا ارسال رایگان کل سفارش!
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-400 font-bold">🎉 ارسال این سفارش کاملاً رایگان است!</p>
                )}
              </div>

              {/* Cart Item list */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-xl shrink-0">
                        {item.product.imageIcon}
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-white line-clamp-1">{item.product.title}</h5>
                        <div className="text-cyan-400 font-mono text-[11px]">
                          {item.product.price.toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 font-mono text-xs">تعداد: {item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">جمع کل سبد خرید:</span>
                <span className="font-black text-white font-mono text-base">
                  {cartSubtotal.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-[1.02] transition-all">
                تکمیل نهایی خرید و پرداخت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
