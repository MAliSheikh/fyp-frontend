import React from 'react';
import { Box, Container, Typography, Grid2, Button, TextField, IconButton, Stack } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductPage = () => {
  return (
    <Container maxWidth="md">
      <Grid2 container spacing={4} sx={{ mt: 4 }}>
        {/* Product Image */}
        <Grid2 item xs={12} md={6}>
          <Box
            component="img"
            src="https://via.placeholder.com/400" // Replace with your image source
            alt="Glasses for Women"
            sx={{ width: '100%', borderRadius: 2 }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 1" sx={{ width: 80, height: 80, borderRadius: 1 }} />
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 2" sx={{ width: 80, height: 80, borderRadius: 1 }} />
            <Box component="img" src="https://via.placeholder.com/100" alt="Small Image 3" sx={{ width: 80, height: 80, borderRadius: 1 }} />
          </Stack>
        </Grid2>

        {/* Product Details */}
        <Grid2 item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Glasses For Women
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Polygon Metal Sunglasses <br />
            Vintage Frame for Women <br />
            Brand: Prada
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            Price: Rs.5000
          </Typography>

          {/* Quantity and Buy Button */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              defaultValue={1}
              sx={{ width: 100 }}
            />
            <Button variant="contained" color="primary" startIcon={<AddShoppingCartIcon />}>
              Buy Now
            </Button>
          </Box>

          {/* Description */}
          <Typography variant="body1" sx={{ mt: 3 }}>
            Elevate your style with our chic women's glasses, designed to blend fashion with functionality. Crafted with lightweight materials
            and available in a variety of trendy frames and colors, these glasses offer a perfect fit for every face shape. Whether you're
            looking for a bold statement piece or a subtle accent, our collection ensures you see clearly while looking effortlessly stylish.
          </Typography>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ProductPage;
