import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const StudentProfile = ({ user }) => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    const formData = new FormData();
    formData.append('photo_estudiante', photo);

    try {
      const response = await axios.post(`/api/estudiantes/${user._id}`, formData);
      if (response.ok) {
        alert('Foto actualizada exitosamente');
      } else {
        alert('Error al actualizar la foto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Perfil de Estudiante</Typography>
        <Typography variant="h6">Nombre: {user.nombre_name}</Typography>
        <Typography variant="h6">Apellido: {user.apellido}</Typography>
        <Typography variant="h6">Documento: {user.numero_documento}</Typography>
        <Box mt={2}>
          <input type="file" onChange={handlePhotoChange} />
          <Button variant="contained" color="primary" onClick={handlePhotoUpload}>
            Subir Foto
          </Button>
        </Box>
        {user.photo_estudiante && (
          <Box mt={2}>
            <img src={`/${user.photo_estudiante}`} alt="Estudiante" style={{ width: '100px' }} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default StudentProfile;
