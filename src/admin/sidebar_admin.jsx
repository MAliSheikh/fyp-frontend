import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../components/LoginSignup/components/token";


export const SideBarAdmin = ({ onSectionChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getButtonStyle = (path) => ({
    height: 45,
    mb: 2,
    width: "100%",
    backgroundColor: currentPath === path ? "#119994" : "#ffffff",
    color: currentPath === path ? "#ffffff" : "grey",
    "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
  });

  const handleNavigation = (path) => {
    navigate(path);
    if (onSectionChange) {
      onSectionChange(path);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: { sm: "sticky" },
        top: { sm: 16 },
        width: "250px",
        mt: 5,
      }}
    >
      <Button
        variant="contained"
        onClick={() => handleNavigation("/admin_dashboard")}
        sx={getButtonStyle("/admin-dashboard")}
      >
        Dashboard
      </Button>

      <Button
        variant="contained"
        onClick={() => handleNavigation("/manage-users")}
        sx={getButtonStyle("/manage-users")}
      >
        Manage Users
      </Button>

      <Button
        variant="contained"
        onClick={() => handleNavigation("/manage-products")}
        sx={getButtonStyle("/manage-products")}
      >
        Manage Products
      </Button>

      <Button
        variant="contained"
        onClick={() => handleNavigation("/manage-reviews")}
        sx={getButtonStyle("/manage-reviews")}
      >
        Manage Reviews
      </Button>

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "red", color: "#ffffff" },
        }}
        onClick={() => {
          authService.logout();
          navigate("/");
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default SideBarAdmin;