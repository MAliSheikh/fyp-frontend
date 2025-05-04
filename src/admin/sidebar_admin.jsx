import React, { useState, useEffect } from "react";
import { Box, Button, Grid, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import authService from "../components/LoginSignup/components/token";
import { useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./admin_dashboard";
import ManageUsers from "./manage_users";
import ManageProducts from "./manage_products";
import ManageReviews from "./manage_reviews";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';

export const SideBarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Get the current section from URL
    const path = location.pathname;
    if (path.includes("manage-users")) {
      setSelectedSection("manage-users");
    } else if (path.includes("manage-products")) {
      setSelectedSection("manage-products");
    } else if (path.includes("manage-reviews")) {
      setSelectedSection("manage-reviews");
    } else {
      setSelectedSection("dashboard");
    }
  }, [location]);

  const getButtonStyle = (path) => ({
    height: 45,
    mb: 2,
    width: isMobile ? "80%" : "100%",
    backgroundColor: selectedSection === path ? "#119994" : "#ffffff",
    color: selectedSection === path ? "#ffffff" : "grey",
    "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
  });

  const handleSelection = (path) => {
    setSelectedSection(path);
    navigate(`/admin/${path}`, { replace: true });
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "manage-users":
        return <ManageUsers />;
      case "manage-products":
        return <ManageProducts />;
      case "manage-reviews":
        return <ManageReviews />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderSidebar = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        mt: isMobile ? 0 : 2, // Reduced margin from top
        p: isMobile ? 0 : 0,
        position: 'relative',
      }}
    >
      {isMobile && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2,
            pl: 2,
            
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              border: '1px solid #119994',
              mt: 1,
              color: '#119994',
              '&:hover': {
                color: '#0d7b76',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleSelection("dashboard")}
          sx={getButtonStyle("dashboard")}
        >
          Dashboard
        </Button>

        <Button
          variant="contained"
          onClick={() => handleSelection("manage-users")}
          sx={getButtonStyle("manage-users")}
        >
          Manage Users
        </Button>

        <Button
          variant="contained"
          onClick={() => handleSelection("manage-products")}
          sx={getButtonStyle("manage-products")}
        >
          Manage Products
        </Button>

        <Button
          variant="contained"
          onClick={() => handleSelection("manage-reviews")}
          sx={getButtonStyle("manage-reviews")}
        >
          Manage Reviews
        </Button>

        <Button
          variant="contained"
          sx={{
            height: 45,
            mb: 2,
            width: isMobile ? "80%" : "100%",
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "red", color: "#ffffff" },
          }}
          onClick={() => {
            authService.logout();
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Grid container>
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1200,
              backgroundColor: '#119994',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0d7b76',
              },
            }}
          >
            <MenuOpenIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 250,
                boxSizing: 'border-box',
              },
            }}
          >
            {renderSidebar()}
          </Drawer>
        </>
      ) : (
        <Grid item xs={12} md={3}>
          {renderSidebar()}
        </Grid>
      )}
      <Grid item xs={12} md={isMobile ? 12 : 9}>
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default SideBarAdmin;