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
} from "@mui/material";
import ReviewsIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const TabPanel = ({ children, value, index }) => {
  return (
    <Box
      hidden={value !== index}
      sx={{ p: 2, width: "100%" }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

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
    //There is one more box that is not visible use to try diffrent styles if needed
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
            width: 500,
            margin: "auto",
            padding: 2,
            bgcolor: "white",
            boxShadow: 2,
            borderRadius: 2,
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
                backgroundColor: "#00987b",  // active indicator color
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                "&.Mui-selected": {
                  color: "#00987b",  // active tab text color
                },
              },
            }}
          >
            <Tab icon={<ReviewsIcon />} label="Reviews" />
            <Tab icon={<ShoppingCartIcon />} label="Cart" />
            <Tab icon={<LocalShippingIcon />} label="Orders" />
            <Tab icon={<LocationOnIcon />} label="Address" />
          </Tabs>

          {/* Centered Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
              <Typography>Review details go here.</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
              <Typography>Cart details go here.</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
              <Typography>Order details go here.</Typography>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 150 }}>
              <Typography>Address details go here.</Typography>
            </Box>
          </TabPanel>
        </Box>


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
