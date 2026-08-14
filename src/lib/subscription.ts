import type { Subscription } from '../types/database';

// ── Constants ─────────────────────────────────────────────────────────────────
export const MONTHLY_PRICE_TZS = 2000;
export const FREE_EPISODES_COUNT = 3; // first N episodes are always free
export const PAYMENT_WINDOW_DAYS = 7; // show pay button N days before expiry

// ── Subscription helpers ──────────────────────────────────────────────────────
export function isSubscriptionValid(sub: Subscription | null): boolean {
  if (!sub) return false;
  return sub.status === 'active' && new Date(sub.expiry_date) >= new Date();
}

export function getDaysRemaining(expiryDate: string): number {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function canInitiatePayment(sub: Subscription | null): boolean {
  if (!sub) return true; // no subscription at all → show pay button
  if (sub.status !== 'active') return true; // expired/cancelled → show pay
  const days = getDaysRemaining(sub.expiry_date);
  return days <= PAYMENT_WINDOW_DAYS; // within payment window → show pay
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

// ── Episode paywall logic ─────────────────────────────────────────────────────
export function isEpisodeLocked(episodeNumber: number, isPremium: boolean): boolean {
  if (episodeNumber <= FREE_EPISODES_COUNT) return false; // always free
  return !isPremium;
}
