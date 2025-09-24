import { createContext, useContext } from 'react';

export type ThemeMode = 'dark' | 'light';
export type FontScale = 'normal' | 'large' | 'xlarge';
export type Accent = 'blue' | 'purple' | 'green';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}; 