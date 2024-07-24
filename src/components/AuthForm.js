import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Importar jwtDecode correctamente
import './css/AuthForm.css';

const AuthForm = ({ onAuth }) => {
  const [hash_usuario, setHashUsuario] = useState('');
  const [hash_password, setHashPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://student-management-backend-mauve.vercel.app//api/auth/login', { hash_usuario, hash_password });
      localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
      const decoded = jwtDecode(response.data.token); // Decodificar el token para obtener el rol del usuario
      onAuth(response.data.token); // Pasar el token a la función onAuth
      // Redirigir al usuario según su rol
      if (decoded.role === 'admin') {
        navigate('/dashboard');
      } else if (decoded.role === 'student') {
        navigate('/profile');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Credenciales incorrectas', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <div className="auth-body">
      <Paper elevation={3} className="auth-form-container">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
          <Typography variant="h4" align="center">Login</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Username"
              value={hash_usuario}
              onChange={(e) => setHashUsuario(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Password"
              type="password"
              value={hash_password}
              onChange={(e) => setHashPassword(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <FormControlLabel
            control={<Checkbox name="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AuthForm;
