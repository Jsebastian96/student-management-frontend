import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import axios from 'axios';

const EnrollmentForm = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/programas/${user.programa_id}/materias`);
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [user.programa_id]);

  const handleEnrollment = async () => {
    try {
      await axios.post('/api/inscripciones', { materia_id: selectedCourse, estudiante_id: user._id });
      alert('Inscripción exitosa');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error al inscribirse en la materia');
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Inscripción de Materias</Typography>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          displayEmpty
          fullWidth
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Selecciona una Materia
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.nombre}
            </MenuItem>
          ))}
        </Select>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleEnrollment}>
            Inscribirse
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EnrollmentForm;
