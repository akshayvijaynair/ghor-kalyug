import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Ghor Kalyug</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <Container className="text-center" style={{ marginTop: "20px" }}>
              <h1>Welcome to Ghor Kalyug</h1>
              <p>Home of all things related to Ghor Kalyug.</p>
              <div>
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <div className="card">
                <Button variant="primary" onClick={() => setCount((count) => count + 1)}>
                  Count is {count}
                </Button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
            </Container>
          }
        />
        {/* Login and Register Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
