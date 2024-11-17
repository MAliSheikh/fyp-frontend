import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from './LoginSignup/components/token';

const PrivateRoute = ({ children, roles }) => {
  const token = authService.getToken1();
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = authService.getUserRole();
  console.log(userRole);
  if (roles && roles.indexOf(userRole) === -1) {
    // Redirect to the appropriate page based on the role
    if (userRole === 'customer') {
      return <Navigate to="/products" />;
    } else if (userRole === 'seller') {
      return <Navigate to="/store_info" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default PrivateRoute;