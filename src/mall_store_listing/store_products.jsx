import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Rating,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStoreProducts } from "./mallStoreApi"; // Assuming this is the correct import path
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Grid2 from "@mui/material/Grid2";

// Banner component for store products page
const StoreBanner = ({ storeInfo }) => {
  return (
    <Box
      sx={{
        height: "400px",
        backgroundImage: storeInfo?.image ? `url(${storeInfo.image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        mb: 4,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ textAlign: "center", mb: 2 }}
        >
          {storeInfo?.name || "Store Products"}
        </Typography>
        {storeInfo?.shop_type && (
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {storeInfo.shop_type}
          </Typography>
        )}
      </Box>
    </Box>
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
      sx={{
        borderRadius: "20px 20px 20px 20px",
        maxWidth: "auto",
        margin: "auto",
        height: 370,
        borderRadius: "20px 20px 0 0",
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
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
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
      </CardContent>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mx={2}>
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
    </Card>
  );
};

const StoreProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const { storeId } = useParams();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchStoreProducts(storeId);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [storeId]);

  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      {/* Banner Section */}
      {/* <StoreBanner storeInfo={storeInfo} /> */}

      {/* Rest of your store products content */}
      {/* Product Grid */}
      <Grid2 container spacing={3}>
        {products.map((product, index) => (
          <Grid2
            item
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={product.product}
          >
            <ProductCard product={product} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default StoreProducts;
