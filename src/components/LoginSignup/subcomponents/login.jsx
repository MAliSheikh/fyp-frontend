import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
// import { login } from './token'
import authService from './token'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    console.log('Login:', { email, password });
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
        const loginSuccess = await authService.login(email, password);
        if (loginSuccess) {
            // Redirect the user to the desired page (e.g., /docs)
            // window.location.href = 'http://localhost:8000/docs';
            // console.log('response:', loginSuccess); 
            console.log('response: success'); 
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