import React from 'react';
import Slider from 'react-slick';
import { Container, Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid, Rating } from '@mui/material';
import banner1 from 'D:/frontend/fyp-frontend/src/components/Logos/banner2.jpg'

// Mock product data
const products = [
  { name: 'Fashion Digital Watch', price: '5000', rating: 4, img: 'https://via.placeholder.com/150' },
  { name: 'Nike Shoes', price: '3000', rating: 4, img: 'https://via.placeholder.com/150' },
  { name: 'Square Dial Watch', price: '3000', rating: 4.3, img: 'https://via.placeholder.com/150' },
  { name: 'Stylish Glasses', price: '6000', rating: 3.5, img: 'https://via.placeholder.com/150' },
  { name: 'Samsung A20', price: '15000', rating: 4.7, img: 'https://via.placeholder.com/150' },
  { name: 'Chanel N5 Perfume', price: '7000', rating: 4.9, img: 'https://via.placeholder.com/150' },
  { name: 'Apple Air Pods', price: '5000', rating: 4.2, img: 'https://via.placeholder.com/150' },
  { name: 'Dior Perfume', price: '6500', rating: 4.8, img: 'https://via.placeholder.com/150' },
  { name: 'Fashion Digital Watch', price: '5000', rating: 4, img: 'https://via.placeholder.com/150' },
  { name: 'Nike Shoes', price: '3000', rating: 4, img: 'https://via.placeholder.com/150' },
  { name: 'Square Dial Watch', price: '3000', rating: 4.3, img: 'https://via.placeholder.com/150' },
  { name: 'Stylish Glasses', price: '6000', rating: 3.5, img: 'https://via.placeholder.com/150' },
  { name: 'Samsung A20', price: '15000', rating: 4.7, img: 'https://via.placeholder.com/150' },
  { name: 'Chanel N5 Perfume', price: '7000', rating: 4.9, img: 'https://via.placeholder.com/150' },
  { name: 'Apple Air Pods', price: '5000', rating: 4.2, img: 'https://via.placeholder.com/150' },
  { name: 'Dior Perfume', price: '6500', rating: 4.8, img: 'https://via.placeholder.com/150' }
];

// Slider component for the banner
const BannerSlider = () => {
  const Bannersettings = {
    dots: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 1,
    // slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Slider {...Bannersettings}>
      <Box>
        <img
          src={banner1}
          alt="Banner"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Slider>
  );
};


// Product card component
const ProductCard = ({ product }) => (
  <Card sx={{ maxWidth: 'auto', margin: 'auto' }}>
    <CardMedia
      component="img"
      height="auto"
      image={product.img}
      alt={product.name}
    />
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        Rs. {product.price}
      </Typography>
      <Rating name="product-rating" value={product.rating} precision={0.5} readOnly />
    </CardContent>
    {/* <CardActions>
      <Button size="small" color="primary">
        Buy Now
      </Button>
    </CardActions> */}
  </Card>
);

const Products = () => {
  return (
    <Container maxWidth="lg">
      {/* Banner Slider */}
      <Box sx={{ mt: 1, mb: 4 }}>
        <BannerSlider />
      </Box>

      {/* Categories Heading */}
      <Typography variant="h5" gutterBottom>
        Categories
      </Typography>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
