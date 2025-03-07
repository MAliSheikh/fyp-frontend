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
        </Paper>
      </Box>
    </Box>
  );
};

export default StoreCreatePage;
