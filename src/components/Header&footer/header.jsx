import React, { useState, useEffect, useRef } from "react";
import BNLOGO2 from "../Logos/BNLOGO2.png";
import authService from "../LoginSignup/components/token";
import MallListingPage from "../../mall_store_listing/mall_list";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Hidden,
  Menu,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import axiosInstance from "../axiosInstance";

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#009688",
  boxShadow: "none",
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "4px",
  backgroundColor: "#fff",
  flexGrow: 1, // Allows flexible resizing
  minWidth: "180px", // Prevents search bar from collapsing
  maxWidth: "580px",
  margin: "0 15px",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")({
  position: "absolute",
  right: "20px",
  top: "52%",
  transform: "translateY(-50%)",
  color: "#119994",
  padding: "2px",
});

const StyledInputBase = styled(InputBase)({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "8px 16px",
    width: "100%",
  },
});

const NavButton = styled(Button)({
  color: "#fff",
  textTransform: "none",
  padding: "6px 15px",
});

const AutocompleteResults = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  boxShadow: theme.shadows[3],
  zIndex: 1,
  maxHeight: "200px",
  overflowY: "auto",
}));

const AutocompleteResultItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
    '& .MuiTypography-root': {
      color: 'gray',
    },
  },
  '& .MuiTypography-root': {
    color: 'black',
  },
}));

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Check token status whenever component mounts or auth state changes
    const checkLoginStatus = () => {
      const token = authService.getToken1();
      setIsLoggedIn(!!token); // Convert token to boolean
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes (in case token is removed in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []); // Empty dependency array since we're setting up listeners

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate("/");
  };
  const navItems = ["Men", "Women", "Kids", "Beauty", "Others"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search_string=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fetchAutocompleteResults = async (query) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products/autocomplete', {
        params: {
          query,
          limit: 10,
        },
      });
      setAutocompleteResults(response.data);
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (query.trim()) {
        fetchAutocompleteResults(query);
      } else {
        setAutocompleteResults([]);
      }
    }, 300); // Debounce time of 300ms
  };

  return (
    <Box>
      {/* Top Bar */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: "8px 0" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
              <Box
                component="img"
                onClick={()=>{navigate("/")} }
                src={BNLOGO2}
                alt="Bazaar Nest logo"
                sx={{
                  height: 70,
                  width: 140,
                  borderRadius: "0%",
                  padding: 2,
                  marginRight: 32,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />

            {/* Category Dropdown */}
            {/* <FormControl variant="standard">
              <CategorySelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                IconComponent={ArrowDownIcon}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="clothes">Clothes</MenuItem>
                <MenuItem value="shoes">Shoes</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
              </CategorySelect>
            </FormControl> */}

            {/* Search Bar */}
            <SearchWrapper>
              <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
                <StyledInputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <SearchIconWrapper>
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </SearchIconWrapper>
                {autocompleteResults.length > 0 && (
                  <AutocompleteResults>
                    {loading ? (
                      <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress size={16} />
                      </Box>
                    ) : (
                      autocompleteResults.map((result, index) => (
                        <AutocompleteResultItem key={index} onClick={() => navigate(`/search?search_string=${encodeURIComponent(result.value)}`)}>
                          <Typography variant="body2">
                            {result.type === "product" && `Product: ${result.value}`}
                            {result.type === "category" && `Category: ${result.value}`}
                            {result.type === "subcategory" && `Subcategory: ${result.value}`}
                            {result.type === "brand" && `Brand: ${result.value}`}
                          </Typography>
                        </AutocompleteResultItem>
                      ))
                    )}
                  </AutocompleteResults>
                )}
                {loading && (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={16} />
                  </Box>
                )}
              </form>
            </SearchWrapper>

            {/* Right Side Menu */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 },
              }}
            >
              {!isMobile && (
                <>
                  {isLoggedIn ? (
                    <NavButton onClick={handleLogout}>Logout</NavButton>
                  ) : (
                    <NavButton onClick={() => navigate("/login")}>
                      Login
                    </NavButton>
                  )}
                  
                </>
              )}
              <IconButton color="inherit" onClick={() => navigate("/add_to_cart")}>
                <Badge badgeContent={0} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate("/profile")}>
                <PersonIcon />
              </IconButton>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: '#009688',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  },
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '14px',
                  padding: '6px 16px'
                }}
                onClick={() => navigate("/mall_lists")}
              >
                Malls
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: '#009688',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  },
                  textTransform: 'none',
                  fontWeight: 'medium',
                  fontSize: '14px',
                  padding: '6px 16px'
                }}
                onClick={() => navigate("/store_lists")}
              >
                Stores
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Bottom Navigation */}
        {!isMobile && (
          <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
            <Container maxWidth="xl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  py: 1,
                  gap: 5,
                }}
              >
                {navItems.map((item) => (
                  <NavButton key={item}>{item}</NavButton>
                ))}
              </Box>
            </Container>
          </Box>
        )}
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: "#009688",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
            Menu
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
            {isLoggedIn ? (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => navigate("/login")}>
                <ListItemText primary="Login" />
              </ListItem>
            )}
            {/* <ListItem button onClick={() => navigate("/login")}>
              <ListItemText primary="Login" />
            </ListItem> */}
            <ListItem button>
              <ListItemText primary="Order & Returns" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
