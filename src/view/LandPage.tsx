import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axiosInstance from '../utils/fetcher';
import { Error } from '../utils/interfaces';

interface LandPageProps {
  setError: (error: Error) => void;
  setToken: (token: string) => void;
}

const LandPage: React.FC<LandPageProps> = ({ setError, setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (email && password) {
        const response = await axiosInstance.post('auth/signin', {
          email,
          password,
        });
        navigate('/home');
        localStorage.setItem('token', response.data.accessToken);
        setToken(response.data.accessToken);
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-3">Login</h1>
      <Form className="w-25 mb-3 d-flex flex-column">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          disabled={!email || !password}
          variant="primary"
          type="button"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Form>
      <span>
        Don't have an account? <a href="/register">Register</a>
      </span>
    </Container>
  );
};

export default LandPage;
