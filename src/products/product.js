import axios from 'axios';
import { base_URL } from '../utils';

export const fetchProducts = async (skip = 0, limit = 10) => {
  try {
    const response = await axios.get(`${base_URL}/products`, {
      params: {
        skip: skip,
        limit: limit
      },
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductDetails = async (id) => {
  try {
    const response = await axios.get(`${base_URL}/products/${id}`, {
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchProductByIdDetails = async (id) => {
  try {
    const response = await axios.get(`${base_URL}/products/${id}`, {
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};