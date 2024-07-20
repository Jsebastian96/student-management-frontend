import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, Button, TextField } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const StudentProfile = ({ user, onLogout }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrollment, setEnrollment] = useState({ course: '', student: user.estudiante_id });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/estudiantes/${user.estudiante_id}`);
        console.log('Student Data:', response.data); // Verificar los datos obtenidos
        setStudent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [user.estudiante_id]);

  const handleOpenEnroll = async () => {
    setOpenEnroll(true);
    try {
      const response = await axios.get('/api/materias');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCloseEnroll = () => {
    setOpenEnroll(false);
  };

  const handleEnrollChange = (e) => {
    const { name, value } = e.target;
    setEnrollment((prevEnrollment) => ({
      ...prevEnrollment,
      [name]: value,
    }));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inscripciones', enrollment);
      setSnackbar({ open: true, message: 'Enrolled successfully', severity: 'success' });
      setOpenEnroll(false);
    } catch (error) {
      console.error('Error enrolling:', error);
      setSnackbar({ open: true, message: 'Error enrolling', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/estudiantes/${user.estudiante_id}`, student);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Perfil Estudiante</Typography>
          <Typography variant="body1"><strong>Nombre:</strong> {student?.nombre_name}</Typography>
          <Typography variant="body1"><strong>Apellido:</strong> {student?.apellido}</Typography>
          <Typography variant="body1"><strong>Documento:</strong> {student?.numero_documento}</Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleOpenEnroll}>
              Inscribir Curso
            </Button>
            <Button variant="contained" color="secondary" onClick={handleOpenEdit}>
              Editar Perfil
            </Button>
          </Box>
        </Paper>
      )}
      <Dialog open={openEnroll} onClose={handleCloseEnroll}>
        <DialogTitle>Inscribir Curso</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEnrollSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="course-label">Curso</InputLabel>
              <Select
                labelId="course-label"
                name="course"
                value={enrollment.course}
                onChange={handleEnrollChange}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Inscribir
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnroll} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Nombre"
              name="nombre_name"
              value={student?.nombre_name || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={student?.apellido || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Documento"
              name="numero_documento"
              value={student?.numero_documento || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentProfile;
