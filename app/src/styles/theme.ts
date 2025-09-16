import 'styled-components';

// Theme colors for HirePath dashboard
export const theme = {
  colors: {
    background: '#0B0E16',
    cardSurface: '#151A24',
    primary: '#3B82F6', // blue
    secondary: '#8B5CF6', // violet
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    headings: '#FFFFFF',
    bodyText: '#B0B8C1',
    borders: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      small: '0.875rem',
      base: '1rem',
      large: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  boxShadow: {
    card: '0 8px 24px rgba(0,0,0,.35)',
  },
};

// Extend the DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      cardSurface: string;
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      headings: string;
      bodyText: string;
      borders: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        small: string;
        base: string;
        large: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    boxShadow: {
      card: string;
    };
  }
}

export type ThemeType = typeof theme;