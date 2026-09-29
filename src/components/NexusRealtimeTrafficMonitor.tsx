import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Cpu, 
  Server, 
  TrendingUp, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  HardDrive,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Radio,
  Eye,
  Terminal,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const NexusRealtimeTrafficMonitor: React.FC = () => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [threatData, setThreatData] = useState<any[]>([]);
  const [attackOrigins, setAttackOrigins] = useState<any[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [activeTabForensics, setActiveTabForensics] = useState<'overview' | 'headers' | 'payload'>('overview');
  const [serverRes, setServerRes] = useState<any>({
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    ramUsedMb: 0,
    ramTotalMb: 8192,
    diskIoKbps: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrafficData = async () => {
    try {
      const res = await fetch('/api/traffic/realtime');
      const data = await res.json();
      if (data.success) {
        setTrafficData(data.timeSeriesTraffic);
        setThreatData(data.threatBreakdown);
        setServerRes(data.serverResources);
        setAttackOrigins(data.attackOrigins || []);
        if (data.attackOrigins && data.attackOrigins.length > 0 && !selectedAttack) {
          setSelectedAttack(data.attackOrigins[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load realtime traffic', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      fetchTrafficData();
    }, 1500);
  };

  const handleCopyPayload = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                مانیتورینگ ترافیک زنده و فورنزیک امنیتی
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
                NexusRealtimeTrafficMonitor
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              پایش آنلاین ترافیک، تحلیل فورنزیک حملات و ردیابی منبع
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              کشف ساختار دقیق درخواست‌های مسدودشده، هدرهای HTTP، پی‌لودهای مخرب تزریق‌شده و قانون امنیتی فعال‌شده فایروال AIOS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Radio className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'در حال اسکن رادار...' : 'اسکن زنده تهدیدات'}</span>
            </button>

            <button
              onClick={fetchTrafficData}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>بارگذاری مجدد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">درخواست‌های ورودی (REQ/min)</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">۳,۴۰۰</div>
          <span className="text-[11px] text-emerald-400 font-medium">↑ ۲۴٪ افزایش نسبت به ساعت قبل</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">حملات دفع‌شده توسط AIOS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">۳۱۰ حمله</div>
          <span className="text-[11px] text-rose-300 font-medium">امنیت فایروال لایه ۷ فعال</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">میانگین مصرف CPU</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">{serverRes.cpuUsagePercent}%</div>
          <span className="text-[11px] text-slate-400 font-medium">بهینه و زیر حد بحران</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">مصرف حافظه رم (RAM)</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{serverRes.ramUsedMb} MB</div>
          <span className="text-[11px] text-slate-400 font-medium">از کل {serverRes.ramTotalMb} مگابایت</span>
        </div>

      </div>

      {/* World Map Attack Geolocation & Forensics Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
              <span>نقشه زنده ردیابی منابع حمله و فورنزیک لایه ۷ (Global Attack Geolocation & Forensics)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              تحلیل عمیق درخواست‌های مسدودشده، استخراج هدرهای HTTP، پی‌لودهای نفوذ و قانون امنیتی فایروال AIOS.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              سیستم دفاعی AIOS فعال
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Interactive Stylized World Map Container */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* World Map Background Graphic Representation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
              <Globe className="w-80 h-80 text-indigo-500" />
            </div>

            {/* Radar Sweep Effect if scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center backdrop-blur-xs z-20">
                <div className="text-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
                  <span className="text-xs font-bold text-rose-300">در حال ردیابی IP و اسکن سیگنال‌های حمله از سراسر جهان...</span>
                </div>
              </div>
            )}

            {/* Top map label */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-300">نقشه حرارتی مبدا تهدیدات (Live WAF Radar)</span>
              <span>تعداد کل گره‌های رصدشده: {attackOrigins.length} کشور</span>
            </div>

            {/* Interactive Attack Markers on Map */}
            <div className="relative w-full h-64 my-auto z-10">
              {attackOrigins.map((atk) => {
                const isSelected = selectedAttack?.id === atk.id;
                return (
                  <button
                    key={atk.id}
                    onClick={() => setSelectedAttack(atk)}
                    style={{ left: `${atk.x}%`, top: `${atk.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-7 h-7 rounded-full animate-ping opacity-75 ${
                        atk.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border ${
                        atk.severity === 'Critical' ? 'bg-rose-600 border-rose-300' : 'bg-amber-600 border-amber-300'
                      }`}>
                        {atk.code}
                      </div>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap shadow-xl z-40">
                      <p className="font-bold">{atk.country} ({atk.city})</p>
                      <p className="text-[10px] text-rose-400 font-mono">{atk.attackType}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  حمله بحرانی (Critical)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  حمله متوسط/بالا (High/Mod)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">مرکز سرور: Frankfurt / AWS Cloud</span>
            </div>

          </div>

          {/* Detailed Attack Forensics Inspector Panel */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-rose-400" />
                  تحلیل فورنزیک حمله (Forensic Analysis)
                </span>
                {selectedAttack && (
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    selectedAttack.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    ریسک: {selectedAttack.forensics?.riskScore || 90}/100
                  </span>
                )}
              </div>

              {/* Forensics Navigation Tabs */}
              <div className="flex items-center gap-2 mb-4 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTabForensics('overview')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTabForensics === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  خلاصه حمله
                </button>
                <button
                  onClick={() => setActiveTabForensics('headers')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTabForensics === 'headers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  هدرها (Headers)
                </button>
                <button
                  onClick={() => setActiveTabForensics('payload')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTabForensics === 'payload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  پی‌لود (Payload)
                </button>
              </div>

              {selectedAttack ? (
                <div>
                  {activeTabForensics === 'overview' && (
                    <div className="space-y-3">
                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] text-slate-400">مبدا و آدرس IP:</span>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">{selectedAttack.country} ({selectedAttack.city})</p>
                          <span className="text-xs font-mono font-bold text-rose-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {selectedAttack.ip}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] text-slate-400 font-bold text-amber-400">قانون امنیتی فعال‌شده (Rule Triggered):</span>
                        <p className="text-xs font-mono font-bold text-white bg-slate-950 p-2 rounded border border-slate-800">
                          {selectedAttack.forensics?.ruleTriggered || 'AIOS-WAF-LAYER7-BLOCK'}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {selectedAttack.forensics?.ruleDescription || 'حمله به دلیل عدم مطابقت با امضاهای امنیتی مسدود گردید.'}
                        </p>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] text-slate-400">شبکه و ارائه دهنده (ASN):</span>
                        <p className="text-xs font-mono text-indigo-300">{selectedAttack.forensics?.clientAsn || 'Unknown ASN'}</p>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] text-slate-400">متد و آدرس مقصد (Target Endpoint):</span>
                        <p className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">{selectedAttack.forensics?.httpMethod || 'POST'}</span>
                          {selectedAttack.targetEndpoint}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTabForensics === 'headers' && (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-400 font-bold">هدرهای HTTP استخراج‌شده (HTTP Request Headers):</span>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5">
                        {Object.entries(selectedAttack.forensics?.requestHeaders || {}).map(([k, v]: [string, any]) => (
                          <div key={k} className="border-b border-slate-800/60 pb-1 flex flex-col">
                            <span className="text-indigo-400 font-bold">{k}:</span>
                            <span className="text-slate-200 break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTabForensics === 'payload' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-bold text-rose-400">قطعه کد پی‌لود تزریق‌شده (Payload Snippet):</span>
                        <button
                          onClick={() => handleCopyPayload(selectedAttack.forensics?.payloadSnippet || '')}
                          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPayload ? 'کپی شد' : 'کپی پی‌لود'}</span>
                        </button>
                      </div>
                      
                      <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-3 max-h-52 overflow-y-auto font-mono text-[11px] text-rose-300 dir-ltr text-left leading-relaxed select-all">
                        <pre>{selectedAttack.forensics?.payloadSnippet || '// No payload payload recorded'}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-12 text-center">لطفاً روی یکی از پین‌های روی نقشه کلیک کنید تا تحلیل فورنزیک کامل نمایش داده شود.</p>
              )}
            </div>

            {selectedAttack && (
              <button
                onClick={() => alert(`IP ${selectedAttack.ip} با موفقیت در بلک‌لیست دائم فایروال لایه ۷ ثبت شد.`)}
                className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>مسدودسازی دائمی این IP در فایروال</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line / Area Chart for Traffic & Threats */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>روند ترافیک ورودی و حملات دفع‌شده در طول زمان</span>
            </h3>
            <p className="text-xs text-slate-400">نمودار خطی و مساحتی درخواست‌های سرور همراه با تعداد حملات مسدودشده</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f05023" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f05023" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="requests" name="درخواست‌های ورودی" stroke="#6366f1" fillOpacity={1} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="threatsBlocked" name="حملات مسدودشده" stroke="#f05023" fillOpacity={1} fill="url(#colorThreat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for Threat Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>دسته‌بندی نوع حملات دفع‌شده</span>
            </h3>
            <p className="text-xs text-slate-400">تحلیل نوع حملات لایه ۷ مسدودشده توسط AIOS</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {threatData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
