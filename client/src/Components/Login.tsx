import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {Box, Typography, Alert, TextField, Button } from "@mui/material";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      }, 5000); // Redirect after 5 seconds
      // @ts-ignore
    } catch (error: never) {
      console.error("Error logging in:", error.message);
      setError("Error logging in: " + error.message);
    }
  };

  return (
      <Box>
        <Typography variant="h4" textAlign="center" mb={2}>
          Login
        </Typography>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
              fullWidth
              label="Username or Email"
              variant="outlined"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              sx={{ mb: 2 }}
          />
          <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
          />
          <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
  );
};

export default Login;
