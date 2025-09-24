import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';
import { ThemeModeContext, type ThemeMode, type FontScale, type Accent } from './themeMode';

const STORAGE_KEY = 'hp-theme-mode';
const FONT_KEY = 'hp-font-scale';
const ACCENT_KEY = 'hp-accent';

export const ThemeModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  const [accent, setAccent] = useState<Accent>('blue');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
      }
      const storedFont = localStorage.getItem(FONT_KEY) as FontScale | null;
      if (storedFont === 'normal' || storedFont === 'large' || storedFont === 'xlarge') {
        setFontScale(storedFont);
      }
      const storedAccent = localStorage.getItem(ACCENT_KEY) as Accent | null;
      if (storedAccent === 'blue' || storedAccent === 'purple' || storedAccent === 'green') {
        setAccent(storedAccent);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      const root = document.documentElement;
      root.setAttribute('data-theme', mode);
      root.style.colorScheme = mode;
    } catch { /* ignore */ }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, fontScale);
      const root = document.documentElement;
      const size = fontScale === 'normal' ? '100%' : fontScale === 'large' ? '112.5%' : '125%';
      root.style.fontSize = size;
    } catch { /* ignore */ }
  }, [fontScale]);

  useEffect(() => {
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch { /* ignore */ }
  }, [accent]);

  const value = useMemo(() => ({
    mode,
    toggleMode: () => setMode(prev => prev === 'dark' ? 'light' : 'dark'),
    setMode,
    fontScale,
    setFontScale,
    accent,
    setAccent,
  }), [mode, fontScale, accent]);

  const baseTheme = mode === 'dark' ? darkTheme : lightTheme;

  // Derive accent colors and glass variants
  const accentColors = accent === 'blue'
    ? { primary: '#3B82F6', secondary: '#8B5CF6' }
    : accent === 'purple'
      ? { primary: '#8B5CF6', secondary: '#A78BFA' }
      : { primary: '#22C55E', secondary: '#16A34A' };

  const activeTheme = useMemo(() => ({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: accentColors.primary,
      secondary: accentColors.secondary,
    },
    glass: {
      ...baseTheme.glass,
      // keep glass look; tint subtly toward accent via alpha overlays if needed later
    },
  }), [baseTheme, accentColors.primary, accentColors.secondary]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}; 