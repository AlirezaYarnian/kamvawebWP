import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  BrainCircuit, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

export const GlobalAiBehaviorSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    tone: 'professional_sales',
    temperature: 0.7,
    maxTokens: 2048,
    modelName: 'gemini-2.5-flash',
    knowledgeScope: {
      includeProductsKb: true,
      includePoliciesKb: true,
      includeSeoGuidelines: true,
      includeSecurityDatasets: true,
      includeSalesPsychology: true,
    },
    customSystemInstructions: 'شما دستیار هوش مصنوعی فوق‌العاده حرفه‌ای در قالب وردپرس کامواوب هستید.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isBatchTuning, setIsBatchTuning] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [batchTunedInfo, setBatchTunedInfo] = useState<any>(null);

  const handleBatchTuneAll = async () => {
    setIsBatchTuning(true);
    try {
      const res = await fetch('/api/ai/batch-tune', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setBatchTunedInfo(data.settings.tuningSummary);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (e) {
      console.error('Failed to batch tune AI', e);
    } finally {
      setIsBatchTuning(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/ai/behavior-settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error('Failed to load AI settings', e);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/ai/behavior-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save AI behavior settings', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                تنظیمات سراسری هوش مصنوعی
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold">
                GlobalAiBehaviorSettings
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              مدیریت لحن، دما و دامنه دانش تزریقی تمامی ماژول‌های AI
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              تنظیمات متمرکز رفتار مدل زبانی، مدل پایه، درجه خلاقیت (Temperature) و حوزه‌های پایگاه دانش برای مارکتینگ، سئو و ابزارهای فروش.
            </p>
          </div>

          <button
            onClick={handleBatchTuneAll}
            disabled={isBatchTuning}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {isBatchTuning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-300" />}
            کالیبراسیون همه‌جانبه ۱۲ سرویس AI
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>تنظیمات رفتاری هوش مصنوعی با موفقیت ذخیره و در سرتاسر قالب اعمال شد.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <span>پارامترهای اصلی مدل زبانی (LLM Parameters)</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">انتخاب مدل زبانی پایه (Model):</label>
            <select
              value={settings.modelName}
              onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (بهینه‌شده برای سرعت و دقت بالا)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (پیشرفته برای تحلیل‌های پیچیده و سئو)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">لحن پیش‌فرض هوش مصنوعی (Tone of Voice):</label>
            <select
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="professional_sales">حرفه‌ای و فروشگاهی (Professional & Sales)</option>
              <option value="friendly_conversational">صمیمی و دوستانه (Friendly & Conversational)</option>
              <option value="aggressive_cro">فروش تهاجمی و محرک تبدیل (Aggressive CRO)</option>
              <option value="technical_academic">فنی، دقیق و آکادمیک (Technical & Academic)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">درجه خلاقیت و تصادف (Temperature):</label>
              <span className="font-mono text-xs text-purple-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-purple-600 bg-slate-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>۰.۰ (دقیق و منطقی)</span>
              <span>۰.۷ (متعادل و خلاق)</span>
              <span>۱.۰ (بسیار خلاقانه)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">حداکثر توکن خروجی (Max Output Tokens):</label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {/* Knowledge Injection Scope & System Prompt */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>دامنه تزریق پایگاه دانش (Knowledge Scope)</span>
            </h3>

            <div className="space-y-2.5 pt-1">
              {[
                { id: 'includeProductsKb', label: 'تزریق اطلاعات محصولات و مشخصات فنی (Products KB)' },
                { id: 'includePoliciesKb', label: 'تزریق قوانین ارسال، گارانتی و عودت وجه (Policies)' },
                { id: 'includeSeoGuidelines', label: 'تزریق استانداردها و دیتاست‌های سئو تکنیکال (SEO Dataset)' },
                { id: 'includeSecurityDatasets', label: 'تزریق پروتکل‌های امنیتی WAF و فایروال (Security Dataset)' },
                { id: 'includeSalesPsychology', label: 'تزریق اصول روانشناسی فروش چالدینی و CRO' },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={(settings.knowledgeScope as any)[item.id]}
                    onChange={(e) => setSettings({
                      ...settings,
                      knowledgeScope: { ...settings.knowledgeScope, [item.id]: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor={item.id} className="text-xs text-slate-300 cursor-pointer font-medium">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">دستورالعمل سیستمی سفارشی (Custom System Prompt):</label>
              <textarea
                value={settings.customSystemInstructions}
                onChange={(e) => setSettings({ ...settings, customSystemInstructions: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات رفتاری هوش مصنوعی'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
