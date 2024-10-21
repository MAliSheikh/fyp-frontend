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

    const handleLogin = () => {
      
                const url = 'http://localhost:8000/users/login';
                axios.post(url, { email, password })
                    .then(response => {
                        console.log('Login successful:', response.data);
                        const { token } = response.data;

                        localStorage.setItem('token', token);
                    })
                    .catch(error => {
                        console.error('Login error:', error);
                    
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