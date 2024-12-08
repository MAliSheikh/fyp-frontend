import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Success = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1">
        Thank you for your purchase. Your payment was successful.
      </Typography>
      {sessionId && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Session ID: {sessionId}
        </Typography>
      )}
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => window.location.href = '/'}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Success; 