import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile, Subscription } from '../types/database';
import { identifyUser, resetAnalytics } from './analytics';


// ─── Types ────────────────────────────────────────────────────────────────────
interface PendingPayment {
  storyId: string;
  storyTitle: string;
  price: number;
  returnUrl: string;
  timestamp?: number;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  purchasedStoryIds: string[];
  pendingPayment: PendingPayment | null;
  hasPurchasedStory: (storyId: string) => boolean;
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  // Auth actions
  login: (email: string, password: string) => Promise<{ error: string | null; data?: any }>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phoneArg?: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  // Data refresh
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshPurchases: () => Promise<void>;
  // Payment intent
  setPendingPayment: (payment: PendingPayment | null) => void;
  clearPendingPayment: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '255' + cleaned.substring(1);
  }
  return cleaned;
}

export function phoneOrEmailToAuthEmail(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  const norm = normalizePhone(trimmed);
  return `${norm}@kisa.co.tz`;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthState | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [purchasedStoryIds, setPurchasedStoryIds] = useState<string[]>([]);
  const [pendingPayment, setPendingPaymentState] = useState<PendingPayment | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch profile from DB ────────────────────────────────────
  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    setProfile(data ?? null);
  }, []);

  // ── Fetch purchased stories ──────────────────────────────────
  const fetchPurchases = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('story_purchases')
      .select('story_id')
      .eq('user_id', uid);
    if (data) {
      setPurchasedStoryIds(data.map((p: any) => p.story_id));
    } else {
      setPurchasedStoryIds([]);
    }
  }, []);

  // ── Fetch active subscription (legacy support) ───────────────
  const fetchSubscription = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', uid)
      .eq('status', 'active')
      .gte('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription(data ?? null);
  }, []);

  // ── Check pending payment ────────────────────────────────────
  const checkPendingPayment = useCallback(() => {
    try {
      const stored = sessionStorage.getItem('pending_payment');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPendingPaymentState(parsed);
      }
    } catch (e) {
      console.error('Error checking pending payment:', e);
    }
  }, []);

  const clearPendingPayment = useCallback(() => {
    sessionStorage.removeItem('pending_payment');
    setPendingPaymentState(null);
  }, []);

  // ── Bootstrap session on mount ───────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }: { data: { session: Session | null } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        Promise.all([
          fetchProfile(s.user.id),
          fetchPurchases(s.user.id),
          fetchSubscription(s.user.id)
        ]).finally(() => {
          checkPendingPayment();
          setLoading(false);
        });
      } else {
        checkPendingPayment();
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, s: Session | null) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
        fetchPurchases(s.user.id);
        fetchSubscription(s.user.id);
      } else {
        setProfile(null);
        setPurchasedStoryIds([]);
        setSubscription(null);
      }
      checkPendingPayment();
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile, fetchPurchases, fetchSubscription, checkPendingPayment]);

  // ── Login (supports Phone number or Email) ───────────────────
  const login = useCallback(
    async (identifier: string, password: string): Promise<{ error: string | null; data?: any }> => {
      try {
        const authEmail = phoneOrEmailToAuthEmail(identifier);
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: authEmail, 
          password 
        });
        
        if (error) {
          return { error: error.message };
        }
        
        if (data?.user) {
          identifyUser(data.user.id, { email: data.user.email, phone: identifier });
        }
        
        return { 
          error: null, 
          data: data 
        };
      } catch (err: any) {
        console.error('Login error:', err);
        return { error: err.message || 'Kuna tatizo limejitokeza. Jaribu tena.' };
      }
    },
    []
  );

  // ── Register (supports Phone number or Email) ─────────────────
  const register = useCallback(
    async (
      fullName: string,
      identifier: string,
      password: string,
      phoneArg?: string
    ): Promise<{ error: string | null }> => {
      try {
        const rawPhone = phoneArg || identifier;
        const phone = normalizePhone(rawPhone);
        const authEmail = phoneOrEmailToAuthEmail(identifier);

        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: { full_name: fullName, phone: phone },
            emailRedirectTo: undefined,
          },
        });

        if (error) return { error: error.message };

        if (data?.user) {
          await supabase
            .from('profiles')
            .update({ phone: phone, full_name: fullName })
            .eq('id', data.user.id);
        }

        return { error: null };
      } catch (err: any) {
        console.error('Register error:', err);
        return { error: err.message || 'Kuna tatizo limejitokeza. Jaribu tena.' };
      }
    },
    []
  );

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    sessionStorage.removeItem('pending_payment');
    setPendingPaymentState(null);
    resetAnalytics(); // clear PostHog identity
    await supabase.auth.signOut();
  }, []);

  // ── Manual refreshes ─────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const refreshPurchases = useCallback(async () => {
    if (user) await fetchPurchases(user.id);
  }, [user, fetchPurchases]);

  const refreshSubscription = useCallback(async () => {
    if (user) await fetchSubscription(user.id);
  }, [user, fetchSubscription]);

  // ── Payment intent setters ──────────────────────────────────
  const setPendingPayment = useCallback((payment: PendingPayment | null) => {
    setPendingPaymentState(payment);
    if (payment) {
      try {
        sessionStorage.setItem('pending_payment', JSON.stringify(payment));
      } catch (err) {
        console.error('Error saving pending payment:', err);
      }
    } else {
      try {
        sessionStorage.removeItem('pending_payment');
      } catch (err) {
        console.error('Error removing pending payment:', err);
      }
    }
  }, []);

  // ── Check if story purchased ─────────────────────────────────
  const hasPurchasedStory = useCallback((storyId: string): boolean => {
    if (!storyId) return false;
    return purchasedStoryIds.includes(storyId);
  }, [purchasedStoryIds]);

  // ── Derived state ────────────────────────────────────────────
  const isPremium = useMemo(() => {
    if (!subscription) return false;
    return (
      subscription.status === 'active' &&
      new Date(subscription.expiry_date) >= new Date()
    );
  }, [subscription]);

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user,
      profile,
      subscription,
      purchasedStoryIds,
      pendingPayment,
      hasPurchasedStory,
      isPremium,
      isAdmin,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      refreshSubscription,
      refreshPurchases,
      setPendingPayment,
      clearPendingPayment,
    }),
    [
      session, user, profile, subscription, purchasedStoryIds, pendingPayment,
      hasPurchasedStory, isPremium, isAdmin, loading, login, register, logout,
      refreshProfile, refreshSubscription, refreshPurchases,
      setPendingPayment, clearPendingPayment,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}