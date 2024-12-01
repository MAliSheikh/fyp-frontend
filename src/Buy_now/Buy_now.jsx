import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Grid2 } from "@mui/material";
import { Card, CardContent } from '@mui/material';
import axios from "axios";

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

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
        const response = await axios.get(`http://localhost:8000/address/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setAddress(response.data.addresses[0]);
        setAddressLoading(false);
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddressLoading(false);
      }
    };

    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userId = parseInt(localStorage.getItem("userId"));
        const response = await axios.get(`http://localhost:8000/payment/user/${userId}/payment`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPayment(response.data.payment_info);
        setPaymentLoading(false);
      } catch (error) {
        console.error("Error fetching payment:", error);
        setPaymentLoading(false);
      }
    };

    fetchAddress();
    fetchPayment();
  }, []);

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Product details are missing. Please go back and try again.
        </Typography>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Order placement failed", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" color="green">
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Thank you for shopping with us. Your order will be processed shortly.
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
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
                <Typography fontSize={18} fontWeight="500"><strong>Product: </strong></Typography>
                <Typography fontSize={18} color="#000">{product.name}</Typography>
              </Box>
            </Grid2>
            <Grid2 size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={18} fontWeight="500"><strong>Per Unit Price: </strong></Typography>
                <Typography fontSize={18}color="#000">Rs.{product.price}</Typography>
              </Box>
            </Grid2>

            <Grid2 size={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontSize={18}fontWeight="500"><strong>Quantity: </strong></Typography>
                <Typography fontSize={18} color="#000">{quantity}</Typography>
              </Box>
            </Grid2>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontSize={18} fontWeight="500"><strong>Price:</strong></Typography>
              <Typography fontSize={18} fontWeight="500" color="blue" sx={{ ml: 2 }}>
                Rs.{product.price * quantity}
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>

      {/* Address Details */}
      <Box sx={{
        padding: 4,
        position: 'absolute',
        right: 0,
        top: 0,
        width: '40%',
        marginTop: '200px',
        marginRight: '20px'
      }}>

        {addressLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : address ? (
          <Card elevation={3} sx={{ maxWidth: 500, margin: '0 auto', padding: 2, mb: 4 }}>
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
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="error" gutterBottom>
              No address found. Please add an address.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/address')}
              sx={{
                mt: 2,
                bgcolor: "#26A69A",
                "&:hover": { bgcolor: "#219688" }
              }}
            >
              Add Address
            </Button>
          </Box>
        )}

        {/* Payment Details */}
        {paymentLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : payment ? (
          <Card elevation={3} sx={{ maxWidth: 500, margin: '0 auto', padding: 2, mt: 4 }}>
            <CardContent>
              <Typography variant="h5" mb={3} textAlign="center">
                Payment Details
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Card Number:</strong> **** **** **** {payment.card_number.slice(-4)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Expiry Date:</strong> {payment.expiry_date}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="error" gutterBottom>
              No payment method found. Please add a payment method.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/payment')}
              sx={{
                mt: 2,
                bgcolor: "#26A69A",
                "&:hover": { bgcolor: "#219688" }
              }}
            >
              Add Payment Method
            </Button>
          </Box>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!address || !payment}
          sx={{
            height: 45,
            textTransform: "none",
            bgcolor: "#26A69A",
            "&:hover": {
              bgcolor: "#219688",
            },
            mt: 15, // Increased from 3 to 5 to lower the button
          }}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default BuyNowPage;
