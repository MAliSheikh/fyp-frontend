import React, { useState } from "react";
import {
  Drawer,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Typography,
  TextField,
  Divider,
  Box,
} from "@mui/material";

const categories = {
  Clothes: ["Men", "Women", "Kids", "Accessories"],
  Electronics: [
    "Mobile Phones", "Laptops", "Tablets", "Cameras", "TVs", "Smartwatch", "Headphones", "Speakers", "Mobile Accessories"
  ],
  Furniture: ["Living room", "Bedroom", "Kitchen", "Outdoor", "Office"],
  Shoes: ["Men", "Women", "Kids"],
  Miscellaneous: ["General Items", "Unique Find", "Novelty Items"],
  Computer: ["Laptops", "Desktop", "Computer Accessories", "Storage Devices", "PC Components"],
  "Home Appliances": ["Refrigerators", "Microwaves", "Washing Machines", "Air Conditioners", "Vacuum Cleaner"],
  Books: ["Fiction", "Non-Fiction", "Educational", "Comics", "Biographies"],
  Beauty: ["Makeup", "Skin", "Haircare", "Fragrances", "Nails"],
  Sports: ["Cricket", "Football", "Badminton", "Fitness", "Outdoor Gear"],
  Toys: ["Action Figures", "Dolls", "Educational Toys", "Puzzles", "Board Games"],
  Groceries: ["Fruits", "Vegetables", "Dairy", "Snacks", "Beverages"],
  Automobiles: ["Cars", "Bikes", "Car Accessories", "Tools", "Spare Parts"],
};

const FilterSidebar = ({ open, onClose, onApply, categories, commonSizes }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    minPrice: "",
    maxPrice: "",
    sizes: [],
  });

  const handleSubcategoryChange = (subcategory) => {
    setFilters((prev) => ({
      ...prev,
      subcategory: prev.subcategory === subcategory ? "" : subcategory,
    }));
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleApply = () => {
    onApply({ 
      ...filters, 
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined
    });
    onClose();
  };

  const handleCancel = () => {
    setFilters({
      category: "",
      subcategory: "",
      minPrice: "",
      maxPrice: "",
      sizes: []
    });
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 320,
          padding: "15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "0px 10px 10px 0px",
          boxShadow: "3px 0px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Filters</Typography>
      <List>
        {categories.map((category) => (
          category.subcategories.map((sub) => (
            <ListItem key={sub}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.subcategory === sub}
                    onChange={() => handleSubcategoryChange(sub)}
                  />
                }
                label={<Typography>{sub}</Typography>}
                // sx={{ pl: 3 }}
              />
            </ListItem>
          ))
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#555" }}>Price Range</Typography>
        <Box display="flex" gap={1} mt={1}>
          <TextField 
            label="Min Price" 
            type="number"
            value={filters.minPrice} 
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} 
            variant="outlined" 
            size="small" 
            fullWidth 
          />
          <TextField 
            label="Max Price" 
            type="number"
            value={filters.maxPrice} 
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} 
            variant="outlined" 
            size="small" 
            fullWidth 
          />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#555" }}>Sizes</Typography>
        <Box>
          {commonSizes.map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
              }
              label={<Typography>{size}</Typography>}
            />
          ))}
        </Box>
      </List>
      <Box display="flex" justifyContent="space-between" mt={3} mb={3}>
        <Button variant="outlined" color="White" onClick={handleCancel} sx={{ borderRadius: "8px" }}>Cancel</Button>
        <Button variant="contained" onClick={handleApply} sx={{ backgroundColor: "#009688", color: "#fff", borderRadius: "8px" }}>Apply</Button>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar;
