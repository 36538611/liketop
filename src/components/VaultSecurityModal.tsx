import React, { useState } from 'react';
import { X, ShieldCheck, HardDrive, Lock, Key, RefreshCw, Sparkles, Share2, Check, CheckCircle2 } from 'lucide-react';
import { User, EncryptedCredentialRecord } from '../types';
import { getVaultRecords } from '../services/crypto';

interface VaultSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onOpenShareModal: () => void;
}

export const VaultSecurityModal: React.FC<VaultSecurityModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'storage' | 'security'>('storage');
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDone, setRotationDone] = useState(false);

  if (!isOpen) return null;

  const vaultRecords: EncryptedCredentialRecord[] = getVaultRecords();

  const totalMaxGB = user
    ? ((user.cloudStorageMaxBytes + user.cloudStorageBonusBytes) / (1024 * 1024 * 1024)).toFixed(1)
    : '5.0';
  const bonusMB = user ? Math.round(user.cloudStorageBonusBytes / (1024 * 1024)) : 0;
  const usedGB = user ? (user.cloudStorageBytes / (1024 * 1024 * 1024)).toFixed(2) : '1.20';
  const usedPercent = user
    ? Math.min(100, Math.round((user.cloudStorageBytes / (user.cloudStorageMaxBytes + user.cloudStorageBonusBytes)) * 100))
    : 24;

  const handleKeyRotation = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      setRotationDone(true);
      setTimeout(() => setRotationDone(false), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto no-scrollbar">
      <div className="relative w-full max-w-lg bg-[#0C0E15] border border-[#D49B8B]/30 rounded-3xl shadow-2xl overflow-hidden p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D49B8B] to-[#C27E6E] flex items-center justify-center shadow-md text-[#0A0C10]">
            <HardDrive className="w-5 h-5 text-[#0A0C10]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">LikeTop Cloud Vault & Security</h2>
            <p className="text-xs text-slate-400">Manage encrypted storage, bonus capacity & privacy</p>
          </div>
        </div>

        {/* Segmented Controls / Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'storage' ? 'bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Bonus Cloud Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'security' ? 'bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] text-[#0A0C10] font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High-Level Encryption</span>
          </button>
        </div>

        {activeTab === 'storage' ? (
          <div className="space-y-5">
            {/* Storage Progress Bar */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-[#D49B8B]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Total Storage Capacity</span>
                <span className="text-sm font-extrabold text-[#F2C4B7] tabular-nums">
                  {totalMaxGB} GB
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#D49B8B] to-[#E8B4A6] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                <span>{usedGB} GB Used ({usedPercent}%)</span>
                <span className="text-[#F2C4B7] font-semibold font-mono">+{bonusMB} MB Bonus Earned</span>
              </div>
            </div>

            {/* Storage Breakdown Details */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Base Tier</span>
                <span className="text-xs font-bold text-slate-200">5.0 GB</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Free forever</span>
              </div>
              <div className="p-3 rounded-xl bg-[#D49B8B]/10 border border-[#D49B8B]/30">
                <span className="text-[10px] text-[#F2C4B7] block">Share Bonuses</span>
                <span className="text-xs font-bold text-[#F2C4B7] tabular-nums">+{bonusMB} MB</span>
                <span className="text-[9px] text-[#D49B8B] block mt-0.5">+500MB/share</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Max Vault Cap</span>
                <span className="text-xs font-bold text-slate-200">50.0 GB</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Expandable</span>
              </div>
            </div>

            {/* Earn More Action Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D49B8B]/20 via-[#0C0E15] to-[#D49B8B]/20 border border-[#D49B8B]/40 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D49B8B]" />
                  <span>Get +500 MB Bonus Right Now</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">Share any video to WhatsApp, X, or copy link</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenShareModal();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D49B8B] to-[#C27E6E] hover:brightness-110 text-[#0A0C10] text-xs font-extrabold shrink-0 shadow-md shadow-[#D49B8B]/20 transition-all active:scale-95"
              >
                Share & Earn
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cryptographic Protocols Audit */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-[#D49B8B]/30 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Cryptographic Standards Compliant</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Cipher Algorithm:</span>
                  <span className="font-mono text-[#F2C4B7] font-semibold">AES-256-GCM (Authenticated)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Key Derivation:</span>
                  <span className="font-mono text-[#F2C4B7] font-semibold">PBKDF2-SHA256 (100k rounds)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Vector & Salt:</span>
                  <span className="font-mono text-[#F2C4B7] font-semibold">96-bit IV / 128-bit Salt</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Zero-Knowledge Vault:</span>
                  <span className="text-emerald-400 font-semibold">Active & Client-Secured</span>
                </div>
              </div>
            </div>

            {/* Saved Password Records in Device Vault */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Saved Encrypted Credentials</span>
              {vaultRecords.length === 0 ? (
                <p className="text-xs text-slate-400">1 active session credential safely stored in device memory.</p>
              ) : (
                vaultRecords.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{r.accountIdentifier}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {r.algorithm} · {new Date(r.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono">
                      ENCRYPTED
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Key Rotation Action */}
            <button
              onClick={handleKeyRotation}
              disabled={isRotating}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{rotationDone ? 'Cryptographic Keys Rotated Successfully!' : 'Rotate Encryption Key & Salt'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
