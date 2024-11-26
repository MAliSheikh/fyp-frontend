import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { SideBar } from "./sidebar";
import { categories } from "./category";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createProduct } from "./seller";
import CloseIcon from "@mui/icons-material/Close";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const UploadProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory(""); // Reset subcategory on category change
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get only the first selected file
    if (file) {
      setProductImages((prevImages) => [...prevImages, file]); // Add to existing images
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const currentSubcategories =
    categories.find((cat) => cat.name === selectedCategory)?.subcategories ||
    [];

  const resetForm = () => {
    setProductImages([]);
    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  // Add snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (
      productImages.length === 0 ||
      !productName ||
      !description ||
      !price ||
      !stock ||
      !selectedCategory
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert all images to base64
      const base64Images = await Promise.all(
        productImages.map((image) => convertToBase64(image))
      );

      const productData = {
        name: productName,
        description: description,
        price: Number(price),
        stock: Number(stock),
        images: base64Images,
        category: selectedCategory,
        subcategory: selectedSubcategory || "",
      };

      const response = await createProduct(productData);
      console.log("Product created successfully:", response);

      setSnackbar({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });

      resetForm();
    } catch (error) {
      console.error("Failed to create product:", error);

      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to create product. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 2,
        gap: 3,
        backgroundColor: "#fff",
      }}
    >
      <Grid container spacing={8}>
        <Grid item xs={12} sm={4} md={4}>
          <SideBar />
        </Grid>
        {/* Sidebar */}

        {/* Main Content */}
        <Grid item xs={12} sm={4} md={8}>
          <Box sx={{ width: "100%", maxWidth: "1200px" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Upload New Product
            </Typography>

            {/* <Box sx={{ wdith: "500px" }}> */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {/* Left Side: Upload Box */}
                  <Box
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      p: 2,
                      minHeight: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 500,
                    }}
                  >
                    <Typography sx={{ paddingTop: 5, color: "#666", mb: 2 }}>
                      Upload Product Images
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "nowrap", // Prevent wrapping to the next line
                        gap: 1,
                        mb: 2,
                        height: 40,
                        width: "100%",
                        overflowX: "auto", // Enable horizontal scrolling
                        justifyContent: "center",
                      }}
                    >
                      {productImages.length > 0 &&
                        productImages.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 60,
                              height: 60,
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative",
                              flexShrink: 0, // Prevent shrinking
                            }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "rgba(255,255,255,0.7)",
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                },
                              }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                    </Box>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{
                        marginBottom: 3,
                        marginTop: -4,
                        backgroundColor: "#00897b",
                        "&:hover": { backgroundColor: "#00796b" },
                        textTransform: "none",
                        width: { xs: "200%", md: "300px" },
                      }}
                    >
                      Add Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    label="Add Product name"
                    variant="outlined"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    sx={{ width: 532, backgroundColor: "#fff", mt: 3 }}
                  />
                </Grid>

                {/* Right Side: Form Fields */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      gap: 1,
                      width: { xs: "100%", md: "250px" },
                      ml: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Add Description"
                      variant="outlined"
                      multiline
                      rows={10.7}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={{ backgroundColor: "#fff" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ width: 532, display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label="Price"
                variant="outlined"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                sx={{ flex: 1, backgroundColor: "#fff" }}
              />
              <TextField
                label="Available stock"
                variant="outlined"
                value={stock}
                type="number"
                onChange={(e) => setStock(e.target.value)}
                sx={{ flex: 1, backgroundColor: "#fff" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!selectedCategory}>
                <InputLabel id="subcategory-select-label">
                  Subcategory
                </InputLabel>
                <Select
                  labelId="subcategory-select-label"
                  id="subcategory-select"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  label="Subcategory"
                >
                  {currentSubcategories.map((subcategory) => (
                    <MenuItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                width: { xs: "100%", sm: "20%" },
                mt: 2,
                backgroundColor: "#00897b",
                "&:hover": { backgroundColor: "#00796b" },
                textTransform: "none",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          {/* </Box> */}
        </Grid>
      </Grid>

      {/* Add Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadProduct;
