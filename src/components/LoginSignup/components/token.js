import axiosInstance from "../../axiosInstance";
import { base_URL } from "../../../utils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const login = async (email, password) => {
  try {
    // console.log('email', email, 'password', password);
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

const getToken1 = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    console.log('jwtDecode(token)', jwtDecode(token));
    return jwtDecode(token);
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

const getUserRole = () => {
  const token = getToken1();
  if (!token) return null;

  try {
    // const decodedToken = jwtDecode(token);
    console.log("decodedToken", token.role);
    return token.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const register = (email, password, username, role) => {
  return axios
    .post(`${base_URL}/users/register`, {
      email: email,
      password: password,
      name: username,
      role: role,
    })
    .then((response) => {
      return { success: true, data: response.data };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.response ? error.response.data.detail : error.message,
      };
    });
};

const authService = {
  login,
  refreshToken,
  getToken1,
  logout,
  getToken,
  register,
  getUserRole,
};

export default authService;
