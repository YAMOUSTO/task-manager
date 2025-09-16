// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Button, CssBaseline, TextField, Box,
  Typography, Alert, CircularProgress, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Logo from '../components/Logo'; // Import our Logo component

// The image for the right side
import sideBgImage from '../assets/register.jpg';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setFormLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'Failed to create an account.';
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
      
      {/* --- LEFT SIDE: THE NEW DARK MODE SIGN UP FORM (50% width) --- */}
      <Box 
        sx={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: '#202124', // The dark background color
          color: 'white',
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
            Create your Account
          </Typography>
          
          {error && <Alert severity="error" sx={{ my: 2, width: '100%' }}>{error}</Alert>}
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="name" label="Your full name"
              name="name" autoComplete="name" autoFocus value={name}
              onChange={(e) => setName(e.target.value)} disabled={formLoading}
              sx={{
                  '& label.Mui-focused': { color: 'white' },
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
              margin="normal" required fullWidth id="email" label="Your email address"
              name="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} disabled={formLoading}
              sx={{
                  '& label.Mui-focused': { color: 'white' },
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
              margin="normal" required fullWidth name="password" label="Create a password"
              type={showPassword ? 'text' : 'password'} id="password"
              autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)} disabled={formLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}
                      edge="end" sx={{ color: 'grey.500' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                  '& label.Mui-focused': { color: 'white' },
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
              margin="normal" required fullWidth name="confirmPassword" label="Confirm your password"
              type="password" id="confirmPassword"
              autoComplete="new-password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} disabled={formLoading}
               sx={{
                  '& label.Mui-focused': { color: 'white' },
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
          startIcon={<PersonAddIcon />}
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.2,
            fontSize: '1rem',
            bgcolor: '#0095f6', 
            '&:hover': { 
              bgcolor: '#0077c2'
            } 
          }} 
          disabled={formLoading}
        >
          {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Already have an account?
              </Typography>
              <Button component={RouterLink} to="/login" variant="outlined" size="small">
                Log In
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* --- RIGHT SIDE: THE IMAGE PANEL (50% width) --- */}
      <Box 
        sx={{ 
          flex: '1 1 50%',
          display: { xs: 'none', md: 'block' },
          backgroundImage: `url(${sideBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}

export default RegisterPage;