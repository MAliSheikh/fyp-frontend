import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../components/axiosInstance";
import { useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axiosInstance.get('/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (product_id) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axiosInstance.delete(`/admin/products/${product_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProducts(prevProducts => 
        prevProducts.filter(product => product.product_id !== product_id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh", p: 2, mb:10 }}>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: "75%",
          ml: 1,
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Manage Products
        </Typography>

        {/* Search Field */}
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            maxWidth: { xs: "100%", sm: "75%", md: "50%" }
          }}
        />

        {/* Scrollable Container */}
        <Box sx={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {/* Header Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#00897b",
              color: "white",
              p: 2,
              borderRadius: 3,
              mb: 2,
              fontWeight: "bold",
              minWidth: "900px"
            }}
          >
            <Typography sx={{ flex: 0.8, textAlign: "left" }}>Store ID</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Name</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Price</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Stock</Typography>
            <Typography sx={{ flex: 0.5, textAlign: "left" }}>Image</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>Actions</Typography>
          </Box>

          {/* Product Rows */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              ml: 1,
              minWidth: "920px"
            }}
          >
            {filteredProducts.map((product) => (
              <Box
                key={product.product_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Typography sx={{ flex: 0.8, textAlign: "left" }}>{product.store_id}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{product.name}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>Rs. {product.price}</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>{product.stock}</Typography>
                <Box sx={{ flex: 0.5, textAlign: "left" }}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  <IconButton
                    onClick={() => handleDelete(product.product_id)}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageProducts;
