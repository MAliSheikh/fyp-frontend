import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Products from "./products/products_page";
import SignUp from "./components/LoginSignup/signup";
import Login from "./components/LoginSignup/login";
import Layout from "./layout";
import Seller from "./seller/store_create";
import MallInfo from "./seller/mall_info";
import StoreInfo from "./seller/store_info";
// import StoreCreatePage from "./seller/store_create";
import ProductDetailsPage from "./products/productInfo";
import PrivateRoute from "./components/privateRoute";
import Unauthorized from "./components/unauthorized";
import UploadProduct from "./seller/upload_product";
import BuyNowPage from "./Buy_now/Buy_now";
import AddToCartPage from "./Add_to_cart/add_to_cart";
import MallListingPage from "./mall_store_listing/mall_list";
import SearchResults from "./products/search_results";
import Profile from "./profile/profile";
import ManageProducts from "./manage_product/manage-products";
import OrdersPage from "./seller/Order";
import MallStores from "./mall_store_listing/mall_stores";
import StoreProducts from "./mall_store_listing/store_products";
import AddressInputPage from "./Address/address";
import PaymentInputPage from "./Payment/payment";

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
        <Route path="/products" element={<Layout>{<Products />}</Layout>} />
        <Route
          path="/products/:id"
          element={<Layout>{<ProductDetailsPage />}</Layout>}
        />
        <Route path="/address" element={<Layout>{<AddressInputPage />}</Layout>} /> 
        <Route path="/payment" element={<Layout>{<PaymentInputPage />}</Layout>} />
        <Route path="/buy-now" element={<Layout>{<BuyNowPage />}</Layout>} />
        <Route path="/add_to_cart" element={<Layout>{<AddToCartPage />}</Layout>} />
        <Route path="/profile" element={<Layout>{<Profile />}</Layout>} />
        <Route
          path="/mall_lists"
          element={<Layout>{<MallListingPage />}</Layout>}
        />

        <Route path="/search" element={<Layout>{<SearchResults />}</Layout>} />
        {/* Seller */}
        <Route
          path="/store_info"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <StoreInfo />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mall"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <MallInfo />
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
        <Route
          path="/orders"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <OrdersPage />
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
        
        <Route path="/orders" element={<Layout>{<OrdersPage />}</Layout>} />
        <Route path="/manageproducts" element={<Layout>{<ManageProducts />}</Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/mall/:mallId/stores" element={<Layout><MallStores /></Layout>} />
        <Route path="/store/:storeId/products" element={<Layout><StoreProducts /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
