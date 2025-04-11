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

export const fetchRecommendations = async ({ productnames, skip = 0, limit = 10, page_size = 10 }) => {
  try {
    // Build the URL with proper parameters
    let url = `${base_URL}/recommendations/?skip=${skip}&limit=${limit}&page_size=${page_size}`;
    
    // Add productnames if provided
    if (productnames && productnames.length > 0) {
      productnames.forEach((name, index) => {
        url += `&product_names=${encodeURIComponent(name)}`;
      });
    }
    
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json'
      }
    });
    
    // Return the recommendations array from the response
    return response.data.recommendations || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Utility function to manage search history
export const updateSearchHistory = (searchString) => {
  try {
    // Get existing search history
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // Add new search string to the beginning
    searchHistory.unshift(searchString);
    
    // Keep only the last 5 searches
    const updatedHistory = searchHistory.slice(0, 5);
    
    // Save back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    return updatedHistory;
  } catch (error) {
    console.error('Error updating search history:', error);
    return [];
  }
}; 