import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Cancel = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1">
        Your payment has been cancelled. If you have any questions, please contact support.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => window.location.href = '/'}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Cancel; 