import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { Button, Card, CardMedia, CardContent, Rating } from '@mui/material';

import { searchProducts } from "./product";
// import { ProductCard } from './products_page';
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.product_id}`);
  };
  return (
    <Card
      borderTop="50px"
      sx={{ maxWidth: "auto", margin: "auto", height: 350 }}
    >
      <CardMedia
        borderTop="50px"
        component="img"
        height="200"
        image={product.images[0]} // Assuming the base64 string is for a JPEG image
        // image={`data:image/jpeg;base64,${product.images[0]}`} // Assuming the base64 string is for a JPEG image
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* <Typography variant="h6">{product.name}</Typography> */}
        <Typography
          variant="h6"
          sx={{
            height: 30,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
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
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchQuery = {
          search_string: searchParams.get("search_string"),
          category: searchParams.get("category"),
          subcategory: searchParams.get("subcategory"),
          min_price: searchParams.get("min_price"),
          max_price: searchParams.get("max_price"),
        };

        const data = await searchProducts(searchQuery);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Results
        </Typography>

        {products.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "50vh",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SearchResults;
