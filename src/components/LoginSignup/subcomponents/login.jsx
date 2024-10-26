import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography
} from '@mui/material';
import authService from './token'
import { useNavigate } from 'react-router-dom';

const LoginSS = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    // const handleLogin = () => {
    //             const data = {email, password}
    //             const url = 'http://localhost:8000/users/token';
    //             axios.post(url, data)
    //                 .then(response => {
    //                     console.log('Login successful:', response.data);
    //                     const { token } = response.data;

    //                     localStorage.setItem('token', token);
    //                 })
    //                 .catch(error => {
    //                     console.error('Login error:', error);

    //                 });
    // };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const response = await authService.login(email, password);
            if (response.access_token) {
                console.log('response: success');
                navigate('/products');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Incorrect username or password.');
            } else {
                setError('Login failed. Please try again later.');
            }
        }
    };
    console.log('Login:', { email, password });

    return (
        <Box component="form" onSubmit={handleLogin}>
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
            >
                Login
            </Button>
        </Box>
    )
}

export default LoginSS