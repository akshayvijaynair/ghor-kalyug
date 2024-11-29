import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";

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
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      setError("Error logging in: " + error.message);
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h2 className="text-center">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="identifier">
          <Form.Label>Username or Email</Form.Label>
          <Form.Control
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
