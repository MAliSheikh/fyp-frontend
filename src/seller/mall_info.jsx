import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import Grid2
import { SideBar } from "./sidebar";
import { createStoreAndMall, fetchMallOptions } from "./seller";
import { MenuItem as MuiMenuItem } from "@mui/material";
import authService from "../components/LoginSignup/components/token";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

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
  const [loadingData, setLoadingData] = useState(true); // State for loading data
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [currentStoreData, setCurrentStoreData] = useState(null); // State for current store data
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number

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

  useEffect(() => {
    const fetchStoreAndMallData = async () => {
      setLoadingData(true);
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(`http://localhost:8000/store/${userId}/malls`);
        
        // Check if the response is valid and contains data
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0]; // Assuming you want the first item
          setCurrentStoreData(data);
          setMallName(data.mall.name);
          setFloorNo(data.mall.floor_number);
          setShopNo(data.mall.shop_number);
          setDescriptionMall(data.mall.description);
          setShopName(data.store.name);
          setShopType(data.store.shop_type);
          setDescriptionStore(data.store.description);
          setImage(data.store.image); // Set the image
          setPhoneNumber(data.store.phone_number); // Set the phone number
          // Convert shop_number to integer for display
          const shopNumberInt = parseInt(data.mall.shop_number, 10);
          setShopNo(shopNumberInt.toString()); // Convert back to string for the input field
          console.log("Fetched Floor Number:", data.mall.floor_number); // Add this line for debugging
        } else {
          // Handle case where no valid data is returned
          console.warn("No valid data found in response");
          setCurrentStoreData(null); // Reset current store data
        }
      } catch (error) {
        console.error("Error fetching store and mall data:", error);
        setCurrentStoreData(null); // Reset current store data on error
      } finally {
        setLoadingData(false);
      }
    };

    fetchStoreAndMallData();
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
          phone_number: phoneNumber,
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

  const handleEditClick = () => {
    console.log("Edit button clicked"); // Debugging line
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUpdateStoreAndMall = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    const storeId = localStorage.getItem("store_id"); // Assuming store_id is user_id
    const mallId = localStorage.getItem("mall_id"); // Assuming mall_id is mall_name_id

    // Convert image to Base64 if it exists
    let base64Image = currentStoreData.store.image; // Default to old image
    if (image) {
        base64Image = await convertToBase64(image); // Convert new image to Base64
    }

    const updatedData = {
        store: {
            user_id: currentStoreData.store.user_id,
            name: shopName || currentStoreData.store.name, // Use new name or old if missing
            description: descriptionStore || currentStoreData.store.description, // Use new description or old if missing
            shop_type: shopType || currentStoreData.store.shop_type, // Use new shop type or old if missing
            image: base64Image, // Use the new image in Base64 format
            phone_number: phoneNumber || currentStoreData.store.phone_number, // Use new phone number or old if missing
        },
        mall: {
            name: mallName || currentStoreData.mall.name, // Use new mall name or old if missing
            floor_number: floorNo || currentStoreData.mall.floor_number, // Use new floor number or old if missing
            shop_number: shopNo || currentStoreData.mall.shop_number, // Use new shop number or old if missing
            description: descriptionMall || currentStoreData.mall.description, // Use new description or old if missing
            created_at: currentStoreData.mall.created_at, // Keep the old created_at
            updated_at: new Date().toISOString(), // Set updated_at to current time
        },
    };

    try {
        // Only hit the PUT API
        await axios.put(`http://localhost:8000/store/store-mall/${storeId}/${mallId}`, updatedData);
        console.log("Store and mall updated successfully");
        handleModalClose(); // Close the modal after successful update
        // Optionally, refetch data or update state here
    } catch (error) {
        console.error("Error updating store and mall:", error);
    } finally {
        setLoading(false);
    }
  };

  console.log("Current Floor Number:", floorNo); // Add this line for debugging
  console.log("Is Modal Open:", modalOpen); // Debugging line

  const isDataAvailable = currentStoreData !== null; // Check if data is available

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

            {/* Show Edit Button only if data is available */}
            {isDataAvailable && (
              <Button onClick={handleEditClick} variant="outlined" sx={{ mb: 2 }} disabled={loadingData}>
                Edit
              </Button>
            )}

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
                  // disabled={loadingMalls || !isDataAvailable} // Disable if loading or no data
                  sx={{
                    height: "56px",
                    "& .MuiSelect-select": {
                      width: { md: "700px", xs: "100%" },
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
                  // disabled={!mallName || availableFloors.length === 0 || !isDataAvailable} // Disable if no mall selected or no floors available or no data
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
                // disabled={!isDataAvailable} // Disable if no data
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
                // disabled={!isDataAvailable} // Disable if no data
              />

              {/* Phone Number Field */}
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                fullWidth
                // disabled={!isDataAvailable} // Disable if no data
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
                // disabled={!isDataAvailable} // Disable if no data
              />
              <TextField
                label="Shop Type"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                required
                fullWidth
                // disabled={!isDataAvailable} // Disable if no data
              />
              <TextField
                label="Description"
                value={descriptionStore}
                onChange={(e) => setDescriptionStore(e.target.value)}
                multiline
                rows={4}
                required
                fullWidth
                // disabled={!isDataAvailable} // Disable if no data
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
                    // disabled={!isDataAvailable} // Disable if no data
                  >
                    {image ? image.name : "Upload Image"}
                  </Button>
                </label>
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


      {/* Modal for editing */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 2,
            maxHeight: '80vh', // Set max height for scrolling
            overflowY: 'auto', // Enable vertical scrolling
            position: 'relative', // Position relative for close icon
            margin: 'auto', // Center the modal
            top: '50%', // Center vertically
            transform: 'translateY(-50%)', // Adjust for vertical centering
            width: { xs: '90%', sm: '600px' }, // Responsive width
          }}
        >
          <IconButton
            onClick={handleModalClose}
            sx={{ position: 'absolute', top: 10, right: 10 }} // Position close icon
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Edit Store and Mall Information</Typography>
          <Box component="form" onSubmit={handleUpdateStoreAndMall} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Mall Selection */}
            <FormControl fullWidth>
              <InputLabel id="modal-mall-select-label">Select Mall</InputLabel>
              <Select
                labelId="modal-mall-select-label"
                id="modal-mall-select"
                value={mallName}
                onChange={handleChange}
                label="Select Mall"
                sx={{ height: "56px" }}
                disabled={!isDataAvailable} // Disable if no data
              >
                {malls.map((mall) => (
                  <MenuItem key={mall.name} value={mall.name}>
                    {mall.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Floor Selection */}
            <FormControl fullWidth>
              <InputLabel id="modal-floor-select-label">Floor Number</InputLabel>
              <Select
                labelId="modal-floor-select-label"
                id="modal-floor-select"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
                label="Floor Number"
                sx={{ height: "56px" }}
                disabled={!availableFloors.length || !isDataAvailable} // Disable if no floors available or no data
              >
                {availableFloors.map((floor) => (
                  <MenuItem key={floor} value={floor}>
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
              disabled={!isDataAvailable} // Disable if no data
              sx={{ "& .MuiInputBase-root": { height: "56px" } }}
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
              disabled={!isDataAvailable} // Disable if no data
            />

            {/* Phone Number Field */}
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
              disabled={!isDataAvailable} // Disable if no data
            />

            {/* Shop Name */}
            <TextField
              label="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              fullWidth
              disabled={!isDataAvailable} // Disable if no data
            />

            {/* Shop Type */}
            <TextField
              label="Shop Type"
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
              required
              fullWidth
              disabled={!isDataAvailable} // Disable if no data
            />

            {/* Store Description */}
            <TextField
              label="Description"
              value={descriptionStore}
              onChange={(e) => setDescriptionStore(e.target.value)}
              multiline
              rows={4}
              required
              fullWidth
              disabled={!isDataAvailable} // Disable if no data
            />

            {/* Image Upload */}
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
                id="modal-upload-button"
              />
              <label htmlFor="modal-upload-button">
                <Button
                  component="span"
                  variant="contained"
                  sx={{
                    backgroundColor: "#119994",
                    "&:hover": { backgroundColor: "#0d7b76" },
                  }}
                  disabled={!isDataAvailable} // Disable if no data
                >
                  {image ? image.name : "Upload Image"}
                </Button>
              </label>
            </Box>

            {/* Update Button */}
            <Button type="submit" variant="contained" disabled={loading || !isDataAvailable} sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#119994",
              "&:hover": { backgroundColor: "#0d7b76" },
            }}>
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MallInfo;
