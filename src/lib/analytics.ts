// src/lib/analytics.ts
// Central analytics module — PostHog for funnel tracking
// Meta Pixel (pixel.ts) handles: ad attribution only

import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_wPrishBCvRUUCRfYNVH3suqwCLXarJxDcgsiYZsQWrXK';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let initialized = false;

// -- Init -----------------------------------------------------------------
export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
    autocapture: false,
  });
  initialized = true;
}

// -- Identify user --------------------------------------------------------
export function identifyUser(userId: string, props: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  if (typeof window === 'undefined') return;
  posthog.identify(userId, { name: props.name, email: props.email, phone: props.phone });
}

// -- Reset on logout ------------------------------------------------------
export function resetAnalytics() {
  if (typeof window === 'undefined') return;
  posthog.reset();
}

// -- Internal helper ------------------------------------------------------
function capture(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try { posthog.capture(event, props); } catch { /* noop */ }
}

// -- All tracked events ----------------------------------------------------
export const analytics = {

  // Auth funnel
  loginAttempt: () => capture('login_attempt'),
  loginSuccess: () => capture('login_success'),
  loginFailed: (reason: string) => capture('login_failed', { reason }),

  registerAttempt: () => capture('register_attempt'),
  registerSuccess: () => capture('register_success'),
  registerFailed: (reason: string) => capture('register_failed', { reason }),

  // Story viewing
  storyViewed: (props: { story_id: string; story_title: string; category?: string }) =>
    capture('story_viewed', props),

  // Reading funnel
  episodeStarted: (props: {
    story_id: string; story_title: string;
    episode_number: number; is_free: boolean;
  }) => capture('episode_started', props),

  chapterNavigated: (props: {
    story_id: string; story_title: string;
    from_episode: number; to_episode: number;
  }) => capture('chapter_navigated', props),

  // Paywall funnel — the most critical events
  paywallHit: (props: {
    story_id: string; story_title: string;
    episode_number: number; price: number; user_logged_in: boolean;
  }) => capture('paywall_hit', props),

  paymentModalOpened: (props: {
    story_id: string; story_title: string; price: number;
  }) => capture('payment_modal_opened', props),

  paymentPhoneEntered: (props: {
    story_id: string; story_title: string; price: number;
  }) => capture('payment_phone_entered', props),

  paymentAttempted: (props: {
    story_id: string; story_title: string;
    price: number; phone_prefix: string;
  }) => capture('payment_attempted', props),

  paymentSuccess: (props: {
    story_id: string; story_title: string; price: number;
  }) => capture('payment_success', props),

  paymentFailed: (props: {
    story_id: string; story_title: string; price: number; error: string;
  }) => capture('payment_failed', props),

  paymentRequiredLogin: (props: {
    story_id: string; story_title: string; price: number;
  }) => capture('payment_required_login', props),

  // Engagement
  searched: (props: { query: string; results_count: number }) =>
    capture('searched', props),
  bookmarkAdded: (props: { story_id: string; story_title: string }) =>
    capture('bookmark_added', props),
  bookmarkRemoved: (props: { story_id: string; story_title: string }) =>
    capture('bookmark_removed', props),
};
