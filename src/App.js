import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';

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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const handleAuth = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!user ? (
        <Container sx={{ mt: 8 }}>
          <AuthForm onAuth={handleAuth} />
        </Container>
      ) : (
        <>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Student Management System
              </Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Navigate to={user.role === 'admin' ? '/dashboard' : '/profile'} />} />
              <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
              <Route path="/profile" element={<StudentProfile user={user} onLogout={handleLogout} />} />
              <Route path="/" element={<AuthForm onAuth={handleAuth} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </>
      )}
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
