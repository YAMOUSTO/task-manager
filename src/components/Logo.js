import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function Logo({ color = 'primary.main', variant = 'h5' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CheckCircleOutlineIcon sx={{ color: color, fontSize: '2rem' }} />
      <Typography variant={variant} component="h1" sx={{ fontWeight: 'bold' }}>
        TaskManager
      </Typography>
    </Box>
  );
}
export default Logo;