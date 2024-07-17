import React, { useState } from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
  const [user, setUser] = useState(null);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
              </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
              <Routes>
                <Route path="/" element={<Navigate to={user.role === 'admin' ? '/dashboard' : '/profile'} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
              </Routes>
            </Container>
          </>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
