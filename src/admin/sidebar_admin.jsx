import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../components/LoginSignup/components/token";

export const SideBarAdmin = () => {
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
        onClick={() => navigate("/seller/upload-product")}
        sx={getButtonStyle("/seller/upload-product")}
      >
        Dashboard
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/manageproducts")}
        onClick={() => navigate("/manageproducts")}
      >
        Seller
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/orders")}
        onClick={() => navigate("/orders")}
      >
        Costumer
      </Button>


      <Button
        variant="contained"
        sx={getButtonStyle("/mall")}
        onClick={() => navigate("/mall")}
      >
        Products
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
