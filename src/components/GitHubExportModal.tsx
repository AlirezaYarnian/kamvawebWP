import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  GitBranch, 
  FolderGit2, 
  Terminal, 
  FileCode2, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Store,
  FolderTree
} from 'lucide-react';
import { 
  generateFullWordPressGitHubZip, 
  generateThemeGitHubZip, 
  generateWordPressThemeZip, 
  generateKamvaCorePluginZip,
  triggerDownload 
} from '../utils/zipGenerator';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  siteName,
}) => {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customRepoUrl, setCustomRepoUrl] = useState('https://github.com/YOUR_USERNAME/kamvaweb-wordpress.git');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDownloadFullRepo = async () => {
    try {
      setDownloadingType('full');
      const blob = await generateFullWordPressGitHubZip(siteName);
      triggerDownload(blob, 'kamvaweb-full-wordpress-repo.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadThemeRepo = async () => {
    try {
      setDownloadingType('theme');
      const blob = await generateThemeGitHubZip(siteName);
      triggerDownload(blob, 'kamvaweb-theme-github-repo.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadInstallableZip = async () => {
    try {
      setDownloadingType('installable');
      const blob = await generateWordPressThemeZip(siteName);
      triggerDownload(blob, 'kamvaweb-wordpress-theme.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingType(null);
    }
  };

  const handleDownloadPluginZip = async () => {
    try {
      setDownloadingType('plugin');
      const blob = await generateKamvaCorePluginZip();
      triggerDownload(blob, 'kamva-core.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingType(null);
    }
  };

  const fullGitScript = `# ۱. اکسترکت فایل زیپ و ورود به پوشه مخزن
cd kamvaweb-wordpress-repo

# ۲. مقداردهی اولیه مخزن گیت
git init

# ۳. افزودن کلیه فایل‌ها به استیج
git add .

# ۴. ثبت کامیت نخست با پیام استاندارد
git commit -m "feat: initial commit of KamvaWeb Pro WordPress theme with Kamva Store & AI core"

# ۵. تنظیم نام شاخه اصلی به main
git branch -M main

# ۶. اتصال به مخزن گیت‌هاب شما
git remote add origin ${customRepoUrl}

# ۷. پوش نهایی به گیت‌هاب
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg">خروجی کامل پروژه برای گیت‌هاب (GitHub Repository)</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  آماده پوش فوری
                </span>
              </div>
              <p className="text-xs text-slate-400">
                پکیج کامل ساختار پروژه استاندارد وردپرس با قالب اختصاصی کامواوب، کانفیگ CI/CD، فایل .gitignore و راهنمای کامل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 4 Download Cards Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Full WordPress Repo */}
            <div className="bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-4 space-y-3 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    مخزن کامل
                  </span>
                  <FolderTree className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="font-bold text-white text-sm">مخزن کامل وردپرس</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  قالب + افزونه کاموا کُر + پایپ‌لاین CI/CD و ساختار کامل وردپرس آماده پوش به گیت‌هاب.
                </p>
              </div>

              <button
                onClick={handleDownloadFullRepo}
                disabled={downloadingType !== null}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'full' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>دانلود مخزن کامل</span>
              </button>
            </div>

            {/* Card 2: Standalone Theme Repo */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    مخزن پوسته
                  </span>
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-sm">مخزن فقط قالب</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  فقط کدهای قالب اختصاصی کامواوب در ریشه مخزن با README و تست خودکار CI/CD.
                </p>
              </div>

              <button
                onClick={handleDownloadThemeRepo}
                disabled={downloadingType !== null}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'theme' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>دانلود مخزن قالب</span>
              </button>
            </div>

            {/* Card 3: Standard Installable Theme ZIP */}
            <div className="bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    نصب پوسته
                  </span>
                  <Store className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-sm">زیپ نصبی قالب وردپرس</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  نصب مستقیم از «نمایش &gt; پوسته‌ها &gt; افزودن پوسته» در پیشخوان وردپرس.
                </p>
              </div>

              <button
                onClick={handleDownloadInstallableZip}
                disabled={downloadingType !== null}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'installable' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>دانلود زیپ قالب</span>
              </button>
            </div>

            {/* Card 4: Standard Installable Kamva Core Plugin ZIP */}
            <div className="bg-gradient-to-b from-purple-950/30 via-slate-950 to-slate-950 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-4 space-y-3 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    نصب افزونه
                  </span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="font-bold text-white text-sm">افزونه مستقل کاموا کُر</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  فایل kamva-core.zip شامل تمامی ۱۲ ماژول (AIOS، کش، بهینه‌ساز عکس، دیتابیس).
                </p>
              </div>

              <button
                onClick={handleDownloadPluginZip}
                disabled={downloadingType !== null}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'plugin' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>دانلود افزونه کاموا کُر</span>
              </button>
            </div>

          </div>

          {/* Terminal & Git Commands Guide */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">دستورات خط فرمان جهت پوش فوری به گیت‌هاب (Terminal Guide)</h4>
              </div>

              <button
                onClick={() => handleCopy(fullGitScript, 'all_git')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {copiedKey === 'all_git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'all_git' ? 'کپی شد!' : 'کپی همه دستورات گیت'}</span>
              </button>
            </div>

            {/* Custom Repo URL input */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">
                آدرس مخزن شما در گیت‌هاب (Remote Origin URL):
              </label>
              <input
                type="text"
                value={customRepoUrl}
                onChange={(e) => setCustomRepoUrl(e.target.value)}
                placeholder="https://github.com/USERNAME/REPOSITORY.git"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                dir="ltr"
              />
            </div>

            {/* Code Block with line-by-line copy */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto" dir="ltr">
              <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800/60">
                <span># Step-by-Step Push to GitHub</span>
                <span className="text-[10px]">bash</span>
              </div>
              <div className="text-emerald-400">git init</div>
              <div className="text-emerald-400">git add .</div>
              <div className="text-emerald-400">git commit -m "feat: initial commit of KamvaWeb Pro WordPress theme"</div>
              <div className="text-emerald-400">git branch -M main</div>
              <div className="text-cyan-300">git remote add origin {customRepoUrl}</div>
              <div className="text-emerald-400 font-bold">git push -u origin main</div>
            </div>
          </div>

          {/* Repository Tree Structure Inspection */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              محتویات و فایل‌های بسته‌بندی شده در مخزن (Repository Tree):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">.github/workflows/deploy.yml</span>
                <span className="text-slate-400 text-[10px]">پایپ‌لاین تست و دیپلوی خودکار</span>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">wp-content/themes/kamvaweb/</span>
                <span className="text-slate-400 text-[10px]">سورس‌کد کامل قالب اختصاصی</span>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">.gitignore</span>
                <span className="text-slate-400 text-[10px]">نادیده‌گیری کش، آپلودها و لاگ‌ها</span>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">README.md</span>
                <span className="text-slate-400 text-[10px]">مستندات کامل به زبان فارسی و انگلیسی</span>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">composer.json</span>
                <span className="text-slate-400 text-[10px]">تعریف نیازمندی‌های PHP 8.2+</span>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-mono text-[11px] block" dir="ltr">wp-config-sample.php</span>
                <span className="text-slate-400 text-[10px]">نمونه فایل دیتابیس بدون لو رفتن رمز</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>فایل‌ها آماده، تست شده و سازگار با استانداردهای گیت‌هاب هستند.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
};
