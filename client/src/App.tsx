import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Header from './Components/Header';
import Home from './Pages/Home';
import theme from './theme';
import Login from "./Components/Login";
import Register from "./Components/Register";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100%',
            overflow: 'hidden',
            bgcolor: '#FFFFFF'
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Routes>
                <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

