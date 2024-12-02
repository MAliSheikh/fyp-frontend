import axiosInstance from "../../axiosInstance";
import { base_URL } from "../../../utils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Add an interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const login = async (email, password) => {
  try {
    // console.log('email', email, 'password', password);
    const response = await axiosInstance.post("/users/token", {
      username: email,
      password: password,
    });

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      const decodedToken = jwtDecode(response.data.access_token);
      localStorage.setItem("userId", decodedToken?.id);
      // localStorage.setItem("store_id", response?.store_id || null);
      // localStorage.setItem("mall_id", response?.mall_id || null);
      localStorage.setItem("userRole", decodedToken.role);
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
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("store_id");
  localStorage.removeItem("mall_id");
  localStorage.removeItem("store_owner_id");
};

// const getToken = () => {
//   return JSON.parse(localStorage.getItem("access_token"));
// };

// Changed this function
const getToken = () => {
  return localStorage.getItem("access_token"); // Remove JSON.parse
};

const getToken1 = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    console.log("jwtDecode(token)", jwtDecode(token));
    // localStorage.setItem("userId", token.id);
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
// const fetchStoreOwnerId = async (userId) => {
//   try {
//     const response = await axiosInstance.get(`/store_owners/store_owner/${userId}`);
//     if (response.data) {
//       localStorage.setItem("store_owner_id", response.data.store_owner_id);
//     }
//     return response.data.store_owner_id;
//   } catch (error) {
//     console.error("Error fetching store owner ID:", error);
//     throw error;
//   }
// };
const fetchStoreInfo = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("access_token");

    if (!userId || !token) {
      throw new Error("Missing userId or token");
    }

    const response = await axios.get(`${base_URL}/store/${userId}/store-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data) {
      localStorage.setItem("store_id", response.data.store_id);
      console.log("Store ID saved:", response.data.store_id);
      localStorage.setItem("mall_id", response.data.mall_id);
      console.log("Mall ID saved:", response.data.mall_id);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching store info:", error);
    throw error;
  }
};

const authService = {
  fetchStoreInfo,
  login,
  refreshToken,
  getToken1,
  logout,
  getToken,
  register,
  getUserRole,
  // fetchStoreOwnerId
};

export default authService;
