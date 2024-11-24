import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon
import CircularProgress from "@mui/material/CircularProgress";
// import tryImage from "../components/Logos/try.jpg";

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Cart items fetched from the API
  const [selectedItems, setSelectedItems] = useState([]); // Tracks selected items for checkout
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state || {}; // Fallback to avoid errors

  // Only run the effect when product is available
  useEffect(() => {
    if (!product) return; // Do nothing if product is not available
    
    const fetchCartItems = async () => {
      try {
        const response = await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve([
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image:product.images[0] //product.image,
                },
              ]),
            1000
          )
        );
        setCartItems(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [product]); // Trigger effect when the product object changes

  // Handle checkbox selection
  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, item]
    );
  };

  //Handle quantity change
  const handleQuantityChange = (item, delta) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: Math.max(1, (cartItem.quantity || 1) + delta) }
          : cartItem
      )
    );
  };



   

  // Handle delete item
  const handleDeleteItem = (itemId) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== itemId));
    setSelectedItems((prev) => prev.filter((selected) => selected.id !== itemId));
  };

  //Calculate subtotal
  const calculateSubtotal = () =>
    selectedItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );

  // Navigate to checkout with selected items
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed.");
      return;
    }
    navigate("/buy-now", { state: { selectedItems } });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 10 }, py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Add to Cart
      </Typography>

      {/* Display cart items */}
      {cartItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Checkbox */}
          <Checkbox
            checked={selectedItems.some((selected) => selected.id === item.id)}
            onChange={() => handleCheckboxChange(item)}
          />

          {/* Product image */}
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
              marginRight: "16px",
              marginLeft: "10px",
            }}
          />

          {/* Product details */}
          <Box sx={{ flexGrow: 1 , marginLeft:3}}>
            <Typography variant="subtitle1" fontWeight="500">
              {item.name}
            </Typography>
            <Typography color="gray">Price: Rs. {item.price}</Typography>

            {/* Quantity controls */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <IconButton
                onClick={() => handleQuantityChange(item, -1)}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ mx: 2 }}>{item.quantity || 1}</Typography>
              <IconButton
                onClick={() => handleQuantityChange(item, 1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Delete button */}
          <IconButton
            onClick={() => handleDeleteItem(item.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Subtotal and checkout */}
      <Box
        sx={{
          borderTop: "1px solid #ddd",
          mt: 3,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Subtotal: Rs. {calculateSubtotal()}</Typography>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#26A69A",
            "&:hover": { bgcolor: "#219688" },
          }}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default AddToCartPage;
