import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuizGenerator from "./components/QuizGen";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import { Home as HomeIcon, Quiz as QuizIcon } from "@mui/icons-material";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e", // Deep indigo
    },
    secondary: {
      main: "#ff6f00", // Amber
    },
    background: {
      default: "#f5f5f5", // Light grey background
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
          {/* Header */}
          <AppBar position="static" elevation={0}>
            <Toolbar sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, fontSize: "1.5rem" }}>
                Ghor Kalyug
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                sx={{ mx: 1, fontSize: "1rem" }}
              >
                HOME
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/quiz-generator"
                startIcon={<QuizIcon />}
                sx={{ mx: 1, fontSize: "1rem" }}
              >
                QUIZ GENERATOR
              </Button>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "background.default",
            }}
          >
            <Container maxWidth="md" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz-generator" element={<QuizGenerator />} />
              </Routes>
            </Container>
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 2,
              width: "100%",
              bgcolor: "primary.main",
              color: "white",
              mt: "auto",
              textAlign: "center",
            }}
          >
            <Typography variant="body2">
              © {new Date().getFullYear()} Ghor Kalyug. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        p: 4,
        bgcolor: "white",
        boxShadow: 1,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Ghor Kalyug
      </Typography>
      <Typography variant="body1" paragraph>
        Explore the power of AI-driven applications. Use the navigation above to discover our
        features.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/quiz-generator"
        startIcon={<QuizIcon />}
        size="large"
        sx={{ mt: 2 }}
      >
        Try Quiz Generator
      </Button>
    </Box>
  );
}

export default App;
