import React, { useState } from 'react';
import { X, Heart, Send, Sparkles } from 'lucide-react';
import { Comment } from '../types';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
  postTitle?: string;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim());
    setInputText('');
  };

  const quickEmojis = ['💜', '🔥', '⚡', '👏', '🚀', '😍', '✨'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full md:max-w-md h-[72vh] md:h-[650px] bg-[#0c1222] border-t md:border border-purple-500/20 md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-2.5 md:hidden" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Comments</span>
            <span className="text-xs text-slate-400 tabular-nums">({comments.length})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              <Sparkles className="w-8 h-8 text-purple-400 mb-2 opacity-60" />
              <p>Be the first to comment!</p>
              <p className="text-xs text-slate-500 mt-1">Engaging boosts your creator streak 🔥</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-xs md:text-sm">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/20 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span>@{comment.username}</span>
                    <span className="text-[11px] font-normal text-slate-500">· {comment.timestamp}</span>
                  </div>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{comment.text}</p>
                </div>
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-rose-400 transition-colors pt-1"
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      comment.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                    }`}
                  />
                  <span className="text-[10px] tabular-nums font-mono">{comment.likes}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center gap-2 px-5 py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-base p-1.5 rounded-lg hover:bg-slate-800/80 active:scale-95 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="px-4 py-3 bg-[#080d1a] border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a comment... (earn streak points)"
            className="flex-1 h-10 px-4 rounded-xl bg-slate-900 border border-slate-700/60 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </form>
      </div>
    </div>
  );
};
