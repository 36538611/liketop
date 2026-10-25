import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../services/soundtrack';

interface LiveSplashIntroProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const LiveSplashIntro: React.FC<LiveSplashIntroProps> = ({ isOpen, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    setIsFadingOut(false);

    // Play celestial live chime
    if (audioEnabled) {
      soundEngine.playIntroChime();
    }

    // Progress timer over ~2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleFinish();
          return 100;
        }
        return prev + 2.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090D] overflow-hidden select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Brushed Titanium & Rose Gold Radial Backdrops */}
      <div className="absolute inset-0 bg-radial from-[#D49B8B]/15 via-[#0C0E15]/90 to-[#08090D] pointer-events-none" />

      {/* Shimmering Animated Star Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-1.5 h-1.5 rounded-full bg-[#F2C4B7] animate-ping opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#D49B8B] animate-pulse opacity-70" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[#E8B4A6] animate-ping delay-300 opacity-50" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#C27E6E] animate-pulse delay-700 opacity-60" />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 rounded-full bg-white animate-ping delay-500 opacity-40" />
      </div>

      {/* Live Emblem & Logo Presentation */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Pulsing Aura Rings behind Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Animated Ambient Ring 1 */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#D49B8B]/30 via-[#F2C4B7]/20 to-[#C27E6E]/30 blur-xl animate-pulse" />
          
          {/* Animated Ambient Ring 2 */}
          <div className="absolute -inset-1 rounded-3xl border border-[#D49B8B]/40 animate-ping opacity-30 duration-1000" />

          {/* Uploaded 3D Metallic Rose Gold Logo Frame */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden ring-2 ring-[#D49B8B]/80 shadow-[0_0_40px_rgba(212,155,139,0.35)] bg-[#12151E] p-1 group transform hover:scale-105 transition-transform duration-500">
            <img
              src="/assets/aistudio/1792908458825_0b55711a.jpg"
              alt="LikeTop Live Logo"
              className="w-full h-full object-cover object-center rounded-2xl"
            />
            {/* Live reflective light sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Live Badge indicator */}
          <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0C10] animate-ping" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
          Like<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C4B7] via-[#D49B8B] to-[#C27E6E]">Top</span>
        </h1>

        {/* Requested Small Words Below Logo */}
        <div className="relative py-1 px-4 my-1">
          <p className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F2C4B7] via-[#D49B8B] to-[#C27E6E] drop-shadow-[0_2px_10px_rgba(212,155,139,0.4)] animate-pulse">
            The future of the universe
          </p>
        </div>

        {/* Sub-tag: High-level security & features */}
        <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151E]/90 border border-[#D49B8B]/30 text-[11px] text-[#F2C4B7]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AES-256 Cloud Vault · Free AI Studio · Viral Rewards</span>
        </div>

        {/* Live Loading Progress Bar */}
        <div className="w-64 mt-8 space-y-2">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-[#D49B8B]/25 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#D49B8B] via-[#F2C4B7] to-[#C27E6E] rounded-full transition-all duration-75 shadow-[0_0_12px_#D49B8B]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Synchronizing feed...</span>
            <span className="text-[#F2C4B7]">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Interactive Enter / Skip Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D49B8B] via-[#E8B4A6] to-[#C27E6E] hover:brightness-110 text-[#0A0C10] font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#D49B8B]/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Enter LikeTop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={audioEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-[#D49B8B]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Footer System Indicator */}
      <div className="absolute bottom-6 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
        LikeTop Universe Engine · v2.4 Live
      </div>
    </div>
  );
};
