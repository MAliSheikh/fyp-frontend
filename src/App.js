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
import Dashboard from "./seller/dashboard"
import IndependentStores from "../src/independent_stores/IndependentStores";
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
import OrderNow from "./order/OrderNow";
// import Reviews from './profile/Reviews';
// import OrderHistory from './profile/OrderHistory'
import ReviewHistory from './profile/review_history'
import Viewer from './3d_viewer/viewer1'
// import ThreeSixtyVieww from './3d_viewer/view_360'
import Success from './Success'; // Import the Success page
import Cancel from './Cancel';

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
        <Route path="/order-now" element={<PrivateRoute roles={["customer"]}><Layout>{<OrderNow />}</Layout></PrivateRoute>} />
        <Route path="/address" element={<PrivateRoute roles={["customer"]}><Layout>{<AddressInputPage />}</Layout></PrivateRoute>} /> 
        <Route path="/payment" element={<PrivateRoute roles={["customer"]}><Layout>{<PaymentInputPage />}</Layout></PrivateRoute>} />
        <Route path="/buy-now" element={<PrivateRoute roles={["customer"]}><Layout>{<BuyNowPage />}</Layout></PrivateRoute>} />
        <Route path="/add_to_cart" element={<PrivateRoute roles={["customer"]}><Layout>{<AddToCartPage />}</Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute roles={["customer"]}><Layout>{<Profile />}</Layout></PrivateRoute>} />
        {/* <Route path="/review" element={<Reviews />} /> */}
        <Route path="/review" element={<Layout>{<ReviewHistory />}</Layout>} />
        <Route path="/viewer" element={<Layout>{<Viewer />}</Layout>} />
        <Route path="/success" element={<Success/>} />
        <Route path="/cancel" element={<Cancel/>} />
        {/* <Route path="/viewer_360" element={<Layout>{<ThreeSixtyVieww />}</Layout>} /> */}
        <Route
          path="/mall_lists"
          element={<Layout>{<MallListingPage />}</Layout>}
        />
        <Route
          path="/store_lists"
          element={<Layout>{<IndependentStores />}</Layout>}
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
          path="/dashboard"
          element={
            <PrivateRoute roles={["seller"]}>
              <Layout>
                <Dashboard />
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
