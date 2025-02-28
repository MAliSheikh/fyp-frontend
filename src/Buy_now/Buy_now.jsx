import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid2,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../components/axiosInstance";

const stripePromise = loadStripe(
  "pk_test_51QTktuD5F58hnFq935pSP61wZhoJnQS8tYlQmwxVRCLgvxaNpHEhyfaOmRz39JI5BSQHYK1ITBsaGJ24QovxUk7000EGFyu9xW"
);

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userId = parseInt(localStorage.getItem("userId"));
        const response = await axios.get(
          `http://localhost:8000/address/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAddress(response.data.addresses[0]);
        setAddressLoading(false);
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const user_id = localStorage.getItem("userId");
      const order_items = await Promise.all(
        [product].map(async (item) => {
          const response = await axios.get(
            `http://localhost:8000/products/${item.product_id}/store_id`
          );
          const storeData = response.data;

          return {
            product_id: item.product_id,
            product_name: item.name,
            quantity: quantity,
            price: item.price,
            store_id: storeData.store_id,
          };
        })
      );
      const totalAmount = product.price * quantity;

      const orderData = {
        total_amount: totalAmount,
        status: "Pending",
        items_count: order_items.length,
        user_id: parseInt(user_id),
        order_items: order_items,
      };

      const response = await axiosInstance.post("/orders", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const orderId = response.data.order_id;
      const checkoutSessionData = {
        order_id: orderId,
        order_items: order_items,
        total_amount: totalAmount,
        user_id: parseInt(user_id),
        currency: "pkr",
      };

      const checkoutSessionResponse = await axiosInstance.post(
        "/payment/create-checkout-session",
        checkoutSessionData,
        { headers: { "Content-Type": "application/json" } }
      );

      const checkoutSessionId = checkoutSessionResponse.data.id;
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSessionId,
      });

      await Promise.all(
        order_items.map(async (item) => {
          try {
            await axiosInstance.delete(
              `/cart/cart-items/product/${user_id}/${item.product_id}`
            );
          } catch (error) {
            console.error("Error deleting cart item:", error);
          }
        })
      );

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

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Product details are missing. Please go back and try again.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Confirm Your Order
      </Typography>

      <Grid2 container spacing={3}>
        {/* Product Details Section */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} sx={{mb:2}}>
          <Card elevation={3} sx={{ p: 2, height: "100%",  }}>
            <CardContent>
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />    
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> Rs.{product.price}
              </Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {quantity}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Order Summary Section */}
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
          <Card elevation={3} sx={{ p: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>Rs.{product.price * quantity}</Typography>
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
                  <Typography variant="h6">Rs.{product.price * quantity}</Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={loading}
                sx={{
                  bgcolor: "#26A69A",
                  "&:hover": { bgcolor: "#219688" },
                  mt: 2,
                  textTransform: "none",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Address Details Section */}
        <Grid2 size={{ xs: 12, sm: 12, md: 4 }}>
          <Card elevation={3} sx={{ p: 2, height: "100%" }}>
            <CardContent>
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
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BuyNowPage;