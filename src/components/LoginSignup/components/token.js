import axiosInstance from "../../axiosInstance";
import { base_URL } from "../../../utils";
import axios from "axios";

const login = async (email, password) => {
  try {
     // const response = await axios.post(`${base_URL}/users/token`, {
    //   username: email,
    //   password: password,
    // }, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",

    //   }
    // });

    // Check if the user is already logged in
    // const existingToken = localStorage.getItem("access_token");
    // if (existingToken) {
    //   console.log("User is already logged in");
    //   return { message: "You are already logged in" };
    // }

    console.log('email', email, 'password', password);
    const response = await axiosInstance.post("/users/token", {
      username: email,
      password: password,
    });

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const refreshToken = async (email, password) => {
  try {
     // const response = await axios.post(`${base_URL}/users/token`, {
    //   username: email,
    //   password: password,
    // }, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",

    //   }
    // });
    const response = await axiosInstance.post("/users/token", {
      username: email,
      password: password,
    });
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      return response.data.access_token;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
  return null;
};

const logout = () => {
  localStorage.removeItem("access_token");
};

const getToken = () => {
  return JSON.parse(localStorage.getItem("access_token"));
};

const register = (email, password, username, role) => {
  return axios.post(`${base_URL}/users/register`, {
      email: email,
      password: password,
      name: username,
      role: role,
    })
    .then((response) => {
      return { success: true, data: response.data };
    })
    .catch((error) => {
      return { success: false, error: error.response ? error.response.data.detail : error.message };
    });
};

const authService = {
  login,
  refreshToken,
  logout,
  getToken,
  register,
};

export default authService;