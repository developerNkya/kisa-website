import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ReadingProgress } from '../types';

export interface KisaUser {
  name: string;
  phone: string;
  email: string;
  premium: boolean;
  daysLeft: number;
  joined: string;
}

export interface ReaderPrefs {
  fontSize: number;
  width: 'narrow' | 'wide';
  mode: 'dark' | 'light';
}

interface KisaState {
  user: KisaUser | null;
  login: (name?: string) => void;
  logout: () => void;
  subscribe: () => void;
  saved: string[];
  toggleSaved: (storyId: string) => boolean;
  isSaved: (storyId: string) => boolean;
  progress: ReadingProgress[];
  progressFor: (storyId: string) => ReadingProgress | undefined;
  setProgress: (storyId: string, episodeNumber: number, percent: number) => void;
  history: string[];
  readerPrefs: ReaderPrefs;
  setReaderPrefs: React.Dispatch<React.SetStateAction<ReaderPrefs>>;
}

const defaultUser: KisaUser = {
  name: 'Amina',
  phone: '+255 712 445 991',
  email: 'amina.hassan@gmail.com',
  premium: true,
  daysLeft: 18,
  joined: '4 Jan 2026'
};

const KisaContext = createContext<KisaState | null>(null);

export function KisaProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<KisaUser | null>(defaultUser);
  const [saved, setSaved] = useState<string[]>(['chumba-cha-404', 'ahadi-ya-mwisho', 'baada-ya-mvua']);
  const [progress, setProgressState] = useState<ReadingProgress[]>([
  { storyId: 'siri-ya-amina', episodeNumber: 12, percent: 72, lastReadAt: 'Jana, 22:10' },
  { storyId: 'chumba-cha-404', episodeNumber: 5, percent: 34, lastReadAt: 'Siku 2 zilizopita' },
  { storyId: 'moyo-wa-mwisho', episodeNumber: 21, percent: 58, lastReadAt: 'Siku 4 zilizopita' }]
  );
  const [history, setHistory] = useState<string[]>([
  'siri-ya-amina',
  'chumba-cha-404',
  'moyo-wa-mwisho',
  'mgeni-asiyejulikana',
  'mapenzi-ya-dar']
  );
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>({
    fontSize: 19,
    width: 'narrow',
    mode: 'dark'
  });

  const login = useCallback((name?: string) => {
    setUser({ ...defaultUser, name: name?.trim() || defaultUser.name });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const subscribe = useCallback(() => {
    setUser((u) => u ? { ...u, premium: true, daysLeft: 30 } : { ...defaultUser, daysLeft: 30 });
  }, []);

  const toggleSaved = useCallback((storyId: string) => {
    let nowSaved = false;
    setSaved((list) => {
      nowSaved = !list.includes(storyId);
      return nowSaved ? [...list, storyId] : list.filter((id) => id !== storyId);
    });
    return nowSaved;
  }, []);

  const isSaved = useCallback((storyId: string) => saved.includes(storyId), [saved]);

  const progressFor = useCallback(
    (storyId: string) => progress.find((p) => p.storyId === storyId),
    [progress]
  );

  const setProgress = useCallback((storyId: string, episodeNumber: number, percent: number) => {
    setProgressState((list) => {
      const next = list.filter((p) => p.storyId !== storyId);
      return [{ storyId, episodeNumber, percent, lastReadAt: 'Sasa hivi' }, ...next];
    });
    setHistory((h) => [storyId, ...h.filter((id) => id !== storyId)]);
  }, []);

  const value = useMemo<KisaState>(
    () => ({
      user,
      login,
      logout,
      subscribe,
      saved,
      toggleSaved,
      isSaved,
      progress,
      progressFor,
      setProgress,
      history,
      readerPrefs,
      setReaderPrefs
    }),
    [
    user,
    login,
    logout,
    subscribe,
    saved,
    toggleSaved,
    isSaved,
    progress,
    progressFor,
    setProgress,
    history,
    readerPrefs]

  );

  return <KisaContext.Provider value={value}>{children}</KisaContext.Provider>;
}

export function useKisa(): KisaState {
  const ctx = useContext(KisaContext);
  if (!ctx) throw new Error('useKisa must be used inside KisaProvider');
  return ctx;
}