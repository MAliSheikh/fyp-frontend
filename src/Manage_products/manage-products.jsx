import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Grid2 } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import { SideBar } from "../seller/sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
// import Grid2 from "@mui/material/Unstable_Grid2";

const OrdersPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/products"); // Adjust the endpoint according to your API
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([
          { id: 1, name: "Watch", category: "Apparel & Accessories", quantity: 20 },
          { id: 2, name: "Bag", category: "Accessories", quantity: 15 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/api/products/${id}`);
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid2 container sx={{ height: "100vh", overflow: "auto" }}>
      {/* Sidebar */}
      <Grid2
        item
        xs={12}
        md={3}
        lg={2}
        sx={{
          display: { xs: "none", md: "block" },
          minHeight: "100%",
        }}
      >
        <SideBar />
      </Grid2>

      {/* Main Content */}
      <Grid2
        item
        xs={12}
        md={9}
        lg={10}
        sx={{
          p: { xs: 2, md: 3, width: "100%", maxWidth: "1200px" },
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
                }}
              >
                <Typography sx={{ flex: 0.8, textAlign: "left" }}>ID</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>Product Name</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>Category</Typography>
                <Typography sx={{ flex: 1, textAlign: "left" }}>Quantity</Typography>
                <Typography sx={{ flex: 0.5, textAlign: "center" }}>Actions</Typography>
              </Box>

              {/* Product Rows */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {filteredProducts.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "white",
                      p: 2,
                      borderRadius: 3, // Rounded corners
                      boxShadow: 2,
                      cursor: "pointer",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: 4,
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                    onClick={() => console.log(`Clicked on product ${product.name}`)}
                  >
                    <Typography sx={{ flex: 0.8, textAlign: "left" }}>{product.id}</Typography>
                    <Typography sx={{ flex: 1, textAlign: "left" }}>{product.name}</Typography>
                    <Typography sx={{ flex: 1, textAlign: "left" }}>{product.category}</Typography>
                    <Typography sx={{ flex: 1, textAlign: "left" }}>Quantity: {product.quantity}</Typography>
                    <Box
                      sx={{
                        flex: 0.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DeleteIcon
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          handleDelete(product.id);
                        }}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

      </Grid2>
    </Grid2>
  );
};

export default OrdersPage;
