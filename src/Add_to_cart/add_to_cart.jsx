import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <CircularProgress sx={{ color: '#009688' }} />
  </Box>
);



const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();
  // const location = useLocation();

  const user_id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/cart/cart-items/${user_id}`
        );
        console.log("API Response:", response.data);
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user_id]);

  if (loading) {
    return <Loader />;
  }

  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(
        (selected) => selected.item_id === item.item_id
      );
      if (isSelected) {
        return prev.filter((selected) => selected.item_id !== item.item_id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = Math.max(1, (item.quantity || 1) + delta);
    const unitPrice = item.price / (item.quantity || 1);
    const newPrice = unitPrice * newQuantity;

    try {
      const updateData = {
        product_id: item.product_id,
        name: item.name,
        image: item.image,
        quantity: newQuantity,
        price: parseFloat(newPrice),
        user_id: parseInt(user_id),
      };

      await axios.put(
        `http://localhost:8000/cart/cart-items/${item.cart_id}/${item.item_id}?user_id=${user_id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: newQuantity, price: newPrice }
            : cartItem
        )
      );

      // Update selected items if the changed item is selected
      setSelectedItems((prev) =>
        prev.map((selectedItem) =>
          selectedItem.id === item.id
            ? { ...selectedItem, quantity: newQuantity, price: newPrice }
            : selectedItem
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await axios.delete(
        `http://localhost:8000/cart/cart-items/${item.cart_id}/${item.item_id}?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setCartItems((prev) => prev.filter((cartItem) => cartItem.item_id !== item.item_id));
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.item_id !== item.item_id)
      );
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setSnackbar({
        open: true,
        message: "Error deleting item",
        severity: "error"
      });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const calculateSelectedSubtotal = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed.");
      return;
    }
    const totalAmount = calculateSelectedSubtotal();
    navigate("/order-now", { 
      state: { 
        orderItems: selectedItems,
        totalAmount: totalAmount
      } 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

      {cartItems.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", my: 4 }}>
          Add products
        </Typography>
      ) : (
        <>
          {/* Display cart items */}
          {cartItems.map((item) => (
            <Box
              key={item.item_id}
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
                checked={selectedItems.some(
                  (selected) => selected.item_id === item.item_id
                )}
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
              <Box sx={{ flexGrow: 1, marginLeft: 3 }}>
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
                onClick={() => handleDeleteItem(item)}
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
            <Box>
              <Typography variant="h6">
                Total: Rs. {calculateSelectedSubtotal()}
              </Typography>
            </Box>
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
        </>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddToCartPage;
