import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  Grid,
  Link,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Google, Facebook, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const db = getFirestore();
      let email = identifier;

      if (!identifier.includes("@")) {
        const userDoc = await getDoc(doc(db, "users", identifier));
        if (!userDoc.exists()) {
          setError("No account found for this username.");
          return;
        }
        email = userDoc.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      setError(null);
      alert("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setError("Error logging in: " + error.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side - Login Form */}
      <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 8 } }}>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/placeholder.svg?height=40&width=40"
              alt="Logo"
              sx={{ width: 40, height: 40, mr: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Queezy
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            Login in to Queezy
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              Don't have account?{' '}
            </Typography>
            <Link href="#" underline="none" sx={{ color: 'primary.main' }}>
              Register
            </Link>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Social Login Buttons */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 2, py: 1.5, color: 'text.primary', borderColor: 'divider' }}
          >
            Login with Google
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<Facebook />}
            sx={{ mb: 3, py: 1.5, bgcolor: '#1877F2', '&:hover': { bgcolor: '#1864D9' } }}
          >
            Login with Facebook
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Your email address"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                bgcolor: '#7C5CFC',
                '&:hover': { bgcolor: '#6A4FD9' },
                mb: 2
              }}
            >
              Login
            </Button>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link href="#" underline="none" sx={{ color: 'primary.main' }}>
                Forgot password?
              </Link>
            </Box>

            <Typography variant="body2" color="text.secondary" align="center">
              By continuing, you agree to the{' '}
              <Link href="#" underline="none">Terms of Services</Link>
              {' & '}
              <Link href="#" underline="none">Privacy Policy</Link>.
            </Typography>
          </form>
        </Box>
      </Grid>

      {/* Right Side - Illustration */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: '#7C5CFC',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(124,92,252,0.8) 0%, #7C5CFC 100%)',
          }
        }}
      >
        <Box
          component="img"
          src="/placeholder.svg?height=400&width=400"
          alt="Quiz illustration"
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 'auto',
            position: 'relative',
            zIndex: 1
          }}
        />
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: 'white',
            mt: 4,
            position: 'relative',
            zIndex: 1,
            fontWeight: 'bold'
          }}
        >
          Find Quizzes to test out
          <br />
          your knowledge
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Login;

