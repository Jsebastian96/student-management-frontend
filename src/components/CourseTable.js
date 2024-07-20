import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';


const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/materias`, {
          params: { pageNumber: pageNumber + 1, pageSize: pageSize }
        });
        setCourses(response.data.courses);
        setTotalCourses(response.data.totalCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [pageNumber, pageSize]);

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleOpenDialog = (students) => {
    console.log(students);
    setSelectedStudents(students);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ bgcolor: '#45BF55', padding: 2, color: '#ffffff' }}>
        Courses Table
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ bgcolor: '#83D9C8' }}>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Remaining Seats</TableCell>
                  <TableCell>Enrollments</TableCell>
                  <TableCell>Student IDs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id} sx={{ borderBottom: '2px solid #2E9CCA' }}>
                    <TableCell>{course.nombre}</TableCell>
                    <TableCell>{20 - course.enrollmentsCount}</TableCell>
                    <TableCell>{course.enrollmentsCount}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleOpenDialog(course.enrollmentsInfo)}>
                        View Students
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalCourses}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{ bgcolor: '#2E9CCA', color: '#ffffff' }}
          />
        </>
      )}
     <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Lista Estudiantes</DialogTitle>
        <DialogContent>
          <List>
            {selectedStudents.map((student, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. Nombre: ${student.nombre} - Apellido: ${student.apellido}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default CourseTable;
