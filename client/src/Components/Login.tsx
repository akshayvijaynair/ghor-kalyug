import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  
} from "@mui/material";
import { Visibility, VisibilityOff, Mail, Lock } from "@mui/icons-material";


const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      const user = userCredential.user;
  
      setError(null); 
      // Get the ID token
      const idToken = await user.getIdToken();
  
      // Store the token in localStorage
      localStorage.setItem('idToken', idToken);
      console.log("User logged in:", user);
      console.log("ID Token:", idToken);
  
      // Now navigate to home
      navigate("/home");
  
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setError("Error logging in: " + error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh',  width: '100vw' }}>
      {/* Left Side - Login Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 4, md: 8 },
        bgcolor: '#FFFFFF'
      }}>
        <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
            <Box
              component="img"
              src="/icon.png"
              alt="Logo"
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="h5" sx={{ color: '#1A1A1A', fontWeight: 600 }}>
              Ghor Kalyug
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: '#1A1A1A' }}>
            Login to your account
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" component="span">
              Don't have account?{' '}
            </Typography>
            <Link component={RouterLink} to="/register" sx={{ color: 'primary.main', fontWeight: 500 }}>
              Register
            </Link>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}


          <form onSubmit={handleLogin}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#4B5563' }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Your email address"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F9FAFB',
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E5E7EB',
                  },
                }
              }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#4B5563' }}>
              Password
            </Typography>

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff sx={{ color: '#9CA3AF' }} /> : <Visibility sx={{ color: '#9CA3AF' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F9FAFB',
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E5E7EB',
                  },
                }
              }}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                mb: 3,
                bgcolor: 'primary.main',
                fontWeight: 500,
              }}
            >
              Login
            </Button>
          </form>

         
        </Box>
      </Box>

      {/* Right Side - Illustration */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'primary.main',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(124,92,252,0.2) 0%, #7C5CFC 100%)',
            opacity: 0.9,
          }
        }}
      >
        <Box
          component="img"
          src="/Col.png"
          alt="Quiz illustration"
          sx={{
            width: '100%',
            maxWidth: 480,
            height: 'auto',
            position: 'relative',
            zIndex: 1,
            mb: 4
          }}
        />
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: 'white',
            fontWeight: 600,
            position: 'relative',
            zIndex: 1,
            maxWidth: 480,
            px: 4
          }}
        >
          Find Quizzes to test out
          <br />
          your knowledge
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

