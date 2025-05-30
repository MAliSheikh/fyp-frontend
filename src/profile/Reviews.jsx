import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button,
  Stack,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axiosInstance from '../components/axiosInstance';
import axios from 'axios';

const Reviews = ({ productId, storeId, reviews }) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [hasReviewed, setHasReviewed] = useState(false);
  const userId = localStorage.getItem('userId');

  const handleSubmitReview = async () => {
    if (!productId || !userId) {
      console.error('Missing productId or userId');
      return;
    }

    console.log('Current review data:', reviewData);
    console.log('Has reviewed:', hasReviewed);
    console.log('Is submitting:', isSubmitting);

    setIsSubmitting(true);
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

      setData(prevData => [...prevData, response.data]);
      setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
      setReviewData({ rating: 0, comment: '' });
      setHasReviewed(true);

    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Error submitting review.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const user_id = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8000/reviews/product/${productId}`);
        if (Array.isArray(response.data)) {
          setData(response.data);
          // Check if the current user has already reviewed this product
          const userReview = response.data.find(review => review.user_id === parseInt(userId));
          setHasReviewed(!!userReview);
          console.log('User has reviewed:', !!userReview);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, storeId, userId]);

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
            disabled={isSubmitting || hasReviewed}
            sx={{
              alignSelf: 'flex-end',
              bgcolor: "#009688",
              "&:hover": { bgcolor: "#00796b" },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : hasReviewed ? 'Already Reviewed' : 'Submit Review'}
          </Button>
        </Stack>
      </Paper>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Your Reviews
      </Typography>
      {data.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((review) => (
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
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reviews;