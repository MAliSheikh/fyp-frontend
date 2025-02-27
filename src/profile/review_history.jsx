import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Rating, CircularProgress } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import { Avatar } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/user/${userId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ); // Loader while fetching reviews
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Review History
      </Typography>
      <Grid container spacing={5}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={3} key={review.review_id} sx={{mb:4,}}>
            <Box
              sx={{
                height: '100%',
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "white",
                display: "flex", 
                flexDirection: "column",
                alignItems: "flex-start", // Align content to left
                width: "100%"
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, p:0.5 }}>
                  <PermIdentityIcon />
                </Avatar>
                <Typography variant="subtitle2">
                  User
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body1" sx={{ mt: 1, flexGrow: 1 }} align="left">
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }} align="left">
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        ))}
        {reviews.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              You have not submitted any reviews yet.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ReviewHistory;
