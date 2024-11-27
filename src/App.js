// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/graph";
import Layout from "./layout";  // Assuming you have a Layout component
import SignUp from "./components/LoginSignup/signup";
import Login from "./components/LoginSignup/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="graph" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
