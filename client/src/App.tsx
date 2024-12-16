import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Home from './Pages/Home';
import Register from './Components/Register';
import theme from './theme';
import Auth from "./Pages/Auth";
import Quiz from "./Pages/Quiz";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minWidth: '100vw',  display: 'flex', 
          flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/:id" element={<Quiz />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

