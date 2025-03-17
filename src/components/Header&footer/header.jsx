import React, { useState, useEffect } from "react";
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

const CategorySelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#fff",
  minWidth: 130, // Adjust as needed
  height: 40, // Fixed height for consistency
  borderRadius: "4px 0 0 4px",
  marginRight: "10px", // Add space between dropdown and searchbar
  '& .MuiSelect-select': {
    padding: "8px 32px 8px 12px",
    display: "flex",
    alignItems: "center", // Changed from 'left' to 'center' for better alignment
    fontSize: "0.9rem",
  },
  '&:before, &:after': {
    display: "none",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: "none", // Removes unwanted border
  },
  '& .MuiSelect-icon': {
    right: 10, // Keeps arrow properly positioned
  },
  // Add hover effect for better interactivity
  '&:hover': {
    backgroundColor: alpha("#fff", 0.9),
  },
  // Add transition for smooth hover effect
  transition: 'background-color 0.3s ease',
}));


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

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
      navigate(`/search?search_string=${encodeURIComponent(searchQuery.trim())}&category=${category}`);
    }
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

            {/* Search Bar with Category Dropdown */}
            <SearchWrapper>
              <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
                <FormControl variant="standard">
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
                </FormControl>
                <StyledInputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIconWrapper>
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </SearchIconWrapper>
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
