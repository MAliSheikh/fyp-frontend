import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid2 } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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
        [product].map(async (item) => { // Wrap product in an array
          const response = await axios.get(
            `http://localhost:8000/products/${item.product_id}/store_id`
          );
          const storeData = response.data;

          return {
            product_id: item.product_id,
            product_name: item.name, // Ensure this matches your data
            quantity: quantity, // Assuming quantity is defined
            price: item.price, // Assuming item.price is defined
            store_id: storeData.store_id,
          };
        })
      );
      // Calculate total amount
      const totalAmount = product.price * quantity; // Calculate total amount

      // Prepare order data
      const orderData = {
        total_amount: totalAmount,
        status: "Pending",
        items_count: order_items.length,
        user_id: parseInt(user_id),
        order_items: order_items,
      };

      // Send order data to /orders API
      const response = await axiosInstance.post("/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderId = response.data.order_id; // Get the order ID from the response

      // Prepare data for Stripe checkout session
      const checkoutSessionData = {
        order_id: orderId,
        order_items: order_items,
        total_amount: totalAmount / 280,
        user_id: parseInt(user_id),
        currency: 'pkr'
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

      const checkoutSessionId = checkoutSessionResponse.data.id; // Get the session ID from the response

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
    <Box sx={{ px: { xs: 2, md: 10 }, py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Confirm Your Order
      </Typography>

      <Grid2 container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid2 item xs={12} md={4}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: 300,
              height: "auto",
              marginBottom: 22,
            }}
          />
        </Grid2>

        <Grid2 item xs={12} md={8}>
          <Box
            sx={{
              marginBottom: 20,
              marginLeft: 10,
              gap: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
            }}
          >
            <Grid2 size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={18} fontWeight="500">
                  <strong>Product: </strong>
                </Typography>
                <Typography fontSize={18} color="#000">
                  {product.name}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={18} fontWeight="500">
                  <strong>Per Unit Price: </strong>
                </Typography>
                <Typography fontSize={18} color="#000">
                  Rs.{product.price}
                </Typography>
              </Box>
            </Grid2>

            <Grid2 size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={18} fontWeight="500">
                  <strong>Quantity: </strong>
                </Typography>
                <Typography fontSize={18} color="#000">
                  {quantity}
                </Typography>
              </Box>
            </Grid2>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontSize={18} fontWeight="500">
                <strong>Price:</strong>
              </Typography>
              <Typography
                fontSize={18}
                fontWeight="500"
                color="blue"
                sx={{ ml: 2 }}
              >
                Rs.{product.price * quantity}
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>

      {/* Address Details */}
      <Box
        sx={{
          padding: 4,
          position: "absolute",
          right: 0,
          top: 0,
          width: "40%",
          marginTop: "200px",
          marginRight: "20px",
        }}
      >
        {addressLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : address ? (
          <Card
            elevation={3}
            sx={{ maxWidth: 300, margin: "0 auto", padding: 2, mb: 4 }}
          >
            <CardContent>
              <Typography variant="h5" mb={3} textAlign="center">
                Address Details
              </Typography>
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
            </CardContent>
          </Card>
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
      </Box>

      <Button
        variant="contained"
        onClick={handlePlaceOrder}
        sx={{
          height: 45,
          textTransform: "none",
          bgcolor: "#26A69A",
          "&:hover": {
            bgcolor: "#219688",
          },
          mt: 5,
          width:"100%"
        }}
      >
        Place Order
      </Button>

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
