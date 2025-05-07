import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../components/axiosInstance";
import { useNavigate } from "react-router-dom";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axiosInstance.get('/admin/reviews', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.reviews) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [navigate]);

  const filteredReviews = reviews.filter(review =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (review_id) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axiosInstance.delete(`/admin/reviews/${review_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setReviews(prevReviews => 
        prevReviews.filter(review => review.review_id !== review_id)
      );
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh", p: 2 }}>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: "75%",
          ml: 1,
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Manage Reviews
        </Typography>

        {/* Search Field */}
        <TextField
          label="Search Reviews"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            maxWidth: { xs: "100%", sm: "75%", md: "50%" }
          }}
        />

        {/* Scrollable Container */}
        <Box sx={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {/* Header Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#00897b",
              color: "white",
              p: 2,
              borderRadius: 3,
              mb: 2,
              fontWeight: "bold",
              minWidth: "900px"
            }}
          >
            <Typography sx={{ flex: 0.8, textAlign: "left" }}>Store ID</Typography>
            <Typography sx={{ flex: 0.8, textAlign: "left" }}>User ID</Typography>
            <Typography sx={{ flex: 0.5, textAlign: "left" }}>Rating</Typography>
            <Typography sx={{ flex: 2, textAlign: "left" }}>Comment</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Date</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>Actions</Typography>
          </Box>

          {/* Review Rows */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              ml: 1,
              minWidth: "920px"
            }}
          >
            {filteredReviews.map((review) => (
              <Box
                key={review.review_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Typography sx={{ flex: 0.8, textAlign: "left" }}>{review.store_id}</Typography>
                <Typography sx={{ flex: 0.8, textAlign: "left" }}>{review.user_id}</Typography>
                <Typography sx={{ flex: 0.5, textAlign: "left" }}>{review.rating}/5</Typography>
                <Typography sx={{ flex: 2, textAlign: "left" }}>{review.comment}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  <IconButton
                    onClick={() => handleDelete(review.review_id)}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageReviews;
