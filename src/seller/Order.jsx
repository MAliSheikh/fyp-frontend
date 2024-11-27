import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { SideBar } from "../seller/sidebar";

const OrdersPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulated API call
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              data: [
                { id: 1, name: "Smart Watch", category: "Electronics", quantity: 10 },
                { id: 2, name: "Leather Bag", category: "Accessories", quantity: 5 },
                { id: 3, name: "Wireless Earbuds", category: "Electronics", quantity: 20 },
                { id: 4, name: "Office Chair", category: "Furniture", quantity: 2 },
                { id: 5, name: "Running Shoes", category: "Footwear", quantity: 15 },
              ],
            });
          }, 1000)
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback dummy data
        setProducts([
          { id: 1, name: "Smart Watch", category: "Electronics", quantity: 10 },
          { id: 2, name: "Leather Bag", category: "Accessories", quantity: 5 },
          { id: 3, name: "Wireless Earbuds", category: "Electronics", quantity: 20 },
          { id: 4, name: "Office Chair", category: "Furniture", quantity: 2 },
          { id: 5, name: "Running Shoes", category: "Footwear", quantity: 15 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    try {
      alert(`Product with ID ${id} approved!`);
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Failed to approve product");
    }
  };

  const handleDecline = async (id) => {
    try {
      alert(`Product with ID ${id} declined!`);
    } catch (error) {
      console.error("Error declining product:", error);
      alert("Failed to decline product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex" sx={{ height: "100vh", overflow: "auto" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "0", md: "20%" },
          display: { xs: "none", md: "block" },
        }}
      >
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
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
          <Typography sx={{ flex: 1, textAlign: "center" }}>Actions</Typography>
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
                borderRadius: 3,
                boxShadow: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: 4,
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Typography sx={{ flex: 0.8, textAlign: "left" }}>{product.id}</Typography>
              <Typography sx={{ flex: 1, textAlign: "left" }}>{product.name}</Typography>
              <Typography sx={{ flex: 1, textAlign: "left" }}>{product.category}</Typography>
              <Typography sx={{ flex: 1, textAlign: "left" }}>{product.quantity}</Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    
                    color: "white",
                    p: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    textAlign: "center",
                    bgcolor: "#009688",
                    "&:hover": {
                                bgcolor: "#00796b",
                    },
                  }}
                  onClick={() => handleApprove(product.id)}
                >
                  Approve
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    p: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    textAlign: "center",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                  onClick={() => handleDecline(product.id)}
                >
                  Decline
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OrdersPage;
