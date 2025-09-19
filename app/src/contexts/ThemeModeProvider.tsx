import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';
import { ThemeModeContext, type ThemeMode } from './themeMode';

const STORAGE_KEY = 'hp-theme-mode';

export const ThemeModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
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

  const value = useMemo(() => ({
    mode,
    toggleMode: () => setMode(prev => prev === 'dark' ? 'light' : 'dark'),
    setMode,
  }), [mode]);

  const activeTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}; 