import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Privacy Policy
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information that you provide directly to us, including name, email address, 
            shipping address, and payment information when you make a purchase.
          </Typography>

          <Typography variant="h6" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to process your orders, communicate with you about 
            your orders, and provide customer service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Information Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell or share your personal information with third parties except as necessary 
            to provide our services or as required by law.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information from 
            unauthorized access or disclosure.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;