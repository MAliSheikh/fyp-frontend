import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../components/axiosInstance';
import axios from 'axios';

const Reviews = ({ productId, storeId }) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const user_id = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8000/reviews/user/${user_id}`);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []); // Empty dependency array to run only once

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

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
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Your Reviews
      </Typography>
      {reviews.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map((review) => (
            <Box
              key={review.review_id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly />
                <Typography sx={{ ml: 1 }}>
                  ({review.rating}/5)
                </Typography>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No reviews yet</Typography>
      )}
    </Box>
  );
};

export default Reviews;