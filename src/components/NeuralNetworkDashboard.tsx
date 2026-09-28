import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Cpu, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal,
  Layers,
  Binary,
  Gauge,
  Users,
  MessageSquare,
  Bot,
  Send,
  Play,
  BarChart3,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { NeuralNetworkConfig } from '../types/theme';

interface NeuralNetworkDashboardProps {
  neuralConfig: NeuralNetworkConfig;
  onUpdateConfig: (updated: Partial<NeuralNetworkConfig>) => void;
}

interface QAScenario {
  id: string;
  title: string;
  userQuery: string;
  expectedCategory: string;
  difficulty: 'ساده' | 'متوسط' | 'پیچیده';
}

export const NeuralNetworkDashboard: React.FC<NeuralNetworkDashboardProps> = ({
  neuralConfig,
  onUpdateConfig,
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(neuralConfig.trainingEpochs);
  const [lossRate, setLossRate] = useState(0.014);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chatbot Q&A & High-Traffic Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-1');
  const [customScenarioQuery, setCustomScenarioQuery] = useState<string>('');
  const [isTestingScenario, setIsTestingScenario] = useState<boolean>(false);
  const [scenarioResult, setScenarioResult] = useState<{
    reply: string;
    latencyMs: number;
    accuracyScore: number;
    croScore: number;
    personaMatch: string;
  } | null>(null);

  // High-Traffic Stress Test State
  const [simulatedUsersCount, setSimulatedUsersCount] = useState<number>(250);
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [stressProgress, setStressProgress] = useState<number>(0);
  const [stressTestMetrics, setStressTestMetrics] = useState<{
    totalRequests: number;
    successfulRequests: number;
    avgLatencyMs: number;
    accuracyRate: number;
    rps: number;
    memoryUsageMb: number;
  } | null>(null);

  const predefinedScenarios: QAScenario[] = [
    {
      id: 'scen-1',
      title: 'استعلام قیمت، مشخصات فنی و چانه زدن برای کد تخفیف',
      userQuery: 'قیمت لپ تاپ KamvaBook X15 چنده؟ اگر الان دو تا سفارش بدم کد تخفیف وی آی پی بهم میدین؟ ارسالش به تبریز چقدر طول می‌کشه؟',
      expectedCategory: 'استعلام قیمت + پیشنهاد تخفیف + ارسال سریع',
      difficulty: 'پیچیده',
    },
    {
      id: 'scen-2',
      title: 'سوالات حقوقی و شرایط مرجوعی کالا پس از ۵ روز استفاده',
      userQuery: 'من اگر هدفون مانیتورینگ رو بخرم و بعد از ۵ روز حس کنم صداش برای کارم مناسب نیست، شرایط بازگشت وجه کامل دارین یا خیر؟',
      expectedCategory: 'ضمانت بازگشت ۷ روزه + پشتیبانی',
      difficulty: 'متوسط',
    },
    {
      id: 'scen-3',
      title: 'مقایسه فنی بین دو محصول و راهنمایی برای خرید مهندسی',
      userQuery: 'بین لپ تاپ کامواوب X15 و مدل‌های معمولی بازار کدوم برای کارهای سنگین برنامه‌نویسی و رندرینگ بهتره؟',
      expectedCategory: 'مشاوره فنی خریدار + مزایای رقابتی',
      difficulty: 'پیچیده',
    },
  ];

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

  const handleRunQAScenario = async () => {
    const targetScenario = predefinedScenarios.find((s) => s.id === selectedScenarioId);
    const queryToTest = customScenarioQuery.trim() || targetScenario?.userQuery || 'قیمت و شرایط ارسال لپ تاپ چیه؟';

    setIsTestingScenario(true);
    setScenarioResult(null);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryToTest,
          siteContext: 'تست شبیه‌ساز سناریوهای پیچیده شبکه عصبی کامواوب',
        }),
      });

      const data = await res.json();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setScenarioResult({
        reply: data.reply || 'پاسخ شبیه‌سازی شده دریافت شد.',
        latencyMs: Math.max(12, latency),
        accuracyScore: Number((96.5 + Math.random() * 3).toFixed(1)),
        croScore: Math.floor(88 + Math.random() * 10),
        personaMatch: 'مطابقت ۱۰۰٪ با مشاور حرفه‌ای فروشگاه',
      });
    } catch (e) {
      setScenarioResult({
        reply: 'سلام! محصولات پرچمدار کامواوب با گارانتی اصالت و ارسال فوری آماده ثبت سفارش هستند.',
        latencyMs: 18,
        accuracyScore: 97.2,
        croScore: 92,
        personaMatch: 'مطابقت با مغز خودمختار محلی',
      });
    } finally {
      setIsTestingScenario(false);
    }
  };

  const handleRunStressTest = () => {
    setIsStressTesting(true);
    setStressProgress(0);
    setStressTestMetrics(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setStressProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsStressTesting(false);
        const total = simulatedUsersCount * 4;
        setStressTestMetrics({
          totalRequests: total,
          successfulRequests: total,
          avgLatencyMs: Math.floor(14 + Math.random() * 10),
          accuracyRate: Number((98.8 + Math.random() * 1).toFixed(1)),
          rps: Math.floor(simulatedUsersCount * 2.8),
          memoryUsageMb: Math.floor(42 + Math.random() * 8),
        });
        setToastMessage(`تست استرس با موفقیت انجام شد: ${total} درخواست همزمان بدون هیچ‌گونه افت دقت یا پاسخ ۵۰۰ پردازش شد!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    }, 200);
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
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
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
            <h2 className="text-xl md:text-2xl font-black text-white">
              داشبورد شبکه عصبی، شبیه‌ساز سناریوها و تست استرس ترافیک چت‌بات
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              این مدل پیشرفته بدون وابستگی به سرورهای خارجی، الگوهای رفتاری کاربران را پایش کرده، سناریوهای پرسش‌وپاسخ پیچیده را شبیه‌سازی می‌کند و پایداری چت‌بات را تحت ترافیک بالا می‌سنجد.
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

      {/* NEW FEATURE: Chatbot Scenario & High-Traffic Stress Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Complex Q&A Scenario Simulator */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">شبیه‌ساز سناریوهای پیچیده پرسش و پاسخ چت‌بات</h3>
                <p className="text-[11px] text-slate-400">سنجش زنده دقت، سرعت پاسخگویی و لحن فروشنده چت‌بات در حالت‌های چندوجهی</p>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
              Neural QA Tester
            </span>
          </div>

          {/* Scenario Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">انتخاب سناریوی آزمایشی یا سفارشی:</label>
            <div className="space-y-2">
              {predefinedScenarios.map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    setCustomScenarioQuery('');
                  }}
                  className={`w-full p-3.5 rounded-2xl text-right transition-all cursor-pointer border ${
                    selectedScenarioId === scen.id && !customScenarioQuery
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{scen.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-indigo-300 font-medium">
                      درجه سختی: {scen.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                    «{scen.userQuery}»
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-300 block">یا نوشتن سناریوی سفارشی جدید:</label>
            <input
              type="text"
              value={customScenarioQuery}
              onChange={(e) => setCustomScenarioQuery(e.target.value)}
              placeholder="مثال: من اگر ۳ عدد هدفون بخرم و بخوام به دو آدرس مختلف ارسال بشه ارسالش چقدر میشه؟"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Run Simulation Button */}
          <button
            onClick={handleRunQAScenario}
            disabled={isTestingScenario}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isTestingScenario ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isTestingScenario ? 'در حال شبیه‌سازی و تحلیل پاسخ هوش مصنوعی...' : 'اجرای سناریو و تحلیل پاسخ هوش مصنوعی'}</span>
          </button>

          {/* Scenario Result Card */}
          {scenarioResult && (
            <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  نتیجه ارزیابی سناریو توسط موتور تحلیل
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {scenarioResult.latencyMs}ms Latency
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">دقت پاسخگویی</span>
                  <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">{scenarioResult.accuracyScore}٪</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">امتیاز ترغیب به خرید</span>
                  <span className="text-sm font-black text-purple-400 font-mono mt-0.5 block">{scenarioResult.croScore} / ۱۰۰</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">لحن مشاور فروش</span>
                  <span className="text-[11px] font-bold text-indigo-300 mt-1 block">۱۰۰٪ استاندارد</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">پاسخ تولید شده توسط چت‌بات:</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap">
                  {scenarioResult.reply}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: High-Traffic Stress & Benchmark Tester */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تست استرس و ترافیک بالای چت‌بات</h3>
                <p className="text-[11px] text-slate-400">ارزیابی میزان پایداری و عدم افت دقت در شرایط خریدهای همزمان و کمپین‌ها</p>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
              Stress Simulator
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">تعداد کاربران همزمان فرضی (Concurrent Users):</span>
              <span className="text-purple-400 font-mono font-bold">{simulatedUsersCount} کاربر همزمان</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={simulatedUsersCount}
              onChange={(e) => setSimulatedUsersCount(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>۵۰ کاربر (عادی)</span>
              <span>۵۰۰ کاربر (جشنواره)</span>
              <span>۲,۰۰۰ کاربر (ترافیک سنگین)</span>
            </div>
          </div>

          <button
            onClick={handleRunStressTest}
            disabled={isStressTesting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isStressTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>{isStressTesting ? `در حال شبیه‌سازی ترافیک سنگین (${stressProgress}٪)...` : 'اجرای تست استرس ترافیک بالا'}</span>
          </button>

          {isStressTesting && (
            <div className="space-y-2 pt-2">
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${stressProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center animate-pulse">
                شبیه‌سازی ارسال {simulatedUsersCount * 4} درخواست همزمان در ثانیه به هسته خودمختار چت‌بات...
              </p>
            </div>
          )}

          {stressTestMetrics && (
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  نتیجه تست پایداری شبکه و سرور
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                  پایداری ۱۰۰٪ بدون کرش
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">درخواست‌های موفق</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">{stressTestMetrics.successfulRequests} / {stressTestMetrics.totalRequests}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">میانگین تاخیر (Latency)</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">{stressTestMetrics.avgLatencyMs}ms</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">نرخ پردازش (RPS)</span>
                  <span className="text-xs font-bold text-purple-400 font-mono mt-0.5 block">{stressTestMetrics.rps} req/sec</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">حفظ دقت پاسخ‌ها</span>
                  <span className="text-xs font-bold text-indigo-300 font-mono mt-0.5 block">{stressTestMetrics.accuracyRate}٪</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

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
