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
    password: string
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

  // ── Check pending payment from sessionStorage ────────────────
  const checkPendingPayment = useCallback(() => {
    try {
      const stored = sessionStorage.getItem('pending_payment');
      if (stored) {
        const payment = JSON.parse(stored);
        setPendingPaymentState(payment);
        return payment;
      }
    } catch (err) {
      console.error('Error checking pending payment:', err);
    }
    return null;
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
          // ✅ Check for pending payment after loading
          checkPendingPayment();
          setLoading(false);
        });
      } else {
        checkPendingPayment();
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event: string, s: Session | null) => {
      // Session expired or token refresh failed — sign out and redirect to homepage
      if (event === 'TOKEN_REFRESH_FAILED' || (event === 'SIGNED_OUT' && !s)) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setPurchasedStoryIds([]);
        setSubscription(null);
        sessionStorage.removeItem('pending_payment');
        setPendingPaymentState(null);

        if (event === 'TOKEN_REFRESH_FAILED') {
          supabase.auth.signOut().then(() => {
            window.location.href = '/';
          });
        }
        return;
      }

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
      // ✅ Check for pending payment on auth change
      checkPendingPayment();
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile, fetchPurchases, fetchSubscription, checkPendingPayment]);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<{ error: string | null; data?: any }> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) {
          return { error: error.message };
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

  // ── Register ─────────────────────────────────────────────────
  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string
    ): Promise<{ error: string | null }> => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: undefined,
          },
        });
        if (error) return { error: error.message };
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
    // ✅ Clear pending payment on logout
    sessionStorage.removeItem('pending_payment');
    setPendingPaymentState(null);
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

  const clearPendingPayment = useCallback(() => {
    setPendingPaymentState(null);
    try {
      sessionStorage.removeItem('pending_payment');
    } catch (err) {
      console.error('Error removing pending payment:', err);
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