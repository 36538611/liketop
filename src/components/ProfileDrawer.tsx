import React, { useState } from 'react';
import { X, CheckCircle2, Flame, TrendingUp, HardDrive, ShieldCheck, Video, Heart, Bookmark, Wand2, Sparkles } from 'lucide-react';
import { User, VideoPost } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  myVideos: VideoPost[];
  likedVideos: VideoPost[];
  onOpenVault: () => void;
  onOpenAIStudio: () => void;
  onSelectVideo: (post: VideoPost) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  myVideos,
  likedVideos,
  onOpenVault,
  onOpenAIStudio,
  onSelectVideo,
}) => {
  const [profileTab, setProfileTab] = useState<'videos' | 'likes' | 'bookmarks'>('videos');

  if (!isOpen) return null;

  const totalStorageGB = user
    ? ((user.cloudStorageMaxBytes + user.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1)
    : '5.0';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/70 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full md:max-w-xl h-[85vh] md:h-[720px] bg-[#0C0E15] border-t md:border border-[#D49B8B]/30 md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Creator Profile</span>
            <span className="text-xs text-[#D49B8B] font-mono">@{user?.username || 'creator'}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* User Bio & Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#D49B8B] via-[#F2C4B7] to-[#C27E6E] ring-2 ring-[#D49B8B]/50 shadow-lg">
                <img
                  src={user?.avatar || '/src/assets/images/avatar_cyber_creator_1792906341940.jpg'}
                  alt={user?.displayName || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {user?.isVerified && (
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] flex items-center justify-center ring-2 ring-[#0C0E15]">
                  <CheckCircle2 className="w-4 h-4 text-[#0A0C10]" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
              <span>{user?.displayName || 'Alex Rivers'}</span>
            </h3>
            <span className="text-xs text-slate-400">@{user?.username || 'liketop_creator'}</span>

            <p className="text-xs text-slate-300 max-w-sm mt-2 leading-relaxed">
              {user?.bio || 'Visual creator on LikeTop ⚡ The future of the universe'}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-6 mt-4 text-center">
              <div>
                <span className="text-base font-extrabold text-white tabular-nums block">
                  {user?.followersCount || 1420}
                </span>
                <span className="text-[11px] text-slate-400">Followers</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-base font-extrabold text-white tabular-nums block">
                  {user?.followingCount || 382}
                </span>
                <span className="text-[11px] text-slate-400">Following</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-base font-extrabold text-white tabular-nums block">
                  {user?.totalLikes ? `${(user.totalLikes / 1000).toFixed(1)}K` : '29.4K'}
                </span>
                <span className="text-[11px] text-slate-400">Likes</span>
              </div>
            </div>
          </div>

          {/* Consistent Engagement & Follower Boost Engine Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D49B8B]/15 via-slate-900 to-[#C27E6E]/15 border border-[#D49B8B]/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-white">Daily Streak: {user?.streakDays || 4} Days Active</span>
              </div>
              <span className="text-xs font-bold text-[#F2C4B7] font-mono">
                {user?.algorithmMultiplier || 1.5}x Viral Multiplier
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              🔥 <span className="font-semibold text-white">Consistent Engagement Boost Active:</span> Your daily likes, comments, and shares automatically push your content to more For You feeds, driving <span className="text-[#F2C4B7] font-semibold">+38 organic new followers</span> this week!
            </p>

            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 pt-1 border-t border-[#D49B8B]/20">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Next Follower Boost at 5-day streak</span>
              </span>
              <button
                onClick={onOpenAIStudio}
                className="text-[#D49B8B] hover:text-[#F2C4B7] flex items-center gap-1 font-semibold"
              >
                <span>Create Post</span>
                <Wand2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVault}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#D49B8B]/30 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#D49B8B]" />
              <span>Vault ({totalStorageGB} GB)</span>
            </button>
            <button
              onClick={onOpenAIStudio}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D49B8B] via-[#E8B4A6] to-[#C27E6E] hover:brightness-110 text-[#0A0C10] text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#D49B8B]/25 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Free AI Studio</span>
            </button>
          </div>

          {/* Tab Navigation for user's content */}
          <div className="flex items-center border-b border-slate-800">
            <button
              onClick={() => setProfileTab('videos')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                profileTab === 'videos'
                  ? 'border-[#D49B8B] text-[#F2C4B7]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos ({myVideos.length})</span>
            </button>
            <button
              onClick={() => setProfileTab('likes')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                profileTab === 'likes'
                  ? 'border-[#D49B8B] text-[#F2C4B7]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Liked ({likedVideos.length})</span>
            </button>
            <button
              onClick={() => setProfileTab('bookmarks')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                profileTab === 'bookmarks'
                  ? 'border-[#D49B8B] text-[#F2C4B7]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favorites</span>
            </button>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-3 gap-2">
            {(profileTab === 'videos' ? myVideos : likedVideos).map((post) => (
              <button
                key={post.id}
                onClick={() => {
                  onSelectVideo(post);
                  onClose();
                }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 group cursor-pointer"
              >
                <img
                  src={post.posterUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{post.likesCount > 1000 ? `${(post.likesCount / 1000).toFixed(0)}k` : post.likesCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
