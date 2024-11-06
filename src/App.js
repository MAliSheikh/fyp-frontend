// App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './product_by_id/product_by_id';
import Products from './products/products_page';
import SignUp from './components/LoginSignup/signup';
import Login from './components/LoginSignup/login';
import Layout from './layout';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - shows Products page with Navbar and Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <Products />
            </Layout>
          }
          
        />
        {/* Route for Product by ID page */}
        <Route
          path="/product/:id"  // Adjust the path as needed, e.g., /product/1
          element={
            <Layout>
              <ProductPage />
            </Layout>
          }
        />
        {/* Other routes like Login and Signup without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

