import axios from "axios";
import authService from "../components/LoginSignup/subcomponents/token";
import { base_URL } from "../utils";

// const baseURL = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: base_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = authService.getToken();
    if (token) {
      try {
        // Check if the token has expired
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          // Token has expired, fetch a new one
          const newToken = await authService.refreshToken(decodedToken.username, decodedToken.password);
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;