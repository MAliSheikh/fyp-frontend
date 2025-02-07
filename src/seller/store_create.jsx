import React from "react";
import { Box, Paper } from "@mui/material";
// import { Label } from '@mui/icons-material';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StoreInfo from "./store_info";
import MallInfo from "./mall_info";

const StoreCreatePage = () => {
  const [storeType, setStoreType] = React.useState("");

  const handleChange = (event) => {
    setStoreType(event.target.value);
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
      {/* <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, // Customize height
            backgroundColor: '#119994', // Customize filled color
            '&:hover': { backgroundColor: '#0d7b76' }, // Darker shade on hover
          }}
        >Upload Product</Button>

        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', // Change text color
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, // Change text color on hover
          }}
          >Manage Products</Button>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, 
          }}
          >Sales</Button>

        <Typography
          sx={{
            height: 50, 
            color: 'grey', 
            marginLeft: '30px',
            marginTop: '5px'
          }}
          >_____REGISTER STORE_____</Typography>
          
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' },
          }}
          >Mall</Button>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, 
          }}
          >Independent Store</Button>
        <Button variant="contained" fullWidth
          sx={{
            marginTop: 'auto',
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: 'red', color: '#ffffff' }, 
          }}
          >Sign Out</Button>
      </Box> */}

      {/* Main Content */}
      <Box sx={{ width: { xs: "100%", md: "100%" } }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ width: 225, marginLeft: 3 }}>
              <InputLabel id="demo-simple-select-label">
                Select option
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={storeType}
                label="storeType"
                onChange={handleChange}
              >
                <MenuItem value={"Mall"}>Mall</MenuItem>
                <MenuItem value={"Store"}>Store</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {storeType === "Store" && <StoreInfo />}
          {storeType === "Mall" && (
            <>
              <MallInfo />
              {/* <StoreInfo /> */}
            </>
          )}
          {/* <Typography variant="h5" gutterBottom>
            Upload New Product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box
              sx={{
                border: "2px dashed gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                cursor: "pointer",
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
                    backgroundColor: "#119994", // Customize filled color
                    "&:hover": { backgroundColor: "#0d7b76" }, // Darker shade on hover
                  }}
                >
                  {image ? image.name : "Upload Image"}
                </Button>
              </label>
            </Box>

            <TextField
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              fullWidth
              required
            />
            <TextField
              label="Available Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              fullWidth
              required
            />
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#119994",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0d7b76",
                },
              }}
            >
              Submit
            </Button>
          </Box> */}
        </Paper>
      </Box>
    </Box>
  );
};

export default StoreCreatePage;
