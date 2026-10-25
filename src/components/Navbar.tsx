import React from 'react';
import { Search, Radio, HardDrive, ShieldCheck, Flame } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'following' | 'foryou' | 'live';
  onTabChange: (tab: 'following' | 'foryou' | 'live') => void;
  onOpenSearch: () => void;
  onOpenVault: () => void;
  onOpenAuth: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenVault,
  onOpenAuth,
  user,
}) => {
  const totalStorageGB = user
    ? ((user.cloudStorageMaxBytes + user.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1)
    : '5.0';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 md:h-16 px-4 md:px-8 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#070a12]/95 via-[#070a12]/70 to-transparent backdrop-blur-xs">
      {/* Zone 1: Single text element wordmark + glowing logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/src/assets/images/liketop_app_logo_1792906339915.jpg"
            alt="LikeTop Logo"
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl object-cover ring-1 ring-purple-500/40 shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform"
          />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Like<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Top</span>
          </span>
        </a>
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
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-purple-500 rounded-full" />
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
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full" />
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

        {/* Cloud Vault Storage & Encryption Badge */}
        <button
          onClick={onOpenVault}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/30 text-xs font-medium text-slate-200 transition-colors shadow-xs"
          title="View Cloud Vault Storage and Cryptographic Security"
        >
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span className="tabular-nums font-mono text-purple-300 font-semibold">{totalStorageGB} GB</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
        </button>

        {user ? (
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">{user.streakDays}d Streak</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-600/30 transition-all whitespace-nowrap"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};
