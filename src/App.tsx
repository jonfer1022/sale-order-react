import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import LandPage from './view/LandPage';
import { Alert, Nav, Navbar } from 'react-bootstrap';
import { Error } from './utils/interfaces';
import axiosInstance from './utils/fetcher';
import RegistrationForm from './view/Register';
import Home from './view/Home';
import NewOrder from './view/NewOrder';

const App: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
    if (error?.status === 403) {
      localStorage.removeItem('token');
      setToken(null);
    }
  }, [error]);

  const handleSignout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
      setToken(null);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
  };

  return (
    <Router>
      {error && (
        <Alert
          className="position-fixed top-0 end-0 m-3 z-1"
          variant="danger"
          onClose={() => {
            setError(null);
          }}
          dismissible
        >
          {error.message}
        </Alert>
      )}
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="ms-3">Sale System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token ? (
              <Link to="/home" className="nav-link">
                Home
              </Link>
            ) : null}
            {!token ? (
              <Link to="/" className="nav-link">
                Login
              </Link>
            ) : null}
            {!token ? (
              <Link to="/register" className="nav-link">
                Register
              </Link>
            ) : null}
            {token ? (
              <Link to="/new-order" className="nav-link">
                New Order
              </Link>
            ) : null}
          </Nav>
          <Nav>
            {token ? (
              <Nav.Link onClick={() => handleSignout()}>Logout</Nav.Link>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/home" />
            ) : (
              <LandPage setToken={setToken} setError={setError} />
            )
          }
        />
        <Route
          path="/register"
          element={<RegistrationForm setError={setError} />}
        />
        <Route
          path="/home"
          element={token ? <Home setError={setError} /> : <Navigate to="/" />}
        />
        <Route
          path="/new-order"
          element={
            token ? <NewOrder setError={setError} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
