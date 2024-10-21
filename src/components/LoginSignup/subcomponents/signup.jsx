import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
} from '@mui/material';
import axiosInstance from "../../axiosInstance";
import authService from './token'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');

    const handleCheckboxChange = (event) => {
        setRole(event.target.checked ? 'customer' : 'store owner');
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
            setError(''); // Clear error message if registration is successful
        } else {
            setError(result.error); // Set error message if registration fails
        }
    };

    return (
        <Box component="form" onSubmit={handleSignup}>
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
            <TextField
                label="Username"
                type="text"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            {/* Check boX of is customer or not */}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={role}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                }
                label="Login as a Customer"
            />

            {/* <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                    row
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
            </FormControl> */}
            {error && <Typography color="error">{error}</Typography>}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                // onClick={handleSignup}
                type="submit"
            >
                Signup
            </Button>
        </Box>
    )
}

export default SignUp