import axios from 'axios';
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();

                const url = 'http://localhost:8000/users/token';
                const data = new URLSearchParams();
                data.append('username', email);  // Use 'username' instead of 'email'
                data.append('password', password);

                axios.post(url, data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then(response => {
                    console.log('Login successful:', response.data);
                    const { access_token } = response.data;
                    localStorage.setItem('token', access_token);  // Store token for future use
                    alert('Login successful!');
                })
                .catch(error => {
                    console.error('Login error:', error.response ? error.response.data : error.message);
                    alert('Login failed. Please check your credentials and try again.');
                });
    };

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

export default Login