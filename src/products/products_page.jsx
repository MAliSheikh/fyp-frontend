import React, { useState, useEffect, } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, Typography, Card, CardMedia, CardContent, Rating, CircularProgress } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
//import banner1 from '../components/Logos/banner2.jpg'
//import banner2 from '../components/Logos/banner3.jpg'
//import banner3 from '../components/Logos/banner4.png'
import banner5 from '../components/Logos/banner5.jpg'
import banner6 from '../components/Logos/banner6.png'
import banner7 from '../components/Logos/banner7.jpg'
import banner8 from '../components/Logos/banner8.jpg'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchProducts } from './product';



// Slider component for the banner
const BannerSlider = () => {
  const Bannersettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const bannerImages = [banner6, banner5, banner7, banner8];

  return (
    <Slider {...Bannersettings}>
      {bannerImages.map((image, index) => (
        <Box key={index}>
          <img
            src={image}
            alt={`Banner ${index + 1}`}
            style={{
              width: '100%',
              height: '400px',  // Set a fixed height or adjust as needed
              objectFit: 'cover',

            }}
          />
        </Box>
      ))}
    </Slider>
  );
};



// Product card component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.product_id}`);
  };
  return (
    <Card sx={{ maxWidth: 'auto', margin: 'auto', height: 350, borderRadius: '20px 20px 0 0' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images[0]} // Assuming the base64 string is for a JPEG image
        // image={`data:image/jpeg;base64,${product.images[0]}`} // Assuming the base64 string is for a JPEG image
        alt={product.name}
        sx={{ borderRadius: '20px 20px 0 0' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* <Typography variant="h6">{product.name}</Typography> */}
        <Typography variant="h6" sx={{ height: 30, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Rs. {product.price}
        </Typography>

        <Rating name="product-rating" value={4} precision={0.5} readOnly />
        {/* <Rating name="product-rating" value={product.rating} precision={0.5} readOnly /> */}
        
        <Button variant="contained" color="primary" onClick={handleViewProduct}>
          See Details
        </Button>
      </CardContent>

      {/* <CardActions>
      <Button size="small" color="primary">
        Buy Now
      </Button>
    </CardActions> */}
    </Card>
  )
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Banner Slider */}
      <Box sx={{ mt: 1, mb: 4 }}>
        <BannerSlider />
      </Box>

      {/* Categories Heading
      <Typography variant="h5" gutterBottom>
        Categories
      </Typography> */}

      {/* Loading Indicator or Product Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={3}>
          {products.map((product, index) => (
            <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.product}>
              <ProductCard product={product} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default Products;
