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
    const params = new URLSearchParams();
    
    if (searchParams.search_string) params.append('search_string', searchParams.search_string);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.subcategory) params.append('subcategory', searchParams.subcategory);
    if (searchParams.min_price) params.append('min_price', searchParams.min_price);
    if (searchParams.max_price) params.append('max_price', searchParams.max_price);
    if (searchParams.brand) params.append('brand', searchParams.brand);
    
    // Handle sizes array correctly - append each size individually with the same key
    if (searchParams.sizes && Array.isArray(searchParams.sizes) && searchParams.sizes.length > 0) {
      searchParams.sizes.forEach(size => {
        params.append('sizes', size);
      });
    }
    
    const response = await axios.get(`${base_URL}/products/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};