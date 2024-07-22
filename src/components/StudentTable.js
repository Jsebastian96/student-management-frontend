import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import DeleteIcon from '@mui/icons-material/Delete';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/estudiantes', {
        params: { pageNumber: page + 1, pageSize: rowsPerPage, searchQuery, sortOption }
      });
      const { students = [], totalStudents = 0 } = response.data;
      setStudents(students);
      setTotalStudents(totalStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, sortOption]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const fetchStudentPhoto = async (studentId) => {
    setPhotoLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/estudiantes/${studentId}/photo`);
      setSelectedPhoto(response.data.photo_estudiante);
      setOpen(true);
      setPhotoLoading(false);
    } catch (error) {
      console.error('Error fetching student photo:', error);
      setPhotoLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenPhoto = (studentId) => {
    fetchStudentPhoto(studentId);
  };

  const handleClosePhoto = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/estudiantes/${studentId}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ bgcolor: '#45BF55', padding: 2, color: '#ffffff' }}>
        Student Table
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
        <TextField
          label="Buscar por nombre o apellido"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '70%' }}
        />
        <FormControl variant="outlined" sx={{ width: '25%' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Ordenar por"
          >
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            <MenuItem value="nombre_name">Nombre</MenuItem>
            <MenuItem value="apellido">Apellido</MenuItem>
            <MenuItem value="fecha_inscripcion">Fecha de Inscripción</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} sx={{ borderBottom: '2px solid #2E9CCA' }}>
                    <TableCell>{student.nombre_name}</TableCell>
                    <TableCell>{student.apellido}</TableCell>
                    <TableCell>{student.numero_documento}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPhoto(student._id)} disabled={photoLoading}>
                        <PhotoIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteStudent(student._id)}>
                        <DeleteIcon />
                      </IconButton>
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
          {photoLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : selectedPhoto ? (
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
