import axios from "axios";
import { base_URL } from "../utils";

// export const create_store = async (store_owner_id, shopName, shopType, description, image) => {
//   // console.log('email', email, 'password', password);
//   try {
//     const response = await axiosInstance.post("/store_owners/stores", {
//         store_owner_id: store_owner_id,
//         name: shopName,
//         description: description,
//         shop_type: shopType,
//         image: image,
//     });

//     if (response.data.store_id) {
//       localStorage.setItem("store_id", response.data.store_id);
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };

export const createStore = async (store_owner_id, shopName, shopType, description, image) => {
  try {
    const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage
    const response = await axios.post(
      `${base_URL}/store_owners/stores`,
      {
        store_owner_id: store_owner_id,
        name: shopName,
        description: description,
        shop_type: shopType,
        image: image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};


export const createStoreAndMall = async (data) => {
  try {
    const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage

    if (!token) {
      throw new Error('No access token found');
    }

    const response = await axios.post(
      `${base_URL}/store_owners/create_mall_store`,
      {
        store: {
          store_owner_id: data.store.store_owner_id,
          name: data.store.name,
          description: data.store.description,
          shop_type: data.store.shop_type,
          image: data.store.image,
        },
        mall: {
          name: data.mall.name,
          floor_number: data.mall.floor_number,
          shop_number: data.mall.shop_number,
          description: data.mall.description,
          created_at: data.mall.created_at,
          updated_at: data.mall.updated_at,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating store and mall:', error);
    throw error;
  }
};