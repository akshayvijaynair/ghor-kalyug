import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom'; 
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
import { Mail, Lock, Person, ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";

const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username.trim(),
        email: email.trim(),
      });
      const idToken = await user.getIdToken();
  
      // Store the token in localStorage
      localStorage.setItem('idToken', idToken);
      console.log("User logged in:", user);
      console.log("ID Token:", idToken);
      setMessage("User successfully registered!");
      setOpenSuccessPopup(true);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Error: Please enter a valid email address.");
      return;
    }

    if (step === 3 && password.length < 8) {
      setMessage("Error: Password must be at least 8 characters long.");
      return;
    }

    setMessage(null); // Clear previous messages
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCloseSuccessPopup = () => {
    setOpenSuccessPopup(false);
    navigate("/home");
  };

  useEffect(() => {
    setMessage(null); // Clear messages on step change
  }, [step]);

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              What's your email
            </Typography>
            <TextField
              fullWidth
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" onClick={handleNext} fullWidth>
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
            <TextField
              fullWidth
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack />} fullWidth>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext} fullWidth>
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
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack />} fullWidth>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleRegister}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? "Registering..." : "Sign Up"}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, p: 4, bgcolor: "#FFFFFF" }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }}>
          Ghor Kalyug
        </Typography>
        {message && (
          <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
        <LinearProgress
          variant="determinate"
          value={(step / 3) * 100}
          sx={{ mb: 40, height: 6, borderRadius: 3 }}
        />
        {getStepContent()}
      </Box>
      <Box
        sx={{
          flex: 1,
          bgcolor: "primary.main",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          Create gamified quizzes <br /> easily!
        </Typography>
      </Box>
      <Dialog open={openSuccessPopup} onClose={handleCloseSuccessPopup}>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
