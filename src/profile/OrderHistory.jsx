import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Modal } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import Reviews from './Reviews';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        const response = await axiosInstance.get(`/orders/user/${user_id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
    setReviewedProducts((prev) => new Set(prev).add(selectedProductId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      <Stack spacing={2}>
        {orders.flatMap(order => 
          Object.values(order.order_items).map(item => (
            <Box
              key={item.product_id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "white",
              }}
            >
              <Typography>{item.product_name}</Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              <Typography>Price: Rs.{item.price}</Typography>
              {order.status === "delivered" && !reviewedProducts.has(item.product_id) && (
                <Button
                  variant="contained"
                  onClick={() => handleReview(item.product_id, order.store_id)}
                >
                  Review
                </Button>
              )}
            </Box>
          ))
        )}
      </Stack>

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
          <Reviews productId={selectedProductId} storeId={selectedStoreId} />
          <Button 
            variant="contained" 
            onClick={handleCloseReviewModal}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderHistory;