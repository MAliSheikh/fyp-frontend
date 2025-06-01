import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Scrollbar,
  Paper,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { createStore } from "./seller";
import { SideBar } from "./sidebar";
import { useNavigate } from "react-router-dom";
import authService from "../components/LoginSignup/components/token";
import axiosInstance from "../components/axiosInstance";
import axios from "axios";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const StoreInfo = () => {
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
    if (!shopName || !shopType || !description || !image || !phoneNumber) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    const user_id = localStorage.getItem("userId");
    if (!user_id) {
      setSnackbar({
        open: true,
        message: "Store owner ID not found",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const base64Image = await convertToBase64(image);
      console.log("Base64 image:", base64Image);
      const response = await createStore(
        user_id,
        shopName,
        shopType,
        description,
        base64Image,
        phoneNumber
      );
      console.log("Store created successfully:", response);

      // Fetch updated store info
      await authService.fetchStoreInfo();

      setSnackbar({
        open: true,
        message: "Store created successfully!",
        severity: "success",
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate("/seller/upload-product");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create store",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async () => {
    try {
      const user_id = localStorage.getItem("userId");
      const response = await axiosInstance.get(`/store/${user_id}/stores`);
      if (response.data.stores.length > 0) {
        const store = response.data.stores[0];
        setShopName(store.name);
        setShopType(store.shop_type);
        setDescription(store.description);
        setPhoneNumber(store.phone_number);
        setImage(store.image);
        setStoreData(store);
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsEditing(false);
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    const store_id = localStorage.getItem('store_id');
    const user_id = localStorage.getItem("userId");
    if (!user_id) {
      setSnackbar({
        open: true,
        message: "Store owner ID not found",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Only convert to base64 if it's a new file (Blob)
      let base64Image = image;
      if (image instanceof Blob) {
        base64Image = await convertToBase64(image);
      }

      const response = await axios.put(
        `http://localhost:8000/store/stores/${store_id}`,
        {
          user_id: parseInt(user_id),
          name: shopName,
          shop_type: shopType,
          description,
          image: base64Image,
          phone_number: phoneNumber,
        }
      );

      // Update local state with the response data
      if (response.data) {
        setStoreData(response.data);
        setShopName(response.data.name);
        setShopType(response.data.shop_type);
        setDescription(response.data.description);
        setPhoneNumber(response.data.phone_number);
        setImage(response.data.image);
      }

      setSnackbar({
        open: true,
        message: "Store updated successfully!",
        severity: "success",
      });
      handleModalClose();
    } catch (error) {
      console.error("Error updating store:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update store",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
        <Paper elevation={3} sx={{ p: 5, borderRadius: 2 }}>
         
          <Grid container spacing={3}>
            <Grid item xs={12}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 3, md: 4 },
          }}
        >
          Add Store Information
        </Typography>
            </Grid>

        {storeData && (
              <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleEditClick}
            sx={{ mb: 2 }}
          >
            Edit
          </Button>
              </Grid>
        )}

            <Grid item xs={12}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              label="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              // disabled={!modalOpen}
              sx={{
                width: { xs: "100%", md: "400px" },
              }}
            />
            <TextField
              label="Shop Type"
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
              required
              // disabled={!modalOpen}
              sx={{
                width: { xs: "100%", md: "400px" },
              }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={10}
              required
              // disabled={!modalOpen}
              sx={{
                width: { xs: "100%", md: "400px" },
              }}
            />
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              // disabled={!modalOpen}
              sx={{
                width: { xs: "100%", md: "400px" },
              }}
            />
          </Box>

                <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: { xs: "100%", md: "400px" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                border: "2px dashed gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: 200, sm: 270 },
                width: { xs: "100%", md: "350px" },
                cursor: "pointer",
                flexShrink: 0,
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {image && typeof image === 'string' && (
                        <img
                          src={image}
                          alt="Store"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                      )}
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
                            position: "relative",
                            zIndex: 1
                  }}
                >
                          {image ? (typeof image === 'string' ? 'Change Image' : image.name) : "Upload Image"}
                </Button>
              </label>
            </Box>

            {!storeData && (
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "80%", md: "100%" },
                  maxWidth: "350px",
                  backgroundColor: "#119994",
                  color: "#ffffff",
                  mt: { xs: 2, md: 0 },
                  "&:hover": {
                    backgroundColor: "#0d7b76",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            )}
          </Box>
                </Grid>
        </Box>
            </Grid>

            <Grid item xs={12}>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <Typography variant="h6" gutterBottom>Edit Store Information</Typography>
            <Box component="form" onSubmit={handleUpdateStore}>
              <TextField
                label="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Shop Type"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box
                sx={{
                  border: "2px dashed gray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: { xs: 200, sm: 270 },
                  width: { xs: "100%", md: "350px" },
                  cursor: "pointer",
                  flexShrink: 0,
                  mb: 2,
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {image && typeof image === 'string' && (
                        <img
                          src={image}
                          alt="Store"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                      )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="edit-upload-button"
                />
                <label htmlFor="edit-upload-button">
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      backgroundColor: "#119994",
                      "&:hover": { backgroundColor: "#0d7b76" },
                            position: "relative",
                            zIndex: 1
                    }}
                  >
                          {image ? (typeof image === 'string' ? 'Change Image' : image.name) : "Upload Image"}
                  </Button>
                </label>
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#119994",
                  "&:hover": { backgroundColor: "#0d7b76" },
                }}
              >
                Update Store
              </Button>
            </Box>
          </Box>
        </Modal>
            </Grid>

            <Grid item xs={12}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default StoreInfo;
