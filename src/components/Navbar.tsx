import React from 'react';
import { Search, Radio, HardDrive, ShieldCheck, Flame, Download } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'following' | 'foryou' | 'live';
  onTabChange: (tab: 'following' | 'foryou' | 'live') => void;
  onOpenSearch: () => void;
  onOpenVault: () => void;
  onOpenAuth: () => void;
  onOpenDownloadApk: () => void;
  onReplayLiveIntro?: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenVault,
  onOpenAuth,
  onOpenDownloadApk,
  onReplayLiveIntro,
  user,
}) => {
  const totalStorageGB = user
    ? ((user.cloudStorageMaxBytes + user.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1)
    : '5.0';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 md:h-16 px-4 md:px-8 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#08090D]/95 via-[#08090D]/75 to-transparent backdrop-blur-xs">
      {/* Zone 1: Single text element wordmark + glowing logo + user requested subtitle */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onReplayLiveIntro}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
          title="LikeTop: The future of the universe (Click to replay live logo intro)"
        >
          <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden ring-1 ring-[#D49B8B]/60 shadow-md shadow-[#D49B8B]/25 bg-[#12151E] group-hover:scale-105 transition-transform flex items-center justify-center p-0.5">
            <img
              src="/assets/aistudio/1792908458825_0b55711a.jpg"
              alt="LikeTop Logo"
              className="w-full h-full object-cover object-center rounded-lg"
            />
            {/* Live pulsing dot indicator */}
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F2C4B7] shadow-[0_0_6px_#D49B8B] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-white whitespace-nowrap leading-none">
              Like<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D0C5] via-[#D89F8F] to-[#B87262]">Top</span>
            </span>
            <span className="hidden sm:block text-[9px] font-semibold tracking-wider uppercase text-[#D49B8B]/90 drop-shadow-xs mt-0.5">
              The future of the universe
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links / Feed Mode Switcher */}
      <nav className="flex items-center gap-5 md:gap-8 text-sm md:text-base font-semibold">
        <button
          onClick={() => onTabChange('live')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'live' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          title="Watch Live Streams"
        >
          <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Live</span>
        </button>

        <button
          onClick={() => onTabChange('following')}
          className={`relative transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'following'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Following
          {activeTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D49B8B] rounded-full shadow-[0_0_8px_#D49B8B]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('foryou')}
          className={`relative transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'foryou'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          For You
          {activeTab === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#F5D0C5] via-[#D89F8F] to-[#B87262] rounded-full shadow-[0_0_8px_#D49B8B]" />
          )}
        </button>
      </nav>

      {/* Zone 3: 1 Primary contextual action zone */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenSearch}
          aria-label="Search"
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick APK Download Action */}
        <button
          onClick={onOpenDownloadApk}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D49B8B] via-[#E8B4A6] to-[#C27E6E] hover:opacity-90 text-[#0A0C10] border border-[#F5D0C5]/40 text-xs font-extrabold transition-all shadow-sm shadow-[#D49B8B]/30"
          title="Download LikeTop Android APK & App"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="whitespace-nowrap">Get APK</span>
        </button>

        {/* Cloud Vault Storage & Encryption Badge */}
        <button
          onClick={onOpenVault}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151E]/90 hover:bg-slate-800/80 border border-[#D49B8B]/30 text-xs font-medium text-slate-200 transition-colors shadow-xs"
          title="View Cloud Vault Storage and Cryptographic Security"
        >
          <HardDrive className="w-3.5 h-3.5 text-[#E8B4A6]" />
          <span className="tabular-nums font-mono text-[#F2C4B7] font-semibold">{totalStorageGB} GB</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
        </button>

        {user ? (
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#221719] border border-[#D49B8B]/35 text-xs font-semibold text-[#F2C4B7] hover:bg-[#2e1d20] transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">{user.streakDays}d Streak</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 text-xs font-extrabold text-[#0A0C10] bg-gradient-to-r from-[#D49B8B] via-[#E8B4A6] to-[#C27E6E] hover:opacity-90 rounded-lg shadow-sm shadow-[#D49B8B]/30 transition-all whitespace-nowrap"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};
