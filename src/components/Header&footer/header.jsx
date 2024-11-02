import React, { useState } from 'react';
import logo from 'D:/frontend/fyp-frontend/src/components/Logos/logo.png';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#009688',
  boxShadow: 'none',
}));

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '600px',
  margin: '0 16px',
}));

const SearchIconWrapper = styled('div')({
  position: 'absolute',
  right: '20px',
  top: '58%',
  transform: 'translateY(-50%)',
  color: '#119994',
  padding: '2px',
});

const StyledInputBase = styled(InputBase)({
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '8px 16px',
    width: '100%',
  },
});

const NavButton = styled(Button)({
  color: '#fff',
  textTransform: 'none',
  padding: '6px 15px'
});

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const navItems = ['Men', 'Women', 'Kids', 'Beauty', 'Others'];

  return (
    <Box>
      {/* Top Bar */}
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: '8px 0' }}>
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
              src={logo}
              alt = "Bazaar Nest logo"
              sx={{
                height: 100,
                width: 100,
                borderRadius: '50%',
                padding: 0,
                marginRight: 50,
                objectFit: 'cover',
              }}
            />

            {/* Search Bar */}
            <SearchWrapper>
              <StyledInputBase
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              />
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            </SearchWrapper>

            {/* Right Side Menu */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 1, md: 2 }
            }}>
              {!isMobile && (
                <>
                  <NavButton>Login</NavButton>
                  <NavButton>Order & Returns</NavButton>
                </>
              )}
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <PersonIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Bottom Navigation */}
        {!isMobile && (
          <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)' }}>
            <Container maxWidth="xl">
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'right',
                py: 1,
                gap: 7
              }}>
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
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#009688',
            color: '#fff',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
            Menu
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
            <ListItem button>
              <ListItemText primary="Login" />
            </ListItem>
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