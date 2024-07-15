import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';

const AuthForm = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/api/auth', { username, password });
    onAuth(response.data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">Iniciar Sesión</Button>
    </Box>
  );
};

export default AuthForm;
