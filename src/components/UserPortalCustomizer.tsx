import React, { useState } from 'react';
import { 
  User, 
  Users, 
  LogIn, 
  KeyRound, 
  ShieldCheck, 
  Sliders, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  Store, 
  GraduationCap, 
  Briefcase, 
  Crown, 
  Layers, 
  Eye, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { UserPortalConfig } from '../types/theme';

interface UserPortalCustomizerProps {
  portalConfig: UserPortalConfig;
  onUpdateConfig: (updated: Partial<UserPortalConfig>) => void;
}

export const UserPortalCustomizer: React.FC<UserPortalCustomizerProps> = ({
  portalConfig,
  onUpdateConfig,
}) => {
  const [activePreview, setActivePreview] = useState<'login' | 'dashboard'>('login');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'tel' | 'email' | 'select'>('text');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const siteTypes = [
    { id: 'shop', label: 'فروشگاه اینترنتی و فیزیکی', icon: Store, desc: 'تمرکز بر رهگیری سفارش، آدرس‌های ارسال و سبد خرید' },
    { id: 'academy', label: 'آموزشگاه آنلاین و دوره‌ها (LMS)', icon: GraduationCap, desc: 'تمرکز بر دوره‌های ثبت‌نامی، ویدیوها و آزمون‌ها' },
    { id: 'corporate', label: 'وبسایت شرکتی و استارتاپی', icon: Briefcase, desc: 'فرم اختصاصی استعلام قیمت و دریافت فایل‌های کاتالوگ' },
    { id: 'vip_membership', label: 'اشتراکی و باشگاه مشتریان (VIP)', icon: Crown, desc: 'تمدید اشتراک ماهانه، دسترسی به مقالات و لایسنس‌ها' },
  ];

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField = {
      id: `field-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: true,
    };
    onUpdateConfig({
      customRegistrationFields: [...portalConfig.customRegistrationFields, newField],
    });
    setNewFieldLabel('');
    setToastMessage('فیلد جدید با موفقیت به فرم ثبت‌نام اضافه گردید.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveField = (id: string) => {
    onUpdateConfig({
      customRegistrationFields: portalConfig.customRegistrationFields.filter((f) => f.id !== id),
    });
  };

  const handleToggleTab = (tabId: string) => {
    onUpdateConfig({
      customDashboardTabs: portalConfig.customDashboardTabs.map((t) =>
        t.id === tabId ? { ...t, enabled: !t.enabled } : t
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              سامانه اختصاصی مدیریت اعضا و ورود کاربران کامواوب
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              OTP پیامکی فعال
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">
            شخصی‌سازی پنل ورود، ثبت‌نام و داشبورد کاربران بر اساس نوع سایت
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            مدیر سایت می‌تواند متناسب با کاربری سایت خود (فروشگاهی، آموزشی، شرکتی یا VIP)، فیلدهای مورد نیاز را طراحی کرده و پنل اختصاصی را در اختیار مخاطبانش قرار دهد.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Site Category Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-indigo-400" />
          مرحله ۱: انتخاب نوع وبسایت برای تنظیم خودکار الگوهای پنل کاربری
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteTypes.map((type) => {
            const IconComponent = type.icon;
            const isSelected = portalConfig.siteCategory === type.id;
            return (
              <div
                key={type.id}
                onClick={() => onUpdateConfig({ siteCategory: type.id as any })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-900/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-300'}`}>{type.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{type.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Configuration & Live Visual Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Builder & Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              مرحله ۲: فیلدهای ثبت‌نام و ورود کاربران
            </h3>

            {/* OTP Toggle */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  ورود فوق‌سریع بدون کلمه عبور با کد پیامکی (OTP SMS)
                </span>
                <p className="text-[11px] text-slate-400">
                  سازگار با سامانه‌های کاوه‌نگار، فراز اس‌ام‌اس، قاصدک، ملی‌پیامک و وب‌سرویس پترن
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={portalConfig.otpMobileLogin}
                  onChange={(e) => onUpdateConfig({ otpMobileLogin: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Custom Registration Fields List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">فیلدهای فرم ثبت‌نام:</span>
              <div className="space-y-2">
                {portalConfig.customRegistrationFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{field.label}</span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        {field.type === 'tel' ? 'تلفن/موبایل' : field.type === 'email' ? 'ایمیل' : 'متن'}
                      </span>
                      {field.required && (
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1 rounded">اجباری</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="حذف فیلد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Field Box */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="عنوان فیلد جدید (مثلاً: کد ملی یا شهر سکونت)..."
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="text">متنی</option>
                  <option value="tel">شماره تلفن</option>
                  <option value="email">ایمیل</option>
                  <option value="select">انتخابی</option>
                </select>
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tabs Toggle */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">تب‌های فعال در پیشخوان کاربری:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {portalConfig.customDashboardTabs.map((tab) => (
                  <label
                    key={tab.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      tab.enabled ? 'bg-indigo-950/20 border-indigo-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <input
                      type="checkbox"
                      checked={tab.enabled}
                      onChange={() => handleToggleTab(tab.id)}
                      className="w-4 h-4 accent-indigo-500 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Visual Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-xs">پیش‌نمایش زنده پنل کاربران (Live Preview)</h4>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                <button
                  onClick={() => setActivePreview('login')}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                    activePreview === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فرم ورود
                </button>
                <button
                  onClick={() => setActivePreview('dashboard')}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                    activePreview === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  پیشخوان کاربر
                </button>
              </div>
            </div>

            {/* Preview Box */}
            {activePreview === 'login' ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-right">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    KW
                  </div>
                  <h5 className="font-bold text-white text-sm">{portalConfig.customPortalTitle}</h5>
                  <p className="text-[11px] text-slate-400">{portalConfig.welcomeNotice}</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  {portalConfig.customRegistrationFields.map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="text-[11px] text-slate-300 block">
                        {f.label} {f.required && <span className="text-rose-400">*</span>}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.label}
                        disabled
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  ))}

                  <button
                    disabled
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg mt-3"
                  >
                    {portalConfig.otpMobileLogin ? 'دریافت کد تایید یکبار مصرف (OTP)' : 'ثبت‌نام و ورود به پنل'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-right text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    علی
                  </div>
                  <div>
                    <span className="font-bold text-white block">علی یاری</span>
                    <span className="text-[10px] text-slate-400">عضویت ویژه • مشتری وفادار</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {portalConfig.customDashboardTabs.filter(t => t.enabled).map((tab) => (
                    <div key={tab.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-indigo-400 font-bold text-xs block">{tab.label}</span>
                      <span className="text-[10px] text-slate-400 block">مشاهده و مدیریت</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>این فرم با شورتکد <code>[kamva_user_portal]</code> در هر برگه وردپرس قابل نمایش است.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
