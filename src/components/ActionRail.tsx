import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Wand2, Plus, Check } from 'lucide-react';
import { VideoPost } from '../types';

interface ActionRailProps {
  post: VideoPost;
  onLike: (e: React.MouseEvent) => void;
  onComment: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onAIRemix: () => void;
  onFollow: () => void;
}

export const ActionRail: React.FC<ActionRailProps> = ({
  post,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onAIRemix,
  onFollow,
}) => {
  // Format numbers cleanly
  const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <aside className="absolute right-2 md:right-4 bottom-20 md:bottom-24 z-30 flex flex-col items-center gap-4.5 text-white select-none pointer-events-auto">
      {/* Creator Avatar with Follow Button */}
      <div className="relative mb-1">
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 to-fuchsia-400 ring-2 ring-purple-500/50 shadow-md">
          <img
            src={post.author.avatar}
            alt={post.author.displayName}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <button
          onClick={onFollow}
          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-md ${
            post.isFollowing
              ? 'bg-slate-800 text-slate-300 ring-1 ring-slate-600'
              : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-90 ring-1 ring-white/50'
          }`}
          title={post.isFollowing ? 'Following' : 'Follow Creator'}
        >
          {post.isFollowing ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
      </div>

      {/* Like Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onLike}
          aria-label="Like video"
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 active:scale-85 transition-all flex items-center justify-center text-white border border-white/10"
        >
          <Heart
            className={`w-6 h-6 md:w-6.5 md:h-6.5 transition-transform ${
              post.isLiked
                ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                : 'text-white hover:text-rose-400'
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-slate-200 mt-1 tabular-nums drop-shadow-xs">
          {formatCount(post.likesCount)}
        </span>
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onComment}
          aria-label="Open comments"
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 active:scale-90 transition-all flex items-center justify-center text-white border border-white/10"
        >
          <MessageCircle className="w-6 h-6 md:w-6.5 md:h-6.5 text-white hover:text-purple-300" />
        </button>
        <span className="text-xs font-semibold text-slate-200 mt-1 tabular-nums drop-shadow-xs">
          {formatCount(post.commentsCount)}
        </span>
      </div>

      {/* Bookmark Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onBookmark}
          aria-label="Save to favorites"
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 active:scale-90 transition-all flex items-center justify-center text-white border border-white/10"
        >
          <Bookmark
            className={`w-5.5 h-5.5 md:w-6 md:h-6 transition-colors ${
              post.isBookmarked
                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                : 'text-white hover:text-amber-300'
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-slate-200 mt-1 tabular-nums drop-shadow-xs">
          {formatCount(post.bookmarksCount)}
        </span>
      </div>

      {/* Share Button (triggers Bonus Cloud Storage!) */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={onShare}
          aria-label="Share video"
          className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-purple-900/70 to-indigo-900/70 backdrop-blur-md hover:from-purple-800/80 hover:to-indigo-800/80 active:scale-90 transition-all flex items-center justify-center text-white border border-purple-500/40 shadow-md shadow-purple-900/30"
          title="Share to earn +500MB bonus cloud storage"
        >
          <Share2 className="w-5.5 h-5.5 text-purple-200" />
        </button>
        <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 mt-0.5 whitespace-nowrap">
          +500MB
        </span>
        <span className="text-xs font-semibold text-slate-300 tabular-nums">
          {formatCount(post.sharesCount)}
        </span>
      </div>

      {/* Free AI Remix Button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onAIRemix}
          aria-label="Free AI Video Remix"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-900/70 backdrop-blur-md hover:bg-purple-950/70 active:scale-90 transition-all flex items-center justify-center border border-purple-500/40 shadow-xs"
          title="Open in Free AI Studio"
        >
          <Wand2 className="w-5 h-5 text-purple-400 hover:rotate-12 transition-transform" />
        </button>
        <span className="text-[10px] font-medium text-purple-300 mt-0.5">AI Remix</span>
      </div>

      {/* Spinning Vinyl Record Disc */}
      <div className="mt-1 animate-spin-slow">
        <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-700/80 p-1 flex items-center justify-center shadow-lg">
          <img
            src={post.posterUrl}
            alt="Audio cover"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
};
