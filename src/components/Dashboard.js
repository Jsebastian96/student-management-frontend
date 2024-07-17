import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Box, IconButton, Tooltip } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentTable from './StudentTable';
import CourseTable from './CourseTable';
import './css/Dash.css';

const Dashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleFaceRecognitionClick = () => {
    navigate('/face-recognition');
  };

  return (
    <div className="Dashbody">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} mb={2}>
       
        <Box>
          <Tooltip title="Face Recognition Module">
            <IconButton onClick={handleFaceRecognitionClick} color="primary" className="large-icon">
              <FaceIcon />
            </IconButton>
          </Tooltip>
        </Box>
    
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper>
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
