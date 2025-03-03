import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import Reviews from './Reviews';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        const response = await axiosInstance.get(`/orders/user/${user_id}`);
        setOrders(response.data);

        // Fetch reviewed products
        const reviewsResponse = await axiosInstance.get(`/reviews/user/${user_id}`);
        const reviewedProductIds = new Set(reviewsResponse.data.map(review => review.product_id));
        setReviewedProducts(reviewedProductIds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, []);

  const handleReview = (productId, storeId) => {
    setSelectedProductId(productId);
    setSelectedStoreId(storeId);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedProductId(null);
    setSelectedStoreId(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ); // Loader while fetching orders
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {orders.flatMap(order => 
              Object.values(order.order_items)
                .map(item => (
                  <TableRow
                    key={item.product_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.product_name}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">Rs.{item.price}</TableCell>
                    <TableCell align="right">
                      {item.status === "delivered" ? (
                        reviewedProducts.has(item.product_id) ? (
                          <Typography>Reviewed</Typography>
                          // item.status // Show status if reviewed
                        ) : (
                          <Button
                            sx={{
                              bgcolor: "#009688",
                                "&:hover": { bgcolor: "#00796b" },
                            }}
                            variant="contained"
                            onClick={() => handleReview(item.product_id, item.store_id)}
                          >
                            Review
                          </Button>
                        )
                      ) : (
                          <Typography sx={{
                            textTransform: 'capitalize',
                          }}>{item.status}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={reviewModalOpen}
        onClose={handleCloseReviewModal}
        aria-labelledby="review-modal"
        aria-describedby="review-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Reviews productId={selectedProductId} storeId={selectedStoreId} reviews={orders.flatMap(order => 
            Object.values(order.order_items)
              .filter(item => item.product_id === selectedProductId)
              .map(item => ({
                product_id: item.product_id,
                store_id: item.store_id,
              }))
          )} />
          <Button 
            variant="contained" 
            onClick={handleCloseReviewModal}
            sx={{
              bgcolor: "#009688",
              "&:hover": { bgcolor: "#00796b" },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderHistory;