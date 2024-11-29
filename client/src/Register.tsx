import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";

const auth = getAuth(app);
const db = getFirestore(app);

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store username and email in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      setMessage("User successfully registered!");
      setTimeout(() => {
        navigate("/login"); // Redirect to the login page after 5 seconds
      }, 5000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="text-center">Register</h2>
      {message && <Alert variant={message.includes("Error") ? "danger" : "success"}>{message}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
