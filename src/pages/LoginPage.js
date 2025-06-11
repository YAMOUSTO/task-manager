import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link as MuiLink 
} from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false); 
  const { login, isAuthenticated, loading: authLoading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    try {
      await login(email, password); 
      navigate('/dashboard', { replace: true });
    } catch (err) {

      const errorMessage = err.response?.data?.msg || err.message || 'Failed to log in. Check credentials.';
      setError(errorMessage);
      console.error("Login error:", err);
    }
    setFormLoading(false);
  };

  if (authLoading || (!authLoading && isAuthenticated)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#A0C878',
          boxShadow: '20',
          borderRadius: '20px'
        }}
      >
        <Typography component="h1" variant="h5" color='white'>
          Log In
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={formLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={formLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: 'white', backgroundColor: '#222831', fontStyle: 'italic' }}
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
          <Box textAlign="center" fontStyle={'italic'} >
            <MuiLink component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;