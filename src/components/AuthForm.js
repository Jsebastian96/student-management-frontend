import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import './css/AuthForm.css';

const AuthForm = ({ onAuth }) => {
  const [hash_usuario, setHashUsuario] = useState('');
  const [hash_password, setHashPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { hash_usuario, hash_password });
      onAuth(response.data.user);
    } catch (error) {
      alert('Credenciales incorrectas');
    }
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
    </div>
  );
};

export default AuthForm;
