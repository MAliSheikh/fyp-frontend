import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [storeId, setStoreId] = useState(1); // Set default storeId to 1 for testing
  const [productInfo, setProductInfo] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      try {
        const response = await axiosInstance.get(
          `/reviews/product/${productId}`
        );
        console.log("Fetched reviews:", response.data);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchProductInfo = async () => {
      if (!productId) return;

      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        console.log("Fetched product info:", response.data);
        setProductInfo(response.data);
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    };

    fetchReviews();
    fetchProductInfo();
  }, [productId]);

  const reviewPayload = {
    // Ensure this uses the state variable
    store_id: storeId,
    user_id: userId,
    rating: rating,
    comment: comment,
  };

  const handleSubmitReview = async () => {
    if (!productId || !userId) {
      console.error("Missing productId or userId");
      return;
    }

    try {
      console.log("Submitting review:", {
        store_id: storeId,
        user_id: userId,
        rating: rating,
        comment: comment,
      });

      const response = await axiosInstance.post(
        `/reviews/product/${productId}`,
        reviewPayload
      );

      console.log("Review submitted successfully:", response.data);

      // Refresh reviews after submitting
      const updatedReviews = await axiosInstance.get(
        `/reviews/product/${productId}`
      );
      setReviews(updatedReviews.data);

      // Reset form
      // setReviewData({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Product Info Section */}
      {productInfo && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {productInfo.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {productInfo.images && productInfo.images[0] && (
              <img
                src={productInfo.images[0]}
                alt={productInfo.name}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            )}
            <Box>
              <Typography variant="body1" color="text.secondary">
                Price: ${productInfo.price}
              </Typography>
              {productInfo.average_rating && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={productInfo.average_rating}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({reviews.length} reviews)
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      )}

      <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
        Customer Reviews
      </Typography>

      {/* Write Review Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              size="large"
              value={rating}
              onChange={(_, value) =>
                setRating((prev) => ({ ...prev, rating: value }))
              }
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            variant="outlined"
            value={comment}
            onChange={(e) =>
              setComment((prev) => ({ ...prev, comment: e.target.value }))
            }
          />
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={rating || !comment}
            sx={{ alignSelf: "flex-end" }}
          >
            Submit Review
          </Button>
        </Stack>
      </Paper>

      {/* Display Reviews */}
      <Stack spacing={2}>
        <Typography variant="h6" gutterBottom>
          All Reviews ({reviews.length})
        </Typography>

        {reviews.map((review) => (
          <Card key={review.review_id} sx={{ mb: 2 }}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Avatar>{review.user_name?.[0] || "U"}</Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {review.user_name || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No reviews yet. Be the first to review!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Reviews;
