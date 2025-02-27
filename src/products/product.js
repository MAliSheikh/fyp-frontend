import axios from 'axios';
import { base_URL } from '../utils';

export const fetchProducts = async (skip = 0, limit = 10) => {
  try {
    const response = await axios.get(`${base_URL}/products/`, {
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

export const searchProducts = async (searchParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Only add parameters that are provided
    if (searchParams.search_string) {
      queryParams.append('search_string', searchParams.search_string);
    }
    if (searchParams.category) {
      queryParams.append('category', searchParams.category);
    }
    if (searchParams.subcategory) {
      queryParams.append('subcategory', searchParams.subcategory);
    }
    if (searchParams.min_price) {
      queryParams.append('min_price', searchParams.min_price);
    }
    if (searchParams.max_price) {
      queryParams.append('max_price', searchParams.max_price);
    }

    const response = await axios.get(
      `${base_URL}/products/search?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};