import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; 
import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { TaskProvider } from './context/TaskContext'; 
//import {createTheme} from '@mui/material/styles';
import ProfilePage from './pages/ProfilePage';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057', },
    background: { 
      default: '#f4f6f8', 
      paper: '#ffffff',
    },
    dark: {
      background: '#202124', // Main dark background color
      paper: '#2d2e30',
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#FCB53B',
      }
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TaskProvider> 
                <DashboardPage />
              </TaskProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;