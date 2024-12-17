import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h4: {
      fontSize: '1.875rem',
      lineHeight: 1.375,
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      lineHeight: 1.375,
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#7C5CFC',
      dark: '#6A4FD9',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F9FAFB',
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#E5E7EB',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C5CFC',
            },
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;

