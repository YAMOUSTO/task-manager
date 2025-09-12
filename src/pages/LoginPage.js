// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link as MuiLink,
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// --- IMPORT BOTH IMAGES ---
import formBgImage from '../assets/istockphoto.jpg'; // For the form background
import sideBgImage from '../assets/login0.jpg';      // For the right side panel
// ---

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
    } catch (err)      
    {const errorMessage = err.response?.data?.msg || err.message || 'Failed to log in. Check credentials.';
      setError(errorMessage);
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
    // Main container for the two-column layout
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* --- LEFT SIDE: THE LOGIN FORM WITH ITS OWN BACKGROUND (50% width) --- */}
      <Box 
        sx={{
          flex: '1 1 50%',
          position: 'relative', // For the overlay pseudo-elements
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          overflow: 'hidden',
          '&::before': { // Pseudo-element for the form's background image
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${formBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px) brightness(0.7)', // Optional: blur and darken image
            zIndex: 1,
          },
        }}
      >
        {/* Form content needs to be on top of the background/overlay */}
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
            Log In
          </Typography>
          
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              InputLabelProps={{ sx: { color: 'grey.400' } }}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 1,
                input: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
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
              InputLabelProps={{ sx: { color: 'grey.400' } }}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 1,
                input: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={RouterLink} to="/register" variant="body2" sx={{ color: 'grey.300' }}>
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* --- RIGHT SIDE: THE OTHER BACKGROUND IMAGE (50% width) --- */}
      <Box 
        sx={{ 
          flex: '1 1 50%',
          display: { xs: 'none', md: 'block' }, // Hide on small screens
          backgroundImage: `url(${sideBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}

export default LoginPage;