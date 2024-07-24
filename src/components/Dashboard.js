import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentTable from "./StudentTable";
import CourseTable from "./CourseTable";
import "./css/Dash.css";

const Dashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(''); 
  const [selectedCourse, setSelectedCourse] = useState(''); 
  const [newStudent, setNewStudent] = useState({
    nombre_name: "",
    apellido: "",
    numero_documento: "",
    programa_id: "",
    photo_estudiante: "",
  });
  const [errors, setErrors] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {

    fetchData();
  }, []);
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentsResponse = await axios.get(
          "https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes"
        );
        const coursesResponse = await axios.get(
          "https://73b5-132-255-20-66.ngrok-free.app/api/materias"
        );
        const programsResponse = await axios.get(
          "https://73b5-132-255-20-66.ngrok-free.app/api/programas"
        );

        console.log("Students Response:", studentsResponse.data);
        console.log("Courses Response:", coursesResponse.data);
        console.log("Programs Response:", programsResponse.data);

        setStudents(studentsResponse.data.students);
        setCourses(coursesResponse.data.courses);
        setPrograms(programsResponse.data);

        // Log adicional para verificar el estado
        console.log("Programs State after setPrograms:", programsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

 

  const handleFaceRecognitionClick = () => {
    navigate("/face-recognition");
  };

  const handleEnrollClickOpen = () => {
    setOpenEnrollDialog(true);
  };

  const handleEnrollClose = () => {
    setOpenEnrollDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    stopCamera();
    setOpen(false);
  };

  const handleChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnrollChange = (e) => {
    if (e.target.name === "student") {
      setSelectedStudent(e.target.value);
    } else if (e.target.name === "course") {
      setSelectedCourse(e.target.value);
    }
  };

  const handleEnrollStudent = async () => {
    try {
      await axios.post("https://73b5-132-255-20-66.ngrok-free.app/api/inscripciones/admin-enroll", {
        estudiante_id: selectedStudent,
        materia_id: selectedCourse
      });
      setSnackbar({ open: true, message: 'Estudiante inscrito exitosamente', severity: 'success' });
      setOpenEnrollDialog(false);
    } catch (error) {
      console.error("Error enrolling student:", error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error al inscribir estudiante', severity: 'error' });
    }
  };

  const validateFields = () => {
    const {
      nombre_name,
      apellido,
      numero_documento,
      programa_id,
      photo_estudiante,
    } = newStudent;
    const errors = [];

    if (!nombre_name) errors.push("Nombre es requerido");
    if (!apellido) errors.push("Apellido es requerido");
    if (!numero_documento) errors.push("Número de Documento es requerido");
    if (!programa_id) errors.push("Programa es requerido");
    if (!photo_estudiante) errors.push("Foto es requerida");

    setErrors(errors);

    return errors.length === 0;
  };

  const handleAddStudent = async () => {
    if (!validateFields()) return;

    try {
      const formData = new FormData();
      formData.append("nombre_name", newStudent.nombre_name);
      formData.append("apellido", newStudent.apellido);
      formData.append("numero_documento", newStudent.numero_documento);
      formData.append("programa_id", newStudent.programa_id);
      if (newStudent.photo_estudiante) {
        formData.append("photo_estudiante", newStudent.photo_estudiante);
      }

      await axios.post("https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackbar({ open: true, message: 'Student registered successfully', severity: 'success' });
      fetchData(); 
      setOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
      setSnackbar({ open: true, message: error.response?.data?.error || 'Error registering student', severity: 'error' });
    }
  };

  const startCamera = () => {
    setCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const photo = canvasRef.current.toDataURL("image/png");
    setNewStudent({ ...newStudent, photo_estudiante: photo });
    setPhotoPreview(photo);
    stopCamera();
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewStudent({ ...newStudent, photo_estudiante: reader.result });
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <div className="Dashbody">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mb={2}
      >
        <Box>
          <Tooltip title="Face Recognition Module">
            <IconButton
              onClick={handleFaceRecognitionClick}
              color="primary"
              className="large-icon"
            >
              <FaceIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Student
        </Button>
        <Button variant="contained" color="primary" onClick={handleEnrollClickOpen}>
          Inscribir materias
        </Button>
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper>
            <StudentTable students={students} />
          </Paper>

          <Paper className="table-container">
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              className="table-title"
            ></Typography>
            <CourseTable courses={courses} />
          </Paper>
        </>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          {errors.length > 0 && (
            <Alert severity="error">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
          <DialogContentText>
            Please fill out the form to add a new student.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="nombre_name"
            label="Nombre"
            type="text"
            fullWidth
            value={newStudent.nombre_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="apellido"
            label="Apellido"
            type="text"
            fullWidth
            value={newStudent.apellido}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="numero_documento"
            label="Número Documento"
            type="text"
            fullWidth
            value={newStudent.numero_documento}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="programa_id-label">Programa</InputLabel>
            <Select
              labelId="programa_id-label"
              name="programa_id"
              value={newStudent.programa_id}
              onChange={handleChange}
            >
              {programs.length > 0 ? (
                programs.map((program) => (
                  <MenuItem key={program._id} value={program._id}>
                    {program.nombre_programa}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando programas...</MenuItem>
              )}
            </Select>
          </FormControl>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            {!cameraOpen ? (
              <>
                <Button variant="contained" color="primary" onClick={startCamera}>
                  Start Camera
                </Button>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-photo"
                  type="file"
                  onChange={handleUploadPhoto}
                />
                <label htmlFor="upload-photo">
                  <Button variant="contained" color="primary" component="span" startIcon={<UploadIcon />}>
                    Upload Photo
                  </Button>
                </label>
              </>
            ) : (
              <div>
                <video ref={videoRef} width="320" height="240" autoPlay />
                <canvas
                  ref={canvasRef}
                  width="320"
                  height="240"
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </Button>
              </div>
            )}
          </div>
          {photoPreview && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <img src={photoPreview} alt="Student" width="320" height="240" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddStudent} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEnrollDialog} onClose={handleEnrollClose}>
        <DialogTitle>Inscripción de materias</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecciona un estudiante y una materia para inscribir.
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel id="student-label">Estudiante</InputLabel>
            <Select
              labelId="student-label"
              name="student"
              value={selectedStudent}
              onChange={handleEnrollChange}
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.nombre_name} {student.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="course-label">Materia</InputLabel>
            <Select
              labelId="course-label"
              name="course"
              value={selectedCourse}
              onChange={handleEnrollChange}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEnrollClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEnrollStudent} color="primary">
            Inscribir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;