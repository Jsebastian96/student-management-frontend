import React from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import StudentTable from './components/StudentTable';
import CourseTable from './components/CourseTable';

const theme = createTheme({
  palette: {
    primary: {
      main: '#335C67',
    },
    secondary: {
      main: '#9EDE73',
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Management System
          </Typography>
          <Button color="secondary" variant="contained">Crear Nuevo</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <StudentTable />
        <Box mt={4}>
          <CourseTable />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
