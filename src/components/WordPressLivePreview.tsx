import React, { useState } from 'react';
import { ThemeOptionsConfig, KnowledgeItem } from '../types/theme';
import { KamvaLogo } from './KamvaLogo';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  SlidersHorizontal, 
  Star, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  X, 
  Plus, 
  Minus, 
  Phone, 
  Layers, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink,
  MessageSquareHeart,
  Bot,
  User,
  Menu
} from 'lucide-react';

interface WordPressLivePreviewProps {
  config: ThemeOptionsConfig;
  knowledgeBase: KnowledgeItem[];
  onSwitchToAdmin: () => void;
}

export const WordPressLivePreview: React.FC<WordPressLivePreviewProps> = ({
  config,
  knowledgeBase,
  onSwitchToAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(2);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductColors, setSelectedProductColors] = useState<Record<string, string>>({
    'prod-1': '#1e293b',
    'prod-2': '#e11d48',
  });
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  // Filter products from knowledge base
  const products = knowledgeBase.filter((k) => k.category === 'product' || k.price);

  const handleAddToCart = (product: any) => {
    setCartItemsCount((prev) => prev + 1);
    setCartNotification(`«${product.title}» به سبد خرید افزوده شد!`);
    setIsCartDrawerOpen(true);
    setTimeout(() => setCartNotification(null), 4000);
  };

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== 'all') {
      return (p.title + p.content).toLowerCase().includes(activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      return (p.title + p.content).toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top WP Admin Bar (Simulation) */}
      <div className="bg-[#1d2327] text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800 z-50 sticky top-0 font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <span className="w-4 h-4 rounded-full bg-[#f05023] flex items-center justify-center text-[10px] text-white font-serif font-black">W</span>
            <span>{config.general.siteName || 'کامواوب پرو'}</span>
          </div>
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center gap-1 hover:text-white bg-slate-800/80 px-2.5 py-0.5 rounded text-[11px] text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#f05023]" />
            <span>بازگشت به پیشخوان تم‌آپشن وردپرس</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            فرانت‌اند زنده قالب وردپرس (Kamva Store Live Preview)
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">کش لایت‌اسپید: Active</span>
        </div>
      </div>

      {/* Top Header Notification Bar */}
      {config.storeBuilderOptions.headerBuilder.topBarEnabled && (
        <div className="bg-gradient-to-r from-[#1e2d5a] via-slate-900 to-[#1e2d5a] text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#ff805d] font-bold">
                <Flame className="w-3.5 h-3.5 text-[#f05023] animate-pulse" />
                تخفیف ویژه راه‌اندازی با کد تخفیف KAMVA15
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">ارسال فوری رایگان برای خریدهای بالای ۱ میلیون تومان</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                پشتیبانی ۲۴ ساعته: ۰۲۱-۹۱۰۰۲۳۴۵
              </span>
              <span>پیگیری سفارش</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Theme Header */}
      <header className={`bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 sticky top-7 z-40 transition-all ${
        config.storeBuilderOptions.headerBuilder.stickyHeader ? 'shadow-xl shadow-black/40' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <KamvaLogo size="md" showText={true} />
          </div>

          {/* Live Ajax Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="جستجوی زنده در میان محصولات، مشخصات فنی و دوره‌ها..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#f05023] focus:ring-1 focus:ring-[#f05023] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Live Search Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>نتایج جستجوی لحظه‌ای:</span>
                  <button onClick={() => setIsSearchOpen(false)} className="hover:text-white cursor-pointer">بستن</button>
                </div>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setQuickViewProduct(p);
                        setIsSearchOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                          WP
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">{p.title}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{p.content}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">{p.price || 'تماس'}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 p-2 text-center">موردی یافت نشد.</p>
                )}
              </div>
            )}
          </div>

          {/* Action Icons: User Account, Wishlist, Shopping Cart */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-medium">
              <User className="w-4 h-4 text-[#f05023]" />
              <span className="hidden lg:inline">حساب کاربری</span>
            </button>

            {config.storeBuilderOptions.headerBuilder.wishlistCompareCounter && (
              <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all relative cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  ۱
                </span>
              </button>
            )}

            {/* Sliding Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#f05023] to-orange-600 hover:from-[#e04519] text-white font-bold text-xs shadow-lg shadow-[#f05023]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سبد خرید</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
                {cartItemsCount}
              </span>
            </button>
          </div>

        </div>

        {/* Navigation Categories Megamenu Bar */}
        <nav className="border-t border-slate-800/60 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs overflow-x-auto py-2">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'all' ? 'text-[#ff805d]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Menu className="w-3.5 h-3.5" />
                <span>همه دسته‌بندی‌ها</span>
              </button>

              {['کالای دیجیتال و لپ‌تاپ', 'موبایل و گجت‌ها', 'دوره‌های آموزشی و LMS', 'پوشاک و مد', 'خدمات و گارانتی اختصاصی'].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`transition-colors cursor-pointer ${
                    activeCategory === cat ? 'text-[#ff805d] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-emerald-400 font-bold hidden lg:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ضمانت اصالت و بازگشت ۷ روزه
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f05023]/20 border border-[#f05023]/40 text-[#ff805d] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#f05023]" />
              <span>نسخه پروداکشن قالب فروشگاهی کامواوب پرو</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              تجربه خرید فوق‌سریع با <span className="bg-gradient-to-r from-[#f05023] via-orange-400 to-indigo-300 bg-clip-text text-transparent">هوش مصنوعی و سواچز زنده</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              هدرساز هوشمند، ایجکس سرچ بدون تاخیر، پنل کاربری متناسب با نیاز کسب‌وکار و لود آنی صفحات با لایت‌هاوس ۹۹/۱۰۰.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const target = document.getElementById('shop-catalog');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-[#f05023] to-orange-600 hover:from-[#e04519] text-white font-bold text-xs md:text-sm rounded-2xl shadow-xl shadow-[#f05023]/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>مشاهده محصولات و دوره‌ها</span>
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs md:text-sm rounded-2xl transition-all cursor-pointer flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>سفارشی‌سازی تم‌آپشن</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#f05023] animate-pulse" />
                  پیشنهاد شگفت‌انگیز روز (Deal of the Day)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  تخفیف ۲۲٪
                </span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-[#1e2d5a] to-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                  KamvaBook
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">اولترابوک مهندسی پرو X15</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-emerald-400">۳۸,۵۰۰,۰۰۰ تومان</span>
                    <span className="text-xs text-slate-500 line-through">۴۹,۰۰۰,۰۰۰</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">فقط ۳ عدد در انبار باقی مانده است!</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">زمان باقی‌مانده:</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#ff805d]">
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">۰۴</span>:
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">۳۲</span>:
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">۱۸</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WooCommerce Products Grid Section */}
      <section id="shop-catalog" className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f05023]" />
              <h2 className="text-xl md:text-2xl font-black text-white">کاتالوگ فروشگاه و محصولات منتخب</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">امکان انتخاب رنگ با سواچز ایجکس، پیش‌نمایش سریع (Quick View) و افزودن فوری به سبد</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">مرتب‌سازی:</span>
            <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white">
              <option>محبوب‌ترین و پرفروش‌ترین‌ها</option>
              <option>جدیدترین‌ها</option>
              <option>ارزان‌ترین به گران‌ترین</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => {
            const selectedColor = selectedProductColors[prod.id] || '#1e293b';

            return (
              <div
                key={prod.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-black/50 group relative"
              >
                {/* Product Image & Badges */}
                <div className="relative h-48 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800/80 flex items-center justify-center overflow-hidden">
                  <div 
                    className="w-24 h-24 rounded-2xl border flex items-center justify-center text-xs font-bold transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${selectedColor}33`, borderColor: selectedColor, color: selectedColor === '#1e293b' ? '#818cf8' : selectedColor }}
                  >
                    Kamva Store
                  </div>

                  {prod.conversionTrigger && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      ویژه
                    </span>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>مشاهده سریع</span>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>دسته‌بندی: {prod.category || 'تجهیزات هوشمند'}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-mono">4.9</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#ff805d] transition-colors">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.content}
                  </p>

                  {/* Variation Swatches (Colors) */}
                  {config.storeBuilderOptions.shopCatalog.swatchesAttributeSelector && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500">رنگ:</span>
                      {['#1e293b', '#e11d48', '#2563eb'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedProductColors({ ...selectedProductColors, [prod.id]: color })}
                          className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                            selectedColor === color ? 'scale-125 ring-2 ring-[#f05023]' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        {prod.price || '۳۸,۵۰۰,۰۰۰ تومان'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="px-3.5 py-2 bg-gradient-to-r from-[#f05023] to-orange-600 hover:from-[#e04519] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>خرید فوری</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sliding Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#f05023]" />
                  <h3 className="font-bold text-white text-base">سبد خرید هوشمند کاموا استور</h3>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart Notification */}
              {cartNotification && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{cartNotification}</span>
                </div>
              )}

              {/* Sample Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white">اولترابوک مهندسی پرو X15</h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">۳۸,۵۰۰,۰۰۰ تومان</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                    <button className="px-1.5 text-slate-400 hover:text-white">+</button>
                    <span className="font-bold font-mono">۱</span>
                    <button className="px-1.5 text-slate-400 hover:text-white">-</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Footer */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">جمع کل سبد خرید:</span>
                <span className="text-base font-black text-emerald-400 font-mono">۳۸,۵۰۰,۰۰۰ تومان</span>
              </div>

              <button
                onClick={() => {
                  alert('هدایت به صفحه تسویه‌حساب تک‌مرحله‌ای ووکامرس (Fast 1-Step Checkout)');
                  setIsCartDrawerOpen(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تکمیل خرید و پرداخت نهایی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 relative space-y-4 shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-56 rounded-2xl bg-gradient-to-tr from-slate-950 to-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg">
                Kamva Quick View
              </div>

              <div className="space-y-3 text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  {quickViewProduct.category || 'کالای پرچمدار'}
                </span>
                <h3 className="font-bold text-base text-white">{quickViewProduct.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{quickViewProduct.content}</p>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {quickViewProduct.price || '۳۸,۵۰۰,۰۰۰ تومان'}
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#f05023] to-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Sales Assistant Widget Button (Bottom Right) */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="p-3.5 bg-gradient-to-r from-[#f05023] to-indigo-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
          <Bot className="w-5 h-5 text-white animate-bounce" />
          <span className="text-xs font-bold">مشاور هوشمند خرید</span>
        </div>
      </div>

      {/* Theme Footer Builder */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <KamvaLogo size="md" showText={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              قالب و سیستم فروشگاهی یکپارچه کامواوب؛ مجهز به موتور هوش مصنوعی محلی، کش لایت‌اسپید و امنیت پیشرفته وردپرس ۷.۱.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">دسترسی سریع</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>صفحه اصلی فروشگاه</li>
              <li>پیگیری سفارشات</li>
              <li>حساب کاربری من</li>
              <li>قوانین و ضمانت بازگشت</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">ماژول‌های فعال تم</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>موتور کاموا استور و سواچز</li>
              <li>سپر امنیتی All-in-One WAF</li>
              <li>کش آبجکت‌های Redis</li>
              <li>ساندباکس خودترمیمی پایداری</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">نشان‌های اعتماد و امنیت</h4>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                TLS 1.3 Strict
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                WP 7.1 Verified
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>تمامی حقوق مادی و معنوی متعلق به برند کامواوب (KamvaWeb Pro) می‌باشد.</span>
          <button onClick={onSwitchToAdmin} className="text-indigo-400 hover:underline cursor-pointer">
            ورود به تم‌آپشن پیشخوان وردپرس
          </button>
        </div>
      </footer>

    </div>
  );
};
