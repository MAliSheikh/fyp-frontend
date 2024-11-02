// Layout.js
import React from 'react';
import Navbar from './header';
import Footer from './footer';
import { Box } from '@mui/material';

function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />            {/* Header component at the top */}
      <Box component="main" flexGrow={1} p={3}>
        {children}          {/* Main content for each route */}
      </Box>
      <Footer />            {/* Footer component at the bottom */}
    </Box>
  );
}

export default Layout;
