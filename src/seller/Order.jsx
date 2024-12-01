import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { SideBar } from "../seller/sidebar";
import axiosInstance from "../components/axiosInstance";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const store_id = localStorage.getItem("store_id");
        const response = await axiosInstance.get(`/orders/store/${store_id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Convert orders and their items into flat array for display
  const flattenedOrderItems = orders.flatMap(order => 
    Object.values(order.order_items).map(item => ({
      order_id: order.order_id,
      status: order.status,
      order_date: new Date(order.order_date).toLocaleDateString(),
      quantity: item.quantity,
      price: item.price,
      total: order.total_amount,
      product_name: item.product_name
    }))
  );

  const filteredOrders = flattenedOrderItems.filter(order =>
    String(order.order_id).includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const store_id = localStorage.getItem("store_id");
  
  const handleApprove = async (order_id, value) => {
    try {
      const response = await axiosInstance.put(`/orders/${order_id}/store/${store_id}/status?status=approved`);
      
      // Update the local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === order_id 
            ? { ...order, status: 'approved' }
            : order
        )
      );

      // Show success message
      alert('Order approved successfully');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const handleDecline = async (order_id, value) => {
    try {
      const response = await axiosInstance.put(`/orders/${order_id}/store/${store_id}/status?status=cancelled`);
      
      // Update the local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === order_id 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      // Show success message
      alert('Order declined successfully');
    } catch (error) {
      console.error('Error declining order:', error);
      alert('Failed to decline order');
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh",p:2 }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "0", md: "20%" },
          display: { xs: "none", md: "block" }
        }}
      >
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: "75%",
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" } // Only enable scrolling on small screens
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Manage Orders
        </Typography>

        {/* Search Field */}
        <TextField
          label="Search Orders"
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
              minWidth: "900px" // Minimum width to prevent squishing
            }}
          >
            <Typography sx={{ flex: 0.8, textAlign: "left" }}>Order ID</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Name</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Status</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Date</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Quantity</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Price</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>Actions</Typography>
          </Box>

          {/* Order Rows */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: "900px" // Minimum width to prevent squishing
            }}
          >
            {filteredOrders.map((order, index) => (
              <Box
                key={`${order.order_id}-${index}`}
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
                <Typography sx={{ flex: 0.8, textAlign: "left" }}>{order.order_id}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.product_name}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.status}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.order_date}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.quantity}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.price}</Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  <Box
                    sx={{
                      color: "white",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      bgcolor: "#009688",
                      "&:hover": { bgcolor: "#00796b" },
                    }}
                    onClick={() => handleApprove(order.order_id)}
                  >
                    Approve
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#f44336",
                      color: "white",
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      "&:hover": { backgroundColor: "#d32f2f" },
                    }}
                    onClick={() => handleDecline(order.order_id)}
                  >
                    Decline
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrdersPage;
