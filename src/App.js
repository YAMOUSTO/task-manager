// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Your updated AuthContext
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // We'll update this later
import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { TaskProvider } from './context/TaskContext'; // We'll update this next
import ProfilePage from './pages/ProfilePage';

const theme = createTheme({
  // Your MUI theme (palette, typography, etc.)
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
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

// Extracted Routes to easily access AuthContext's loading state
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
              <TaskProvider> {/* TaskProvider will also be updated */}
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
        {/* Redirect root based on auth status */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all */}
      </Routes>
    </Router>
  );
}


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Use isAuthenticated from context

  if (loading) {
    // This check might be redundant if AppRoutes already handles global loading
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