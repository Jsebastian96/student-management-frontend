import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, Paper, Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';

const StudentProfile = ({ user }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEnroll, setOpenEnroll] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrollment, setEnrollment] = useState({ course: '', student: user?.estudiante_id || '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    if (user && user.estudiante_id) {
      fetchStudent();
    }
  }, [user]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes/${user.estudiante_id}`);
      console.log('Student Data:', response.data);
      setStudent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student:', error);
      setLoading(false);
    }
  };

  const handleOpenEnroll = async () => {
    setOpenEnroll(true);
    try {
      const response = await axios.get('https://73b5-132-255-20-66.ngrok-free.app/api/materias');
      console.log('Courses fetched:', response.data.courses); 
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
      const selectedCourse = courses.find(c => c._id === enrollment.course);
      if (selectedCourse && selectedCourse.cuposDisponibles > 0) {
        await axios.post('https://73b5-132-255-20-66.ngrok-free.app/api/inscripciones', {
          materia_id: enrollment.course,
          estudiante_id: user.estudiante_id
        });
        setSnackbar({ open: true, message: 'Enrolled successfully', severity: 'success' });
        setOpenEnroll(false);
        fetchStudent(); 
      } else {
        setSnackbar({ open: true, message: 'No hay cupos disponibles para este curso', severity: 'warning' });
      }
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedStudent = { ...student };
    if (newPhoto) {
      updatedStudent.photo_estudiante = newPhoto.split(',')[1]; 
    }
    try {
      await axios.put(`https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes/${user.estudiante_id}`, updatedStudent);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    }
  };

  if (!user || !user.estudiante_id) {
    return <Typography variant="h5" gutterBottom>No se pudo cargar el perfil del estudiante</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ bgcolor: '#fff', padding: 4, borderRadius: 2, mt: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">Perfil Estudiante</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1"><strong>Nombre:</strong> {student?.nombre_name}</Typography>
              <Typography variant="body1"><strong>Apellido:</strong> {student?.apellido}</Typography>
              <Typography variant="body1"><strong>Documento:</strong> {student?.numero_documento}</Typography>
            </Box>
            {student?.photo_estudiante && (
              <Box ml={2}>
                <img
                  src={`data:image/jpeg;base64,${student.photo_estudiante}`}
                  alt="Student"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </Box>
            )}
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleOpenEnroll} sx={{ bgcolor: '#335C67', '&:hover': { bgcolor: '#1e3a47' } }}>
              Inscribir Curso
            </Button>
            <Button variant="contained" color="secondary" onClick={handleOpenEdit} sx={{ bgcolor: '#9EDE73', '&:hover': { bgcolor: '#83c35e' } }}>
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
                  <MenuItem key={course._id} value={course._id} disabled={course.cuposDisponibles === 0}>
                    {course.nombre} {course.cuposDisponibles === 0 ? '(Sin cupos disponibles)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={!enrollment.course || courses.find(c => c._id === enrollment.course)?.cuposDisponibles === 0}>
              Inscribir
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnroll} color="primary">
            Cancelar
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
            <input
              accept="image/*"
              type="file"
              onChange={handlePhotoChange}
              style={{ marginTop: '16px' }}
            />
            {newPhoto && (
              <Box mt={2}>
                <img
                  src={newPhoto}
                  alt="New"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </Box>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Guardar
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentProfile;
