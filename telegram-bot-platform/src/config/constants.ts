export const SUPER_ADMIN_ID = 7128038268;

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum CommunityType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

export enum BroadcastTargetType {
  ALL_COMMUNITIES = 'all',
  ALL_GROUPS = 'groups',
  ALL_CHANNELS = 'channels',
  SELECTED_GROUPS = 'selected_groups',
  SELECTED_CHANNELS = 'selected_channels',
  CUSTOM_TARGETS = 'custom',
}

export enum BroadcastStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export const COMMUNITY_CATEGORIES = [
  { slug: 'gaming', name: 'Gaming', icon: '🎮' },
  { slug: 'minecraft', name: 'Minecraft', icon: '⛏️' },
  { slug: 'hosting', name: 'Hosting & Server', icon: '🚀' },
  { slug: 'programming', name: 'Programming & Coding', icon: '💻' },
  { slug: 'technology', name: 'Technology & AI', icon: '🤖' },
  { slug: 'business', name: 'Business & Store', icon: '💼' },
  { slug: 'education', name: 'Education & Tips', icon: '📚' },
  { slug: 'community', name: 'Community Hub', icon: '👥' },
  { slug: 'entertainment', name: 'Entertainment', icon: '🎬' },
] as const;

export const DEFAULT_AI_TONES = [
  'professional',
  'friendly',
  'casual',
  'promotional',
  'educational',
] as const;

export const TIMEZONE = 'Asia/Jakarta';
