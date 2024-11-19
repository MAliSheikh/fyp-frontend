import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { fetchProductByIdDetails } from "./product";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductByIdDetails(id);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getProductDetails();
  }, [id]);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // const product = {
  //   name: "Glasses For Women",
  //   shortDescription:
  //     "Polygon Metal Sunglasses Vintage Frame For Women Sunglasses Men Luxury Brand Design Sun Glasses Women Mirror Gafas De Sol Uv400",
  //   rating: 4,
  //   brand: "Prada",
  //   price: 5000,
  //   description:
  //     "Elevate your style with our chic women's glasses, designed to blend fashion with functionality. Crafted with lightweight materials and available in a variety of trendy frames and colors, these glasses offer a perfect fit for every face shape. Whether you're looking for a bold statement piece or a subtle accent, our collection ensures you see clearly while looking effortlessly stylish.",
  // };

  return (
    <>
      <Grid container>
        {/* Left Column - Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ ml: { md: 1 }, mt: 1 }}>
            {/* Main Image */}
            <img
              src={`data:image/jpeg;base64,${product.images[0]}`}
              alt={product.name}
              style={{
                width: "100%",
                height: "50%",
                // height: "auto",
                display: "block",
                // maxHeight: "600px",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        {/* Right Column - Product Details */}
        <Grid size={{ xs: 16, md: 6 }}>
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

            <Rating
              // value={product.rating}
              value={4}
              readOnly
              sx={{ mb: 1, fontSize: "1.2rem" }}
            />

            <Grid container spacing={2}>
              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight="500">Brand: </Typography>
                  <Typography color="#000">
                    {product.subcategory} {product.category}{" "}
                  </Typography>
                </Box>
              </Grid>
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
                    Rs.{product.price}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Button
                  fullWidth
                  variant="outlined"
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
            </Grid>
          </Box>
        </Grid>

        {/* Thumbnail Images */}
        <Box sx={{ mt: 4, ml: { md: 1 } }}>
          <Typography sx={{ mb: 1 }} variant="h6">
            More Images
          </Typography>
          <Grid container spacing={1}>
            {product.images.slice(1).map((image, index) => (
              <Grid xs={6} sm={4} md={3} key={index}>
                {/* <Modal open={open} onClose={handleClose}> */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen(image)}
                >
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`View ${index + 1}`}
                    // width="100%"
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                {/* </Modal> */}
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
                height: "7  0%",
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
                  src={`data:image/jpeg;base64,${selectedImage}`}
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
          <Box sx={{ ml: { md: 1 }, mt: 3, mb: 10 }}>
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
    </>
  );
}

export default ProductDetailsPage;
