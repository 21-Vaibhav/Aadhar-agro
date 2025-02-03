import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: '0.00938em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02857em',
      fontFamily: '"Montserrat", sans-serif',
    },
  },
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: '1em',
        },
      },
    },
  },
});

export default theme;
