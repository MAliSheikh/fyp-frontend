import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const OrderNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderItems, totalAmount } = location.state || {
    orderItems: [],
    totalAmount: 0,
  };
  console.log("orderitems", orderItems);

  const stripePromise = loadStripe(
    "pk_test_51QTktuD5F58hnFq935pSP61wZhoJnQS8tYlQmwxVRCLgvxaNpHEhyfaOmRz39JI5BSQHYK1ITBsaGJ24QovxUk7000EGFyu9xW"
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      setAddressLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const userId = parseInt(localStorage.getItem("userId"));
        const response = await axiosInstance.get(`/address/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data && response.data.addresses && response.data.addresses.length > 0) {
          setAddress(response.data.addresses[0]);
        } else {
          setAddress(null);
        }
      } catch (error) {
        setAddress(null);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddress();
  }, []);

  // Redirect if no items
  if (!orderItems.length) {
    navigate("/cart");
    return null;
  }


  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const user_id = localStorage.getItem("userId");
      const order_items = await Promise.all(
        orderItems.map(async (item) => {
          const response = await axiosInstance.get(
            `http://localhost:8000/products/${item.product_id}/store_id`
          );
          const storeData = response.data;

          return {
            product_id: item.product_id,
            product_name: item.name, 
            quantity: item.quantity,
            price: item.price,
            store_id: storeData.store_id,
            status: "pending",
            colors: item.colors && item.colors.length > 0 ? item.colors : [],
            sizes: item.sizes && item.sizes.length > 0 ? item.sizes : [],
            brand: item.brand || "No Brand"
          };
        })
      );
       // Send order data to /order API
       const orderData = {
        total_amount: totalAmount,
        items_count: orderItems.length,
        user_id: parseInt(user_id),
        order_items: order_items,
      };
      const response = await axiosInstance.post("/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderId = response.data.order_id;

      // Prepare data for Stripe checkout session
      const checkoutSessionData = {
        order_id: orderId,
        order_items: order_items,
        total_amount: totalAmount,
        user_id: parseInt(user_id),
      };

      // Create a new Stripe Checkout Session
      const checkoutSessionResponse = await axiosInstance.post(
        "/payment/create-checkout-session",
        checkoutSessionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const checkoutSessionId = checkoutSessionResponse.data.id;

      // Delete cart items before redirecting to Stripe checkout page
      await Promise.all(order_items.map(item => deleteCartItems(item.product_id)));

      // Redirect to Stripe checkout page
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSessionId,
      });

      if (result.error) {
        setSnackbar({
          open: true,
          message: result.error.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setSnackbar({
        open: true,
        message: "Failed to create checkout session. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItems = async (product_id) => {
    const userId = localStorage.getItem("userId"); // Ensure userId is retrieved correctly
    try {
      await axiosInstance.delete(`/cart/cart-items/product/${userId}/${product_id}`);
      console.log('Cart item deleted successfully');
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Grid container spacing={4}>
        {/* Order Items Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, height: '47%' }}>
            <Typography variant="h6" gutterBottom>
              Selected Items
            </Typography>
            {orderItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  borderBottom:
                    index < orderItems.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <img
                  src={item.image}
                  alt={item.product_name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    {item.product_name}
                  </Typography>
                  <Typography color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography>Rs. {item.price}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>Rs. {totalAmount}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid #eee",
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">Rs. {totalAmount}</Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || !address}
              sx={{
                bgcolor: "#009688",
                "&:hover": { bgcolor: "#00796b" },
                mt: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Place Order"
              )}
            </Button>
          </Paper>

          {/* Address Details Section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Address Details
            </Typography>
            {addressLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : address ? (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>State:</strong> {address.state}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>City:</strong> {address.city}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Full Address:</strong> {address.full_address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Zip Code:</strong> {address.zip_code}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {address.phone_no}
                </Typography>
              </>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="error" gutterBottom>
                  No address found. Please add an address.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/address")}
                  sx={{
                    mt: 2,
                    bgcolor: "#26A69A",
                    "&:hover": { bgcolor: "#219688" },
                  }}
                >
                  Add Address
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderNow;
