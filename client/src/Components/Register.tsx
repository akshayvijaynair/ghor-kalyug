import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  InputAdornment,
  IconButton,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";



const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      setMessage("User successfully registered!");
      setOpenSuccessPopup(true);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };


  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCloseSuccessPopup = () => {
    setOpenSuccessPopup(false);
    navigate("/home");
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              What's your email
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Fill in all the data and proceed to the next step
            </Typography>
            <TextField
              fullWidth
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Next Step
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Create a username
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Fill in all the data and proceed to the next step
            </Typography>
            <TextField
              fullWidth
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.5,
                  flex: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': { borderColor: 'primary.dark', color: 'primary.dark' },
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  py: 1.5,
                  flex: 1,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Next Step
              </Button>
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              What's your password?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Fill in all the data and proceed to the next step
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
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ color: 'text.secondary' }} />
                      ) : (
                        <Visibility sx={{ color: 'text.secondary' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
              Must be at least 8 characters.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.5,
                  flex: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': { borderColor: 'primary.dark', color: 'primary.dark' },
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                sx={{
                  py: 1.5,
                  flex: 1,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left Side - Registration Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 4, md: 8 },
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 8 }}>
          <Box
            component="img"
            src="/icon.png"
            alt="Logo"
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Ghor Kalyug
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 6, width: '100%', maxWidth: 440 }}>
          <LinearProgress
            variant="determinate"
            value={(step / 3) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', textAlign: 'right' }}
          >
            {step} of 3
          </Typography>
        </Box>

        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        <Box sx={{ maxWidth: 440 }}>
          {getStepContent()}
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
          Create gamified quizzes
          <br />
          becomes simple
        </Typography>
      </Box>

      {/* Success Popup */}
      <Dialog
        open={openSuccessPopup}
        onClose={handleCloseSuccessPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Registration Successful!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your account has been successfully created. You will now be redirected to the home page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessPopup} autoFocus>
            Go to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default Register;

