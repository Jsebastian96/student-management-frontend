import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/estudiantes', {
        params: { pageNumber: page + 1, pageSize: rowsPerPage }
      });
      const { students = [], totalStudents = 0 } = response.data;
      setStudents(students);
      setTotalStudents(totalStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenPhoto = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/estudiantes/${studentId}`);
      setSelectedPhoto(response.data.photo_estudiante);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching student photo:', error);
    }
  };

  const handleClosePhoto = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ bgcolor: '#45BF55', padding: 2, color: '#ffffff' }}>
        Student Table
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Foto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} sx={{ borderBottom: '2px solid #2E9CCA' }}>
                    <TableCell>{student.nombre_name}</TableCell>
                    <TableCell>{student.apellido}</TableCell>
                    <TableCell>{student.numero_documento}</TableCell>
                    <TableCell>
                      {student.photo_estudiante ? (
                        <IconButton onClick={() => handleOpenPhoto(student._id)}>
                          <PhotoIcon />
                        </IconButton>
                      ) : (
                        'No Photo'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalStudents}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ bgcolor: '#2E9CCA', color: '#ffffff' }}
          />
        </>
      )}
      <Dialog open={open} onClose={handleClosePhoto}>
        <DialogTitle>Student Photo</DialogTitle>
        <DialogContent>
          {selectedPhoto ? (
            <img src={`data:image/jpeg;base64,${selectedPhoto}`} alt="Student" style={{ width: '100%' }} />
          ) : (
            'No Photo Available'
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default StudentTable;
