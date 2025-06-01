import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SideBar } from "./sidebar";
import { categories } from "./category";
import { createProduct, predictShoeCategoryAndColor } from "./seller";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import axios from "axios";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};

const commonColors = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink",
  "Brown", "Gray", "Orange", "Navy", "Beige", "Maroon", "Teal",
  "Light Gray", "Dark Gray", "Dark Red", "Burgundy", "Hot Pink",
  "Olive", "Lime", "Forest Green", "Sky Blue", "Turquoise",
  "Dark Brown", "Chocolate", "Tan", "Cream", "Khaki",
  "Gold", "Coral", "Violet", "Lavender", "Silver",
  "Charcoal", "Mint", "Indigo", "Slate", "Copper", "Bronze"
];

export const commonSizes = [
  "XS", "S", "M", "L", "XL", "XXL", "XXXL",
  "36", "37", "38", "39", "40", "41", "42", "43", "44", "45",
  "One Size"
];

const UploadProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brand, setBrand] = useState("");
  const [showSizesField, setShowSizesField] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Categories and subcategories that should show size fields
  const categoriesWithSizes = ["Clothes", "Shoes", "Sports"];
  const subcategoriesWithSizes = [
    "Men", "Women", "Kids", "Accessories",
    "Cricket", "Football", "Badminton", "Fitness"
  ];

  useEffect(() => {
    const shouldShowSizes = 
      categoriesWithSizes.includes(selectedCategory) ||
      (selectedSubcategory && subcategoriesWithSizes.includes(selectedSubcategory));
    
    setShowSizesField(shouldShowSizes);
    if (!shouldShowSizes) setSizes([]);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory("");
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setProductImages((prevImages) => [...prevImages, file]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const handleDeleteColor = (colorToDelete) => {
    setColors(colors.filter((color) => color !== colorToDelete));
  };

  const currentSubcategories = 
    categories.find((cat) => cat.name === selectedCategory)?.subcategories || [];

  const resetForm = () => {
    setProductImages([]);
    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setColors([]);
    setSizes([]);
    setBrand("");
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAIPrediction = async () => {
    if (productImages.length === 0) {
      setAiError("Please upload an image first");
      setAiSuccess("");
      return;
    }

    setIsAILoading(true);
    setAiError("");
    setAiSuccess("");
    try {
      const prediction = await predictShoeCategoryAndColor(productImages[0]);
      
      // Set category to Shoes
      setSelectedCategory("Shoes");
      
      // Format and set subcategory (capitalize first letter)
      const formattedSubcategory = prediction.category.charAt(0).toUpperCase() + prediction.category.slice(1);
      setSelectedSubcategory(formattedSubcategory);
      
      // Add the predicted color
      const formattedColor = prediction.color.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      if (!colors.includes(formattedColor)) {
        setColors([...colors, formattedColor]);
      }

      setAiSuccess("Sucessfuly Predicted Image Color and Category");
    } catch (error) {
      setAiError("Failed to get AI prediction. Please try again.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productImages.length || !productName || !description || !price || !stock || !selectedCategory) {
      setSnackbar({ 
        open: true, 
        message: "Please fill in all required fields", 
        severity: "error" 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const base64Images = await Promise.all(
        productImages.map((image) => convertToBase64(image))
      );
      
      const productData = {
        name: productName,
        description,
        price: Number(price),
        stock: Number(stock),
        images: base64Images,
        category: selectedCategory,
        subcategory: selectedSubcategory || "",
        colors: colors.length > 0 ? colors : [],
        sizes: sizes.length > 0 ? sizes : [],
        brand: brand || "No Brand",
      };
      
      await createProduct(productData);
      setSnackbar({ 
        open: true, 
        message: "Product created successfully!", 
        severity: "success" 
      });
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create product. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" sx={{ p: 2, mb:10 }}>
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
          overflow: { xs: "auto", md: "hidden" }
        }}
      >
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Upload Product
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={12} sm={8} md={9} lg={10}>
              <Box sx={{ width: "100%" }}>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleAIPrediction}
                    disabled={isAILoading}
                    startIcon={isAILoading ? <CircularProgress size={20} /> : <SmartToyIcon />}
                    sx={{
                      backgroundColor: "#00897b",
                      "&:hover": { backgroundColor: "#00796b" },
                      textTransform: "none",
                    }}
                  >
                    AI Prediction
                  </Button>
                </Box>
                {aiError && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {aiError}
                  </Typography>
                )}
                {aiSuccess && (
                  <Typography color="success.main" sx={{ mb: 2 }}>
                    {aiSuccess}
                  </Typography>
                )}

                <Grid container spacing={3} disableEqualOverflow>
                  {/* Left Column */}
                  <Grid xs={12} md={6}>
                    {/* Image Upload Box */}
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
                        width: "92%",
                      }}
                    >
                      <Typography sx={{ paddingTop: 3, color: "#666", mb: 2 }}>
                        Upload Product Images
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                          width: "100%",
                          justifyContent: "center",
                        }}
                      >
                        {productImages.length > 0 &&
                          productImages.map((image, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 40,
                                height: 60,
                                border: "1px solid #e0e0e0",
                                borderRadius: "4px",
                                overflow: "hidden",
                                position: "relative",
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
                          mb: 2,
                          backgroundColor: "#00897b",
                          "&:hover": { backgroundColor: "#00796b" },
                          textTransform: "none",
                          width: { xs: "100%", sm: "auto" },
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

                    {/* Product Name */}
                    <TextField
                      fullWidth
                      label="Add Product name"
                      variant="outlined"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      sx={{ backgroundColor: "#fff", mt: 3 }}
                    />

                    {/* Price and Stock */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <TextField
                        label="Price"
                        variant="outlined"
                        type="number"
                        value={price < 0 ? 0 : price}
                        onChange={(e) => setPrice(e.target.value < 0 ? 0 : e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1, backgroundColor: "#fff" }}
                      />
                      <TextField
                        label="Available stock"
                        variant="outlined"
                        type="number"
                        value={stock < 0 ? 0 : stock}
                        onChange={(e) => setStock(e.target.value < 0 ? 0 : e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ flex: 1, backgroundColor: "#fff" }}
                      />
                    </Box>

                    {/* Brand */}
                    <TextField
                      fullWidth
                      label="Brand (optional)"
                      variant="outlined"
                      placeholder="Enter brand name or leave empty for 'No Brand'"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      sx={{ backgroundColor: "#fff", mt: 2 }}
                    />

                    {/* Categories */}
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
                  </Grid>

                  {/* Right Column */}
                  <Grid xs={12} md={6}>
                    {/* Description */}
                    <TextField
                      fullWidth
                      label="Add Description"
                      variant="outlined"
                      multiline
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={{ backgroundColor: "#fff" }}
                    />

                    {/* Colors Section */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Colors (optional)
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          listStyle: "none",
                          p: 0.5,
                          m: 0,
                          minHeight: "50px",
                        }}
                      >
                        {colors.map((color) => (
                          <Chip
                            key={color}
                            label={color}
                            onDelete={() => handleDeleteColor(color)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Paper>
                      <Autocomplete
                        freeSolo
                        options={commonColors.filter(color => !colors.includes(color))}
                        value={newColor}
                        onChange={(e, value) => {
                          if (value && !colors.includes(value)) {
                            setColors([...colors, value]);
                            setNewColor("");
                          }
                        }}
                        inputValue={newColor}
                        onInputChange={(e, value) => setNewColor(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Add color"
                            size="small"
                            sx={{ mt: 1 }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddColor();
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      />
                    </Box>
                    
                    {/* Sizes Section - Only shown for relevant categories */}
                    {showSizesField && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Sizes (optional)
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            listStyle: "none",
                            p: 0.5,
                            m: 0,
                            minHeight: "50px",
                          }}
                        >
                          {sizes.map((size) => (
                            <Chip
                              key={size}
                              label={size}
                              onDelete={() => setSizes(sizes.filter(s => s !== size))}
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Paper>
                        <Autocomplete
                          freeSolo
                          options={commonSizes.filter(size => !sizes.includes(size))}
                          onChange={(e, value) => {
                            if (value && !sizes.includes(value)) {
                              setSizes([...sizes, value]);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Add size"
                              size="small"
                              sx={{ mt: 1 }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value && !sizes.includes(e.target.value)) {
                                  setSizes([...sizes, e.target.value]);
                                  e.preventDefault();
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
                
                {/* Submit Button */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{
                    mt: 4,
                    backgroundColor: "#00897b",
                    "&:hover": { backgroundColor: "#00796b" },
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Upload Product"}
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {/* Snackbar for notifications */}
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
        </Paper>
      </Box>
    </Box>
  );
};

export default UploadProduct;