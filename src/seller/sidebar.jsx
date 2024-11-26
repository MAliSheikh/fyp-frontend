import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../components/LoginSignup/components/token";

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  // const [showMall, setShowMall] = useState(false);
  // const [showStore, setShowStore] = useState(true);

  // useEffect(() => {
  //   const storeId = localStorage.getItem("store_id");
  //   const mallId = localStorage.getItem("mall_id");
    
  //   // Show both options if neither exists
  //   if (!storeId && !mallId) {
  //     setShowMall(true);
  //     setShowStore(true);
  //   } 
  //   // If either exists, only show mall option
  //   else if (storeId || mallId) {
  //     setShowMall(false);
  //     setShowStore(false);
  //   }
  // }, []);

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
        Upload Product
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/manage-products")}
        onClick={() => navigate("/manage-products")}
      >
        Manage Products
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/sales")}
        onClick={() => navigate("/sales")}
      >
        Sales
      </Button>

      <Typography
        sx={{
          my: 2,
          color: "grey",
          textAlign: "center",
        }}
      >
        REGISTER STORE
      </Typography>

      {!localStorage.getItem('store_id') && !localStorage.getItem('mall_id') && (
        <>
          <Button
            variant="contained"
            sx={getButtonStyle("/seller/mall")}
            onClick={() => navigate("/seller/mall")}
          >
            Mall
          </Button>
          <Button
            onClick={() => navigate("/seller/store_info")}
            variant="contained"
            sx={getButtonStyle("/seller/store_info")}
          >
            Independent Store
          </Button>
        </>
      )}

      {localStorage.getItem('store_id') && localStorage.getItem('mall_id') && (
        <Button
          variant="contained"
          sx={getButtonStyle("/mall")}
          onClick={() => navigate("/mall")}
        >
          Mall
        </Button>
      )}

      {localStorage.getItem('store_id') && !localStorage.getItem('mall_id') && (
        <Button
          onClick={() => navigate("/store_info")}
          variant="contained"
          sx={getButtonStyle("/store_info")}
        >
          Independent Store
        </Button>
      )}

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
