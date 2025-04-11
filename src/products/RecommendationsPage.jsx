import React, { useState, useRef } from 'react';
import { Container, Box, Typography, Grid, CircularProgress, Button } from '@mui/material';
import ProductCard from './productCard';
import { fetchRecommendations } from './product';

const RecommendationsPage = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const basePageSize = 10; // Fixed initial page size

  const getRecommendedProducts = async (pageNumber = 0, shouldAppend = false) => {
    try {
      if (pageNumber === 0 && !shouldAppend) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Get search history from localStorage
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      
      const response = await fetchRecommendations({
          product_names: searchHistory,
          skip: pageNumber * basePageSize,
          limit: (pageNumber + 1) * basePageSize,
          page_size: basePageSize 
      });

      if (shouldAppend) {
        // Append new products to the existing list
        setRecommendedProducts(prevProducts => {
          const newProducts = [...prevProducts];
          
          // Add only unique products based on product_id
          response.forEach(newProduct => {
            if (!prevProducts.some(p => p.product_id === newProduct.product_id)) {
              newProducts.push(newProduct);
            }
          });
          return newProducts;
        });
      } else {
        // Set new products for the first load
        setRecommendedProducts(response);
      }
      
      // Check if we have more products to load - if we received fewer than requested, there are no more
      setHasMore(response.length === basePageSize);
      
      // Update the page in localStorage
      localStorage.setItem('recommendationsPage', pageNumber.toString());
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1; // Increment page number
    setPage(nextPage);
    getRecommendedProducts(nextPage, true); // Load more products
  };

  // Fetch initial data when the component mounts
  const fetchInitialData = () => {
    getRecommendedProducts(0, false); // Load initial products
  };

  // Call fetchInitialData when the component is first rendered
  React.useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Recommended Products
        </Typography>

        {/* Product Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {recommendedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {hasMore && (
              <Box display="flex" justifyContent="center" mt={4} mb={4}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{
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
                    'Load More'
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default RecommendationsPage;