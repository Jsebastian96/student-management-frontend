import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import FaceRecognition from './components/FaceRecognition';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#335C67',
    },
    secondary: {
      main: '#9EDE73',
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
  },
});

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleAuth = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded);  // Verificar el contenido del token decodificado
      localStorage.setItem('token', token);
      setUser(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT on reload:', decoded);  // Verificar el contenido del token decodificado
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding JWT on reload:', error);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Management System
          </Typography>
          {user && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/dashboard' : '/profile') : '/login'} />} />
          <Route path="/login" element={<AuthForm onAuth={handleAuth} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><StudentProfile user={user} /></ProtectedRoute>} />
          <Route path="/face-recognition" element={<ProtectedRoute><FaceRecognition /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
  