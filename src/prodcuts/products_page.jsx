import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import authService from '../components/LoginSignup/components/token'
import { useNavigate } from 'react-router-dom';


const Products = () => {
    const navigate = useNavigate(); 
    
    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true })
    };

    return (
        <Box>
            <Typography variant="h4">Welcome to the Dashboard!</Typography>
            <Typography variant="body1">You have successfully logged in.</Typography>


            <Button
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
    );
};

export default Products;