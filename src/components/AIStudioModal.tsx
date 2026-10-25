import React, { useState, useRef } from 'react';
import { X, Sparkles, Wand2, Upload, Video, Image, Sliders, Check, Music, Lock, Loader2, ArrowRight } from 'lucide-react';
import { AI_FILTERS } from '../data/mockFeed';
import { AIFilter, VideoPost, User } from '../types';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPublishPost: (post: VideoPost) => void;
  onOpenShareModalForUnlock: () => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  user,
  onPublishPost,
  onOpenShareModalForUnlock,
}) => {
  const [mediaType, setMediaType] = useState<'video' | 'picture'>('video');
  const [selectedFilter, setSelectedFilter] = useState<AIFilter>(AI_FILTERS[1]); // Ultraviolet default
  const [caption, setCaption] = useState('Creating viral magic on LikeTop ✨');
  const [topic, setTopic] = useState('Cyberpunk street style in neon purple');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState<{
    caption: string;
    hashtags: string[];
    suggestedFilter: string;
    musicMood: string;
    hookTip: string;
    viralityScore: number;
  } | null>(null);

  // Sample media preview choices
  const sampleMedia = [
    { name: 'Tokyo Neon', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-showing-her-balance-41619-large.mp4', poster: '/src/assets/images/feed_cover_tokyo_night_1792906343109.jpg' },
    { name: 'Future Dance', url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-a-futuristic-room-41913-large.mp4', poster: '/src/assets/images/avatar_dancer_female_1792906342657.jpg' },
    { name: 'Cyber City', url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-cyberpunk-city-at-night-41549-large.mp4', poster: '/src/assets/images/feed_cover_tokyo_night_1792906343109.jpg' },
    { name: 'Studio Tech', url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41584-large.mp4', poster: '/src/assets/images/avatar_tech_reviewer_1792906342873.jpg' },
  ];

  const [currentMedia, setCurrentMedia] = useState(sampleMedia[0]);
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Check if filter is unlocked
  const isFilterUnlocked = (filter: AIFilter) => {
    if (!filter.isPremium) return true;
    return user ? user.unlockedFilters.includes(filter.id) : false;
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/enhance-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mediaType,
          style: selectedFilter.name,
          audience: 'LikeTop Discover & For You Feed',
        }),
      });
      const data = await res.json();
      setAiResult(data);
      if (data.caption) {
        setCaption(data.caption);
      }
    } catch {
      // Local smart fallback
      setAiResult({
        caption: `✨ Dropping my newest ${mediaType} on LikeTop! Loving the ${selectedFilter.name} aesthetic 💜`,
        hashtags: ['#LikeTop', '#CreativeHub', '#ForYouPage', '#ViralReels', '#Trending'],
        suggestedFilter: selectedFilter.name,
        musicMood: 'Phonk Synthwave / 140 BPM',
        hookTip: 'Use a dynamic snap zoom in the first 0.8 seconds to boost retention by 3.2x',
        viralityScore: 94,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
    }
  };

  const handlePublish = () => {
    const newPost: VideoPost = {
      id: `post_user_${Date.now()}`,
      author: {
        id: user?.id || 'usr_guest',
        username: user?.username || 'you',
        displayName: user?.displayName || 'Creator',
        avatar: user?.avatar || '/src/assets/images/avatar_cyber_creator_1792906341940.jpg',
        isVerified: user?.isVerified ?? true,
      },
      videoUrl: customFileUrl || currentMedia.url,
      posterUrl: currentMedia.poster,
      caption: caption,
      tags: aiResult?.hashtags || ['#LikeTop', '#AICreator', '#FYP'],
      music: {
        title: aiResult?.musicMood || 'LikeTop AI Original Audio',
        artist: user?.displayName || 'Creator Original',
      },
      category: 'lifestyle',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isLiked: true,
      isBookmarked: false,
      isFollowing: true,
      aiFilterApplied: selectedFilter.name,
      createdAt: 'Just now',
    };

    onPublishPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto no-scrollbar">
      <div className="relative w-full max-w-4xl bg-[#090e1c] border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Studio Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-xs">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Free AI Creative Studio</span>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded-full">
                  100% Free
                </span>
              </h2>
              <p className="text-xs text-slate-400">Enhance videos & pictures with AI filters, viral captions & soundtracks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Main Workspace (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto no-scrollbar">
          {/* Left: Video / Picture Live Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 shadow-xl group">
              {customFileUrl ? (
                <video
                  src={customFileUrl}
                  poster={currentMedia.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setCustomFileUrl(null)}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: selectedFilter.cssFilter }}
                />
              ) : (
                <img
                  src={currentMedia.poster}
                  alt="AI studio preview"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: selectedFilter.cssFilter }}
                />
              )}

              {/* Watermark Ribbon */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{selectedFilter.name}</span>
              </div>

              {/* Upload Overlay Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-[11px] font-semibold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload Media</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick Media Presets */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1 no-scrollbar">
              {sampleMedia.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    setCustomFileUrl(null);
                    setCurrentMedia(m);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all shrink-0 ${
                    currentMedia.name === m.name && !customFileUrl
                      ? 'bg-purple-900/60 border-purple-500 text-purple-200 shadow-xs'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: AI Controls, Filters & Viral Optimizer */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            {/* Media Type Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setMediaType('video')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mediaType === 'video' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Clip</span>
              </button>
              <button
                onClick={() => setMediaType('picture')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mediaType === 'picture' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>Photo Post</span>
              </button>
            </div>

            {/* AI Filters Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">AI Visual Filters</span>
                <span className="text-[11px] text-purple-400">Share posts to unlock Premium 4D FX</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {AI_FILTERS.map((filter) => {
                  const unlocked = isFilterUnlocked(filter);
                  const isSelected = selectedFilter.id === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => {
                        if (unlocked) {
                          setSelectedFilter(filter);
                        } else {
                          onOpenShareModalForUnlock();
                        }
                      }}
                      className={`relative p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                        isSelected
                          ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: filter.previewColor }}
                        />
                        {!unlocked && (
                          <Lock className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                        )}
                        {isSelected && <Check className="w-3 h-3 text-purple-300" />}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 line-clamp-1">{filter.name}</span>
                      <span className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                        {filter.isPremium ? (unlocked ? 'Unlocked' : 'Share to unlock') : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Caption & Viral Hook Generator */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">AI Viral Strategist & Hook Generator</span>
                </div>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  {isGeneratingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>{isGeneratingAI ? 'Thinking...' : 'Generate with AI'}</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Video Topic / Theme</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Cyberpunk fashion haul, Tokyo midnight drive..."
                  className="w-full h-8 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Post Caption & Viral Hashtags</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-purple-500 resize-none"
                />
              </div>

              {/* AI Insights Card if generated */}
              {aiResult && (
                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-purple-300 font-semibold">
                    <span>Algorithm Virality Score: {aiResult.viralityScore}/100</span>
                    <span className="text-emerald-400 font-mono">Top 5% Discovery</span>
                  </div>
                  <p className="text-slate-300">💡 <span className="font-semibold text-white">Hook Tip:</span> {aiResult.hookTip}</p>
                  <p className="text-purple-200">🎵 <span className="font-semibold text-white">Music Match:</span> {aiResult.musicMood}</p>
                </div>
              )}
            </div>

            {/* Publish Action Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-98 transition-all"
              >
                <span>Publish to LikeTop Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
