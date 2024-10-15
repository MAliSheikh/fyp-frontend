import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('male');

  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  const handleSignup = () => {
    console.log('Signup:', { username, email, password, confirmPassword, gender });
  };

  const handleChangeTab = (event, newValue) => {
    setIsLogin(newValue === 0);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      backgroundColor="#f0f0f0"
      alignItems= "center"
      height="100vh"
    >
      <Paper elevation={3} style={{ padding: '16px', width: '300px' }}>
        <Typography variant="h4" align="center" color="black">
          {isLogin ? 'Login' : 'Signup'}
        </Typography>
        <Tabs value={isLogin ? 0 : 1} onChange={handleChangeTab} centered>
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>
        {isLogin ? (
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
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        ) : (
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
              onClick={handleSignup}
            >
              Signup
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};



export default LoginSignupPage;


