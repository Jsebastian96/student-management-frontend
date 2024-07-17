import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import StudentTable from './StudentTable';
import CourseTable from './CourseTable';


const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentsResponse = await axios.get('/api/estudiantes');
        const coursesResponse = await axios.get('/api/materias');
        setStudents(studentsResponse.data.students);
        setCourses(coursesResponse.data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=".Dashbody">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper >
            <StudentTable students={students} />
          </Paper>

          <Paper className="table-container">
            <Typography variant="h4" gutterBottom align="center" className="table-title"></Typography>
            <CourseTable courses={courses} />
          </Paper>
        </>
      )}
    </div>
  );
};

export default Dashboard;
