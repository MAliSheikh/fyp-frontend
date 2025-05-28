import React, { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton, Drawer } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../components/LoginSignup/components/token";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const SideBar = ({ isMobile, onClose }) => {
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

  const SidebarContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "250px",
        mt: isMobile ? 0 : 5,
        p: isMobile ? 2 : 0,
      }}
    >
      {isMobile && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={() => {
          navigate("/dashboard");
          if (isMobile) onClose();
        }}
        sx={getButtonStyle("/dashboard")}
      >
        Dashboard
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          navigate("/seller/upload-product");
          if (isMobile) onClose();
        }}
        sx={getButtonStyle("/seller/upload-product")}
      >
        Upload Product
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/manageproducts")}
        onClick={() => {
          navigate("/manageproducts");
          if (isMobile) onClose();
        }}
      >
        Manage Products
      </Button>

      <Button
        variant="contained"
        sx={getButtonStyle("/orders")}
        onClick={() => {
          navigate("/orders");
          if (isMobile) onClose();
        }}
      >
        Orders
      </Button>
      {/* <Button
        variant="contained"
        sx={getButtonStyle("/chat-seller")}
        onClick={() => navigate("/chat-seller")}
      >
        Chat Messages
      </Button> */}

      <Typography
        sx={{
          my: 2,
          color: "grey",
          textAlign: "center",
        }}
      >
        REGISTER STORE
      </Typography>

      {localStorage.getItem("store_id")==='null' &&
        localStorage.getItem("mall_id")==='null' && (
          <>
            <Button
              variant="contained"
              sx={getButtonStyle("/mall")}
              onClick={() => {
                navigate("/mall");
                if (isMobile) onClose();
              }}
            >
              Mall
            </Button>
            <Button
              onClick={() => {
                navigate("/store_info");
                if (isMobile) onClose();
              }}
              variant="contained"
              sx={getButtonStyle("/store_info")}
            >
              Independent Store
            </Button>
          </>
        )}

      {localStorage.getItem("store_id")!=='null' && localStorage.getItem("mall_id")!=="null" && (
        <Button
          variant="contained"
          sx={getButtonStyle("/mall")}
          onClick={() => {
            navigate("/mall");
            if (isMobile) onClose();
          }}
        >
          Mall
        </Button>
      )}

      {localStorage.getItem("store_id")!=='null' && localStorage.getItem("mall_id")==="null" && (
        <Button
          onClick={() => {
            navigate("/store_info");
            if (isMobile) onClose();
          }}
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
          if (isMobile) onClose();
        }}
      >
        Sign Out
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={true}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '280px',
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return <SidebarContent />;
};
