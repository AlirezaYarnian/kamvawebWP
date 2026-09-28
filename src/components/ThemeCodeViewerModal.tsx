import React, { useState } from 'react';
import { themeCodeFiles, ThemeFile } from '../data/themeFiles';
import { kamvaCorePluginFiles, PluginCodeFile } from '../data/kamvaCorePluginFiles';
import { generateKamvaCorePluginZip, triggerDownload } from '../utils/zipGenerator';
import { 
  X, 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  FolderTree, 
  Layers,
  Store
} from 'lucide-react';

interface ThemeCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const ThemeCodeViewerModal: React.FC<ThemeCodeViewerModalProps> = ({
  isOpen,
  onClose,
  onDownloadZip,
  isDownloading,
}) => {
  const [activePackage, setActivePackage] = useState<'theme' | 'plugin'>('theme');
  const [selectedThemeFile, setSelectedThemeFile] = useState<ThemeFile>(themeCodeFiles[0]);
  const [selectedPluginFile, setSelectedPluginFile] = useState<PluginCodeFile>(kamvaCorePluginFiles[0]);
  const [isDownloadingPlugin, setIsDownloadingPlugin] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = activePackage === 'theme' ? selectedThemeFile : selectedPluginFile;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPluginZip = async () => {
    try {
      setIsDownloadingPlugin(true);
      const blob = await generateKamvaCorePluginZip();
      triggerDownload(blob, 'kamva-core.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloadingPlugin(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">سورس‌کد کامل پروژه کامواوب (PHP / CSS / JS)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  آماده پروداکشن
                </span>
              </div>
              <p className="text-xs text-slate-400">
                بررسی ساختار دقیق فایل‌های قالب اختصاصی و افزونه مستقل نصبی کاموا کُر (kamva-core)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Kamva-Core Plugin ZIP */}
            <button
              onClick={handleDownloadPluginZip}
              disabled={isDownloadingPlugin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-900/30 cursor-pointer disabled:opacity-50"
              title="دانلود افزونه نصبی مجزا شامل تمامی ۱۱ ماژول"
            >
              <Layers className="w-4 h-4" />
              <span>{isDownloadingPlugin ? 'در حال ایجاد...' : 'دانلود افزونه kamva-core.zip'}</span>
            </button>

            {/* Download Theme ZIP */}
            <button
              onClick={onDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-900/40 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'در حال ایجاد...' : 'دانلود زیپ قالب'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Package Switcher Bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 ml-2">مجموعه فایل‌ها:</span>
          <button
            onClick={() => setActivePackage('theme')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePackage === 'theme'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>پوسته اختصاصی کامواوب ({themeCodeFiles.length} فایل)</span>
          </button>

          <button
            onClick={() => setActivePackage('plugin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePackage === 'plugin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>افزونه نصبی kamva-core ({kamvaCorePluginFiles.length} فایل ماژولار)</span>
          </button>
        </div>

        {/* Modal Body: File Tree (Right) + Code Inspector (Left) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* File Explorer Sidebar */}
          <div className="w-72 border-l border-slate-800 bg-slate-950/60 p-3 space-y-1 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
              {activePackage === 'theme' ? 'فایل‌های ساختار قالب:' : 'فایل‌های ماژولار افزونه:'}
            </span>

            {activePackage === 'theme'
              ? themeCodeFiles.map((file) => {
                  const isSelected = selectedThemeFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedThemeFile(file)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <FileCode2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                      <span className="truncate" dir="ltr">{file.path}</span>
                    </button>
                  );
                })
              : kamvaCorePluginFiles.map((file) => {
                  const isSelected = selectedPluginFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedPluginFile(file)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <FileCode2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                      <span className="truncate" dir="ltr">{file.path}</span>
                    </button>
                  );
                })}
          </div>

          {/* Code Viewer Main Area */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            
            {/* File Info Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 font-bold" dir="ltr">
                  {currentFile.path}
                </span>
                <span className="text-xs text-slate-400">
                  — {currentFile.description}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی کد</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed text-slate-200 select-all selection:bg-indigo-600 selection:text-white">
              <pre className="whitespace-pre" dir="ltr">
                <code>{currentFile.content}</code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
