import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Menu icon for mobile view */}
        <IconButton 
          color="inherit" 
          edge="start" 
          onClick={toggleDrawer} 
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title / Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>

        {/* Buttons for desktop view */}
        <div sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Services</Button>
          <Button color="inherit">Contact</Button>
        </div>

        {/* Drawer for mobile view */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button onClick={toggleDrawer}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
