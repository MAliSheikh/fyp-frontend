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

const FilterSidebar = ({ open, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    selectedCategory: "",
    selectedSubcategories: [],
    priceLow: false,
    priceHigh: false,
    minPrice: "",
    maxPrice: "",
  });

  const handleCategoryClick = (category) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: prev.selectedCategory === category ? "" : category,
      selectedSubcategories: [],
    }));
  };

  const handleSubcategoryChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      selectedSubcategories: checked
        ? [...prev.selectedSubcategories, name]
        : prev.selectedSubcategories.filter((sub) => sub !== name),
    }));
  };

  const handlePriceChange = (event) => {
    const { name } = event.target;
    setFilters((prev) => ({
      ...prev,
      priceLow: name === "priceLow" ? !prev.priceLow : false,
      priceHigh: name === "priceHigh" ? !prev.priceHigh : false,
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleCancel = () => {
    setFilters({ selectedCategory: "", selectedSubcategories: [], priceLow: false, priceHigh: false, minPrice: "", maxPrice: "" });
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
        {Object.keys(categories).map((category) => (
          <div key={category}>
            <ListItem button onClick={() => handleCategoryClick(category)} sx={{ backgroundColor: "#f4f4f4", borderRadius: "5px", mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#555" }}>{category}</Typography>
            </ListItem>
            {filters.selectedCategory === category &&
              categories[category].map((sub) => (
                <ListItem key={sub} sx={{ pl: 3 }}>
                  <FormControlLabel
                    control={<Checkbox name={sub} checked={filters.selectedSubcategories.includes(sub)} onChange={handleSubcategoryChange} />}
                    label={sub}
                  />
                </ListItem>
              ))}
          </div>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#555" }}>Price</Typography>
        <ListItem>
          <FormControlLabel
            control={<Checkbox name="priceLow" checked={filters.priceLow} onChange={handlePriceChange} />}
            label="Low to High"
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={<Checkbox name="priceHigh" checked={filters.priceHigh} onChange={handlePriceChange} />}
            label="High to Low"
          />
        </ListItem>
        <Box display="flex" gap={1} mt={1}>
          <TextField label="Min Price" name="minPrice" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} variant="outlined" size="small" fullWidth sx={{ borderRadius: 2 }} />
          <TextField label="Max Price" name="maxPrice" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} variant="outlined" size="small" fullWidth sx={{ borderRadius: 2 }} />
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
