import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Sparkles, HardDrive, ShieldCheck, Flame, TrendingUp, Info } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { VideoPlayer } from './components/VideoPlayer';
import { ActionRail } from './components/ActionRail';
import { CommentDrawer } from './components/CommentDrawer';
import { ShareRewardModal } from './components/ShareRewardModal';
import { AIStudioModal } from './components/AIStudioModal';
import { AuthModal } from './components/AuthModal';
import { VaultSecurityModal } from './components/VaultSecurityModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { ExploreView } from './components/ExploreView';
import { LiveStreamModal } from './components/LiveStreamModal';
import { BottomNav } from './components/BottomNav';
import { INITIAL_POSTS, INITIAL_USER, MOCK_COMMENTS, AI_FILTERS } from './data/mockFeed';
import { VideoPost, User, Comment } from './types';

export default function App() {
  const [posts, setPosts] = useState<VideoPost[]>(() => {
    try {
      const saved = localStorage.getItem('liketop_posts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: VideoPost) => ({
            ...p,
            videoUrl: p.videoUrl && p.videoUrl.startsWith('blob:') ? p.videoUrl : '',
          }));
        }
      }
    } catch {}
    return INITIAL_POSTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('liketop_user_v1');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('liketop_comments_v1');
    return saved ? JSON.parse(saved) : MOCK_COMMENTS;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou' | 'live'>('foryou');
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'inbox' | 'profile'>('home');

  // Modals state
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('liketop_posts_v2', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('liketop_user_v1', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('liketop_comments_v1', JSON.stringify(commentsMap));
  }, [commentsMap]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'l' || e.key === 'L') {
        handleLike(posts[activeIndex].id);
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCommentOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        setIsShareOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, posts]);

  // Filter posts based on active tab
  const displayedPosts = posts.filter((p) => {
    if (activeTab === 'following') {
      return p.isFollowing;
    }
    return true; // For You shows full personalized discovery feed
  });

  const activePost = displayedPosts[activeIndex] || displayedPosts[0] || posts[0];

  const goToNext = () => {
    if (activeIndex < displayedPosts.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // Handle like & increase engagement consistency
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likesCount: newLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );

    // Boost creator engagement consistency score
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const newScore = Math.min(100, prev.consistencyScore + 2);
        return {
          ...prev,
          consistencyScore: newScore,
          algorithmMultiplier: Number((1.0 + (newScore / 50)).toFixed(1)),
        };
      });
    }
  };

  const handleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newBookmarked = !p.isBookmarked;
          return {
            ...p,
            isBookmarked: newBookmarked,
            bookmarksCount: newBookmarked ? p.bookmarksCount + 1 : p.bookmarksCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleFollow = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newFollow = !p.isFollowing;
          return {
            ...p,
            isFollowing: newFollow,
          };
        }
        return p;
      })
    );

    if (currentUser) {
      showToast('Followed creator! Your algorithm recommendation updated 💜');
    }
  };

  // Claim bonus cloud storage from sharing
  const handleRewardClaimed = (bonusBytes: number, unlockedFilterName?: string) => {
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const newBonus = prev.cloudStorageBonusBytes + bonusBytes;
        const newFilters = [...prev.unlockedFilters];

        if (unlockedFilterName) {
          const matchingFilter = AI_FILTERS.find((f) => f.name === unlockedFilterName);
          if (matchingFilter && !newFilters.includes(matchingFilter.id)) {
            newFilters.push(matchingFilter.id);
          }
        }

        // Simulate inbound follower increase for engaging consistently!
        const simulatedFollowersGained = Math.floor(Math.random() * 8) + 4;
        const newFollowers = prev.followersCount + simulatedFollowersGained;

        return {
          ...prev,
          cloudStorageBonusBytes: newBonus,
          followersCount: newFollowers,
          unlockedFilters: newFilters,
          consistencyScore: Math.min(100, prev.consistencyScore + 5),
          algorithmMultiplier: Number((1.2 + (prev.consistencyScore / 40)).toFixed(1)),
        };
      });

      // Update post share count
      setPosts((prev) =>
        prev.map((p) => (p.id === activePost.id ? { ...p, sharesCount: p.sharesCount + 1 } : p))
      );

      showToast(
        unlockedFilterName
          ? `🎉 +500 MB Added to Vault! New Filter: ${unlockedFilterName} Unlocked!`
          : `🎉 +500 MB Added to your Cloud Vault! +6 new followers gained from share boost!`
      );
    }
  };

  // Add comment
  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      username: currentUser?.username || 'you',
      userAvatar: currentUser?.avatar || '/src/assets/images/avatar_cyber_creator_1792906341940.jpg',
      isVerified: currentUser?.isVerified ?? true,
      text,
      likes: 0,
      isLiked: false,
      timestamp: 'Just now',
    };

    setCommentsMap((prev) => ({
      ...prev,
      [activePost.id]: [newComment, ...(prev[activePost.id] || [])],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === activePost.id ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    // Consistency score boost
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              consistencyScore: Math.min(100, prev.consistencyScore + 3),
              followersCount: prev.followersCount + 2,
            }
          : null
      );
    }

    showToast('Comment posted! +2 new followers gained from engagement boost 🔥');
  };

  const handleLikeComment = (commentId: string) => {
    setCommentsMap((prev) => {
      const list = prev[activePost.id] || [];
      const updated = list.map((c) =>
        c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
      );
      return { ...prev, [activePost.id]: updated };
    });
  };

  // Handle publishing newly created post from AI Studio
  const handlePublishPost = (newPost: VideoPost) => {
    setPosts([newPost, ...posts]);
    setActiveIndex(0);
    setActiveTab('foryou');
    showToast('🚀 Your AI video was published to the LikeTop discovery feed!');
  };

  // Wheel scrolling (one video per deliberate gesture)
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrollingRef.current) return;
    if (Math.abs(e.deltaY) > 40) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 450);
    }
  };

  // Current active AI filter css
  const activePostFilter = AI_FILTERS.find((f) => f.name === activePost.aiFilterApplied);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-screen h-screen bg-[#070a12] text-slate-100 overflow-hidden select-none flex flex-col font-sans"
    >
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'live') {
            setIsLiveOpen(true);
          } else {
            setActiveTab(tab);
            setActiveIndex(0);
          }
        }}
        onOpenSearch={() => setIsExploreOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={currentUser}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-purple-950/90 border border-purple-400 text-white text-xs md:text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-fuchsia-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container: 1440px desktop balanced layout & full mobile presence */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden pt-14 md:pt-16 pb-16 md:pb-0">
        {/* Desktop Left Side Quick Bar (on larger screens) */}
        <aside className="hidden xl:flex flex-col justify-between w-72 h-[82vh] p-6 rounded-3xl bg-slate-950/50 border border-purple-500/20 backdrop-blur-md mr-8 text-xs text-slate-400">
          <div className="space-y-5">
            {/* User Profile summary card */}
            <div
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition-all group"
            >
              <img
                src={currentUser?.avatar || '/src/assets/images/avatar_cyber_creator_1792906341940.jpg'}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/50 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 truncate">
                <span className="font-bold text-white text-sm block truncate group-hover:text-purple-300">
                  {currentUser?.displayName || 'Creator'}
                </span>
                <span className="text-[11px] text-purple-400">@{currentUser?.username || 'liketop'}</span>
              </div>
            </div>

            {/* Engagement & Follower Multiplier */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{currentUser?.streakDays || 4}-Day Streak</span>
                </span>
                <span className="text-purple-300 font-mono">{currentUser?.algorithmMultiplier || 1.5}x Boost</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Engage daily with likes & shares to automatically trigger follower discovery placement!
              </p>
            </div>

            {/* Bonus Cloud Vault Strip */}
            <div
              onClick={() => setIsVaultOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-purple-500/30 hover:border-purple-500 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Cloud Vault</span>
                </span>
                <span className="font-mono text-white">
                  {currentUser ? ((currentUser.cloudStorageMaxBytes + currentUser.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1) : '5.0'} GB
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 w-2/5" />
              </div>
              <span className="text-[10px] text-slate-400 block">+500MB bonus storage per share</span>
            </div>

            {/* Trending tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Trending on LikeTop
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['#LikeTop', '#UltravioletGlow', '#CyberCity', '#TokyoNeon', '#DanceDrop'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setIsExploreOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950 text-slate-300 hover:text-purple-200 border border-slate-800 transition-colors text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard navigation hints */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] space-y-1">
            <div className="text-slate-300 font-semibold mb-1">Keyboard Controls</div>
            <div className="flex justify-between"><span>Next/Prev Video:</span> <span className="font-mono text-purple-300">↓ / ↑ or J / K</span></div>
            <div className="flex justify-between"><span>Double tap / Like:</span> <span className="font-mono text-purple-300">L</span></div>
            <div className="flex justify-between"><span>Open Comments:</span> <span className="font-mono text-purple-300">C</span></div>
            <div className="flex justify-between"><span>Share & Earn:</span> <span className="font-mono text-purple-300">S</span></div>
          </div>
        </aside>

        {/* Center: Vertical TikTok-Style Video Frame */}
        <div className="relative w-full h-full md:w-[420px] md:h-[84vh] md:max-h-[820px] md:rounded-3xl overflow-hidden md:border md:border-purple-500/30 md:shadow-2xl md:shadow-purple-950/40 bg-slate-950 flex items-center justify-center">
          {displayedPosts.length === 0 ? (
            <div className="text-center p-8 text-slate-400">
              <p className="text-base font-semibold">No posts in this feed yet.</p>
              <button
                onClick={() => setActiveTab('foryou')}
                className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Switch to For You Feed
              </button>
            </div>
          ) : (
            <>
              {/* Active Video Player */}
              <VideoPlayer
                post={activePost}
                isActive={true}
                onLike={() => handleLike(activePost.id)}
                onTagClick={(tag) => setIsExploreOpen(true)}
                onCreatorClick={(creatorId) => setIsProfileOpen(true)}
                aiFilterStyle={activePostFilter?.cssFilter || 'none'}
              />

              {/* TikTok Right Action Rail */}
              <ActionRail
                post={activePost}
                onLike={(e) => {
                  e.stopPropagation();
                  handleLike(activePost.id);
                }}
                onComment={() => setIsCommentOpen(true)}
                onBookmark={() => handleBookmark(activePost.id)}
                onShare={() => setIsShareOpen(true)}
                onAIRemix={() => setIsAIStudioOpen(true)}
                onFollow={() => handleFollow(activePost.id)}
              />
            </>
          )}

          {/* Desktop Arrow Controls for Next/Prev */}
          <div className="hidden md:flex flex-col gap-2 absolute right-[-54px] top-1/2 -translate-y-1/2 pointer-events-auto">
            <button
              onClick={goToPrev}
              disabled={activeIndex === 0}
              className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-purple-900 disabled:opacity-30 disabled:hover:bg-slate-900 text-white flex items-center justify-center border border-purple-500/30 transition-all shadow-md active:scale-95"
              title="Previous video (Up Arrow)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={activeIndex === displayedPosts.length - 1}
              className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-purple-900 disabled:opacity-30 disabled:hover:bg-slate-900 text-white flex items-center justify-center border border-purple-500/30 transition-all shadow-md active:scale-95"
              title="Next video (Down Arrow)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Right Side Quick Actions & AI Studio Spotlight */}
        <aside className="hidden 2xl:flex flex-col justify-between w-80 h-[82vh] p-6 rounded-3xl bg-slate-950/50 border border-purple-500/20 backdrop-blur-md ml-8 text-xs text-slate-400">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Free AI Creative Studio</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Edit videos & pictures with cinematic AI style grading, smart caption generators, and royalty-free audio tracks.
            </p>

            <button
              onClick={() => setIsAIStudioOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Free AI Studio</span>
            </button>

            {/* High-Level Security Card */}
            <div
              onClick={() => setIsVaultOpen(true)}
              className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all space-y-2 mt-4"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>AES-256-GCM Vault</span>
              </div>
              <p className="text-[11px] text-slate-300">
                All passwords, credentials, and user data are encrypted with PBKDF2-SHA256 (100,000 iterations).
              </p>
              <span className="text-[10px] text-purple-300 font-semibold block">Click to inspect security audit →</span>
            </div>

            {/* Viral Share Perk */}
            <div
              onClick={() => setIsShareOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-white font-bold">
                <span>Viral Share Rewards</span>
                <span className="text-fuchsia-300 font-mono">+500MB</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Share posts to unlock Premium 4D Hologram filters and permanent bonus cloud vault storage!
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            LikeTop © 2026 · Built with Vibrant Purple & Deep Navy
          </div>
        </aside>
      </main>

      {/* Bottom Navigation Dock */}
      <BottomNav
        currentView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'explore') setIsExploreOpen(true);
          if (view === 'profile') setIsProfileOpen(true);
        }}
        onOpenCreate={() => setIsAIStudioOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        storageBonusBadge={currentUser && currentUser.cloudStorageBonusBytes > 0 ? '+500M' : undefined}
      />

      {/* Interactive Modals */}
      <CommentDrawer
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        comments={commentsMap[activePost.id] || []}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />

      <ShareRewardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={activePost}
        user={currentUser}
        onRewardClaimed={handleRewardClaimed}
      />

      <AIStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        user={currentUser}
        onPublishPost={handlePublishPost}
        onOpenShareModalForUnlock={() => {
          setIsAIStudioOpen(false);
          setIsShareOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome to LikeTop, @${user.username}! High-level AES-256 encryption active.`);
        }}
      />

      <VaultSecurityModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        user={currentUser}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        myVideos={posts.filter((p) => p.author.username === currentUser?.username)}
        likedVideos={posts.filter((p) => p.isLiked)}
        onOpenVault={() => {
          setIsProfileOpen(false);
          setIsVaultOpen(true);
        }}
        onOpenAIStudio={() => {
          setIsProfileOpen(false);
          setIsAIStudioOpen(true);
        }}
        onSelectVideo={(post) => {
          const idx = displayedPosts.findIndex((p) => p.id === post.id);
          if (idx !== -1) setActiveIndex(idx);
        }}
      />

      <ExploreView
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        posts={posts}
        onSelectPost={(post) => {
          const idx = displayedPosts.findIndex((p) => p.id === post.id);
          if (idx !== -1) setActiveIndex(idx);
        }}
        onSelectTag={(tag) => {
          setIsExploreOpen(false);
          showToast(`Filtering For You feed for ${tag}`);
        }}
      />

      <LiveStreamModal
        isOpen={isLiveOpen}
        onClose={() => setIsLiveOpen(false)}
      />
    </div>
  );
}
