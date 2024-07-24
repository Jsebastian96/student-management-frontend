import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const StudentForm = ({ studentId, onSubmit }) => {
  const [student, setStudent] = useState({
    nombre_name: "",
    apellido: "",
    numero_documento: "",
    programa_id: "",
    photo_estudiante: null,
  });
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await axios.get("https://73b5-132-255-20-66.ngrok-free.app/api/programas");
      setPrograms(response.data);
    };
    fetchPrograms();

    if (studentId) {
      const fetchStudent = async () => {
        const response = await axios.get(
          `https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes/${studentId}`
        );
        setStudent(response.data);
      };
      fetchStudent();
    }
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleFileChange = (e) => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      photo_estudiante: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in student) {
      formData.append(key, student[key]);
    }

    if (studentId) {
      await axios.put(
        `https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes/${studentId}`,
        formData
      );
    } else {
      await axios.post("https://73b5-132-255-20-66.ngrok-free.app/api/estudiantes", formData);
    }

    if (onSubmit) onSubmit();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Nombre"
        name="nombre_name"
        value={student.nombre_name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellido"
        name="apellido"
        value={student.apellido}
        onChange={handleChange}
        required
      />
      <TextField
        label="Número de Documento"
        name="numero_documento"
        value={student.numero_documento}
        onChange={handleChange}
        required
      />
      <FormControl required>
        <InputLabel>Programa</InputLabel>
        <Select
          name="programa_id"
          value={student.programa_id}
          onChange={handleChange}
        >
          {programs.map((program) => (
            <MenuItem key={program._id} value={program._id}>
              {program.nombre_programa}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" component="label">
        Subir Fotografía
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </Box>
  );
};

export default StudentForm;
