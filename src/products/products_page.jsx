import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  CircularProgress,
  Button,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
//import banner1 from '../components/Logos/banner2.jpg'
//import banner2 from '../components/Logos/banner3.jpg'
//import banner3 from '../components/Logos/banner4.png'
import banner5 from "../components/Logos/banner5.jpg";
import banner6 from "../components/Logos/banner6.png";
import banner7 from "../components/Logos/banner7.jpg";
import banner8 from "../components/Logos/banner8.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchProducts, fetchRecommendations } from "./product";
import ProductSlider from "./ProductSlider";

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
              width: "100%",
              height: "400px", // Set a fixed height or adjust as needed
              objectFit: "cover",
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
    <Card
      onClick={handleViewProduct}
      sx={{
        cursor: "pointer",
        borderRadius: "20px 20px 20px 20px",
        maxWidth: "auto",
        margin: "auto",
        height: 400,
        boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={product.images[0]} // Assuming the base64 string is for a JPEG image
        // image={`data:image/jpeg;base64,${product.images[0]}`} // Assuming the base64 string is for a JPEG image
        alt={product.name}
        sx={{ borderRadius: "20px 20px 0 0" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* <Typography variant="h6">{product.name}</Typography> */}
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            height: 30,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 2 0 2",
          }}
        >
          {/* <Typography variant="body2" color="text.secondary" fontSize={18}>
              Rs. {product.price}
            </Typography> */}
          {/* <Rating name="product-rating" value={4} precision={0.5} readOnly /> */}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Rating
            name="product-rating"
            value={product.average_rating}
            precision={0.5}
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            Rs. {product.price}
          </Typography>
        </Box>
        {/* <Rating name="product-rating" value={product.rating} precision={0.5} readOnly /> */}
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const dataFetchedRef = useRef(false);

  const getProducts = async (pageNumber = 0, shouldAppend = false) => {
    try {
      if (pageNumber === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await fetchProducts(pageNumber * limit, limit);

      if (data.length < limit) {
        setHasMore(false);
      }

      if (shouldAppend) {
        setProducts((prevProducts) => [...prevProducts, ...data]);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getRecommendedProducts = async () => {
    try {
      // Get search history from localStorage
      const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );

      // Fetch more data initially to have enough for both pages
      const response = await fetchRecommendations({
        productnames: searchHistory,
        limit: 10,
        skip: 0,
        page_size: 30, // Fetch more data initially
      });

      // Store the recommendations data
      setRecommendedProducts(response);

      // Store only essential data in localStorage
      const essentialData = response.map(product => ({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        average_rating: product.average_rating,
        image_url: product.image_url
      }));

      // Store in localStorage for the recommendations page
      localStorage.setItem("recommendedProducts", JSON.stringify(essentialData));
      localStorage.setItem("recommendationsPage", "0"); // Track current page
      localStorage.setItem("recommendationsTotal", response.length.toString()); // Store total count
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getProducts(nextPage, true);
  };

  // Call getProducts and getRecommendedProducts when the component is mounted
  useEffect(() => {
    if (!dataFetchedRef.current) {
      getProducts(0, false);
      getRecommendedProducts();
      dataFetchedRef.current = true;
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Container maxWidth="lg">
      {/* Banner Slider */}
      <Box sx={{ mt: 1, mb: 4 }}>
        <BannerSlider />
      </Box>

      {/* Recommended Products Slider */}
      {recommendedProducts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <ProductSlider
            products={recommendedProducts.slice(0, 5)}
            title="Recommended For You"
          />
        </Box>
      )}

      {/* Loading Indicator or Product Grid */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "#333",
              borderLeft: "4px solid #F57224",
              pl: 1.5,
              mb:4,
            }}
          >
            Top Products
          </Typography>
          <Grid2 container spacing={3}>
            {products.map((product, index) => (
              <Grid2
                item
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={`${product.product_id}-${index}`}
              >
                <ProductCard product={product} />
              </Grid2>
            ))}
          </Grid2>
          {hasMore && (
            <Box display="flex" justifyContent="center" mt={4} mb={4}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{
                  mb:13,
                  height: 45,
                  textTransform: "none",
                  bgcolor: "#26A69A",
                  minWidth: 200,
                  "&:hover": {
                    bgcolor: "#219688",
                  },
                }}
              >
                {loadingMore ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Load More"
                )}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
