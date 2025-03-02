import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Card, CardMedia, CardContent, Rating, CircularProgress } from '@mui/material';
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
    <Card onClick={handleViewProduct} sx={{cursor:'pointer', borderRadius: '20px 20px 20px 20px', maxWidth: 'auto', margin: 'auto', height: 400, boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)' }}>
      <CardMedia
        component="img"
        height="250"
        image={product.images[0]} // Assuming the base64 string is for a JPEG image
        // image={`data:image/jpeg;base64,${product.images[0]}`} // Assuming the base64 string is for a JPEG image
        alt={product.name}
        sx={{borderRadius: '20px 20px 0 0',  }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* <Typography variant="h6">{product.name}</Typography> */}
        <Typography variant="h6" sx={{mb:4, height: 30, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "10px 2 0 2" }}>
            {/* <Typography variant="body2" color="text.secondary" fontSize={18}>
              Rs. {product.price}
            </Typography> */}
            {/* <Rating name="product-rating" value={4} precision={0.5} readOnly /> */}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Rating name="product-rating" value={product.average_rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">
            Rs. {product.price}
          </Typography>
        </Box> 
        {/* <Rating name="product-rating" value={product.rating} precision={0.5} readOnly /> */}
        
      </CardContent>
    </Card>
  )
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false); // Ref to track if data has been fetched

  const getProducts = async () => {
    if (!dataFetchedRef.current) { // Only fetch if data hasn't been fetched yet
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        dataFetchedRef.current = true; // Mark data as fetched
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Call getProducts when the component is mounted
  useEffect(() => {
    getProducts(); // Fetch data when the component is mounted
  }, []); // Empty dependency array ensures this runs only once

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
        {/* Top Rated Products
      </Typography> */}

      {/* Loading Indicator or Product Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={3}>
          {products.map((product, index) => (
            <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.product_id}>
              <ProductCard product={product} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default Products;
