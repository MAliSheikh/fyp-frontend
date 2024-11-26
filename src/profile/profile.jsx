import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ReviewsIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const CustomerProfile = () => {
  // State to hold user data
  const [user, setUser] = useState({name: "", picture: "" });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/costumer-profiles"); 
        setUser({
          name: response.data.phone,
          picture: response.data.picture,
        
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 4,
        boxShadow: 4,
        borderRadius: 4,
        bgcolor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      {/* Profile Header */}
      <Box sx={{ textAlign: "center" }}>
        <Avatar
          src={user.picture}
          sx={{
            bgcolor: "#009688",
            width: 80,
            height: 80,
            fontSize: "2rem",
            margin: "auto",
            mb: 2,
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {user.name || "Loading..."}
        </Typography>
      </Box>

      {/* Profile Actions */}
      <List
        sx={{
          width: "100%",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 2,
          overflow: "hidden",
        }}
      >
        <ListItem button>
          <ListItemIcon>
            <ReviewsIcon sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Reviews" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon sx={{ color: "success.main" }} />
          </ListItemIcon>
          <ListItemText primary="Add to Cart" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LocalShippingIcon sx={{ color: "info.main" }} />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LocationOnIcon sx={{ color: "secondary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Address" />
        </ListItem>
      </List>

      {/* Signout Button */}
      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        sx={{
          width: "100%",
          padding: 1.5,
          fontWeight: "bold",
          borderRadius: 2,
          backgroundColor: '#009688',
                        '&:hover': {
                            backgroundColor: '#00796b',
                        },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default CustomerProfile;
