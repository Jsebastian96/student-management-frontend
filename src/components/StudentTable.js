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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PhotoIcon from '@mui/icons-material/Photo';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/estudiantes`, {
        params: { page: page + 1, limit: rowsPerPage }
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

  const handleViewPhoto = (photoBase64) => {
    setSelectedPhoto(photoBase64);
  };

  const handleClosePhotoDialog = () => {
    setSelectedPhoto(null);
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
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Foto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} sx={{ borderBottom: '2px solid #2E9CCA' }}>
                    <TableCell>{student._id}</TableCell>
                    <TableCell>{student.nombre_name}</TableCell>
                    <TableCell>{student.apellido}</TableCell>
                    <TableCell>{student.numero_documento}</TableCell>
                    <TableCell>
                      {student.photo_estudiante ? (
                        <IconButton onClick={() => handleViewPhoto(student.photo_estudiante)}>
                          <PhotoIcon />
                        </IconButton>
                      ) : (
                        'Sin Foto'
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
      <Dialog open={!!selectedPhoto} onClose={handleClosePhotoDialog}>
        <DialogTitle>Foto del Estudiante</DialogTitle>
        <DialogContent>
          {selectedPhoto && <img src={`data:image/jpeg;base64,${selectedPhoto}`} alt="Foto del Estudiante" style={{ maxWidth: '100%' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhotoDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentTable;
