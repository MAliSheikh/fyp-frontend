import axiosInstance from "../../axiosInstance";

const create_store = async (shopName, shopType, description, image) => {
  try {
    // console.log('email', email, 'password', password);
    const response = await axiosInstance.post("/store_owners/stores", {
        name: shopName,
        description: description,
        shop_type: shopType,
        image: image
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