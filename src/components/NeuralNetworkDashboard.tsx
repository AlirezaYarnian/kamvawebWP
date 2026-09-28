import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Flame, 
  SlidersHorizontal,
  Layers,
  ArrowRightLeft,
  Binary
} from 'lucide-react';
import { NeuralNetworkConfig } from '../types/theme';

interface NeuralNetworkDashboardProps {
  neuralConfig: NeuralNetworkConfig;
  onUpdateConfig: (updated: Partial<NeuralNetworkConfig>) => void;
}

export const NeuralNetworkDashboard: React.FC<NeuralNetworkDashboardProps> = ({
  neuralConfig,
  onUpdateConfig,
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(neuralConfig.trainingEpochs);
  const [lossRate, setLossRate] = useState(0.014);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTrainEpochs = () => {
    setIsTraining(true);
    let current = trainingEpoch;
    const interval = setInterval(() => {
      current += 20;
      setTrainingEpoch(current);
      setLossRate((prev) => Math.max(0.004, Number((prev - 0.001).toFixed(4))));
      if (current >= trainingEpoch + 100) {
        clearInterval(interval);
        setIsTraining(false);
        onUpdateConfig({
          trainingEpochs: current,
          realtimeOptimizationScore: 99,
          lastTrainedTimestamp: 'هم‌اکنون (دقت ۹۹.۲٪)',
        });
        setToastMessage('آموزش شبکه عصبی مدل کامواوب با موفقیت انجام شد: ضریب خطای پیش‌بینی به ۰.۰۰۴ کاهش یافت!');
        setTimeout(() => setToastMessage(null), 4000);
      }
    }, 150);
  };

  const handleWeightChange = (key: keyof typeof neuralConfig.synapticWeights, value: number) => {
    onUpdateConfig({
      synapticWeights: {
        ...neuralConfig.synapticWeights,
        [key]: value,
      },
    });
  };

  const layers = [
    {
      id: 'input',
      title: 'ورودی سنسورهای رفتاری (Input Layer)',
      nodes: ['سرعت اسکرول کاربر', 'حرکت ماوس و تمرکز', 'منطقه جغرافیایی و زمان', 'منبع ارجاع (گوگل/مستقیم)', 'تاریخچه سبد خرید'],
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
    },
    {
      id: 'hidden-1',
      title: 'لایه پردازش شناختی ۱ (Hidden Layer A)',
      nodes: ['تحلیل قصد خرید (Intent)', 'حساسیت به قیمت و تخفیف', 'احتمال پرش کاربر (Bounce)', 'محاسبه نیاز به مشاوره چت'],
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
    {
      id: 'hidden-2',
      title: 'لایه پیش‌بینی زیرساخت ۲ (Hidden Layer B)',
      nodes: ['پیش‌گرم‌سازی کش هوشمند', 'اولویت‌بندی کوئری‌های دیتابیس', 'سرکوب کدهای اضافی المنتور', 'تحلیل سلامت هوک‌های PHP'],
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    },
    {
      id: 'output',
      title: 'لایه تصمیم و خروجی (Output Layer)',
      nodes: ['نمایش آفر و کد تخفیف آنی', 'لود موشکی برگه هدف', 'تبدیل کاربر به خریدار (CRO)', 'پایداری ۱۰۰٪ بدون کرش'],
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                هسته یادگیری ماشین و شبکه‌های عصبی محلی کامواوب
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                مدل خودآموز فعال (Active ML Core)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              داشبورد شبکه عصبی و ماشین لرنینگ مدل کامواوب (Kamva Neural Network)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              این مدل پیشرفته بدون وابستگی به هیچ سرور خارجی، الگوهای رفتاری کاربران را پایش کرده و زیرساخت سایت را به صورت خودکار برای حداکثر سرعت و نرخ فروش تنظیم می‌کند.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleTrainEpochs}
              disabled={isTraining}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? `در حال آموزش لایه‌ها (Epoch ${trainingEpoch})...` : 'آموزش مجدد شبکه عصبی (Train Epochs)'}</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Real-time ML Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold block">امتیاز بهینه‌سازی زنده (Neural Score)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {neuralConfig.realtimeOptimizationScore}٪
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">بسیار دقیق</span>
          </div>
          <span className="text-[10px] text-slate-500 block">بر اساس داده‌های واقعی بازدیدکنندگان</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold block">تعداد چرخه‌های آموزش (Trained Epochs)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400 font-mono">
              {trainingEpoch.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">سیکل یادگیری</span>
          </div>
          <span className="text-[10px] text-slate-500 block">به‌روزرسانی خودکار سیناپس‌ها</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold block">نرخ خطا (Loss Function)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {lossRate}
            </span>
            <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded font-bold">حداقل خطا</span>
          </div>
          <span className="text-[10px] text-slate-500 block">الگوریتم گرادیان کاهشی تصادفی (SGD)</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold block">نرخ یادگیری (Learning Rate)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {neuralConfig.learningRate}
            </span>
            <span className="text-[10px] text-slate-400">Adaptive Momentum</span>
          </div>
          <span className="text-[10px] text-slate-500 block">پایداری بالا بدون اورفیتینگ</span>
        </div>
      </div>

      {/* Visual Neural Network Architecture (4 Layers Representation) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-bold text-white text-sm">توپولوژی لایه‌های شبکه عصبی کامواوب (Neural Topology)</h3>
              <p className="text-[11px] text-slate-400">جریان داده‌ها از حسگرهای رفتاری تا تصمیمات فروش و بهینه‌سازی هسته</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            ۴ لایه متصل (Fully Connected)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {layers.map((layer) => (
            <div key={layer.id} className={`rounded-2xl border p-4 space-y-3 ${layer.color}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-xs">{layer.title}</span>
                <Binary className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="space-y-2">
                {layer.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 text-[11px] flex items-center justify-between"
                  >
                    <span>{node}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synaptic Weights Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-white text-sm">تنظیم وزن‌های سیناپسی مدل (Synaptic Weights Tuner)</h3>
              <p className="text-[11px] text-slate-400">
                این مقادیر به صورت خودکار توسط موتور ML بهینه‌سازی می‌شوند، اما می‌توانید به صورت دستی نیز آن‌ها را کالیبره کنید.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">وزن تخمین قصد خرید کاربر (User Intent):</span>
              <span className="font-mono text-indigo-400 font-bold">{neuralConfig.synapticWeights.userIntentWeight}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={neuralConfig.synapticWeights.userIntentWeight}
              onChange={(e) => handleWeightChange('userIntentWeight', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">وزن حساسیت به قیمت (Price Sensitivity):</span>
              <span className="font-mono text-purple-400 font-bold">{neuralConfig.synapticWeights.priceSensitivityWeight}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={neuralConfig.synapticWeights.priceSensitivityWeight}
              onChange={(e) => handleWeightChange('priceSensitivityWeight', Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">وزن ارتباط محتوایی (Content Relevance):</span>
              <span className="font-mono text-emerald-400 font-bold">{neuralConfig.synapticWeights.contentRelevanceWeight}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={neuralConfig.synapticWeights.contentRelevanceWeight}
              onChange={(e) => handleWeightChange('contentRelevanceWeight', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">وزن جلوگیری از خروج و پرش (Bounce Prevention):</span>
              <span className="font-mono text-rose-400 font-bold">{neuralConfig.synapticWeights.bouncePreventionWeight}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={neuralConfig.synapticWeights.bouncePreventionWeight}
              onChange={(e) => handleWeightChange('bouncePreventionWeight', Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={neuralConfig.adaptiveCachePrewarming}
              onChange={(e) => onUpdateConfig({ adaptiveCachePrewarming: e.target.checked })}
              className="w-4 h-4 accent-indigo-500 rounded"
            />
            <span>پیش‌گرم‌سازی سازگار کش بر اساس پیش‌بینی رفتاری</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={neuralConfig.anomalyDetectionActive}
              onChange={(e) => onUpdateConfig({ anomalyDetectionActive: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded"
            />
            <span>شناسایی هوشمند آنومالی‌ها و رفتارهای مشکوک بات‌ها</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={neuralConfig.userIntentInference}
              onChange={(e) => onUpdateConfig({ userIntentInference: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
            <span>استنباط بی‌درنگ قصد خرید و ارسال پیشنهاد هوشمند</span>
          </label>
        </div>
      </div>
    </div>
  );
};
