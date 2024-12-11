import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#646cff',
    },
    secondary: {
      main: '#535bf2',
    },
    background: {
      default: '#242424',
      paper: '#1a1a1a',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          min-width: 320px;
          min-height: 100vh;
        }
        
        a {
          color: #646cff;
          text-decoration: none;
        }
        a:hover {
          color: #535bf2;
        }
        
        button {
          font-family: inherit;
        }
      `,
    },
  },
});

export default theme;

