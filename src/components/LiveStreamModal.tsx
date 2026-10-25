import React, { useState, useEffect } from 'react';
import { X, Heart, Users, Sparkles, Send, Gift, Flame } from 'lucide-react';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LiveChat {
  id: number;
  user: string;
  avatar: string;
  message: string;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ isOpen, onClose }) => {
  const [chatList, setChatList] = useState<LiveChat[]>([
    { id: 1, user: 'leo_skates', avatar: '/src/assets/images/avatar_tech_reviewer_1792906342873.jpg', message: 'That beat drop was incredible!! 🔥' },
    { id: 2, user: 'clara_style', avatar: '/src/assets/images/avatar_dancer_female_1792906342657.jpg', message: 'Loving the LikeTop live vibe tonight 💜' },
    { id: 3, user: 'kairo_tokyo', avatar: '/src/assets/images/avatar_cyber_creator_1792906341940.jpg', message: 'Sent 10 Diamonds! Keep going!' },
  ]);
  const [inputText, setInputText] = useState('');
  const [likesCount, setLikesCount] = useState(48200);
  const [viewersCount, setViewersCount] = useState(14820);
  const [activeGift, setActiveGift] = useState<string | null>(null);

  // Periodically inject new live comments
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const randomComments = [
        'Greetings from Berlin! 🇩🇪',
        'That transition was butter smooth',
        'Where can I get that hoodie??',
        'LikeTop algorithm brought me here and I love it',
        '🔥🔥🔥 Best stream today',
        'Drop the remix track ID please!',
      ];
      const randomUsers = ['morpheus9', 'sora_ai', 'zen_flow', 'pixel_queen', 'crypto_dan'];
      const nextComment: LiveChat = {
        id: Date.now(),
        user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        avatar: '/src/assets/images/avatar_cyber_creator_1792906341940.jpg',
        message: randomComments[Math.floor(Math.random() * randomComments.length)],
      };
      setChatList((prev) => [...prev.slice(-15), nextComment]);
      setViewersCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 2800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatList((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'you',
        avatar: '/src/assets/images/avatar_cyber_creator_1792906341940.jpg',
        message: inputText.trim(),
      },
    ]);
    setInputText('');
  };

  const sendGift = (giftName: string) => {
    setActiveGift(giftName);
    setLikesCount((prev) => prev + 500);
    setTimeout(() => setActiveGift(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 md:p-6">
      <div className="relative w-full max-w-md h-[90vh] bg-slate-950 border border-[#D49B8B]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Background Stream Visual Stage */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
          <img
            src="/src/assets/images/feed_cover_tokyo_night_1792906343109.jpg"
            alt="Live stream stage"
            className="w-full h-full object-cover filter contrast-125 brightness-90 animate-pulse duration-1000"
          />
          {/* Animated Concert Laser & Waveform Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#D49B8B]/15 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-0 right-0 h-40 bg-radial from-[#D49B8B]/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Dark overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

        {/* Stream Top Header */}
        <div className="relative z-20 p-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10">
            <img
              src="/src/assets/images/avatar_dancer_female_1792906342657.jpg"
              alt="Streamer"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Zara Johnson</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-[10px] font-extrabold text-white uppercase animate-pulse">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                <Users className="w-3 h-3 text-[#D49B8B]" />
                <span>{viewersCount.toLocaleString()} viewers</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gift Animation Popup */}
        {activeGift && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 p-3 rounded-2xl bg-[#D49B8B]/30 backdrop-blur-md border border-[#D49B8B]/60 text-center animate-bounce">
            <Sparkles className="w-6 h-6 text-[#F2C4B7] mx-auto mb-1" />
            <p className="text-xs font-bold text-white">Sent {activeGift} to Streamer!</p>
          </div>
        )}

        {/* Live Chat Comments Stream */}
        <div className="relative z-20 mt-auto p-4 flex flex-col justify-end max-h-[38vh] overflow-y-auto no-scrollbar pointer-events-auto space-y-2">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className="self-start max-w-[85%] px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white"
            >
              <span className="font-bold text-[#F2C4B7] mr-1.5">@{chat.user}:</span>
              <span>{chat.message}</span>
            </div>
          ))}
        </div>

        {/* Gift Quick Actions Bar */}
        <div className="relative z-20 px-4 py-2 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between gap-2 pointer-events-auto">
          <button
            onClick={() => sendGift('Rose 🌹')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-rose-300 hover:bg-slate-800 transition-all"
          >
            <span>🌹 Rose</span>
          </button>
          <button
            onClick={() => sendGift('Diamond 💎')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#D49B8B]/20 border border-[#D49B8B]/40 text-xs text-[#F2C4B7] hover:bg-[#D49B8B]/30 transition-all"
          >
            <span>💎 LikeTop Diamond</span>
          </button>
          <button
            onClick={() => {
              setLikesCount((prev) => prev + 1);
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-md"
          >
            <Heart className="w-4 h-4 fill-[#0A0C10] text-[#0A0C10]" />
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendChat} className="relative z-20 p-3 bg-black/80 flex items-center gap-2 pointer-events-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say something to the stream..."
            className="flex-1 h-9 px-3 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D49B8B]"
          />
          <button
            type="submit"
            className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] hover:brightness-110 text-[#0A0C10] text-xs font-extrabold flex items-center justify-center gap-1 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
