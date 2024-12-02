import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button,
  Stack,
  Paper
} from '@mui/material';
import axiosInstance from '../components/axiosInstance';

const Reviews = ({ productId, storeId }) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const userId = localStorage.getItem('userId');

  const handleSubmitReview = async () => {
    if (!productId || !userId) {
      console.error('Missing productId or userId');
      return;
    }

    try {
      const reviewPayload = {
        store_id: storeId,
        user_id: userId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };

      console.log('Submitting review:', reviewPayload);

      const response = await axiosInstance.post(
        `/reviews/product/${productId}`, 
        JSON.stringify(reviewPayload),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Review submitted successfully:', response.data);

      // Reset form
      setReviewData({ rating: 0, comment: '' });

    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
        Write a Review
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <Box>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              size="large"
              value={reviewData.rating}
              onChange={(_, value) => setReviewData(prev => ({ ...prev, rating: value }))}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            variant="outlined"
            value={reviewData.comment}
            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
          />
          <Button 
            variant="contained" 
            onClick={handleSubmitReview}
            disabled={!reviewData.rating || !reviewData.comment}
            sx={{ alignSelf: 'flex-end' }}
          >
            Submit Review
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Reviews;