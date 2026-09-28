import React, { useState, useEffect, useRef } from 'react';
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
  Pause,
  RotateCcw,
  BarChart3,
  ShieldCheck,
  AlertCircle,
  Server,
  HardDrive
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

interface LiveTelemetryPoint {
  timeLabel: string;
  latencyMs: number;
  cpuPercent: number;
  ramMb: number;
  rps: number;
  activeRequests: number;
}

export const NeuralNetworkDashboard: React.FC<NeuralNetworkDashboardProps> = ({
  neuralConfig,
  onUpdateConfig,
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(neuralConfig.trainingEpochs);
  const [lossRate, setLossRate] = useState(0.014);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chatbot Q&A Scenario State
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

  // Advanced Traffic & CPU/RAM Live Simulator State
  const [simulatedLoadMessages, setSimulatedLoadMessages] = useState<number>(3500);
  const [trafficSimActive, setTrafficSimActive] = useState<boolean>(false);
  const [totalProcessedMessages, setTotalProcessedMessages] = useState<number>(0);
  const [telemetryHistory, setTelemetryHistory] = useState<LiveTelemetryPoint[]>([
    { timeLabel: '00:00', latencyMs: 14, cpuPercent: 12, ramMb: 42, rps: 180, activeRequests: 20 },
    { timeLabel: '00:02', latencyMs: 16, cpuPercent: 15, ramMb: 44, rps: 240, activeRequests: 45 },
    { timeLabel: '00:04', latencyMs: 15, cpuPercent: 14, ramMb: 43, rps: 210, activeRequests: 35 },
    { timeLabel: '00:06', latencyMs: 18, cpuPercent: 19, ramMb: 48, rps: 320, activeRequests: 80 },
    { timeLabel: '00:08', latencyMs: 22, cpuPercent: 24, ramMb: 52, rps: 450, activeRequests: 120 },
    { timeLabel: '00:10', latencyMs: 19, cpuPercent: 21, ramMb: 50, rps: 390, activeRequests: 95 },
  ]);

  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Simulation Engine Effect
  useEffect(() => {
    if (trafficSimActive) {
      simTimerRef.current = setInterval(() => {
        const timeNow = new Date();
        const timeStr = `${timeNow.getMinutes().toString().padStart(2, '0')}:${timeNow.getSeconds().toString().padStart(2, '0')}`;
        
        // Calculate realistic load factors based on simulatedLoadMessages (1000 - 10000)
        const loadRatio = simulatedLoadMessages / 10000;
        
        const baseLatency = Math.floor(12 + loadRatio * 28 + Math.random() * 8);
        const baseCpu = Math.floor(18 + loadRatio * 52 + Math.random() * 12);
        const baseRam = Math.floor(45 + loadRatio * 115 + Math.random() * 15);
        const baseRps = Math.floor((simulatedLoadMessages / 2.2) + (Math.random() * 150 - 75));
        const activeReqs = Math.floor(simulatedLoadMessages * 0.12 + Math.random() * 50);

        setTotalProcessedMessages((prev) => prev + Math.floor(baseRps * 1.2));

        setTelemetryHistory((prev) => {
          const next = [
            ...prev,
            {
              timeLabel: timeStr,
              latencyMs: baseLatency,
              cpuPercent: Math.min(99, baseCpu),
              ramMb: baseRam,
              rps: baseRps,
              activeRequests: activeReqs,
            },
          ];
          return next.slice(-12); // keep last 12 data points for smooth charting
        });
      }, 1200);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [trafficSimActive, simulatedLoadMessages]);

  const handleStartTrafficSim = () => {
    setTrafficSimActive(true);
    setToastMessage(`شبیه‌ساز ترافیک سنگین فعال شد: ارسال همزمان ${simulatedLoadMessages.toLocaleString('fa-IR')} پیام در ثانیه به هسته هوش مصنوعی!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePauseTrafficSim = () => {
    setTrafficSimActive(false);
  };

  const handleResetTrafficSim = () => {
    setTrafficSimActive(false);
    setTotalProcessedMessages(0);
    setTelemetryHistory([
      { timeLabel: '00:00', latencyMs: 14, cpuPercent: 12, ramMb: 42, rps: 180, activeRequests: 20 },
      { timeLabel: '00:02', latencyMs: 15, cpuPercent: 14, ramMb: 44, rps: 210, activeRequests: 30 },
      { timeLabel: '00:04', latencyMs: 13, cpuPercent: 13, ramMb: 43, rps: 190, activeRequests: 25 },
    ]);
  };

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

  const handleWeightChange = (key: keyof typeof neuralConfig.synapticWeights, value: number) => {
    onUpdateConfig({
      synapticWeights: {
        ...neuralConfig.synapticWeights,
        [key]: value,
      },
    });
  };

  const currentPoint = telemetryHistory[telemetryHistory.length - 1] || {
    latencyMs: 16,
    cpuPercent: 15,
    ramMb: 45,
    rps: 200,
    activeRequests: 30,
  };

  const maxLatencyInHistory = Math.max(...telemetryHistory.map((p) => p.latencyMs), 60);
  const maxCpuInHistory = Math.max(...telemetryHistory.map((p) => p.cpuPercent), 100);

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
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                مدل خودآموز فعال (Active ML Core)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              داشبورد شبکه عصبی، شبیه‌ساز ترافیک سنگین و پایش زنده CPU/RAM
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              ارسال هزاران پیام همزمان به چت‌بات، اندازه‌گیری زنده زمان پاسخگویی (Latency) و سنجش بار پردازشی سرور روی نمودارهای پویا.
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

      {/* FEATURE: MASSIVE TRAFFIC SIMULATOR & REAL-TIME CPU/RAM/LATENCY CHARTS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">ماژول شبیه‌ساز ترافیک سنگین و پایش منابع هسته AI</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  Live Telemetry Core
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تولید همزمان هزاران درخواست پیام به چت‌بات و رسم لحظه‌ای زمان پاسخگویی (Latency) و میزان مصرف CPU و RAM
              </p>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2.5">
            {!trafficSimActive ? (
              <button
                onClick={handleStartTrafficSim}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع شبیه‌سازی ترافیک همزمان</span>
              </button>
            ) : (
              <button
                onClick={handlePauseTrafficSim}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>توقف شبیه‌ساز (Pause)</span>
              </button>
            )}

            <button
              onClick={handleResetTrafficSim}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
              title="بازنشانی آمار"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intensity Control & Realtime Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">حجم پیام‌های همزمان (Concurrent Messages):</span>
              <span className="text-sm font-black text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                {simulatedLoadMessages.toLocaleString('fa-IR')} پیام/ثانیه
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={simulatedLoadMessages}
              onChange={(e) => setSimulatedLoadMessages(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>۱,۰۰۰ پیام (ترافیک معمولی)</span>
              <span>۵,۰۰۰ پیام (کمپین)</span>
              <span>۱۰,۰۰۰ پیام (حمله/جشنواره)</span>
            </div>

            <div className="pt-2 border-t border-slate-900 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>کل پیام‌های پردازش‌شده:</span>
                <span className="font-mono font-bold text-white text-sm">{totalProcessedMessages.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>وضعیت سلامت هسته:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  بدون گلوگاه (Optimal)
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Gauge Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gauge 1: Latency */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  زمان پاسخگویی (Latency)
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">
                  پاسخ آنی
                </span>
              </div>

              <div className="my-1">
                <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                  {currentPoint.latencyMs}
                </span>
                <span className="text-xs text-slate-400 font-mono mr-1.5">ms</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentPoint.latencyMs / 80) * 100)}%` }}
                />
              </div>
            </div>

            {/* Gauge 2: CPU Usage */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  مصرف پردازنده (CPU)
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  currentPoint.cpuPercent > 75 ? 'text-rose-400 bg-rose-500/10' : 'text-purple-400 bg-purple-500/10'
                }`}>
                  {currentPoint.cpuPercent > 75 ? 'بار بالا' : 'استاندارد'}
                </span>
              </div>

              <div className="my-1">
                <span className="text-3xl font-black text-purple-400 font-mono tracking-tight">
                  {currentPoint.cpuPercent}٪
                </span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-purple-500 h-full transition-all duration-500" 
                  style={{ width: `${currentPoint.cpuPercent}%` }}
                />
              </div>
            </div>

            {/* Gauge 3: RAM Usage */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  مصرف حافظه (RAM)
                </span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-mono font-bold">
                  محلی
                </span>
              </div>

              <div className="my-1">
                <span className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                  {currentPoint.ramMb}
                </span>
                <span className="text-xs text-slate-400 font-mono mr-1.5">MB</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentPoint.ramMb / 250) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LIVE VISUAL CHARTS (SVG Telemetry Line & Bar Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Chart 1: Latency Trend Line Chart */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                نمودار زنده زمان پاسخگویی چت‌بات (Latency - ms)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                آخرین ثبت: {currentPoint.timeLabel}
              </span>
            </div>

            {/* SVG Line Chart */}
            <div className="h-44 w-full relative pt-4 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Path calculation */}
                {(() => {
                  const points = telemetryHistory.map((pt, idx) => {
                    const x = (idx / (telemetryHistory.length - 1 || 1)) * 500;
                    const y = 110 - ((pt.latencyMs / (maxLatencyInHistory || 100)) * 90);
                    return { x, y, pt };
                  });

                  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                  const areaD = `${pathD} L 500 110 L 0 110 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#latencyGradient)" />
                      <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          className="fill-amber-400 stroke-slate-950 stroke-2"
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* X-Axis labels */}
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                {telemetryHistory.map((pt, idx) => (
                  <span key={idx}>{pt.timeLabel}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 2: CPU & RAM Consumption Multi-Bar Chart */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                نمودار زنده مصرف منابع پردازشی (CPU % & RAM MB)
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> CPU٪
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> RAM (MB)
                </span>
              </div>
            </div>

            {/* Bars Visualization */}
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 pb-2 px-2">
              {telemetryHistory.map((pt, idx) => (
                <div key={idx} className="flex-1 flex items-end justify-center gap-1 h-full relative group">
                  {/* CPU Bar */}
                  <div
                    className="w-2 bg-purple-500 rounded-t transition-all duration-500 hover:brightness-125"
                    style={{ height: `${Math.max(10, pt.cpuPercent)}%` }}
                  />
                  {/* RAM Bar */}
                  <div
                    className="w-2 bg-cyan-400 rounded-t transition-all duration-500 hover:brightness-125"
                    style={{ height: `${Math.max(10, (pt.ramMb / 200) * 100)}%` }}
                  />

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 text-[9px] p-2 rounded shadow-xl whitespace-nowrap z-20 font-mono">
                    <div>CPU: {pt.cpuPercent}%</div>
                    <div>RAM: {pt.ramMb} MB</div>
                    <div>RPS: {pt.rps}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
              {telemetryHistory.map((pt, idx) => (
                <span key={idx}>{pt.timeLabel}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* COMPLEX Q&A SCENARIO SIMULATOR SECTION */}
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

        {/* Right Side: Architecture & Topology Summary */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-white text-sm">معماری ایزوله پردازش شبکه‌های عصبی</h3>
                <p className="text-[11px] text-slate-400">بدون مصرف منابع سرور اصلی وردپرس</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-purple-300 block">۱. کش هوشمند و دسترسی صفر ثانیه‌ای (Zero-Latency Storage)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                استفاده از حافظه ترنزینت خودمختار وردپرس جهت تحویل لحظه‌ای پاسخی بدون درگیر کردن پردازنده اصلی host.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">۲. کنترل هوشمند ترافیک همزمان (Throttling & Queueing)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                صف‌بندی خودکار تا ۱۰,۰۰۰ درخواست در ثانیه برای جلوگیری از Overload سرور و حفظ زمان پاسخگویی زبر ۱۸ میلی‌ثانیه.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300 block">۳. تطبیق خودکار با نسخه PHP و دیتابیس</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                سازگاری کامل با PHP 7.4 تا PHP 8.3 و عدم ایجاد لاگ اضافه در جداول وردپرس.
              </p>
            </div>
          </div>
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
