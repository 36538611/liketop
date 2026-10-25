export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  authMethod: 'google' | 'email' | 'phone' | 'username';
  email?: string;
  phoneNumber?: string;
  encryptedPasswordHash?: string;
  cloudStorageBytes: number; // e.g. 5 GB base
  cloudStorageBonusBytes: number; // bonus earned from sharing
  cloudStorageMaxBytes: number; // max pool e.g. 50 GB
  streakDays: number;
  consistencyScore: number;
  algorithmMultiplier: number;
  unlockedFilters: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  replies?: Comment[];
}

export interface VideoPost {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  videoUrl: string;
  posterUrl: string;
  caption: string;
  tags: string[];
  music: {
    title: string;
    artist: string;
    coverUrl?: string;
  };
  category: 'dance' | 'tech' | 'comedy' | 'gaming' | 'fashion' | 'ai' | 'lifestyle';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  aiFilterApplied?: string;
  createdAt: string;
}

export interface AIFilter {
  id: string;
  name: string;
  description: string;
  category: 'color' | 'cyber' | 'retro' | 'cinematic' | 'premium';
  isPremium: boolean;
  cssFilter: string;
  previewColor: string;
  unlockedByDefault: boolean;
}

export interface EncryptedCredentialRecord {
  id: string;
  accountIdentifier: string;
  authMethod: 'google' | 'email' | 'phone' | 'username';
  encryptedCiphertext: string;
  saltHex: string;
  ivHex: string;
  algorithm: string;
  lastUpdated: string;
}

export interface NotificationItem {
  id: string;
  type: 'boost' | 'like' | 'follow' | 'storage_reward' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  badge?: string;
}
