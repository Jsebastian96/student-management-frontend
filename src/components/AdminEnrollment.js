import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AdminEnrollment = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const studentsResponse = await axios.get('http://localhost:3000/api/estudiantes');
        const coursesResponse = await axios.get('http://localhost:3000/api/materias');
        setStudents(studentsResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStudentsAndCourses();
  }, []);

  const handleEnroll = async () => {
    try {
      await axios.post('http://localhost:3000/api/inscripciones/admin-enroll', {
        estudiante_id: selectedStudent,
        materia_id: selectedCourse
      });
      setMessage('Estudiante inscrito exitosamente');
    } catch (error) {
      setMessage('Error al inscribir estudiante');
      console.error('Error enrolling student:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Inscribir Estudiante en Materia</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Estudiante</InputLabel>
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {students.map(student => (
            <MenuItem key={student._id} value={student._id}>
              {student.nombre_name} {student.apellido}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Materia</InputLabel>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map(course => (
            <MenuItem key={course._id} value={course._id}>
              {course.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleEnroll}>Inscribir</Button>
      {message && <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>}
    </Container>
  );
};

export default AdminEnrollment;

