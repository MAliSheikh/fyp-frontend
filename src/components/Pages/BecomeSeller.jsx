import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';

const BecomeSeller = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Become a Seller
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Why Sell on Bazaar Nest?
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                • Access to millions of customers
              </Typography>
              <Typography variant="body1" paragraph>
                • Easy-to-use seller tools
              </Typography>
              <Typography variant="body1" paragraph>
                • Secure payment processing
              </Typography>
              <Typography variant="body1" paragraph>
                • Professional support team
              </Typography>
            </Box>
            <Button variant="contained" color="primary" size="large">
              Start Selling
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              How It Works
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                1. Create your seller account
              </Typography>
              <Typography variant="body1" paragraph>
                2. List your products
              </Typography>
              <Typography variant="body1" paragraph>
                3. Start selling and earning
              </Typography>
              <Typography variant="body1" paragraph>
                4. Manage your business
              </Typography>
            </Box>
            <Button variant="outlined" color="primary" size="large">
              Learn More
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BecomeSeller;