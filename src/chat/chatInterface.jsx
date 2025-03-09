// src/chat/chatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  Badge,
  Chip,
  ListItemAvatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';
import { fetchMessagesByUser, fetchMessagesByStore, sendMessage, deleteMessage, getLatestMessage } from './chat';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastMessageId, setLastMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const checkInterval = useRef(null);
  const location = useLocation();
  const role = localStorage.getItem('role');
  const orderMessageSetRef = useRef(false);

  // Form initial message from order details if available.
  useEffect(() => {
    // Check if we've already set the message for this order
    const messageAlreadySet = localStorage.getItem('orderMessageSet');
    
    if (location.state && !messageAlreadySet) {
      const { 
        orderId,
        productId,
        productName,
        image,
        price,
        storeId,
        status,
        orderDate,
        category,
        subcategory,
        phoneNumber
      } = location.state;

      // Store the storeId for future API calls
      localStorage.setItem('currentStoreId', storeId);

      const orderMessage = 
      `Order ID: ${orderId}\n` +
      `Product: ${productName}\n` +
      `Price: Rs.${price}\n` +
      `Status: ${status}\n` +
      `Order Date: ${orderDate}\n` +
      `Category: ${category}\n` +
      `Subcategory: ${subcategory}`;

      setNewMessage(orderMessage);
      
      // Mark that we've set the message for this order
      localStorage.setItem('orderMessageSet', 'true');
    }
    
    // Cleanup function to reset the flag when unmounting
    return () => {
      localStorage.removeItem('orderMessageSet');
    };
  }, [location.state]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial fetch of messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      let fetchedMessages = [];
      if (role === 'seller') {
        fetchedMessages = await fetchMessagesByStore();
      } else {
        fetchedMessages = await fetchMessagesByUser();
      }

      // Sort messages by created_at
      fetchedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      if (fetchedMessages.length > 0) {
        setLastMessageId(fetchedMessages[fetchedMessages.length - 1].message_id);
      }

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for new messages
  const checkForNewMessages = async () => {
    try {
      const latestMessage = await getLatestMessage();

      if (latestMessage && lastMessageId !== null && latestMessage.message_id > lastMessageId) {
        // Fetch all messages again if we have a new message
        fetchMessages();
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up interval for checking new messages
    checkInterval.current = setInterval(checkForNewMessages, 10000); // Check every 10 seconds

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const role = localStorage.getItem('role');
      const userId = parseInt(localStorage.getItem('userId'), 10);
      const storeId = role === 'seller' ?
        parseInt(localStorage.getItem('store_id'), 10) :
        parseInt(localStorage.getItem('currentStoreId'), 10);
      const currentTimestamp = new Date().toISOString();
      // Create the message object in the required format
      const messageData = {
        message: newMessage.toString(),
        user_id: userId,
        store_id: storeId,
        role: role,
        created_at: currentTimestamp,
        updated_at: currentTimestamp,
      };

      const sentMessage = await sendMessage(messageData);

      // Update UI with the newly sent message
      setMessages([...messages, sentMessage.data]);
      setNewMessage('');
      setLastMessageId(sentMessage.data.message_id);
      
      // Since we've sent the message successfully, we should also mark that the order message has been set
      // This prevents re-populating the input box if the page is refreshed
      localStorage.setItem('orderMessageSet', 'true');

    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(messages.filter(msg => msg.message_id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const isOwnMessage = (message) => {
    if (role === 'seller') {
      return message.store_id === parseInt(localStorage.getItem('store_id'));
    } else {
      return message.user_id === parseInt(localStorage.getItem('userId'));
    }
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>
        {role === 'seller' ? 'Customer Support Chat' : 'Chat with Store'}
      </Typography>
      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', mt: 2, mb: 2 }}>
        {
          loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="textSecondary">No messages yet. Start the conversation!</Typography>
            </Box>
          ) : (
            <List>
              {messages.map((msg) => {
                const own = isOwnMessage(msg);
                return (
                  <ListItem
                    key={msg.message_id}
                    sx={{
                      flexDirection: own ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: own ? '#009688' : '#757575' }}>
                        {own ? role === 'seller' ? 'S' : 'C' : role === 'seller' ? 'C' : 'S'}
                      </Avatar>
                    </ListItemAvatar>
                    <Box
                      sx={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: own ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: own ? '#e0f7fa' : '#f5f5f5',
                          borderRadius: 2,
                          position: 'relative'
                        }}
                      >
                        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                          {msg.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                          {formatTime(msg.created_at)}
                        </Typography>
                      </Paper>

                      {own && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMessage(msg.message_id)}
                          sx={{ mt: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </ListItem>
                );
              })}
              <div ref={messagesEndRef} />
            </List>
          )}
      </Box>

      <Divider />
      {location.state?.image && (
        <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
          <img 
            src={location.state.image} 
            alt={location.state.productName || "Product"} 
            style={{ 
              width: '60px', 
              height: '60px', 
              objectFit: 'cover',
              borderRadius: '4px',
              marginRight: '12px'
            }} 
          />
          <Box>
            <Typography variant="subtitle2">
              {location.state.productName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Order #{location.state.orderId} • Rs.{location.state.price}
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', mt: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          sx={{ ml: 1, bgcolor: "#009688", "&:hover": { bgcolor: "#00796b" }, height: '40px' }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;