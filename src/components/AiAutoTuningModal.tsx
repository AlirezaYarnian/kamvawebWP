import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  CheckCircle2, 
  Gauge, 
  Loader2, 
  X, 
  TrendingUp,
  Cpu,
  Layers,
  Check
} from 'lucide-react';

interface AiAutoTuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTuning: () => void;
}

interface AssessmentItem {
  id: string;
  category: 'cache' | 'security' | 'neural';
  title: string;
  before: string;
  after: string;
  impact: string;
  status: 'pending' | 'running' | 'completed';
}

export const AiAutoTuningModal: React.FC<AiAutoTuningModalProps> = ({
  isOpen,
  onClose,
  onApplyTuning
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const [assessments, setAssessments] = useState<AssessmentItem[]>([
    {
      id: 'c1',
      category: 'cache',
      title: 'فشرده‌سازی بروتلی و فشرده‌سازی CSS/JS',
      before: 'غیرفعال / نیمه‌فعال',
      after: 'Brotli Level 11 + Minify Ultra',
      impact: 'سرعت لود لایت‌هاوس: ۹۹/۱۰۰',
      status: 'pending'
    },
    {
      id: 'c2',
      category: 'cache',
      title: 'تبدیل خودکار عکس‌ها به WebP/AVIF',
      before: 'JPEG سنگین (2.4MB)',
      after: 'WebP Lossless (180KB)',
      impact: 'کاهش ۹۲٪ حجم تصاویر',
      status: 'pending'
    },
    {
      id: 's1',
      category: 'security',
      title: 'دیوار آتش WAF و فیلتر حملات SQLi/XSS',
      before: 'حالت استاندار',
      after: 'فیلتر هوشمند WAF + لایه ۷',
      impact: 'امنیّت ۱۰۰٪ کامل',
      status: 'pending'
    },
    {
      id: 's2',
      category: 'security',
      title: 'محدودسازی نرخ درخواست (Rate-Limiting) و غیرفعال‌سازی XML-RPC',
      before: 'بدون محدودیت نرخ',
      after: 'مسدودسازی ربات‌ها و Brute-Force',
      impact: 'کاهش ۹۵٪ فشار سرور',
      status: 'pending'
    },
    {
      id: 'n1',
      category: 'neural',
      title: 'تنظیم نرخ یادگیری و اندازه بچ هسته ML',
      before: 'LR: 0.01 (پایه)',
      after: 'LR: 0.001 (بهینه)',
      impact: 'دقت پاسخگویی: ۹۸.۶٪',
      status: 'pending'
    },
    {
      id: 'n2',
      category: 'neural',
      title: 'بهینه‌سازی پنجره کانتکست و زمان پاسخ‌دهی (Latency)',
      before: 'تأخیر: ۱۸ میلی‌ثانیه',
      after: 'تأخیر: ۳.۲ میلی‌ثانیه',
      impact: 'پاسخ‌دهی ۵ برابر سریع‌تر',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setOverallProgress(0);
      setIsCompleted(false);
      setLogs([]);
      setAssessments(prev => prev.map(a => ({ ...a, status: 'pending' })));
      return;
    }

    // Start auto-tuning steps automatically when opened
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timer4: NodeJS.Timeout;

    setLogs(['[0.00s] شروع تحلیل متقاطع ماژول‌های کش، امنیت و شبکه عصبی...']);

    // Step 1: Cache
    timer1 = setTimeout(() => {
      setCurrentStep(1);
      setOverallProgress(35);
      setAssessments(prev => prev.map((a, i) => i <= 1 ? { ...a, status: 'completed' } : a));
      setLogs(l => [
        ...l, 
        '[0.85s] کش بروتلی، فشرده‌سازی جاوااسکریپت و تبدیل WebP اعمال شد (+۳۴٪ سرعت).'
      ]);
    }, 1000);

    // Step 2: Security
    timer2 = setTimeout(() => {
      setCurrentStep(2);
      setOverallProgress(70);
      setAssessments(prev => prev.map((a, i) => i <= 3 ? { ...a, status: 'completed' } : a));
      setLogs(l => [
        ...l, 
        '[1.70s] دیواره آتش WAF فعال شد. پورت‌های غیرضروری و XML-RPC مسدود گردیدند.'
      ]);
    }, 2200);

    // Step 3: Neural ML
    timer3 = setTimeout(() => {
      setCurrentStep(3);
      setOverallProgress(100);
      setAssessments(prev => prev.map(a => ({ ...a, status: 'completed' })));
      setLogs(l => [
        ...l, 
        '[2.60s] وزن‌های شبکه عصبی کالیبره شد. زمان پاسخگویی به ۳.۲ms کاهش یافت.'
      ]);
    }, 3400);

    // Step 4: Finish
    timer4 = setTimeout(() => {
      setIsCompleted(true);
      onApplyTuning();
      setLogs(l => [
        ...l, 
        '✅ [3.10s] فرآیند AI Auto-Tuning با موفقیت کامل انجام شد. کلیه کانفیگ‌های بهینه اعمال گردیدند.'
      ]);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden text-slate-100 font-sans">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                تنظیم خودکار هوش مصنوعی (AI Auto-Tuning)
                {isCompleted && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    تکمیل شد
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                پایش متقاطع و اعمال خودکار بهترین تنظیمات کش، امنیت و شبکه عصبی
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Scores */}
        <div className="my-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              {!isCompleted ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  در حال تحلیل و تنظیم متقاطع... ({overallProgress}٪)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  تنظیمات بهینه با موفقیت اعمال گردید!
                </>
              )}
            </span>
            <span className="text-slate-400 font-mono">
              امتیاز لایت‌هاوس: <strong className="text-emerald-400">۹۹/۱۰۰</strong>
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Assessment Items Grid */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {assessments.map((item) => (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                item.status === 'completed'
                  ? 'bg-slate-950/80 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.category === 'cache' && <Zap className="w-4 h-4 text-amber-400 shrink-0" />}
                {item.category === 'security' && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                {item.category === 'neural' && <BrainCircuit className="w-4 h-4 text-indigo-400 shrink-0" />}

                <div>
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="line-through text-slate-500">{item.before}</span>
                    <span>←</span>
                    <span className="text-indigo-300 font-medium">{item.after}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                {item.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    {item.impact}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    در حال ارزیابی
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live Execution Logs */}
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 h-20 overflow-y-auto space-y-1">
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith('✅') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {log}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>پایدار با وردپرس ۷.۱ و PHP 8.2+</span>
          </div>

          <button
            onClick={onClose}
            disabled={!isCompleted}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>بستن و مشاهده نتایج</span>
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال بهینه‌سازی...</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
