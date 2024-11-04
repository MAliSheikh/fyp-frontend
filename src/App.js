// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './products/products_page';
import SignUp from './components/LoginSignup/signup';
import Login from './components/LoginSignup/login';
import Layout from './layout';

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
        
        {/* Other routes like Login and Signup without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

