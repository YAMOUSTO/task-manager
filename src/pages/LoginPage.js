// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Button, CssBaseline, TextField, Box,
  Typography, Alert, CircularProgress, IconButton, InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from '../components/Logo'; // Import our new Logo component

// The image for the left side
import sideBgImage from '../assets/login0.jpg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    }
    setFormLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  if (authLoading || (!authLoading && isAuthenticated)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* --- LEFT SIDE: THE IMAGE PANEL (50% width) --- */}
      <Box 
        sx={{ 
          flex: '1 1 50%',
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${sideBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* --- RIGHT SIDE: THE NEW DARK MODE LOGIN FORM (50% width) --- */}
      <Box 
        sx={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: '#202124', // The dark background color
          color: 'white', // Set default text color to white for this Box
        }}
      >
        <Logo color="white" variant="h4" />
        
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '450px',
            mt: 3,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Sign in to Task Manager
          </Typography>
          
          {error && <Alert severity="error" sx={{ my: 2, width: '100%' }}>{error}</Alert>}
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="email" label="Your email address"
              name="email" autoComplete="email" autoFocus value={email}
              onChange={(e) => setEmail(e.target.value)} disabled={formLoading}
              // Dark mode styles for TextField
              sx={{
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                  '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'grey.700' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      '& input': { color: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'grey.500' }
              }}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Your password"
              type={showPassword ? 'text' : 'password'} id="password"
              autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} disabled={formLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'grey.500' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // Dark mode styles for TextField
              sx={{
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                  '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'grey.700' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      '& input': { color: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'grey.500' }
              }}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              startIcon={<PersonIcon />} // Use the imported icon here
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.2, // Padding top/bottom for height
                fontSize: '1rem', // Make font slightly larger
                bgcolor: '#0095f6', // A vibrant, modern blue
                '&:hover': { 
                  bgcolor: '#0077c2' // A slightly darker blue for the hover effect
                } 
              }} 
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Don't have an account?
              </Typography>
              <Button component={RouterLink} to="/register" variant="outlined" size="small">
                Sign up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;