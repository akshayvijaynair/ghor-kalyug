import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {Box, Typography, Alert, TextField, Button } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [/*error*/, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setError(null);
            alert("Login successful!");
            setTimeout(() => {
                navigate("/home");
            }, 5000); // Redirect after 5 seconds
            // @ts-ignore

            // setMessage(Welcome, ${user.email});
            console.log("Logged in user:", user);
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    return (
      
      <Box>
        <Typography variant="h4" textAlign="center" mb={2}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>

            <TextField
              fullWidth
              label="Username or Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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