import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ChatInterface from './chatInterface';

const Chat = () => {
  const location = useLocation();
  
  // Extract order details from location state if available
  const orderDetails = location.state || null;
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {orderDetails && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {orderDetails.image && (
              <img 
                src={orderDetails.image} 
                alt={orderDetails.productName} 
                style={{ width: '60px', height: '60px', marginRight: '16px', objectFit: 'cover' }}
              />
            )}
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {orderDetails.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order #{orderDetails.orderId} • Rs.{orderDetails.price}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  textTransform: 'capitalize',
                  color: orderDetails.status === 'delivered' ? 'success.main' : 
                         orderDetails.status === 'cancelled' ? 'error.main' : 'warning.main'
                }}
              >
                Status: {orderDetails.status}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      
      <ChatInterface />
    </Container>
  );
};

export default Chat;