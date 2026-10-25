import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Music2, Sparkles, CheckCircle2 } from 'lucide-react';
import { VideoPost } from '../types';
import { soundEngine } from '../services/soundtrack';

interface HeartBurst {
  id: number;
  x: number;
  y: number;
}

interface VideoPlayerProps {
  post: VideoPost;
  isActive: boolean;
  onLike: () => void;
  onTagClick: (tag: string) => void;
  onCreatorClick: (creatorId: string) => void;
  aiFilterStyle?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  post,
  isActive,
  onLike,
  onTagClick,
  onCreatorClick,
  aiFilterStyle = 'none',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [hearts, setHearts] = useState<HeartBurst[]>([]);

  const totalDuration = 15; // 15s short video standard
  const progress = (currentTime / totalDuration) * 100;

  // Double tap timing tracker
  const lastTapRef = useRef<number>(0);

  // Reset video error on new post
  useEffect(() => {
    setVideoError(false);
    setCurrentTime(0);
  }, [post.id]);

  // Handle active state & audio synth
  useEffect(() => {
    if (isActive && isPlaying && !isMuted) {
      soundEngine.playTrack(post.music.title);
    } else {
      soundEngine.stop();
    }

    return () => {
      soundEngine.stop();
    };
  }, [isActive, isPlaying, isMuted, post.music.title]);

  // Motion simulation timeline when video is playing
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1;
        return next >= totalDuration ? 0 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, totalDuration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setShowPlayIcon(true);
      soundEngine.stop();
    } else {
      setIsPlaying(true);
      setShowPlayIcon(false);
      if (!isMuted && isActive) {
        soundEngine.playTrack(post.music.title);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && isActive && isPlaying) {
      soundEngine.playTrack(post.music.title);
    } else {
      soundEngine.stop();
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(ratio * totalDuration);
  };

  // Double-tap or single tap handling
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;

    if (now - lastTapRef.current < 300) {
      // Double tap detected: trigger like with heart particle burst
      onLike();
      const newHeart: HeartBurst = { id: Date.now() + Math.random(), x, y };
      setHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      togglePlay();
    }
  };

  // Check if we can play a real video (e.g. user uploaded file or blob)
  const isCustomUpload = post.videoUrl.startsWith('blob:') || post.videoUrl.startsWith('data:');

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      className="relative w-full h-full bg-[#070a12] overflow-hidden select-none cursor-pointer flex items-center justify-center"
    >
      {/* Real Video Element if valid custom upload and no error */}
      {isCustomUpload && !videoError ? (
        <video
          ref={videoRef}
          src={post.videoUrl}
          poster={post.posterUrl}
          loop
          playsInline
          muted={isMuted}
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: aiFilterStyle !== 'none' ? aiFilterStyle : undefined }}
        />
      ) : (
        /* Cinematic Motion Engine Visualizer */
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={post.posterUrl}
            alt={post.caption}
            className={`w-full h-full object-cover transition-transform duration-1000 ease-linear ${
              isPlaying ? 'scale-110' : 'scale-100'
            }`}
            style={{
              filter: aiFilterStyle !== 'none' ? aiFilterStyle : undefined,
              transform: isPlaying
                ? `scale(${1.08 + Math.sin(currentTime * 0.8) * 0.05}) translate(${Math.sin(currentTime * 0.4) * 1.5}%, ${Math.cos(currentTime * 0.5) * 1.5}%)`
                : 'scale(1)',
            }}
          />

          {/* Dynamic Audio Waveform Overlay */}
          <div className="absolute inset-x-0 bottom-14 h-16 pointer-events-none flex items-end justify-center gap-1 opacity-40 px-6">
            {[14, 28, 45, 32, 60, 40, 25, 52, 38, 22, 48, 30, 55, 35, 18].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-fuchsia-400 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(6, (h * (0.6 + Math.sin(currentTime * 4 + i) * 0.4)))}px` : '6px',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Measured Contrast Scrim for 4.5:1 text legibility */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/85" />

      {/* Floating Hearts from Double Tap */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute pointer-events-none z-50 animate-heart-float"
          style={{ left: heart.x - 30, top: heart.y - 30 }}
        >
          <svg
            className="w-16 h-16 fill-fuchsia-500 text-purple-300 filter drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Big Play/Pause Indicator if paused */}
      {(!isPlaying || showPlayIcon) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-950/65 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-2xl scale-100 transition-all">
            <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Audio Mute/Unmute Toggle Button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        className="absolute top-16 md:top-20 right-4 z-30 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/90 text-white flex items-center justify-center border border-white/10 transition-colors pointer-events-auto"
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-slate-300" /> : <Volume2 className="w-5 h-5 text-purple-300 animate-pulse" />}
      </button>

      {/* AI Filter Applied Ribbon */}
      {post.aiFilterApplied && (
        <div className="absolute top-16 md:top-20 left-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/75 backdrop-blur-md border border-purple-500/30 text-[11px] font-medium text-purple-200">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>AI Style: {post.aiFilterApplied}</span>
        </div>
      )}

      {/* Bottom Creator Info & Caption Area */}
      <div className="absolute left-3 md:left-5 right-18 md:right-22 bottom-4 md:bottom-6 z-20 flex flex-col gap-2 text-white pointer-events-auto">
        {/* Creator Handle & Verified Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreatorClick(post.author.id);
            }}
            className="group flex items-center gap-1.5 font-bold text-sm md:text-base hover:text-purple-300 transition-colors"
          >
            <span>@{post.author.username}</span>
            {post.author.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            )}
          </button>
          <span className="text-xs text-slate-400">· {post.createdAt}</span>
        </div>

        {/* Video Caption & Hashtags */}
        <p className="text-xs md:text-sm text-slate-100 line-clamp-3 leading-snug drop-shadow-xs">
          {post.caption}{' '}
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="font-semibold text-purple-300 hover:text-purple-200 hover:underline mr-1.5"
            >
              {tag}
            </button>
          ))}
        </p>

        {/* Music Sound Ticker */}
        <div className="flex items-center gap-2 text-xs text-slate-300 overflow-hidden max-w-[260px] md:max-w-[340px]">
          <Music2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <div className="whitespace-nowrap truncate font-medium">
            {post.music.title} — {post.music.artist}
          </div>
        </div>
      </div>

      {/* Video Progress / Scrub Bar */}
      <div
        onClick={handleScrub}
        className="absolute bottom-0 left-0 right-0 h-1.5 md:h-2 bg-slate-800/40 hover:h-3 transition-all cursor-pointer z-30 group"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-r-full relative transition-all"
          style={{ width: `${progress}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
