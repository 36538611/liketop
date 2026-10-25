import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

interface ApkPromptBannerProps {
  onOpenDownloadModal: () => void;
}

export const ApkPromptBanner: React.FC<ApkPromptBannerProps> = ({ onOpenDownloadModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after a short delay (e.g., 2.5 seconds) if not previously dismissed
    const dismissed = sessionStorage.getItem('liketop_apk_banner_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('liketop_apk_banner_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <aside
      aria-label="Mobile app download"
      className="fixed bottom-20 md:bottom-6 left-3 md:left-6 z-40 max-w-[340px] md:max-w-sm p-3 rounded-2xl bg-[#0D0F16]/95 border border-[#D49B8B]/40 shadow-2xl shadow-[#D49B8B]/20 backdrop-blur-md animate-fade-in flex items-center gap-3 transition-all cursor-pointer hover:border-[#D49B8B] group"
      onClick={onOpenDownloadModal}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-[#D49B8B]/50 shadow-md bg-[#12151E] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
          <img
            src="/assets/aistudio/1792908458825_0b55711a.jpg"
            alt="LikeTop APK"
            className="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#090e1c] flex items-center justify-center">
          <Download className="w-2 h-2 text-slate-950 stroke-[3]" />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-white truncate">Get LikeTop APK</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#221719] border border-[#D49B8B]/30 text-[#F2C4B7] font-mono">v2.4</span>
        </div>
        <p className="text-[11px] text-slate-300 truncate mt-0.5">
          Faster video & offline ready · Tap to download
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDownloadModal();
          }}
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D49B8B] via-[#E8B4A6] to-[#C27E6E] hover:opacity-90 text-[#0A0C10] text-[11px] font-extrabold shadow-xs whitespace-nowrap active:scale-95 transition-all"
        >
          Download
        </button>
        <button
          onClick={handleDismiss}
          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
