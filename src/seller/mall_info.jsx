import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const MallInfo = () => {
  const [mallName, setmallName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setshopType] = useState("");
  const [floorNo, setfloorNo] = useState("");
  const [shopNo, setshopNo] = useState("");
  const [description, setdescription] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: 2,
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
          }}
        >
          Upload Product
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey", // Change text color
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" }, // Change text color on hover
          }}
        >
          Manage Products
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
          }}
        >
          Sales
        </Button>

        <Typography
          sx={{
            height: 50,
            color: "grey",
            marginLeft: "30px",
            marginTop: "5px",
          }}
        >
          _____REGISTER STORE_____
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50, // Customize height
            backgroundColor: "#119994", // Customize filled color
            "&:hover": { backgroundColor: "#0d7b76" }, // Darker shade on hover
          }}
        >
          Mall
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "#0d7b76", color: "#ffffff" },
          }}
        >
          Independent Store
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: "auto",
            height: 50,
            backgroundColor: "#ffffff",
            color: "grey",
            "&:hover": { backgroundColor: "red", color: "#ffffff" },
          }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ width: { xs: "100%", md: "100%" } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add Mall Information
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box
              sx={{
                border: "2px dashed gray",
                marginLeft: "650px",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                width: "390px",
                cursor: "pointer",
                display: "flex",
              }}
            >
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
                    alignItems: "center",
                    backgroundColor: "#119994", // Customize filled color
                    "&:hover": { backgroundColor: "#0d7b76" }, // Darker shade on hover
                  }}
                >
                  {image ? image.name : "Upload Image"}
                </Button>
              </label>
            </Box>

            <TextField
              label="Mall Name"
              value={mallName}
              onChange={(e) => setmallName(e.target.value)}
              required
              sx={{
                width: "600px",
              }}
            />
            <TextField
              label="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              fullWidth
              required
              sx={{
                width: "600px",
                display: "flex",
              }}
            />
            <TextField
              label="Shop Type"
              value={shopType}
              onChange={(e) => setshopType(e.target.value)}
              required
              sx={{
                width: "300px",
                display: "flex",
              }}
            />
            <TextField
              label="Floor No"
              value={floorNo}
              onChange={(e) => setfloorNo(e.target.value)}
              type="number"
              required
              sx={{
                width: "200px",
                display: "flex",
              }}
            />
            <TextField
              label="Shop No"
              value={shopNo}
              onChange={(e) => setshopNo(e.target.value)}
              type="number"
              required
              sx={{
                width: "200px",
                display: "flex",
              }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              multiline
              rows={7}
              required
              sx={{
                width: "600px",
                display: "flex",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#119994",
                color: "#ffffff",
                marginTop: "10px",
                "&:hover": {
                  backgroundColor: "#0d7b76",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MallInfo;
