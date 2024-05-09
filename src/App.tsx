import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LandPage from './view/LandPage';
import { Alert, Nav, Navbar } from 'react-bootstrap';
import { Error } from './utils/types';
import axiosInstance from './utils/fetcher';
import RegistrationForm from './view/Register';
import Home from './view/Home';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if(error){
      setTimeout(() => {
        setError(null);
      }, 3000)
    }
    if(error?.status === 403){
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  },[error])
  
  const handleSingout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setIsLoggedIn(false);
    } catch (error: any) {
      if(error?.response?.status === 403) {
        setError({ message: error.response.data.message, status: 403 });
      } else setError({ message: 'Something went wrong', status: 500 });
    }
    localStorage.removeItem('token');
  }

  return (
    <Router>
      {error && <Alert className='position-fixed top-0 end-0 m-3 z-1' variant="danger" onClose={() => {
        setError(null); 
      }} dismissible>{error.message}</Alert>}
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="ms-3">Sale System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? <Link to="/home" className="nav-link">Home</Link> : null}
            {!isLoggedIn ? <Link to="/" className="nav-link">Login</Link> : null}
            {!isLoggedIn ? <Link to="/register" className="nav-link">Register</Link> : null}
          </Nav>
          <Nav>
            {isLoggedIn ? <Nav.Link href="/" onClick={() => handleSingout()}>Logout</Nav.Link> : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<LandPage setIsLoggedIn={setIsLoggedIn} setError={setError}/>} />
        <Route path='/register' element={<RegistrationForm setIsLoggedIn={setIsLoggedIn} setError={setError}/>} />
        <Route path="/home" element={isLoggedIn ? <Home setError={setError}/> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;