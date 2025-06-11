import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { changePassword as apiChangePassword } from '../api'; 
import {
  Container, Box, Typography, TextField, Button, Alert, CircularProgress, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function ProfilePage() {
  const { currentUser, logout } = useAuth(); 
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiChangePassword({ currentPassword, newPassword });
      setSuccess(response.data.msg || 'Password changed successfully! Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
         logout(); 
         navigate('/login');
      }, 3000); 

    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to change password.');
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading user profile...</Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="h6">Name: {currentUser.name}</Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>Email: {currentUser.email}</Typography>

        <Typography component="h2" variant="h5" sx={{ mt: 4, mb: 2 }}>
          Change Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password (min. 6 characters)"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfilePage;