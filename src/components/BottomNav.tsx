import React from 'react';
import { Home, Compass, Plus, HardDrive, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'explore' | 'inbox' | 'profile';
  onNavigate: (view: 'home' | 'explore' | 'inbox' | 'profile') => void;
  onOpenCreate: () => void;
  onOpenVault: () => void;
  storageBonusBadge?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  onOpenVault,
  storageBonusBadge,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 md:h-18 px-4 flex items-center justify-around bg-[#070a12]/95 backdrop-blur-md border-t border-purple-500/15 pointer-events-auto">
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          currentView === 'home' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-purple-400' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Home</span>
      </button>

      {/* Discover / Explore */}
      <button
        onClick={() => onNavigate('explore')}
        className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          currentView === 'explore' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className={`w-5 h-5 ${currentView === 'explore' ? 'text-purple-400' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Discover</span>
      </button>

      {/* Center Create (+) Button */}
      <button
        onClick={onOpenCreate}
        aria-label="Create AI short video"
        className="relative -top-2 w-12 h-11 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all ring-2 ring-white/20 cursor-pointer"
        title="Open Free AI Video & Photo Studio"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Cloud Vault & Storage Rewards */}
      <button
        onClick={onOpenVault}
        className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-slate-400 hover:text-purple-300 transition-colors cursor-pointer relative"
      >
        <div className="relative">
          <HardDrive className="w-5 h-5 text-purple-400" />
          {storageBonusBadge && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-fuchsia-500 text-[8px] font-extrabold text-white">
              {storageBonusBadge}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-1">Vault</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onNavigate('profile')}
        className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          currentView === 'profile' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <UserIcon className={`w-5 h-5 ${currentView === 'profile' ? 'text-purple-400' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Profile</span>
      </button>
    </nav>
  );
};
