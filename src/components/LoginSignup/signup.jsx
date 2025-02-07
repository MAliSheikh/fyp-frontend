import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    Link,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from './components/token'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    console.log('Role:', username);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleCheckboxChange = (event) => {
        setRole(event.target.checked ? 'customer' : 'seller');
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const result = await authService.register(email, password, username, role);
        if (result.success) {
            console.log('Registration successful');
            navigate('/login');
            setError('');
        } else {
            setError(result.error);
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
                onSubmit={handleSignup}
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
                    Create Account
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
                    fullWidth
                    label="Enter Username"
                    variant="outlined"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

                <TextField
                    label="Confirm Password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                    }}
                    required
                />
                <FormControlLabel
                    sx={{ 
                        mt: -2,
                        mb: -2,
                        '& .MuiTypography-root': {
                            fontSize: isMobile ? '0.875rem' : '1rem'
                        }
                    }}
                    control={
                        <Checkbox
                            checked={role === 'customer'}
                            onChange={handleCheckboxChange}
                        />
                    }
                    label="Login as a Customer"
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
                        href="/login"
                        underline="hover"
                        sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontSize: isMobile ? '0.875rem' : '1rem'
                        }}
                    >
                        Sign In...
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

export default SignUp;