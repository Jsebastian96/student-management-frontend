import React, { useEffect, useState, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const fetchStudents = useCallback(async () => {
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
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = students.filter(student =>
        `${student.nombre_name} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === 'name') {
      filtered.sort((a, b) => a.nombre_name.localeCompare(b.nombre_name));
    } else if (sortOrder === 'date') {
      filtered.sort((a, b) => new Date(a.fecha_inscripcion) - new Date(b.fecha_inscripcion));
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, sortOrder]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ bgcolor: '#45BF55', padding: 2, color: '#ffffff' }}>
        Student Table
      </Typography>
      <Box display="flex" justifyContent="space-between" p={2}>
        <TextField
          label="Buscar por nombre o apellido"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '60%' }}
        />
        <FormControl variant="outlined" sx={{ width: '35%' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            label="Ordenar por"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="name">Nombre</MenuItem>
            <MenuItem value="date">Fecha de inscripción</MenuItem>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id} sx={{ borderBottom: '2px solid #2E9CCA' }}>
                    <TableCell>{student.nombre_name}</TableCell>
                    <TableCell>{student.apellido}</TableCell>
                    <TableCell>{student.numero_documento}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPhoto(student._id)} disabled={photoLoading}>
                        <PhotoIcon />
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
