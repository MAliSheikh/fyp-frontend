import React from 'react';
import { Box, Typography } from '@mui/material';
// import Navbar from '../components/Header&footer/header';
// import Footer from '../components/Header&footer/footer';
// import Layout  from '../layout';
import Navabr from '../components/Header&footer/header';

const Products = () => {
    return (
        <Box>
            <Navabr />
            <Typography variant="h4">Welcome to the Dashboard!</Typography>
            <Typography variant="body1">You have successfully logged in.</Typography>
        </Box>
    );
};

export default Products;