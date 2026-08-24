import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ReaderPrefs = {
  fontSize: number;
  width: 'narrow' | 'wide';
  mode: 'dark' | 'light';
};

interface KisaContextType {
  readerPrefs: ReaderPrefs;
  setReaderPrefs: React.Dispatch<React.SetStateAction<ReaderPrefs>>;
}

const defaultReaderPrefs: ReaderPrefs = {
  fontSize: 18,
  width: 'narrow',
  mode: 'light',
};

const KisaContext = createContext<KisaContextType | undefined>(undefined);

export function KisaProvider({ children }: { children: ReactNode }) {
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(() => {
    try {
      const saved = localStorage.getItem('kisa_reader_prefs');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        fontSize: parsed.fontSize ?? 18,
        width: parsed.width ?? 'narrow',
        mode: 'light', // always start light — user can toggle dark via controls
      };
    } catch {
      return defaultReaderPrefs;
    }
  });

  useEffect(() => {
    localStorage.setItem('kisa_reader_prefs', JSON.stringify(readerPrefs));
  }, [readerPrefs]);

  return (
    <KisaContext.Provider value={{ readerPrefs, setReaderPrefs }}>
      {children}
    </KisaContext.Provider>
  );
}

export function useKisa() {
  const context = useContext(KisaContext);
  if (context === undefined) {
    throw new Error('useKisa must be used within a KisaProvider');
  }
  return context;
}