import React, { useState } from 'react';
import { Search, TrendingUp, Music2, Hash, Users, Sparkles, Play, Check } from 'lucide-react';
import { VideoPost } from '../types';

interface ExploreViewProps {
  isOpen: boolean;
  onClose: () => void;
  posts: VideoPost[];
  onSelectPost: (post: VideoPost) => void;
  onSelectTag: (tag: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
  onSelectTag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Trends' },
    { id: 'dance', label: 'Dance & Rhythm' },
    { id: 'tech', label: 'Tech & Gadgets' },
    { id: 'ai', label: 'AI & Generative' },
    { id: 'lifestyle', label: 'City & Lifestyle' },
  ];

  const trendingHashtags = [
    { tag: '#LikeTop', views: '2.4B views', desc: 'Official platform viral creators' },
    { tag: '#UltravioletGlow', views: '840M views', desc: 'AI visual filter trending challenge' },
    { tag: '#TokyoMidnight', views: '520M views', desc: 'Rainy neon night drives and vlogs' },
    { tag: '#BonusVaultStorage', views: '310M views', desc: 'Share hacks for +500MB cloud boost' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto no-scrollbar">
      <div className="relative w-full max-w-3xl h-[88vh] bg-[#0C0E15] border border-[#D49B8B]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Search Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, sounds, #hashtags, AI filters..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D49B8B]"
            />
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800/80 overflow-x-auto no-scrollbar bg-slate-950/40">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] font-bold shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          {/* Trending Hashtag Strip */}
          {!searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#D49B8B]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Trending Hashtags</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trendingHashtags.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => {
                      onSelectTag(item.tag);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#D49B8B]/40 text-left transition-all group flex items-start justify-between"
                  >
                    <div>
                      <span className="text-sm font-bold text-[#F2C4B7] group-hover:text-[#D49B8B] block">
                        {item.tag}
                      </span>
                      <span className="text-xs text-slate-400 line-clamp-1">{item.desc}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">{item.views}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Discovery Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {searchQuery ? `Search Results (${filteredPosts.length})` : 'Personalized Discovery For You'}
              </h3>
              <span className="text-xs text-[#D49B8B]">Curated by LikeTop Algorithm</span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No videos found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 group cursor-pointer text-left"
                  >
                    <img
                      src={post.posterUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-xs font-bold line-clamp-2 leading-tight drop-shadow-xs">
                        {post.caption}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#F2C4B7]">
                        <img
                          src={post.author.avatar}
                          alt={post.author.username}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate">@{post.author.username}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
