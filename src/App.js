import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./products/products_page";
import SignUp from "./components/LoginSignup/signup";
import Login from "./components/LoginSignup/login";
import Layout from "./layout";
import Seller from "./seller/store_create";
// import Mall_info from "./Mall/Mall_info";
import StoreCreatePage from "./seller/store_create";
import ProductDetailsPage from "./products/productInfo";
import PrivateRoute from "./components/privateRoute";
import Unauthorized from "./components/unauthorized";
import UploadProduct from "./seller//upload_product";
import BuyNowPage from "./Buy_now/Buy_now";
import AddToCartPage from "./Add_to_cart/add_to_cart";

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
        <Route
          path="/products"
          element={<Layout>{<Products />}</Layout>}
        />
        <Route
          path="/products/:id"
          element={<Layout>{<ProductDetailsPage />}</Layout>}
        />
        <Route
        path="/buy-now" element={<Layout>{<BuyNowPage />}</Layout>}
        />
        <Route
        path="/add-to-cart" element={<Layout>{<AddToCartPage />}</Layout>}
        />


        {/* Seller */}
        <Route
          path="/store_info"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <StoreCreatePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/upload-product"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <UploadProduct />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/mall_info"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <Mall_info />
              </Layout>
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/seller_upload"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <Seller />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Admin */}
        {/* <Route
          path="/admin_page"
          element={
            <PrivateRoute roles={['admin']}>
              <Layout>
                <AdminPage />
              </Layout>
            </PrivateRoute>
          }
        /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
