import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import Grid2
import { SideBar } from "./sidebar";
import { createStoreAndMall } from "./seller";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const MallInfo = () => {
  const [mallName, setMallName] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [shopNo, setShopNo] = useState("");
  const [descriptionMall, setDescriptionMall] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [descriptionStore, setDescriptionStore] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("Store Info", shopName);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handleChange = (event) => {
    setMallName(event.target.value);
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
    if (
      !mallName ||
      !floorNo ||
      !shopNo ||
      !descriptionMall ||
      !shopName ||
      !shopType ||
      !descriptionStore ||
      !image
    ) {
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

      const data = {
        store: {
          store_owner_id: store_owner_id,
          name: shopName,
          description: descriptionStore,
          shop_type: shopType,
          image: base64Image,
        },
        mall: {
          name: mallName,
          floor_number: floorNo,
          shop_number: shopNo,
          description: descriptionMall,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      const response = await createStoreAndMall(data);
      console.log("Store and mall created successfully:", response);
    } catch (error) {
      console.error("Error creating store and mall:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={8}>
        {/* Sidebar - width: 4 columns */}
        {/* <Grid xs={12} sm={4} md={2}> */}
        <Box
        sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 2,
        gap: 3,
      }}
      >
          <SideBar />
        </Box>
        {/* </Grid> */}

        
        {/* Mall Content - width: 8 columns */}
        <Grid xs={12} sm={8} md={10}>
          <Box
            sx={{
              width: { lg: "350%", md: "200%", xs: "100%" },
              margin: "0 auto",
            }}
          >
            <Paper sx={{ p: 3 }}>
            {/* Mall Information Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: { xs: 2, sm: 0 } }}>
              Add Mall Information
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
            >
              <FormControl fullWidth>
                <InputLabel id="mall-select-label">Select Mall</InputLabel>

                <Select
                  labelId="mall-select-label"
                  id="mall-select"
                  value={mallName}
                  onChange={handleChange}
                  label="Select Mall"
                >
                  <MenuItem value="Dolmen Mall">Dolmen Mall (Karachi)</MenuItem>
                  <MenuItem value="Emporium Mall">
                    Emporium Mall (Lahore)
                  </MenuItem>
                  <MenuItem value="Lucky One Mall">
                    Lucky One Mall (Karachi)
                  </MenuItem>
                  <MenuItem value="Centaurus Mall">
                    Centaurus Mall (Islamabad)
                  </MenuItem>
                  <MenuItem value="Giga Mall">Giga Mall (Islamabad)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Floor No"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
                type="number"
                required
                fullWidth
              />
              <TextField
                label="Shop No"
                value={shopNo}
                onChange={(e) => setShopNo(e.target.value)}
                type="number"
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={descriptionMall}
                onChange={(e) => setDescriptionMall(e.target.value)}
                multiline
                rows={4}
                required
                fullWidth
              />
            </Box>

            {/* Store Information Section */}
            <Typography variant="h5" gutterBottom>
              Add Store Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Shop Type"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={descriptionStore}
                onChange={(e) => setDescriptionStore(e.target.value)}
                multiline
                rows={4}
                required
                fullWidth
              />
              <Box
                sx={{
                  border: "2px dashed gray",
                  borderRadius: 1,
                  p: 2,
                  height: { xs: 150, sm: 200 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
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
                {/* {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      position: "absolute",
                    }}
                  />
                )} */}
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#119994",
                "&:hover": { backgroundColor: "#0d7b76" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Paper>
          </Box>


        </Grid>
        
      </Grid>
      
    </Box>
  );
};

export default MallInfo;
