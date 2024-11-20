import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { createStore } from './seller';

const StoreInfo = () => {
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("Store Info", shopName);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // Validation
    if (!shopName || !shopType || !description || !image) {
      console.error("All fields are required");
      return;
    }

    const store_owner_id = localStorage.getItem("store_owner_id");
    if (!store_owner_id) {
      console.error("Store owner ID not found in localStorage");
      return;
    }

    setLoading(true);

    try {
      const base64Image = await convertToBase64(image);
      console.log("Base64 image:", base64Image);
      const response = await createStore(store_owner_id, shopName, shopType, description, base64Image);
      console.log("Store created successfully:", response);
    } catch (error) {
      console.error("Error creating store:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 2,
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
          }}
        >
          Upload Product
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey", // Change text color
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" }, // Change text color on hover
          }}
        >
          Manage Products
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
          }}
        >
          Sales
        </Button>

        <Typography
          sx={{
            height: 50,
            color: "grey",
            marginLeft: "30px",
            marginTop: "5px",
          }}
        >
          _____REGISTER STORE_____
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" }, // Darker shade on hover
          }}
        >
          Mall
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50, // Customize height
            backgroundColor: "#119994", // Customize filled color
            "&:hover": { backgroundColor: "#0d7b76" },
          }}
        >
          Independent Store
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "auto",
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "red", color: "#ffffff" },
          }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add Store Information
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "row", // Align items in a row
              gap: 2,
            }}
          >
            {/* Left Side: Text Fields */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                sx={{ width: "600px" }}
              />
              <TextField
                label="Shop Type"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                required
                sx={{ width: "600px" }}
              />

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={10}
                required
                sx={{ width: "600px" }}
              />
            </Box>

            {/* Right Side: Upload Box */}
            <Box
              sx={{
                border: "2px dashed gray",
                alignItems: "center",
                justifyContent: "center",
                height: 270,
                width: 500,
                cursor: "pointer",
                display: "flex",
                flexShrink: 0, // because of this shrink nai hogga box
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <Button
                  component="span"
                  variant="contained"
                  sx={{
                    backgroundColor: "#119994",
                    "&:hover": { backgroundColor: "#0d7b76" },
                  }}
                >
                  {image ? image.name : "Upload Image"}
                </Button>
              </label>
            </Box>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#119994",
              color: "#ffffff",
              marginTop: "20px",
              width: "100%",
              "&:hover": {
                backgroundColor: "#0d7b76",
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default StoreInfo;