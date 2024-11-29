import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import Grid2
import { SideBar } from "./sidebar";
import { createStoreAndMall, fetchMallOptions } from "./seller";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import authService from "../components/LoginSignup/components/token";
import { useNavigate } from "react-router-dom";

const MallInfo = () => {
  const [mallName, setMallName] = useState("");
  const [mallNameId, setMallNameId] = useState(""); // Added state for mall ID
  const [floorNo, setFloorNo] = useState("");
  const [shopNo, setShopNo] = useState("");
  const [descriptionMall, setDescriptionMall] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [descriptionStore, setDescriptionStore] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [malls, setMalls] = useState([]);
  const [loadingMalls, setLoadingMalls] = useState(true);
  const [availableFloors, setAvailableFloors] = useState([]);

  const navigate = useNavigate();

  // console.log("Store Info", shopName);
  console.log("Mall Name ID:", mallNameId);
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId);
  
  useEffect(() => {
    const getMalls = async () => {
      try {
        const mallsData = await fetchMallOptions();
        console.log("Malls Data:", mallsData);
        setMalls(mallsData);
        setLoadingMalls(false);
      } catch (error) {
        console.error("Error fetching malls:", error);
        setLoadingMalls(false);
      }
    };

    getMalls();
  }, []);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handleChange = (event) => {
    const selectedMall = malls.find((mall) => mall.name === event.target.value);
    setMallName(event.target.value);
    setMallNameId(selectedMall?.mall_name_id || ""); // Store the mall ID

    if (selectedMall) {
      // Use the 'floor' property from your API response
      const maxFloors = parseInt(selectedMall.floor) || 3; // Convert to number and fallback to 3 if not defined
      const floors = Array.from(
        { length: maxFloors },
        (_, index) => (index + 1).toString() // Convert to string for value
      );
      setAvailableFloors(floors);
      setFloorNo("1"); // Set default floor to 1
    } else {
      setAvailableFloors([]);
      setFloorNo("");
    }
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

    if (!userId) {
      console.error("userId ID not found in localStorage");
      return;
    }

    setLoading(true);

    try {
      const base64Image = await convertToBase64(image);
      // console.log("Base64 image:", base64Image);
      console.log("Mall Name ID:", mallNameId);
      const data = {
        store: {
          user_id: userId,
          name: shopName,
          mall_name_id: mallNameId, // Added mall ID to the request
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
          updated_at: new Date().toISOString()
        }
      };

      console.log("Submitting data:", data);
      const response = await createStoreAndMall(data);
      console.log("Store and mall created successfully:", response);

      // Fetch store info immediately after successful creation
      try {
        await authService.fetchStoreInfo();
        console.log("Store info fetched successfully after creation");
      } catch (storeInfoError) {
        console.error("Error fetching store info after creation:", storeInfoError);
      }

      // Show success message or redirect
      navigate('/seller/upload-product');
    } catch (error) {
      console.error("Error creating store and mall:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Grid container spacing={8}>
        {/* Sidebar - width: 4 columns */}
        {/* <Grid xs={12} sm={4} md={2}> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            p: 1,
            gap: 5,
          }}
        >
          <SideBar />
        </Box>
        {/* </Grid> */}

        {/* Mall Content - width: 8 columns */}
        <Grid xs={12} sm={8} md={10}>
          <Box
            sx={{
              width: { lg: "100%", md: "100%", xs: "100%" },
              margin: "0 auto",
            }}
          >
            {/* <Paper sx={{ p: 3}}> */}
            {/* Mall Information Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: { xs: 2, sm: 0 } }}>
              Add Mall Information
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mb: 4,
              }}
            >
              {/* Mall Selection */}
              <FormControl fullWidth>
                <InputLabel id="mall-select-label">Select Mall</InputLabel>
                <Select
                  labelId="mall-select-label"
                  id="mall-select"
                  value={mallName}
                  onChange={handleChange}
                  label="Select Mall"
                  disabled={loadingMalls}
                  sx={{ 
                    height: "56px",
                    "& .MuiSelect-select": {
                      // display: "flex",
                      // alignItems: "center",
                      width:{md: "700px", xs: "100%"},
                      gap: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }
                  }}
                >
                  {loadingMalls ? (
                    <MenuItem disabled>Loading malls...</MenuItem>
                  ) : (
                    malls.map((mall) => (
                      <MenuItem
                        key={mall.name}
                        value={mall.name}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          gap: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        <Typography noWrap>{mall.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          ({mall.location})
                        </Typography>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Floor Selection */}
              <FormControl fullWidth>
                <InputLabel id="floor-select-label">Floor Number</InputLabel>
                <Select
                  labelId="floor-select-label"
                  id="floor-select"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                  label="Floor Number"
                  disabled={!mallName || availableFloors.length === 0}
                  sx={{ 
                    height: "56px",
                    "& .MuiSelect-select": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }
                  }}
                >
                  {availableFloors.map((floor) => (
                    <MenuItem
                      key={floor}
                      value={floor}
                      sx={{
                        padding: "8px 16px",
                        minHeight: "40px",
                      }}
                    >
                      {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Shop Number */}
              <TextField
                label="Shop Number"
                value={shopNo}
                onChange={(e) => setShopNo(e.target.value)}
                type="number"
                required
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                }}
              />

              {/* Mall Description */}
              <TextField
                label="Mall Description"
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
            {/* </Paper> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MallInfo;
