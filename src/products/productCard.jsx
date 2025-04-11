import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Rating, Typography } from '@mui/material';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.product_id}`);
  };

  return (
    <Card onClick={handleViewProduct} sx={{ cursor: 'pointer', borderRadius: '20px 20px 20px 20px', maxWidth: 'auto', margin: 'auto', height: 400, boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)' }}>
      <CardMedia
        component="img"
        height="250"
        image={product.images[0]} // Assuming the base64 string is for a JPEG image
        alt={product.name}
        sx={{ borderRadius: '20px 20px 0 0' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 4, height: 30, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "10px 2 0 2" }}>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Rating name="product-rating" value={product.average_rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">
            Rs. {product.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard;
