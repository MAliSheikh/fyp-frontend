// sidebar.js
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: { sm: "sticky" },
        top: { sm: 16 },
        width: "100%", // Takes full width of its grid container
        mt: 5,
      }}
    >
      <Button
        variant="contained"
        onClick={() => navigate("/seller/upload-product")}
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
        }}
      >
        Upload Product
      </Button>

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
        }}
      >
        Manage Products
      </Button>

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
        }}
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

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#119994",
          "&:hover": { backgroundColor: "#0d7b76" },
        }}
      >
        Mall
      </Button>

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
        }}
      >
        Independent Store
      </Button>

      <Button
        variant="contained"
        sx={{
          height: 45,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          color: "grey",
          "&:hover": { backgroundColor: "red", color: "#ffffff" },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};
