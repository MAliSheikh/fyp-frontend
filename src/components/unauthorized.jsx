import React from 'react';
import { Box, Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" color="error">
         404-Page Unauthorized Access
      </Typography>
    </Box>
  );
};

export default Unauthorized;