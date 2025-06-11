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

function RegisterPage() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false); 
  const { signup, isAuthenticated, loading: authLoading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) { 
        return setError('Password must be at least 6 characters');
    }
    setError('');
    setFormLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to create an account.';
      setError(errorMessage);
      console.error("Signup error:", err);
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
    <Container component="main" maxWidth="xs" >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#9FC87E',
          borderRadius: '20px',
          color: 'white'
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" 
        onSubmit={handleSubmit} 
        noValidate 
        sx={{ 
          mt: 1, 
          fontStyle: 'italic', 
          fontFamily: 'bold'
       }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={formLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={formLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password (min. 6 characters)"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={formLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={formLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, mb: 2, 
              backgroundColor: '#222831', 
              fontStyle: 'italic' 
            }}
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Box textAlign="center" color={'white'}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              {'Already have an account? Log In'}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;