import axiosInstance from "../components/axiosInstance";
import axios from 'axios'

// Fetch user chat data 
export const fetchUserChatData = async (userId) => {
  try {
    const response = await axiosInstance.get(`/messages/chat/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user chat data:', error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (payload) => {
  try {
    // const config = {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // };
    
    const response = await axios.post('http://localhost:8000/messages/', payload);
    // const response = await axiosInstance.post('/messages/', payload, config);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Process and merge chat data from both user and store responses
export const processChatData = (data) => {
  // Determine if this is a seller or customer response
  const isSeller = data.role === 'seller';
  const chats = data.chats || [];
  
  return chats.map(chat => {
    return {
      user_id: chat.user_id,
      store_id: chat.store_id,
      username: isSeller ? chat.username : data.username,
      store_name: isSeller ? data.storename : chat.store_name,
      role: data.role, // Add role to help identify sender type
      messages: (chat.messages || []).map(msg => ({
        ...msg,
        // Ensure consistent role naming
        role: msg.role === 'user' ? 'customer' : msg.role
      })),
      hasUnread: (chat.messages || []).some(msg => 
        isSeller ? 
          (msg.role !== 'seller' && !msg.read) :
          (msg.role === 'seller' && !msg.read)
      )
    };
  });
};

// Helper function to determine chat role based on response
export const determineChatRole = (data) => {
  return data.role === 'seller' ? 'seller' : 'customer';
};