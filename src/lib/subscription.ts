import type { Subscription } from '../types/database';

// ── Constants ─────────────────────────────────────────────────────────────────
export const DEFAULT_STORY_PRICE_TZS = 1000;
export const FREE_EPISODES_COUNT = 3; // first 3 episodes are ALWAYS free

// ── Story Pay-Per-Book Paywall logic ──────────────────────────────────────────
export function isStoryEpisodeLocked(
  episodeNumber: number,
  storyPrice: number = 0,
  isPurchased: boolean = false
): boolean {
  if (episodeNumber <= FREE_EPISODES_COUNT) return false; // First 3 episodes always free
  if (storyPrice <= 0) return false; // Free story
  return !isPurchased; // Locked if paid story and user has not purchased
}

// ── Backward-compatible subscription helpers ─────────────────────────────────
export function isEpisodeLocked(episodeNumber: number, isPremium: boolean): boolean {
  if (episodeNumber <= FREE_EPISODES_COUNT) return false;
  return !isPremium;
}

export function isSubscriptionValid(sub: Subscription | null): boolean {
  if (!sub) return false;
  return sub.status === 'active' && new Date(sub.expiry_date) >= new Date();
}

export function getDaysRemaining(expiryDate: string): number {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function canInitiatePayment(sub: Subscription | null): boolean {
  if (!sub) return true;
  if (sub.status !== 'active') return true;
  const days = getDaysRemaining(sub.expiry_date);
  return days <= 7;
}

export function formatSubscriptionStatus(sub: Subscription | null): string {
  if (!sub) return 'Haijasajiliwa';
  const days = getDaysRemaining(sub.expiry_date);
  if (sub.status === 'active' && days > 0) {
    if (days <= 3) return `Inaisha hivi karibuni (siku ${days})`;
    return 'Hai';
  }
  if (sub.status === 'trial') return 'Majaribio';
  return 'Imekwisha';
}
