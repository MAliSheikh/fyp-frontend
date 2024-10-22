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

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('male');
    const [error, setError] = useState(null); // Initialize error state


    const handleSignup = (event) => {
        event.preventDefault();
        
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const url = 'http://localhost:8000/users/register';
        const data = {
            name: username,
            email,
            password,
            gender,
        };

        axios.post(url, data)
            .then(response => {
                console.log('Signup successful:', response.data);
                alert('Signup successful! You can now login.');
                // Optionally, redirect to login page or show a success message
            })
            .catch(error => {
                console.error('Signup error:', error.response ? error.response.data : error.message);
                alert('Signup failed. Please try again.');
            });
    };

    return (
        <Box component="form" onSubmit={handleSignup}>
            <TextField
                label="Username"
                type="text"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
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
            <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                    row
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
            >
                Signup
            </Button>
        </Box>
    )
}

export default SignUp