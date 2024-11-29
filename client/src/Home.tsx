import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container className="text-center">
      <h1>Project Name</h1>
      <div className="mt-4">
        <Link to="/login">
          <Button variant="primary" size="lg" className="mx-2">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary" size="lg" className="mx-2">Register</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Home;
