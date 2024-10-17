import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import SignUp from './subcomponents/signup';
import Login from './subcomponents/login';


const LoginSignupPage = () => {
  const [tabValue, setTabValue] = useState(true);


  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue === 0);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      backgroundColor="#f0f0f0"
      alignItems="center"
      height="100vh"
    >
      <Paper elevation={3} style={{ padding: '16px', width: '300px' }}>
        <Typography variant="h4" align="center" color="black">
          {tabValue ? 'Login' : 'Signup'}
        </Typography>

        <Tabs value={tabValue ? 0 : 1} onChange={handleChangeTab} centered>
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        {tabValue ? (
          <Login />
        ) : (
          <SignUp />
        )}

      </Paper>
    </Box>
  );
};

export default LoginSignupPage;
