import React, { useState, useEffect } from 'react';
import { X, Copy, Check, HardDrive, Sparkles, Share2, Send, Flame } from 'lucide-react';
import { VideoPost, User } from '../types';

interface ShareRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: VideoPost;
  user: User | null;
  onRewardClaimed: (bonusBytes: number, unlockedFilterName?: string) => void;
}

export const ShareRewardModal: React.FC<ShareRewardModalProps> = ({
  isOpen,
  onClose,
  post,
  user,
  onRewardClaimed,
}) => {
  const [copied, setCopied] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [unlockedFilter, setUnlockedFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setRewardGranted(false);
      setUnlockedFilter(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBonusMB = user ? Math.round(user.cloudStorageBonusBytes / (1024 * 1024)) : 0;
  const currentTotalGB = user
    ? ((user.cloudStorageMaxBytes + user.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1)
    : '5.0';

  const triggerReward = (channel: string) => {
    const bonusBytes = 500 * 1024 * 1024; // +500 MB
    let newFilterName: string | undefined;

    // Check if user unlocks a premium filter
    if (user && !user.unlockedFilters.includes('filter_prism4d')) {
      newFilterName = 'Prism 4D Hologram';
    } else if (user && !user.unlockedFilters.includes('filter_neonmatrix')) {
      newFilterName = 'Neon Matrix Velocity';
    } else if (user && !user.unlockedFilters.includes('filter_hyper60')) {
      newFilterName = 'Hyper-Vivid 60FPS AI';
    }

    setRewardGranted(true);
    if (newFilterName) {
      setUnlockedFilter(newFilterName);
    }

    onRewardClaimed(bonusBytes, newFilterName);
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/#post-${post.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      triggerReward('copy_link');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      triggerReward('copy_link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LikeTop: Watch @${post.author.username}`,
          text: post.caption,
          url: window.location.href,
        });
        triggerReward('native_share');
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const shareChannels = [
    { name: 'Copy Link', icon: copied ? Check : Copy, action: handleCopyLink, color: 'bg-purple-900/40 text-purple-300' },
    { name: 'WhatsApp', icon: Send, action: () => { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.caption + ' ' + window.location.href)}`, '_blank'); triggerReward('whatsapp'); }, color: 'bg-emerald-950/60 text-emerald-300' },
    { name: 'X / Twitter', icon: Share2, action: () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.caption)}&url=${encodeURIComponent(window.location.href)}`, '_blank'); triggerReward('twitter'); }, color: 'bg-sky-950/60 text-sky-300' },
    { name: 'Direct Message', icon: Send, action: () => triggerReward('dm'), color: 'bg-indigo-950/60 text-indigo-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/70 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full md:max-w-md bg-[#0a0f1d] border-t md:border border-purple-500/30 md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden z-10 p-5">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3 md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Share & Earn Cloud Storage</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reward Status Banner */}
        <div className="my-4 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 border border-purple-500/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-bold text-white">Cloud Vault Total: {currentTotalGB} GB</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-300 tabular-nums">+{currentBonusMB} MB Earned</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Every share gives you <span className="text-purple-300 font-bold">+500 MB permanent cloud storage</span> and advances you toward unlocking exclusive <span className="text-fuchsia-300 font-bold">Premium AI Filters</span>!
          </p>
        </div>

        {/* Instant Reward Alert if just shared */}
        {rewardGranted && (
          <div className="mb-4 p-3 rounded-xl bg-purple-900/40 border border-purple-400/50 flex items-center gap-3 animate-bounce">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">+500 MB Bonus Cloud Storage Unlocked!</p>
              {unlockedFilter ? (
                <p className="text-[11px] text-fuchsia-300 font-semibold">🎉 New Filter: {unlockedFilter} unlocked!</p>
              ) : (
                <p className="text-[11px] text-purple-200">Vault upgraded & algorithm visibility increased 🔥</p>
              )}
            </div>
          </div>
        )}

        {/* Share Options Grid */}
        <div className="grid grid-cols-4 gap-3 py-2">
          {shareChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <button
                key={channel.name}
                onClick={channel.action}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 active:scale-95 transition-all shadow-md ${channel.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
                  {channel.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Native Web Share button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={handleNativeShare}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 active:scale-98 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>More Share Options (+500MB)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
