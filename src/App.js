// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './products/products_page';
import SignUp from './components/LoginSignup/signup';
import Login from './components/LoginSignup/login';
import Layout from './layout';
import Seller from './seller/seller_upload';
import Mall_info from './Mall info/Mall_info';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - shows Products page with Navbar and Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <Mall_info />
            </Layout>
          }
        />
        
        {/* Other routes like Login and Signup without Layout */}
        <Route path="/seller_upload" element={<Seller />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

