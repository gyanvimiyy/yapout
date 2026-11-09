import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor, AccentInfo, ThemeMode } from '../types';

export const ACCENT_PALETTES: AccentInfo[] = [
  {
    id: 'coral',
    name: 'Electric Coral',
    hex: '#F43F5E',
    description: 'Vibrant, social, energetic signature YapOut tone',
    mood: 'Outgoing & Lively'
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    hex: '#10B981',
    description: 'Fresh, balanced outdoor and campus sports vibe',
    mood: 'Active & Fresh'
  },
  {
    id: 'violet',
    name: 'Cosmic Violet',
    hex: '#8B5CF6',
    description: 'Deep, creative, evening and late-night aesthetic',
    mood: 'Creative & Chill'
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    hex: '#F59E0B',
    description: 'Warm, golden hour conversations and friendly cafes',
    mood: 'Warm & Welcoming'
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    hex: '#0EA5E9',
    description: 'Invigorating azure for focused study sprints & clear minds',
    mood: 'Calm & Sharp'
  },
  {
    id: 'mint',
    name: 'Neo Mint',
    hex: '#14B8A6',
    description: 'Crisp, contemporary botanical tea and boba runs',
    mood: 'Modern & Crisp'
  }
];

interface ThemeContextType {
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  accent: AccentColor;
  currentAccentInfo: AccentInfo;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleQuickMode: () => void;
}

const STORAGE_KEY_MODE = 'yapout_theme_mode';
const STORAGE_KEY_ACCENT = 'yapout_theme_accent';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback to system
    }
    return 'system';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCENT) as AccentColor | null;
      if (saved && ACCENT_PALETTES.some(p => p.id === saved)) {
        return saved;
      }
    } catch {
      // fallback to coral
    }
    return 'coral';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveMode = mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;

  // Apply class and data attribute to document root
  useEffect(() => {
    const root = document.documentElement;
    
    if (effectiveMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-accent', accent);
  }, [effectiveMode, accent]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
    } catch (e) {
      console.warn('Failed to persist theme mode to localStorage', e);
    }
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem(STORAGE_KEY_ACCENT, newAccent);
    } catch (e) {
      console.warn('Failed to persist theme accent to localStorage', e);
    }
  };

  const toggleQuickMode = () => {
    const next = effectiveMode === 'dark' ? 'light' : 'dark';
    setMode(next);
  };

  const currentAccentInfo = ACCENT_PALETTES.find(a => a.id === accent) || ACCENT_PALETTES[0];

  return (
    <ThemeContext.Provider
      value={{
        mode,
        effectiveMode,
        accent,
        currentAccentInfo,
        setMode,
        setAccent,
        toggleQuickMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
