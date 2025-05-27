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
  Dialog,
  DialogContent,
  Slide,
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
import axios from "axios";
import axiosInstance from "../axiosInstance";
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ChattingPanel from "../../chat/chatPanel";
import ChatIcon from '@mui/icons-material/Chat';

// import { categories } from "../../seller/category";

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#009688",
  boxShadow: "none",
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "4px",
  backgroundColor: "#fff",
  flexGrow: 1,
  minWidth: "180px",
  maxWidth: "580px",
  margin: "0 8px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    margin: "0 4px",
    minWidth: "120px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#119994",
  padding: "2px",
}));

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
  zIndex: 1000,
  maxHeight: "250px",
  overflowY: "auto",
  borderRadius: "0 0 4px 4px",
}));

const AutocompleteItem = styled(Box)(({ theme }) => ({
  padding: "10px 16px",
  borderBottom: "1px solid #f0f0f0",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&:last-child": {
    borderBottom: "none",
  },
  color: "black",
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const updateSearchHistory = (searchString) => {
  try {
    // Get existing search history
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // Add new search string to the beginning
    searchHistory.unshift(searchString);
    
    // Keep only the last 5 searches
    const updatedHistory = searchHistory.slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    return updatedHistory;
  } catch (error) {
    console.error('Error updating search history:', error);
    return [];
  }
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Check if current path is admin or seller dashboard
  const isAdminOrSellerPath = () => {
    const path = window.location.pathname;
    return path.includes('/admin') || path.includes('/seller');
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const userRole = authService.getUserRole();

  useEffect(() => {
    // Check token status whenever component mounts or auth state changes
    const checkLoginStatus = () => {
      const token = authService.getToken1();
      setIsLoggedIn(!!token); // Convert token to boolean
    };

    checkLoginStatus();

    // Add event listener for storage changes (in case token is removed in another tab)
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []); // Empty dependency array since we're setting up listeners

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate("/");
  };
  // const navItems = ["Men", "Women", "Kids", "Beauty", "Others"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update search history
      updateSearchHistory(searchQuery.trim());

      // Construct the search URL with category and subcategory
      const searchUrl = `/search?search_string=${encodeURIComponent(searchQuery.trim())}` +
        (category ? `&category=${encodeURIComponent(category)}` : "");
      navigate(searchUrl);
      setShowResults(false);
      setSearchDialogOpen(false);
    }
  };

  const fetchAutocompleteResults = async (query) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products/autocomplete", {
        params: {
          query,
          limit: 10,
        },
      });
      setAutocompleteResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
      setAutocompleteResults([]);
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
        setShowResults(false);
      }
    }, 300);
  };

  const handleAutocompleteClick = (suggestion) => {
    const selectedText = suggestion.value;
    setSearchQuery(selectedText);
    setShowResults(false);
    setSearchDialogOpen(false);

    // Update search history
    updateSearchHistory(selectedText);

    navigate(`/search?search_string=${encodeURIComponent(selectedText)}` +
      (category ? `&category=${encodeURIComponent(category)}` : "") +
      (subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : ""));
  };

  const renderSearchBar = () => (
    <SearchWrapper ref={searchRef}>
      <form onSubmit={handleSearch} style={{ width: "100%", display: "flex", position: "relative" }}>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={handleInputChange}
          onClick={() => {
            if (autocompleteResults.length > 0) {
              setShowResults(true);
            }
          }}
          inputRef={inputRef}
        />
        <SearchIconWrapper>
          <IconButton type="submit" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </SearchIconWrapper>
        {showResults && autocompleteResults.length > 0 && (
          <AutocompleteResults>
            {autocompleteResults.map((result, index) => (
              <AutocompleteItem
                key={index}
                onClick={() => handleAutocompleteClick(result)}
              >
                <Typography variant="body2">{result.value}</Typography>
              </AutocompleteItem>
            ))}
          </AutocompleteResults>
        )}
      </form>
    </SearchWrapper>
  );

  return (
    <Box>
      {/* Top Bar */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: { xs: "4px 0", sm: "8px 0" }, flexWrap: isSmallMobile ? "wrap" : "nowrap" }}>
            {isMobile && !isAdminOrSellerPath() && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ padding: { xs: 0.5, sm: 1 } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component="img"
              onClick={() => {
                const userRole = authService.getUserRole();
                if (userRole !== 'seller' && userRole !== 'admin') {
                  navigate("/");
                }
              }}
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
            {/* Search Bar - Only show on larger screens and not in admin/seller */}
            {!isSmallMobile && !isAdminOrSellerPath() && userRole !== 'seller' && renderSearchBar()}

            {/* Right Side Menu */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1, md: 2 },
                ml: "auto",
              }}
            >
              {!isMobile && (
                <>
                  {isLoggedIn ? (
                    <NavButton onClick={handleLogout}>Logout</NavButton>
                  ) : (
                    !isAdminOrSellerPath() && userRole !== 'seller' && (
                      <NavButton onClick={() => navigate("/login")}>
                        Login
                      </NavButton>
                    )
                  )}
                </>
              )}
              {!isMobile && (
                <>
                  {!isAdminOrSellerPath() && userRole !== 'seller' && (
                    <IconButton
                      color="inherit"
                      onClick={() => navigate("/add_to_cart")}
                    >
                      <Badge badgeContent={0} color="error">
                        <CartIcon />
                      </Badge>
                    </IconButton>
                  )}
                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/chat")}
                  >
                    <InsertCommentOutlinedIcon />
                  </IconButton>
                  {!isAdminOrSellerPath() && userRole !== 'seller' && (
                    <IconButton color="inherit" onClick={() => navigate("/profile")}>
                      <PersonIcon />
                    </IconButton>
                  )}
                  {!isAdminOrSellerPath() && userRole !== 'seller' && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#fff",
                          color: "#009688",
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                          },
                          textTransform: "none",
                          fontWeight: "medium",
                          fontSize: "14px",
                          padding: "6px 16px",
                        }}
                        onClick={() => navigate("/mall_lists")}
                      >
                        Malls
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#fff",
                          color: "#009688",
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                          },
                          textTransform: "none",
                          fontWeight: "medium",
                          fontSize: "14px",
                          padding: "6px 16px",
                        }}
                        onClick={() => navigate("/store_lists")}
                      >
                        Stores
                      </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Bottom Navigation
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
        )} */}
      </StyledAppBar>

      {/* Mobile Drawer - Only show if not in admin/seller */}
      {!isAdminOrSellerPath() && (
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Menu
              </Typography>
              <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Search Bar in Mobile Drawer */}
            {userRole !== 'seller' && (
              <Box sx={{ mb: 2 }}>
                {renderSearchBar()}
              </Box>
            )}

            <List>
              {userRole !== 'seller' && (
                <>
                  <ListItem button onClick={() => { navigate("/mall_lists"); setMobileOpen(false); }}>
                    <ListItemText primary="Malls" />
                  </ListItem>
                  <ListItem button onClick={() => { navigate("/store_lists"); setMobileOpen(false); }}>
                    <ListItemText primary="Stores" />
                  </ListItem>
                  <ListItem button onClick={() => { navigate("/add_to_cart"); setMobileOpen(false); }}>
                    <ListItemText primary="Cart" />
                  </ListItem>
                  <ListItem button onClick={() => { navigate("/profile"); setMobileOpen(false); }}>
                    <ListItemText primary="Profile" />
                  </ListItem>
                </>
              )}
              {userRole === 'seller' && (
                <ListItem button onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              )}
              <ListItem button onClick={() => { navigate("/chat"); setMobileOpen(false); }}>
                <ListItemText primary="Chats" />
              </ListItem>
              {isLoggedIn ? (
                <ListItem button onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                userRole !== 'seller' && (
                  <ListItem button onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                    <ListItemText primary="Login" />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Header;
