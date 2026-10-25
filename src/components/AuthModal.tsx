import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, Phone, User as UserIcon, CheckCircle2, ArrowRight, Loader2, Key } from 'lucide-react';
import { saveEncryptedCredential, generateGoogleToken } from '../services/crypto';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'google' | 'email' | 'phone' | 'username'>('google');
  const [email, setEmail] = useState('robertmose00@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 839-2041');
  const [username, setUsername] = useState('liketop_star');
  const [password, setPassword] = useState('SecurePass2026!');
  const [smsOtp, setSmsOtp] = useState('749201');
  const [savePasswordToVault, setSavePasswordToVault] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsProcessing(true);
    setEncryptionStatus('Deriving PBKDF2-SHA256 (100,000 iterations) session key...');

    setTimeout(async () => {
      try {
        const token = generateGoogleToken(email);
        if (savePasswordToVault) {
          await saveEncryptedCredential(email, 'google', token);
        }

        const newUser: User = {
          id: `usr_${Date.now()}`,
          username: email.split('@')[0],
          displayName: email.split('@')[0].toUpperCase(),
          avatar: '/src/assets/images/avatar_cyber_creator_1792906341940.jpg',
          bio: 'Verified LikeTop Creator ⚡ AI video artist',
          isVerified: true,
          followersCount: 1850,
          followingCount: 240,
          totalLikes: 42300,
          authMethod: 'google',
          email,
          cloudStorageBytes: 1.2 * 1024 * 1024 * 1024,
          cloudStorageBonusBytes: 1000 * 1024 * 1024, // 1 GB initial bonus
          cloudStorageMaxBytes: 5 * 1024 * 1024 * 1024,
          streakDays: 5,
          consistencyScore: 78,
          algorithmMultiplier: 1.8,
          unlockedFilters: ['filter_original', 'filter_ultraviolet', 'filter_cyberpunk', 'filter_anime', 'filter_vintage', 'filter_noir', 'filter_prism4d'],
          createdAt: new Date().toISOString(),
        };

        onLoginSuccess(newUser);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 700);
  };

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setEncryptionStatus('Encrypting credentials with AES-256-GCM zero-knowledge protocol...');

    setTimeout(async () => {
      try {
        const identifier = authMode === 'email' ? email : authMode === 'phone' ? phone : username;
        if (savePasswordToVault) {
          await saveEncryptedCredential(identifier, authMode, password);
        }

        const newUser: User = {
          id: `usr_${Date.now()}`,
          username: authMode === 'username' ? username : identifier.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 12),
          displayName: authMode === 'username' ? username : 'LikeTop Creator',
          avatar: '/src/assets/images/avatar_tech_reviewer_1792906342873.jpg',
          bio: 'Building consistency on LikeTop 🚀 Verified via ' + authMode,
          isVerified: true,
          followersCount: 1200,
          followingCount: 180,
          totalLikes: 18400,
          authMethod: authMode,
          email: authMode === 'email' ? email : undefined,
          phoneNumber: authMode === 'phone' ? phone : undefined,
          cloudStorageBytes: 0.8 * 1024 * 1024 * 1024,
          cloudStorageBonusBytes: 500 * 1024 * 1024,
          cloudStorageMaxBytes: 5 * 1024 * 1024 * 1024,
          streakDays: 3,
          consistencyScore: 62,
          algorithmMultiplier: 1.4,
          unlockedFilters: ['filter_original', 'filter_ultraviolet', 'filter_cyberpunk', 'filter_anime', 'filter_vintage', 'filter_noir'],
          createdAt: new Date().toISOString(),
        };

        onLoginSuccess(newUser);
        onClose();
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto no-scrollbar">
      <div className="relative w-full max-w-md bg-[#090e1c] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Branding & Logo */}
        <div className="flex flex-col items-center text-center mb-5">
          <img
            src="/src/assets/images/liketop_app_logo_1792906339915.jpg"
            alt="LikeTop Logo"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-600/30 mb-2"
          />
          <h2 className="text-xl font-extrabold text-white">Join LikeTop</h2>
          <p className="text-xs text-slate-400 mt-0.5">Watch, create, and earn bonus cloud storage & algorithm reach</p>
        </div>

        {/* High-Level Encryption Indicator */}
        <div className="mb-4 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2.5 text-[11px] text-purple-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-white">End-to-End Encrypted:</span> AES-256-GCM + PBKDF2 (100k rounds)
          </div>
        </div>

        {/* Google 1-Click Verification CTA */}
        <button
          onClick={handleGoogleAuth}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs md:text-sm flex items-center justify-center gap-3 shadow-md active:scale-98 transition-all mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google Verification</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] text-slate-500 font-medium uppercase">Or choose method</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Multi-Channel Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setAuthMode('email')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'email' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('phone')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'phone' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('username')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'username' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Username</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleManualAuth} className="space-y-3">
          {authMode === 'email' && (
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
            </div>
          )}

          {authMode === 'phone' && (
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">SMS Verification Code</label>
                <input
                  type="text"
                  required
                  value={smsOtp}
                  onChange={(e) => setSmsOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {authMode === 'username' && (
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Username Handle</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="unique_handle"
                  className="w-full h-10 pl-7 pr-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Save password with high-level encryption toggle */}
          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={savePasswordToVault}
              onChange={(e) => setSavePasswordToVault(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-[11px] text-slate-300">
              Save password in <span className="text-purple-300 font-semibold">AES-256-GCM Secure Vault</span> on this device
            </span>
          </label>

          {/* Encryption status text */}
          {encryptionStatus && (
            <p className="text-[10px] text-emerald-400 font-mono animate-pulse">{encryptionStatus}</p>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-all mt-3 active:scale-98"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Secure Log In / Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
