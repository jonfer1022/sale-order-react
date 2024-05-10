import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Error } from '../utils/interfaces';
import axiosInstance from '../utils/fetcher';
import { useNavigate } from 'react-router-dom';

interface RegistrationFormProps {
  setError: (error: Error) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ setError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (email && password) {
        const response = await axiosInstance.post('auth/signup', {
          name,
          email,
          password,
        });
        localStorage.setItem('token', response.data.accessToken);
        navigate('/home');
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
        navigate('/');
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1>Register</h1>
      <Form className="w-25 mb-3 d-flex flex-column">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
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
          onClick={handleRegister}
        >
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrationForm;
