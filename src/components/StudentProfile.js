import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';

const StudentProfile = ({ user, onLogout }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/estudiantes/${user.estudiante_id}`);
        setStudent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [user.estudiante_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/estudiantes/${user.estudiante_id}`, student);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Student Profile</Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              name="nombre_name"
              value={student?.nombre_name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={student?.apellido || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Documento"
              name="numero_documento"
              value={student?.numero_documento || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default StudentProfile;
