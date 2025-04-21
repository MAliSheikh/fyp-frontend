import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Rating, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProductSlider = ({ products, title = "Featured Products" }) => {
  const navigate = useNavigate();

  // Updated settings to show 4 slides by default
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    draggable: true, // Enable dragging with pointer
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleViewAll = () => {
    navigate('/recommendations');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ position: 'relative', mb: 12, mt: 2 }}>
      {/* Section Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        px: 1
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333',
            borderLeft: '4px solid #F57224', 
            pl: 1.5
          }}
        >
          {title}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewAll}
          sx={{
            color: '#F57224',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#d35400',
            },
          }}
        >
          View All
        </Button>
      </Box>
      
      {/* Product Slider */}
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.product_id} sx={{ px: 2,py: 1, gap: 2, display: "flex", }} gap={2}>
            <Card 
              sx={{ 
                height: '100%',
                maxHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.12)', // Made shadow darker
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.16)', // Made shadow darker
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => handleProductClick(product.product_id)}
            >
              {/* Product Image */}
              <CardMedia
                component="img"
                height="140"
                image={product.images[0]}
                alt={product.name}
                sx={{ 
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  p: 1
                }}
              />
              
              {/* Product Info */}
              <CardContent sx={{ 
                p: 1.5, 
                pt: 1,
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '1px solid #f0f0f0'
              }}>
                {/* Product Name */}
                <Typography 
                  variant="body2" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 400,
                    color: '#212121',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 0.5,
                    height: '2.5em',
                    lineHeight: 1.2
                  }}
                >
                  {product.name}
                </Typography>
                
                {/* Price */}
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#F57224',
                    mt: 0.5 
                  }}
                >
                  Rs. {product.price ? product.price.toFixed(2) : '0.00'}
                </Typography>
                
                {/* Rating */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 0.5
                }}>
                  <Rating 
                    value={product.average_rating} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                    sx={{ fontSize: '0.8rem' }}
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    ({product.rating_count})
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ProductSlider;