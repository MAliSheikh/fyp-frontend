import axios from 'axios'
import axiosInstance from "../components/axiosInstance";

export const fetchMessagesByUser = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const storeId = localStorage.getItem('currentStoreId');
    const response = await axiosInstance.get(`/messages/user/${userId}`);
    return response.data.filter(msg => msg.store_id === parseInt(storeId));
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return [];
  }
};

export const fetchMessagesByStore = async () => {
  try {
    const storeId = localStorage.getItem('store_id');
    const userId = localStorage.getItem('chatUserId'); // We'll set this when navigating to chat
    const response = await axiosInstance.get(`/messages/store/${storeId}`);
    return response.data.filter(msg => msg.user_id === parseInt(userId));
  } catch (error) {
    console.error("Error fetching store messages:", error);
    return [];
  }
};

// src/chat/chat.js
export const sendMessage = async (messageData) => {
  try {
    // We now receive the complete messageData object from handleSendMessage
    const response = await axios.post('http://localhost:8000/messages/', messageData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;  
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const getLatestMessage = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const storeId = localStorage.getItem('role') === 'seller' ?
      localStorage.getItem('store_id') : localStorage.getItem('currentStoreId');

    let url;
    if (localStorage.getItem('role') === 'seller') {
      url = `/messages/store/${storeId}/latest`;
    } else {
      url = `/messages/user/${userId}/latest?store_id=${storeId}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error checking for new messages:", error);
    return null;
  }
};