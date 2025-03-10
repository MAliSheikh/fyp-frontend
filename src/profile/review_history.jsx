import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Rating, CircularProgress, Card, CardContent, CardMedia, Link, Modal } from "@mui/material";
import axiosInstance from "../components/axiosInstance";

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/user/${userId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  const handleOpenImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Review History
      </Typography>
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.review_id}>
            <Card sx={{ p: 2, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  height="60"
                  image={review.product_details.images[0]} // Assuming the first image is the product image
                  alt={review.product_details.name}
                  sx={{ borderRadius: '50%', width: 60, height: 60, marginRight: 2, cursor: 'pointer' }} // Round image
                  onClick={() => handleOpenImage(review.product_details.images[0])} // Open image in modal
                />
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {review.product_details.name}
                </Typography>
              </Box>
              <Box sx={{ mt: 1, textAlign: 'left' }}>
                <Rating value={review.rating} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'left' }}>
                  View Details
                </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Link href={`/products/${review.product_details.product_id}`} variant="body2" color="primary">
                  View Product
                </Link>
                <Link href={`/store/${review.store_id}/products`} variant="body2" color="primary">
                  View Store
                </Link>
              </Box>
            </Card>
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

      {/* Modal for displaying the image */}
      <Modal open={Boolean(selectedImage)} onClose={handleCloseImage}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <img src={selectedImage} alt="Review" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ReviewHistory;
