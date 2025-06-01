import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Grid2, CircularProgress, IconButton, useTheme, useMediaQuery } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import { SideBar } from "../seller/sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditProductModal from "./EditProductModal";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// import { useNavigate } from "react-router-dom";
// import Grid2 from "@mui/material/Unstable_Grid2";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const store_id = localStorage.getItem("store_id");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/products/store/${store_id}`); // Adjust the endpoint according to your API
        // Sort products by product_id in ascending order
        const sortedProducts = response.data.sort(
          (a, b) => a.product_id - b.product_id
        );
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setProducts([
        //   { id: 1, name: "Watch", category: "Apparel & Accessories", quantity: 20 },
        //   { id: 2, name: "Bag", category: "Accessories", quantity: 15 },
        // ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [store_id]);

  const handleDelete = async (product_id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`products/${product_id}`);
        setProducts((prev) =>
          prev.filter((product) => product.product_id !== product_id)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex" sx={{ p: 2, mb:14 }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1200,
            bgcolor: '#119994',
            color: 'white',
            '&:hover': {
              bgcolor: '#0d7b76',
            },
          }}
        >
          <MenuOpenIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      {isMobile ? (
        isSidebarOpen && (
          <SideBar 
            isMobile={true} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )
      ) : (
        <Box
          sx={{
            width: "250px",
            display: { xs: "none", md: "block" }
          }}
        >
          <SideBar isMobile={false} />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: { xs: "100%", md: "75%" },
          ml: { xs: 0, md: 1 },
          maxWidth: "1200px",
          overflow: "hidden"
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
            maxWidth: { xs: "100%", sm: "75%", md: "50%" },
          }}
        />

        {/* Table Container with Scroll */}
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: { xs: "calc(100vh - 200px)", md: "calc(100vh - 250px)" },
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
              "&:hover": {
                background: "#555",
              },
            },
          }}
        >
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
              minWidth: "800px", // Minimum width to prevent squishing
            }}
          >
            <Typography sx={{ flex: 0.5, textAlign: "left" }}>ID</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>
              Product Name
            </Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Category</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Price</Typography>
            <Typography sx={{ flex: 1, textAlign: "left" }}>Stock</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>Image</Typography>
            <Typography sx={{ flex: 0.5, textAlign: "center" }}>
              Actions
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: "800px", // Minimum width to prevent squishing
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
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: 4,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Typography sx={{ flex: 0.5, textAlign: "left" }}>{product.store_id}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "left" }}>{product.name}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "left" }}>{product.category}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "left" }}>Rs. {product.price}</Typography>
                  <Typography sx={{ flex: 1, textAlign: "left" }}>{product.stock}</Typography>
                  <Box 
                    sx={{ 
                      flex: 0.8, 
                      display: "flex", 
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No Image
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      flex: 0.5,
                      display: "flex",
                      justifyContent: "center",
                      gap: 0
                    }}
                  >
                    <IconButton
                      onClick={() => handleEdit(product)}
                      sx={{
                        color: "#2196f3",
                        "&:hover": {
                          backgroundColor: "rgba(33, 150, 243, 0.1)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
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
          )}
        </Box>

        {selectedProduct && (
          <EditProductModal
            open={isEditModalOpen}
            handleClose={handleEditModalClose}
            product={selectedProduct}
            onProductUpdated={handleProductUpdated}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageProducts;
