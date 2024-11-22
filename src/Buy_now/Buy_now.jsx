import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import tryImage from "../components/Logos/try.jpg";

const BuyNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {}; // Fallback to avoid errors

  // Handle form data state
  // const [formData, setFormData] = useState({
  //   // name: "",
  //   address: "",
  //   phone: "",
  //   // email: "",
  // });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate("/");  // Redirect if product data is missing
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Product details are missing. Please go back and try again.
        </Typography>
      </Box>
    );
  }

  // Handle form changes
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Order placement failed", error);
      setLoading(false);
    }
  };

  // Loading spinner when submitting
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Success message after order is placed
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
        
        {/* Grid Container for Image and Content */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4}}>
          {/* Product Image on the left side */}
          <Grid item xs={12} md={4}>
            <img
              src={tryImage} // product.image if you're using product's image URL
              alt="not found" // product.name if you prefer the product name
              style={{
                width: "100%",
                maxWidth: 300,
                height: "auto",            
                marginBottom: 20,
                
              }}
            />
          </Grid>

          {/* Product Details on the right side */}
          <Grid item xs={12} md={8}>
            <Box
               sx={{
                marginBottom:22,
                gap:2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Align to the left horizontally
                height: "100%", // Take full height of the parent container
              }}
            >
              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Product: </Typography>
                  <Typography color="#000"><strong>{product.name}</strong></Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Per Unit Price: </Typography>
                   <Typography color="#000"><strong>Rs.{product.stock}</strong></Typography>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Quantity: </Typography>
                   <Typography color="#000"><strong>{quantity}</strong></Typography>
                </Box>
              </Grid>
              {/* <Typography variant="body1" fontWeight="500">
                Total Price: <strong>Rs. {product.price * quantity}</strong>
              </Typography> */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography fontWeight="500">Price:</Typography>
                  <Typography fontWeight="500" color="blue" sx={{ ml: 2 }}>
                    Rs.{product.price * quantity}
                  </Typography>
                </Box>
            </Box>
          </Grid>
        </Grid>



        

      <Box component="form" onSubmit={handleSubmit}>
        {/* <Typography variant="h6" gutterBottom>
          Delivery Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline  // Makes the input a textarea
              rows={3}
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            height: 45,
            textTransform: "none",
            bgcolor: "#26A69A",
            "&:hover": {
              bgcolor: "#219688",
            },
            mt: 3,
          }}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default BuyNowPage;
