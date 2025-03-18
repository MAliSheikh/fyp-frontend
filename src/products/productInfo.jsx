import React, { Suspense, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductByIdDetails } from "./product";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Reviews from "../reviews/Reviews";
import Viewer from "../3d_viewer/viewer";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Item successfully added to cart!"
  );

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductByIdDetails(id);
        setProduct(data);

        // Set default size and color if available from API
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getProductDetails();
  }, [id]);

  const handleBuyNow = () => {
    navigate(`/buy-now`, { state: { product, quantity } });
  };
  // console.log(product)
  const handleaddtoCart = async () => {
    const user_id = parseInt(localStorage.getItem("userId"));
    try {
      const cartData = {
        user_id: user_id,
        product_id: product.product_id,
        name: product.name,
        image: product.images[0],
        quantity: quantity,
        price: product.price * quantity,
        colors: selectedColor ? [selectedColor] : [],
        sizes: selectedSize ? [selectedSize] : [],
        brand: product.brand || "No Brand"
      };

      await axios.post("http://localhost:8000/cart/cart-items", cartData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSnackbarOpen(true);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === "Item already exists in the cart"
      ) {
        setSnackbarOpen(true);
        setSnackbarMessage("Item already exists in the cart.");
      } else {
        console.error("Error adding to cart: ", error);
      }
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleViewerOpen = () => {
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Grid container>
        {/* Left Column - Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ ml: { xs: 1, md: 1 }, mt: 1 }}>
            {/* Main Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: "100%",
                height: "350px",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        {/* Right Column - Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              ml: { md: 5 },
              mt: { xs: 5, md: 0 },
              width: { xs: "auto", md: "70%" },
            }}
          >
            <Typography variant="h5" color="#000000">
              {product.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, width: "auto" }}
            >
              {product.description}
            </Typography>

            <Rating value={4} readOnly sx={{ mb: 1, fontSize: "1.2rem" }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Brand: </Typography>
                  <Typography color="#000">
                    {product.brand || "Not specified"}
                  </Typography>
                </Box>

                {/* Show colors if available */}
                {product.colors && product.colors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="500">Colors:</Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      {product.colors.map((color) => {
                        // Create a color mapping for common color names to ensure CSS compatibility
                        const colorMap = {
                          black: "#000000",
                          white: "#FFFFFF",
                          red: "#FF0000",
                          blue: "#0000FF",
                          green: "#008000",
                          yellow: "#FFFF00",
                          purple: "#800080",
                          pink: "#FFC0CB",
                          brown: "#A52A2A",
                          gray: "#808080",
                          orange: "#FFA500",
                          navy: "#000080",
                          beige: "#F5F5DC",
                          maroon: "#800000",
                          teal: "#008080",
                        };

                        // Get the CSS color value (either from map or use the original color name)
                        const cssColor = colorMap[color.toLowerCase()] || color;

                        // Better contrast detection - light colors need dark text, dark colors need light text
                        const getContrastTextColor = (colorValue) => {
                          // For mapped colors, we can be more precise
                          if (colorMap[colorValue.toLowerCase()]) {
                            const lightColors = [
                              "white",
                              "yellow",
                              "beige",
                              "pink",
                            ];
                            return lightColors.includes(
                              colorValue.toLowerCase()
                            )
                              ? "#000000"
                              : "#FFFFFF";
                          }

                          // For unmapped colors, use the previous heuristic but improved
                          const darkColors = [
                            "black",
                            "navy",
                            "blue",
                            "dark",
                            "purple",
                            "brown",
                            "maroon",
                            "green",
                            "teal",
                            "red",
                          ];
                          const isDark = darkColors.some((dark) =>
                            colorValue.toLowerCase().includes(dark)
                          );
                          return isDark ? "#FFFFFF" : "#000000";
                        };

                        return (
                          <Button
                            key={color}
                            sx={{
                              bgcolor:
                                selectedColor === color ? cssColor : "#ffffff",
                              color:
                                selectedColor === color
                                  ? getContrastTextColor(color)
                                  : "#000000",
                              border:
                                selectedColor === color
                                  ? "none"
                                  : `1px solid ${cssColor}`,
                              "&:hover": {
                                bgcolor:
                                  selectedColor === color
                                    ? cssColor
                                    : "#f0f0f0",
                                opacity: selectedColor === color ? 0.9 : 1,
                              },
                              mb: 1,
                              minWidth: "60px",
                            }}
                            variant="contained"
                            onClick={() => handleColorSelect(color)}
                          >
                            {color}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Show sizes if available */}
                {product.sizes && product.sizes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography fontWeight="500">Sizes:</Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          sx={{
                            bgcolor:
                              selectedSize === size ? "#26A69A" : "#ffffff",
                            color:
                              selectedSize === size ? "#ffffff" : "#000000",
                            border:
                              selectedSize === size
                                ? "none"
                                : "1px solid #26A69A",
                            "&:hover": {
                              bgcolor:
                                selectedSize === size ? "#219688" : "#f0f0f0",
                            },
                            mb: 1,
                          }}
                          variant="contained"
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Available: </Typography>
                  <Typography color="#000">{product.stock}</Typography>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography fontWeight="500">Quantity</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <IconButton
                      onClick={handleDecrement}
                      sx={{
                        border: "1px solid #444444",
                        borderRadius: 25,
                        height: 30,
                        width: 30,
                        fontSize: 12,
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                    <IconButton
                      onClick={handleIncrement}
                      sx={{
                        border: "1px solid #444444",
                        borderRadius: 25,
                        height: 30,
                        width: 30,
                        fontSize: 12,
                      }}
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography fontWeight="500">Price:</Typography>
                  <Typography fontWeight="500" color="blue" sx={{ ml: 3 }}>
                    Rs.{product.price * quantity}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleaddtoCart}
                  sx={{
                    height: 45,
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: "#000",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow below the border
                  }}
                >
                  Add to Cart
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBuyNow}
                  sx={{
                    height: 45,
                    textTransform: "none",
                    bgcolor: "#26A69A",
                    "&:hover": {
                      bgcolor: "#219688",
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Grid>
              {(product.product_id === 1 ||
                product.product_id === 2 ||
                product.product_id === 3 ||
                product.product_id === 4 ||
                product.product_id === 5 ||
                product.product_id === 6) && (
                <Grid size={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleViewerOpen}
                    sx={{
                      height: 45,
                      textTransform: "none",
                      borderColor: "#e0e0e0",
                      color: "#000",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    View in 3D
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>

        {/* Modal for Viewer */}
        <Modal open={viewerOpen} onClose={handleViewerClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            {product.product_id && <Viewer productId={product.product_id} />}{" "}
            {/* Pass product ID to Viewer */}
          </Box>
        </Modal>

        {/* Thumbnail Images */}
        <Box sx={{ mt: 4, ml: { xs: 1, md: 5 } }}>
          <Typography sx={{ mb: 1 }} variant="h6">
            More Images
          </Typography>
          <Grid container spacing={1}>
            {product.images.slice(1).map((image, index) => (
              <Grid xs={6} sm={4} md={3} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen(image)}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "70%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>

              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "440px",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          </Modal>
        </Box>
        {/* Description Section */}
        <Grid size={12}>
          <Box sx={{ ml: { xs: 1, md: 5 }, mt: 3, mb: 10 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography
              sx={{ width: { xs: "auto", md: "70%" } }}
              variant="body2"
              color="text.secondary"
            >
              {product.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* <Box sx={{ mt: 4, px: { xs: 2, md: 10 } }}>
        <Typography variant="h5" gutterBottom>
          Product Reviews
        </Typography>
        <Reviews storeId={product?.store_id} />
      </Box> */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductDetailsPage;
