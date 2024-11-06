import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, TextField, Stack, Rating } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(4.5); // Example rating

  const handleAddToCart = () => {
    console.log(`Added product ${id} with quantity ${quantity} to the cart.`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/product.jpeg" // Update this path to the actual image in the public folder
            alt="Product"
            sx={{ width: '100%', borderRadius: 2 }}
          />
          
          {/* More Images Section */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            more images
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 1" sx={{ width: 80, height: 80, borderRadius: 1, border: '1px solid #e0e0e0' }} />
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 2" sx={{ width: 80, height: 80, borderRadius: 1, border: '1px solid #e0e0e0' }} />
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 3" sx={{ width: 80, height: 80, borderRadius: 1, border: '1px solid #e0e0e0' }} />
          </Stack>

          {/* Description */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Elevate your style with our chic women's glasses, designed to blend fashion with functionality. Crafted with lightweight materials
            and available in a variety of trendy frames and colors, these glasses offer a perfect fit for every face shape. Whether you're
            looking for a bold statement piece or a subtle accent, our collection ensures you see clearly while looking effortlessly stylish.
          </Typography>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold">
            Glasses For Women
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Polygon Metal Sunglasses <br />
            Vintage Frame for Women <br />
            Sunglasses Men Luxury Brand <br />
            Design Sun Glasses Women Mirror Oculos De Sol UV400
          </Typography>

          {/* Brand and Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Brand: <strong>Prada</strong>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating name="read-only" value={rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">({rating})</Typography>
            </Stack>
          </Box>

          {/* Quantity Selector */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Quantity
            </Typography>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ width: 80 }}
            />
          </Box>

          {/* Price */}
          <Typography variant="h5" color="#009688" fontWeight="bold" sx={{ mt: 2 }}>
            Rs.5000
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color='#009688'
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartIcon />}
              sx={{ width: '150px' }}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              sx={{
                width: '150px',
                backgroundColor: '#009688', // Same as price color
                color: 'white', // Make the text white for contrast
                '&:hover': {
                  backgroundColor: '#00796b', 
                },
              }}
            >
              Buy Now
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;
