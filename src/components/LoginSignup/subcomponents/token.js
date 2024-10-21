import axiosInstance from "../../axiosInstance";

const login = (email, password) => {
  return axiosInstance
    .post("/users/token", {
      username: email,
      password: password,
    })
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem("access_token", JSON.stringify(response.data.access_token));
      }
      return response.data;
    });
};

const refreshToken = async (email, password) => {
  try {
    const response = await axiosInstance.post("/users/token", {
      username: email,
      password: password,
    });
    if (response.data.access_token) {
      localStorage.setItem("access_token", JSON.stringify(response.data.access_token));
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
  return axiosInstance
    .post("/users/register", {
      email: email,
      password: password,
      username: username,
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