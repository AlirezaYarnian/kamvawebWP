import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Power, 
  RefreshCw, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  User, 
  Lock, 
  Unlock, 
  Activity, 
  Cpu, 
  Sliders, 
  Zap 
} from 'lucide-react';

export const GlobalSafetyProtocol: React.FC = () => {
  const [safetyStatus, setSafetyStatus] = useState<any>({
    globalAiPaused: false,
    pauseReason: '',
    pausedAt: null,
    pausedBy: '',
    subsystems: {
      marketingAutomations: true,
      aiChatSalesBots: true,
      backgroundCronTasks: true,
      dynamicStyleSync: true,
      seoContentGenerators: true,
    },
    auditLogs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSafetyStatus = async () => {
    try {
      const res = await fetch('/api/safety/status');
      const data = await res.json();
      if (data.success) {
        setSafetyStatus(data);
      }
    } catch (e) {
      console.error('Failed to load safety status', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleGlobal = async (pause: boolean) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/safety/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pause,
          reason: reasonInput || (pause ? 'توقف اضطراری کل سیستم توسط ادمین' : 'از سرگیری عادی سیستم'),
          adminUser: 'مدیر ارشد سیستم (Administrator)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSafetyStatus(data);
        setReasonInput('');
        setShowModal(false);
        showToast(data.message);
      }
    } catch (e) {
      console.error('Failed to toggle safety state', e);
      showToast('خطا در ارتباط با سرور و اعمال پروتکل ایمنی.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyLockdown = async () => {
    const reason = prompt('لطفاً دلیل قرنطینه اضطراری (Emergency Lockdown) و توقف کل هوش مصنوعی را وارد کنید:', 'رفتار غیرعادی یا خطای پاسخگویی مدل هوش مصنوعی');
    if (reason === null) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/safety/emergency-lockdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          adminUser: 'مدیر ارشد امنیت (AIOS Security)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSafetyStatus(data);
        showToast(data.message);
      }
    } catch (e) {
      console.error('Failed emergency lockdown', e);
      showToast('خطا در اجرای قرنطینه اضطراری.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubsystemToggle = async (key: string, currentValue: boolean) => {
    const updatedSubsystems = {
      ...safetyStatus.subsystems,
      [key]: !currentValue
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/safety/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pause: safetyStatus.globalAiPaused,
          reason: safetyStatus.pauseReason,
          subsystems: updatedSubsystems,
          adminUser: 'مدیر ارشد سیستم'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSafetyStatus(data);
        showToast('وضعیت زیرسیستم با موفقیت به‌روزرسانی شد.');
      }
    } catch (e) {
      console.error('Failed to update subsystem', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-indigo-500/50 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all ${
        safetyStatus.globalAiPaused 
          ? 'bg-gradient-to-r from-slate-950 via-rose-950 to-slate-950 border-rose-500/50' 
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30'
      }`}>
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          safetyStatus.globalAiPaused ? 'bg-rose-500/15' : 'bg-indigo-500/10'
        }`} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                safetyStatus.globalAiPaused 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {safetyStatus.globalAiPaused ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                {safetyStatus.globalAiPaused ? 'وضعیت: توقف اضطراری هوش مصنوعی (AI Paused)' : 'وضعیت: تمامی سیستم‌های هوش مصنوعی فعال و پایدار'}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                GlobalSafetyProtocol v1.0
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              پروتکل ایمنی جهانی و کلید قطع اضطراری هوش مصنوعی (Kill-Switch)
            </h2>
            
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              امکان توقف فوری تمامی فرآیندهای خودکار هوش مصنوعی، ربات‌های فروش، تقویم‌های محتوایی و وظایف پس‌زمینه وردپرس در صورت بروز هرگونه رفتار غیرعادی یا ناهنجاری رفتاری.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {safetyStatus.globalAiPaused ? (
              <button
                onClick={() => handleToggleGlobal(false)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>از سرگیری فعالیت هوش مصنوعی</span>
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>توقف اضطراری هوش مصنوعی</span>
              </button>
            )}

            <button
              onClick={handleEmergencyLockdown}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-rose-950 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer"
            >
              <Power className="w-4 h-4 text-rose-400" />
              <span>قرنطینه کامل (Lockdown)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Status & Lockdown Banner if Paused */}
      {safetyStatus.globalAiPaused && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">هشدار: فرآیندهای خودکار هوش مصنوعی در سایت معلق هستند</h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                دلیل توقف: <span className="font-bold text-white">{safetyStatus.pauseReason || 'نامشخص'}</span> | ثبت‌شده توسط: <span className="font-mono text-white">{safetyStatus.pausedBy}</span> در تاریخ {safetyStatus.pausedAt ? new Date(safetyStatus.pausedAt).toLocaleString('fa-IR') : 'اخیر'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subsystems Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {Object.entries(safetyStatus.subsystems || {}).map(([key, active]: [string, any]) => {
          const names: Record<string, { title: string; desc: string }> = {
            marketingAutomations: { title: 'خودکارسازی بازاریابی و تقویم محتوا', desc: 'تولید هفتگی محتوا و پست‌های هوش مصنوعی' },
            aiChatSalesBots: { title: 'ربات‌های چت و مشاوره فروش زنده', desc: 'ویجت‌های هوش مصنوعی تعاملی با مشتریان' },
            backgroundCronTasks: { title: 'وظایف پس‌زمینه و Action Scheduler', desc: 'پاکسازی دیتابیس و بهینه‌سازی خودکار' },
            dynamicStyleSync: { title: 'همگام‌ساز استایل و توکن‌های المنتور', desc: 'آپدیت خودکار طراحی‌ها و متریال دیزاین' },
            seoContentGenerators: { title: 'تولیدکننده استراتژی سئو و متادیتا', desc: 'تحلیل کلمات کلیدی و مقالات سالانه' }
          };

          const info = names[key] || { title: key, desc: 'زیرسیستم هوش مصنوعی' };
          const isPausedGlobal = safetyStatus.globalAiPaused;
          const isSubActive = isPausedGlobal ? false : active;

          return (
            <div key={key} className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all ${
              isSubActive ? 'border-slate-800' : 'border-rose-500/30 bg-rose-950/10'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-white">{info.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{info.desc}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${
                  isSubActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {isSubActive ? 'فعال (Active)' : 'متوقف (Paused)'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">وضعیت زیرسیستم:</span>
                <button
                  onClick={() => handleSubsystemToggle(key, active)}
                  disabled={isSubmitting || isPausedGlobal}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 ${
                    active 
                      ? 'bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700' 
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                </button>
              </div>
            </div>
          );
        })}

      </div>

      {/* Audit Trail Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>تاریخچه رویدادها و لاگ‌های امنیتی پروتکل ایمنی (Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">سوابق تغییرات وضعیت، توقف‌های اضطراری و دسترسی مدیران به کلید قطع اضطراری</p>
          </div>

          <button
            onClick={fetchSafetyStatus}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>بارگذاری مجدد لاگ‌ها</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4">نوع رویداد (Action)</th>
                <th className="py-3 px-4">شرح رویداد و جزئیات</th>
                <th className="py-3 px-4">مدیر مجری</th>
                <th className="py-3 px-4">زمان ثبت</th>
                <th className="py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {safetyStatus.auditLogs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      log.severity === 'critical' ? 'bg-rose-500 animate-ping' : log.severity === 'success' ? 'bg-emerald-400' : 'bg-indigo-400'
                    }`} />
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans">{log.description}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{log.adminUser}</td>
                  <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {log.severity === 'critical' ? 'بحرانی/توقف' : 'پایدار/عادی'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Pause Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">تایید توقف اضطراری هوش مصنوعی</h3>
                <p className="text-xs text-slate-400">لطفاً دلیل توقف سیستم‌های هوش مصنوعی را وارد کنید</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">دلیل توقف اضطراری (باعث ثبت در Audit Trail می‌شود):</label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="مثال: مشاهده رفتار غیرعادی در پاسخگویی ربات فروش یا خطای تکراری در پردازشگر..."
                className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => handleToggleGlobal(true)}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                تایید و توقف فوری کل هوش مصنوعی
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
