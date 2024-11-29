import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { authService } from './auth-service';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Button,
  Divider,
} from "@mui/material";
import ReviewsIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const CustomerProfile = () => {
  const [user, setUser] = useState({ name: "" });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/costumer-profiles"); 
        setUser({
          name: response.data.name,
          picture: response.data.picture,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const navigate = useNavigate();

  const handleSignOut = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        maxWidth: "auto",
        margin: "auto",
        padding: 4,
        borderRadius: 4,
        boxShadow: 0,
        bgcolor: "white",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Profile Header */}
      <Avatar
        sx={{
          bgcolor: "#009688",
          width: 80,
          height: 80,
          fontSize: "2rem",
          margin: "auto",
        }}
      >
        {user.name ? user.name.charAt(0).toUpperCase() : "A"}
      </Avatar>
      <Typography variant="h5" fontWeight="bold">
        {user.name || "Anonymous"}
      </Typography>

      {/* Tabs Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#00987b", // Active indicator color
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              "&.Mui-selected": {
                color: "#00987b", // Active tab text color
              },
            },
          }}
        >
          <Tab
            icon={<ReviewsIcon sx={{ fontSize: 40 }} />} // Increase icon size
            label="Reviews"
          />
          <Tab
            icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />} // Increase icon size
            label="Cart"
          />
          <Tab
            icon={<LocalShippingIcon sx={{ fontSize: 40 }} />} // Increase icon size
            label="Orders"
          />
          <Tab
            icon={<LocationOnIcon sx={{ fontSize: 40 }} />} // Increase icon size
            label="Address"
          />
        </Tabs>
      </Box>

      {/* Divider */}
      <Divider
        sx={{
          marginY: 0.5,
          borderColor: "#009688", // Line color
          borderWidth: 1,
        }}
      />

      {/* Signout Button */}
      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        onClick={handleSignOut}
        sx={{
          width: "100%",
          fontWeight: "bold",
          borderRadius: 2,
          bgcolor: "#009688",
          "&:hover": {
            bgcolor: "#00796b",
          },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default CustomerProfile;
