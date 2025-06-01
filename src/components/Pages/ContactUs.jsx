import React from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const ContactUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            required
            type="email"
          />
          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Message"
            margin="normal"
            required
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Send Message
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactUs;