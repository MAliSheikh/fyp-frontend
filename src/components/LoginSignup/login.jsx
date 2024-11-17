import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    Link
} from '@mui/material';
import authService from './components/token'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            console.log('email:', email, password);
            const response = await authService.login(email, password);
            console.log('response:', response);
            if (response.access_token) {
                const userRole = authService.getUserRole();
                console.log(userRole)
                if (userRole === 'customer') {
                    navigate('/products');
                } else if (userRole === 'seller') {
                    navigate('/store_info');
                } else if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/unauthorized');
                }
            }
            // if (response.access_token) {
            //     console.log('response: success');
            //     navigate('/products');
            // }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Incorrect username or password.');
            } else {
                setError('Login failed. Please try again later.');
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: isMobile ? '20px' : 0,
                backgroundColor: '#f5f5f5'
            }}
        >
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    px: isMobile ? 2 : 4,
                    py: 3,
                    borderRadius: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    width: {
                        xs: '100%',
                        sm: '300px',
                        md: '300px',
                        lg: '300px'
                    },
                    maxWidth: '95%',
                    margin: isMobile ? '20px 0' : 'auto'
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    align="center"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    Login Account
                </Typography>

                <TextField
                    label="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    type="email"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                    }}
                    required
                />

                <TextField
                    label="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    type="password"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                    }}
                    required
                />


                {error && (
                    <Typography
                        color="error"
                        sx={{
                            fontSize: isMobile ? '0.875rem' : '1rem',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        py: isMobile ? 1.2 : 1.5,
                        borderRadius: '8px',
                        backgroundColor: '#009688',
                        '&:hover': {
                            backgroundColor: '#00796b',
                        },
                        textTransform: 'none',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                    }}
                >
                    Submit
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Link
                        href="/signup"
                        underline="hover"
                        sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: isMobile ? '0.875rem' : '1rem'
                        }}
                    >
                        Sign Up...
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

export default Login