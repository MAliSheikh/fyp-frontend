import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { SideBar } from "../seller/sidebar";
import axiosInstance from "../components/axiosInstance";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userId = localStorage.getItem("userId"); // Assuming user_id is stored in localStorage

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
      order_date: new Date(order.order_date).toLocaleDateString(),
      quantity: item.quantity,
      price: item.price,
      total: order.total_amount,
      product_name: item.product_name,
      product_id: item.product_id,
      user_id: order.user_id,
      status: item.status,
    }))
  );

  const filteredOrders = flattenedOrderItems.filter(order =>
    String(order.order_id).includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const store_id = localStorage.getItem("store_id");
  
  const handleApprove = async (order_id,user_id, product_id) => {
    try {
      const response = await axiosInstance.put(`/orders/${order_id}/user/${user_id}/item/${product_id}/status?status=approved`);
      
      // Update the local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === order_id 
            ? { ...order, status: 'approved' }
            : order
        )
      );

      // Delete cart items after successful approval
      // await deleteCartItems(product_id);

      // Show success message
      alert('Order approved successfully');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const handleDecline = async (order_id, user_id, product_id) => {
    try {
      const response = await axiosInstance.put(`/orders/${order_id}/user/${user_id}/item/${product_id}/status?status=cancelled`);
      
      // Update the local state to reflect the change
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === order_id 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );

      // Delete cart items after successful decline
      // await deleteCartItems(product_id);

      // Show success message
      alert('Order declined successfully');
    } catch (error) {
      console.error('Error declining order:', error);
      alert('Failed to decline order');
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh", p: 2 }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1200,
            bgcolor: '#119994',
            color: 'white',
            '&:hover': {
              bgcolor: '#0d7b76',
            },
          }}
        >
          <MenuOpenIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      {isMobile ? (
        isSidebarOpen && (
          <SideBar 
            isMobile={true} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )
      ) : (
        <Box
          sx={{
            width: "250px",
            display: { xs: "none", md: "block" }
          }}
        >
          <SideBar isMobile={false} />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: { xs: "100%", md: "75%" },
          ml: { xs: 0, md: 1 },
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" }
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
              ml:1,
              minWidth: "920px" // Minimum width to prevent squishing
            }}
          >
            {filteredOrders.map((order, index) => (
              <Box
                key={`${order.order_id}-${order.item_id}-${index}`}
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
                <Typography 
                  sx={{ 
                    flex: 1, 
                    textAlign: "left",
                    textTransform: 'capitalize',
                    color: order.status === 'approved' ? '#009688' : 
                           order.status === 'delivered' ? '#4CAF50' :
                           order.status === 'cancelled' ? '#f44336' : '#666'
                  }}
                >
                  {order.status}
                </Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.order_date}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left", ml:6 }}>{order.quantity}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{order.price}</Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  {order.status === "pending" ? (
                    <>
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
                        onClick={() => handleApprove(order.order_id, order.user_id, order.product_id)}
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
                        onClick={() => handleDecline(order.order_id, order.user_id, order.product_id)}
                      >
                        Decline
                      </Box>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        color: "#666",
                        fontStyle: "italic",
                        fontSize: "0.9rem"
                      }}
                    >
                      No action to perform
                    </Typography>
                  )}
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
