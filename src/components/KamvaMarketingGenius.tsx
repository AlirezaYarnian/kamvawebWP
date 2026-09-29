import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Share2, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Target, 
  Layers, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  Instagram,
  Send as TelegramIcon,
  Mail,
  FileText
} from 'lucide-react';

export const KamvaMarketingGenius: React.FC = () => {
  const [productName, setProductName] = useState('اولترابوک مهندسی کامواوب پرو KamvaBook X15');
  const [goal, setGoal] = useState('افزایش فروش مستقیم و معرفی ویژگی‌های سخت‌افزاری');
  const [targetAudience, setTargetAudience] = useState('برنامه‌نویسان، طراحان و مهندسان نرم‌افزار حرفه‌ای');
  const [platforms, setPlatforms] = useState<string[]>(['اینستاگرام', 'تلگرام', 'بلاگ وردپرس', 'خبرنامه ایمیلی']);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [calendarResult, setCalendarResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateCalendar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/marketing/generate-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, goal, targetAudience, platforms }),
      });
      const data = await res.json();
      if (data.success && data.calendarData) {
        setCalendarResult(data.calendarData);
      }
    } catch (e) {
      console.error('Failed to generate marketing calendar', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate on mount
  useEffect(() => {
    handleGenerateCalendar();
  }, []);

  const handleCopyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
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
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                هوش مصنوعی بازاریابی و فروش
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
                KamvaMarketingGenius
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              نابغه بازاریابی — تولید تقویم محتوایی ۷ روزه و ایده‌های شبکه‌های اجتماعی
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تولید خودکار تقویم محتوایی هفتگی برای محصولات ووکامرس بر اساس ترندهای روز، اصول روانشناسی فروش چالدینی و زمان‌بندی بهینه انتشار.
            </p>
          </div>

          <button
            onClick={handleGenerateCalendar}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 ring-1 ring-rose-400/50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'در حال تحلیل ترندها...' : 'تولید تقویم محتوایی جدید'}</span>
          </button>
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">محصول یا دسته‌بندی هدف:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            placeholder="مثلا: هدفون بی‌سیم Kamva Pro"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">هدف کلان بازاریابی:</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            placeholder="مثلا: معرفی ویژگی‌های جدید و افزایش فروش"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">مخاطبان هدف (Target Audience):</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            placeholder="مثلا: گيمرها و طراحان دیجیتال"
          />
        </div>
      </div>

      {/* Calendar Overview Card */}
      {calendarResult && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950/60 to-rose-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Target className="w-4 h-4" />
              <span>خلاصه استراتژی و ترندهای هفته:</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {calendarResult.strategyOverview}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold text-amber-400">هدف هفتگی: {calendarResult.weeklyGoal}</span>
              <span className="font-mono text-emerald-400">۷ روز محتوای بهینه‌سازی شده آماده</span>
            </div>
          </div>

          {/* 7-Day Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarResult.calendar?.map((item: any, index: number) => (
              <div 
                key={index}
                className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold font-mono">
                      {item.day}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      {item.platform === 'اینستاگرام' && <Instagram className="w-3.5 h-3.5 text-rose-400" />}
                      {item.platform === 'تلگرام' && <TelegramIcon className="w-3.5 h-3.5 text-blue-400" />}
                      {item.platform === 'خبرنامه ایمیلی' && <Mail className="w-3.5 h-3.5 text-amber-400" />}
                      {item.platform === 'بلاگ وردپرس' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{item.platform}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      {item.postType}
                    </span>
                    <h3 className="font-extrabold text-white text-base tracking-tight leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-line">
                    {item.caption}
                  </p>

                  {item.hashtags && item.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.hashtags.map((tag: string, tagIdx: number) => (
                        <span key={tagIdx} className="text-[10px] font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>ساعت: {item.bestTime}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCaption(`${item.title}\n\n${item.caption}\n\n${(item.hashtags || []).join(' ')}`, index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === index ? 'کپی شد' : 'کپی متن'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
