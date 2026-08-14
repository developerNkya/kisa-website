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
interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isPremium: boolean;
  isAdmin: boolean;
  loading: boolean;
  // Auth actions
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  // Data refresh
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthState | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
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

  // ── Fetch active subscription ────────────────────────────────
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

  // ── Bootstrap session on mount ───────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }: { data: { session: Session | null } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        Promise.all([fetchProfile(s.user.id), fetchSubscription(s.user.id)]).finally(() =>
          setLoading(false)
        );
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, s: Session | null) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
        fetchSubscription(s.user.id);
      } else {
        setProfile(null);
        setSubscription(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile, fetchSubscription]);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: undefined, // no email verification
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ── Manual refreshes ─────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const refreshSubscription = useCallback(async () => {
    if (user) await fetchSubscription(user.id);
  }, [user, fetchSubscription]);

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
      isPremium,
      isAdmin,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      refreshSubscription,
    }),
    [
      session, user, profile, subscription, isPremium, isAdmin, loading,
      login, register, logout, refreshProfile, refreshSubscription,
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
