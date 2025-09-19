import 'styled-components';

// Dark theme colors for HirePath dashboard
export const darkTheme = {
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
    borders: 'rgba(255,255,255,0.08)'
  },
  gradients: {
    baseStart: '#0b1020',
    baseMid: '#0e1424',
    baseEnd: '#0b1220',
    primaryGlow: 'rgba(59, 130, 246, 0.22)',
    secondaryGlow: 'rgba(168, 85, 247, 0.18)'
  },
  glass: {
    navbar: 'rgba(15, 23, 42, 0.6)',
    sidebar: 'rgba(15, 23, 42, 0.6)',
    dropdown: 'rgba(15, 23, 42, 0.85)',
    drawer: 'rgba(15, 23, 42, 0.85)',
    card: 'rgba(15, 23, 42, 0.65)'
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
      '4xl': '2.25rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  boxShadow: {
    card: '0 8px 24px rgba(0,0,0,.35)'
  }
};

// Light theme
export const lightTheme = {
  colors: {
    background: '#F3F4F6',
    cardSurface: '#FFFFFF',
    primary: '#2563EB', // slightly deeper blue
    secondary: '#7C3AED',
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    headings: '#111827',
    bodyText: '#374151',
    borders: 'rgba(17, 24, 39, 0.08)'
  },
  gradients: {
    baseStart: '#e9eff6',
    baseMid: '#e5ecf5',
    baseEnd: '#e8eef7',
    primaryGlow: 'rgba(59, 130, 246, 0.18)',
    secondaryGlow: 'rgba(148, 163, 184, 0.15)'
  },
  glass: {
    navbar: 'rgba(226, 236, 244, 0.72)',
    sidebar: 'rgba(226, 236, 244, 0.72)',
    dropdown: 'rgba(236, 244, 252, 0.9)',
    drawer: 'rgba(236, 244, 252, 0.9)',
    card: 'rgba(232, 240, 248, 0.65)'
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
      '4xl': '2.25rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  boxShadow: {
    card: '0 6px 18px rgba(0,0,0,.12)'
  }
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
    gradients: {
      baseStart: string;
      baseMid: string;
      baseEnd: string;
      primaryGlow: string;
      secondaryGlow: string;
    };
    glass: {
      navbar: string;
      sidebar: string;
      dropdown: string;
      drawer: string;
      card: string;
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

export type ThemeType = typeof darkTheme;