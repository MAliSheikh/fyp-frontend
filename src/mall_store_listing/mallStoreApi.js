import axios from 'axios';
import { base_URL } from '../utils';

export const fetchMallStores = async (mallId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${base_URL}/store/mall/${mallId}/stores`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mall stores:', error);
    throw error;
  }
};

export const fetchStoreProducts = async (storeId) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${base_URL}/products/store/${storeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching store products:', error);
    throw error;
  }
};

export const fetchMallInfo = async (mallId) => {
  try {
    const response = await fetch(`${base_URL}/store/mall/${mallId}/info`);
    if (!response.ok) {
      throw new Error('Failed to fetch mall info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching mall info:', error);
    throw error;
  }
}; 