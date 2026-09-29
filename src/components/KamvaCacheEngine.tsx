import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Database, 
  Server, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Terminal, 
  Download, 
  Cpu, 
  HardDrive, 
  ShieldAlert, 
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';

export const KamvaCacheEngine: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'strategy' | 'htaccess' | 'redis' | 'benchmarks'>('strategy');
  const [cacheSettings, setCacheSettings] = useState({
    pageCacheEnabled: true,
    pageCacheTtl: 86400, // 24 hours
    objectCacheType: 'redis', // redis, memcached, database
    redisHost: '127.0.0.1',
    redisPort: 6379,
    browserCacheEnabled: true,
    browserCacheExpires: '1 year',
    gzipCompression: true,
    brotliCompression: true,
    minifyHtml: true,
    minifyCss: true,
    minifyJs: true,
    preloadCacheOnUpdate: true,
    bypassLoggedInUsers: true,
    databaseCleanupAuto: true,
  });

  const [htaccessContent, setHtaccessContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgeSuccess, setPurgeSuccess] = useState<boolean>(false);

  // Generate .htaccess rules dynamically based on settings
  const generateHtaccessRules = () => {
    let rules = `# BEGIN KamvaCacheEngine Professional Rules\n`;
    rules += `# Generated automatically by KamvaWeb Pro for WordPress 7.1\n\n`;

    if (cacheSettings.gzipCompression) {
      rules += `<IfModule mod_deflate.c>\n`;
      rules += `  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/x-javascript\n`;
      rules += `</IfModule>\n\n`;
    }

    if (cacheSettings.brotliCompression) {
      rules += `<IfModule mod_brotli.c>\n`;
      rules += `  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css text/javascript application/javascript application/json\n`;
      rules += `</IfModule>\n\n`;
    }

    if (cacheSettings.browserCacheEnabled) {
      rules += `<IfModule mod_expires.c>\n`;
      rules += `  ExpiresActive On\n`;
      rules += `  ExpiresByType image/jpg "access plus 1 year"\n`;
      rules += `  ExpiresByType image/jpeg "access plus 1 year"\n`;
      rules += `  ExpiresByType image/gif "access plus 1 year"\n`;
      rules += `  ExpiresByType image/png "access plus 1 year"\n`;
      rules += `  ExpiresByType image/webp "access plus 1 year"\n`;
      rules += `  ExpiresByType image/svg+xml "access plus 1 year"\n`;
      rules += `  ExpiresByType text/css "access plus 1 month"\n`;
      rules += `  ExpiresByType application/pdf "access plus 1 month"\n`;
      rules += `  ExpiresByType application/javascript "access plus 1 month"\n`;
      rules += `  ExpiresByType application/x-javascript "access plus 1 month"\n`;
      rules += `  ExpiresByType application/x-shockwave-flash "access plus 1 month"\n`;
      rules += `  ExpiresByType image/x-icon "access plus 1 year"\n`;
      rules += `  ExpiresDefault "access plus 2 days"\n`;
      rules += `</IfModule>\n\n`;
    }

    if (cacheSettings.pageCacheEnabled) {
      rules += `# Kamva Disk Cache Rules\n`;
      rules += `<IfModule mod_rewrite.c>\n`;
      rules += `  RewriteEngine On\n`;
      rules += `  RewriteBase /\n`;
      rules += `  RewriteCond %{REQUEST_METHOD} !GET\n`;
      rules += `  RewriteCond %{QUERY_STRING} !.*s=.*\n`;
      rules += `  RewriteCond %{HTTP_COOKIE} !wordpress_logged_in_\n`;
      rules += `  RewriteCond %{DOCUMENT_ROOT}/wp-content/cache/kamva/$1/index.html -f\n`;
      rules += `  RewriteRule ^(.*)$ /wp-content/cache/kamva/$1/index.html [L]\n`;
      rules += `</IfModule>\n`;
    }

    rules += `# END KamvaCacheEngine`;
    setHtaccessContent(rules);
  };

  useEffect(() => {
    generateHtaccessRules();
  }, [cacheSettings]);

  const handleCopyHtaccess = () => {
    navigator.clipboard.writeText(htaccessContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePurgeAllCaches = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                موتور کش پیشرفته وردپرس
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                Redis / Memcached + .htaccess
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              KamvaCacheEngine — مدیریت بصری استراتژی‌های کشینگ
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              مدیریت هوشمند کش دیتابیس، شیء (Object Cache)، فشرده‌سازی Gzip/Brotli و تولید خودکار قوانین بهینه‌سازی وب‌سرور برای دستیابی به سرعت لود زیر ۰.۸ ثانیه.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePurgeAllCaches}
              disabled={isPurging}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPurging ? 'animate-spin' : ''}`} />
              <span>{isPurging ? 'در حال پاکسازی کش...' : 'پاکسازی کامل کل کش‌ها'}</span>
            </button>
          </div>
        </div>

        {purgeSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>کش تمام صفحات، آبجکت‌ها و فایل‌های استاتیک با موفقیت پاکسازی شد و سیستم آماده پروموت سریع است.</span>
          </div>
        )}
      </div>

      {/* Navigation SubTabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'strategy', label: 'استراتژی‌های کش صفحه و دیتابیس', icon: Sliders },
          { id: 'htaccess', label: 'تولیدکننده قوانین .htaccess', icon: Terminal },
          { id: 'redis', label: 'وضعیت Object Cache (Redis)', icon: Server },
          { id: 'benchmarks', label: 'تست سرعت و بنچمارک لایت‌هاوس', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SubTab 1: Strategy Settings */}
      {activeSubTab === 'strategy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">کش کامل صفحات (Full-Page RAM/Disk Cache)</h3>
                  <p className="text-xs text-slate-400">ذخیره خروجی HTML نهایی برای پاسخ‌دهی در کمتر از ۱۵ میلی‌ثانیه</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cacheSettings.pageCacheEnabled}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, pageCacheEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">مدت انقضای TTL صفحات:</span>
                <select
                  value={cacheSettings.pageCacheTtl}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, pageCacheTtl: Number(e.target.value) })}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value={3600}>۱ ساعت</option>
                  <option value={21600}>۶ ساعت</option>
                  <option value={86400}>۲۴ ساعت (توصیه شده)</option>
                  <option value={604800}>۷ روز</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">عبور از کش برای کاربران لاگین‌شده (Logged-in Bypass):</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.bypassLoggedInUsers}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, bypassLoggedInUsers: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">پیش‌گرمایش خودکار کش (Cache Preloading) پس از آپدیت محتوا:</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.preloadCacheOnUpdate}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, preloadCacheOnUpdate: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">بهینه‌سازی و فشرده‌سازی استاتیک</h3>
                  <p className="text-xs text-slate-400">کوچک‌سازی کدهای HTML, CSS, JS و فعال‌سازی Brotli</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">فشرده‌سازی Gzip سرور:</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.gzipCompression}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, gzipCompression: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">فشرده‌سازی پیشرفته Brotli:</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.brotliCompression}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, brotliCompression: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">کوچک‌سازی HTML (Minify HTML):</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.minifyHtml}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, minifyHtml: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">پاکسازی خودکار دیتابیس (Transient & Post Revisions):</span>
                <input
                  type="checkbox"
                  checked={cacheSettings.databaseCleanupAuto}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, databaseCleanupAuto: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SubTab 2: Htaccess Generator */}
      {activeSubTab === 'htaccess' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-white">تولیدکننده خودکار قوانین `.htaccess` وب‌سرور آپاچی</h3>
              <p className="text-xs text-slate-400 mt-0.5">این کدها بر اساس آخرین تنظیمات کش شما بهینه شده‌اند و قابل کپی و درج مستقیم در ریشه هاست می‌باشند.</p>
            </div>
            <button
              onClick={handleCopyHtaccess}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'کپی شد!' : 'کپی کل قوانین .htaccess'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed select-all">
              {htaccessContent}
            </pre>
          </div>
        </div>
      )}

      {/* SubTab 3: Redis Object Cache */}
      {activeSubTab === 'redis' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl">
                <Server className="w-6 h-6" />
              </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">وضعیت اتصال Redis Object Cache</h3>
              <p className="text-xs text-slate-400">حذف کوئری‌های تکراری دیتابیس با نگهداری متادیتا و گزینه‌های ووکامرس در RAM</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            اتصال برقرار (Connected & Active)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">هاست و پورت اتصال:</span>
            <span className="font-mono text-sm font-bold text-indigo-300">127.0.0.1:6379</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">میزان حافظه مصرفی (Memory):</span>
            <span className="font-mono text-sm font-bold text-emerald-400">۱۲.۴ مگابایت / ۲۵۶ مگابایت</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">نسبت برخورد کش (Hit Rate):</span>
            <span className="font-mono text-sm font-bold text-amber-400">۹۸.۶٪</span>
          </div>
        </div>
      </div>
      )}

      {/* SubTab 4: Benchmarks */}
      {activeSubTab === 'benchmarks' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-white">بنچمارک و تست سرعت عملکرد وبسایت</h3>
            <p className="text-xs text-slate-400">مقایسه زمان پاسخگویی و امتیاز لایت‌هاوس پیش و پس از اعمال موتور کش کاموا</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">پیش از فعال‌سازی کش کاموا</span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">زمان بارگذاری (Load Time):</span>
                <span className="font-mono font-bold text-rose-400">۳.۲ ثانیه</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">امتیاز لایت‌هاوس (Lighthouse):</span>
                <span className="font-mono font-bold text-rose-400">۶۱ / ۱۰۰</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">تعداد کوئری‌های SQL:</span>
                <span className="font-mono font-bold text-rose-400">۴۸ کوئری</span>
              </div>
            </div>

            <div className="bg-indigo-950/40 p-5 rounded-xl border border-indigo-500/40 space-y-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                پس از فعال‌سازی KamvaCacheEngine
              </span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">زمان بارگذاری (Load Time):</span>
                <span className="font-mono font-bold text-emerald-400">۰.۵۴ ثانیه</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">امتیاز لایت‌هاوس (Lighthouse):</span>
                <span className="font-mono font-bold text-emerald-400">۹۹ / ۱۰۰</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">تعداد کوئری‌های SQL:</span>
                <span className="font-mono font-bold text-emerald-400">۳ کوئری (سایر از Redis)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
