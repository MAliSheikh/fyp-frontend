import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        About Bazaar Nest
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Bazaar Nest was founded with a vision to revolutionize the online shopping experience. 
              We provide a platform where quality meets convenience, offering a wide range of products 
              from trusted sellers worldwide.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We strive to create a seamless shopping experience while supporting independent sellers 
              and providing customers with unique, quality products at competitive prices.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;