import { createTheme } from '@mui/material/styles';

// Common theme configuration
const commonTheme = {
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      fontSize: '3.5rem',
      '@media (max-width:900px)': { fontSize: '2.5rem' },
    },
    h2: {
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      fontSize: '2.5rem',
      '@media (max-width:900px)': { fontSize: '2rem' },
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A855F7',
      light: '#C084FC',
      dark: '#9333EA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C084FC',
      light: '#D8B4FE',
      dark: '#A855F7',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      disabled: '#9CA3AF',
    },
  },
});

export default lightTheme;
