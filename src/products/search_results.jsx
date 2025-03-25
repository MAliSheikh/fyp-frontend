import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Button, Card, CardMedia, CardContent, Rating } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt"; // Filter icon
import FilterSidebar from "../components/Filter/filter"; // Import the FilterSidebar component
import { searchProducts } from "./product";
import { categories } from "../seller/category";
import { commonSizes } from "../seller/upload_product"; // Import commonSizes

const categoriesWithSizes = ["Clothes", "Shoes", "Sports"];
const subcategoriesWithSizes = [
  "Men",
  "Women",
  "Kids",
  "Accessories",
  "Cricket",
  "Football",
  "Badminton",
  "Fitness",
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.product_id}`);
  };

  return (
    <Card sx={{ maxWidth: "auto", margin: "auto", height: 350 }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images[0]}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            height: 30,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rs. {product.price}
        </Typography>
        <Rating name="product-rating" value={4} precision={0.5} readOnly />
        <Button variant="contained" color="primary" onClick={handleViewProduct}>
          See Details
        </Button>
      </CardContent>
    </Card>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subcategoryAnchorEl, setSubcategoryAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (event, category) => {
    setSelectedCategory(category);
    setSubcategoryAnchorEl(event.currentTarget);
  };

  const handleSubcategorySelect = (category, subcategory) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("category", category);
    if (subcategory !== "All") {
      updatedSearchParams.set("subcategory", subcategory);
    } else {
      updatedSearchParams.delete("subcategory");
    }
    if (category) {
      updatedSearchParams.delete("search_string");
    }
    setSearchParams(updatedSearchParams);
    setAnchorEl(null);
    setSubcategoryAnchorEl(null);
  };

  const handleFilterApply = (filters) => {
    const newParams = new URLSearchParams(searchParams);

    const searchTerm = searchParams.get("search_string");
    if (searchTerm) newParams.set("search_string", searchTerm);

    if (filters.category) {
      newParams.set("category", filters.category);
      newParams.delete("search_string");
    } else newParams.delete("category");

    if (filters.subcategory) {
      newParams.set("subcategory", filters.subcategory);
    } else newParams.delete("subcategory");

    if (filters.minPrice) newParams.set("min_price", filters.minPrice);
    else newParams.delete("min_price");

    if (filters.maxPrice) newParams.set("max_price", filters.maxPrice);
    else newParams.delete("max_price");

    if (filters.brand) newParams.set("brand", filters.brand);
    else newParams.delete("brand");

    // Add sizes to the search parameters if provided
    if (filters.sizes && filters.sizes.length > 0) {
      filters.sizes.forEach((size) => newParams.append("sizes", size)); // Append each size separately
    } else {
      newParams.delete("sizes");
    }

    setSearchParams(newParams);
    console.log("Search Params:", newParams.toString()); // Debugging line to check params
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Extract search parameters from URL
        const searchQuery = {
          search_string: searchParams.get("search_string"),
          category: searchParams.get("category"),
          subcategory: searchParams.get("subcategory"),
          min_price: searchParams.get("min_price"),
          max_price: searchParams.get("max_price"),
          brand: searchParams.get("brand"),
        };
        // Get sizes array from URL params if present
        const sizesParam = searchParams.getAll("sizes");
        if (sizesParam && sizesParam.length > 0) {
          searchQuery.sizes = sizesParam;
        }
        const data = await searchProducts(searchQuery);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Category Dropdown */}
      <Box sx={{ mb: 2 }}>
        <Button
          aria-controls="category-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          Select Category
        </Button>
        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.name}
              onClick={(event) => handleCategoryClick(event, category)}
            >
              <Typography variant="subtitle1">{category.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="subcategory-menu"
          anchorEl={subcategoryAnchorEl}
          open={Boolean(subcategoryAnchorEl)}
          onClose={() => setSubcategoryAnchorEl(null)}
        >
          <MenuItem
            onClick={() =>
              handleSubcategorySelect(selectedCategory.name, "All")
            }
          >
            <Typography variant="subtitle1">All</Typography>
          </MenuItem>
          {selectedCategory &&
            selectedCategory.subcategories.map((subcategory) => (
              <MenuItem
                key={subcategory}
                onClick={() =>
                  handleSubcategorySelect(selectedCategory.name, subcategory)
                }
              >
                <Typography variant="subtitle1">{subcategory}</Typography>
              </MenuItem>
            ))}
        </Menu>
      </Box>

      {/* Filter Icon */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => setFilterOpen(true)} sx={{ mr: 1 }}>
          <FilterAltIcon />
        </IconButton>
        <Typography variant="h5">Search Results</Typography>
      </Box>

      {/* Sidebar for Filter Component */}
      <FilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        categories={categories.filter((cat) =>
          products.some((product) => product.category === cat.name)
        )}
        commonSizes={commonSizes}
        categoriesWithSizes={categoriesWithSizes}
      />

      {products.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "50vh",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
