import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar, 
  CircularProgress,
  Container,
  Divider,
  Button,
  Card,
  CardContent
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserChatComponent = () => {
  // Get userId and storeId from URL parameters
  const { userId: urlUserId, storeId: urlStoreId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || {};
  
  // Use URL parameters first, then fallback to state data
  const userId = localStorage.getItem('userId')
  const storeId = urlStoreId || orderData.storeId;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const latestMessageIdRef = useRef(null); 
  const pendingSentMessages = useRef(new Set());
  
  // Initial fetch of messages
  useEffect(() => {
    if (storeId) {
      fetchMessages();
      
      // Set up polling for new messages
      pollingIntervalRef.current = setInterval(() => {
        fetchLatestMessage();
      }, 3000); // Poll every 3 seconds
    }
    
    return () => {
      // Clean up interval on component unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [storeId]);

  // Update latestMessageIdRef when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Find the highest message_id
      const maxId = Math.max(...messages
        .filter(msg => msg.message_id) // Filter out any messages without IDs
        .map(msg => msg.message_id));
      
      if (maxId && !isNaN(maxId)) {
        latestMessageIdRef.current = maxId;
      }
    }
  }, [messages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/messages/store/${storeId}`);
      setMessages(response.data);
      
      // Update the latest message ID after initial fetch
      if (response.data.length > 0) {
        const allIds = response.data
          .filter(msg => msg.message_id)
          .map(msg => msg.message_id);
        if (allIds.length > 0) {
          latestMessageIdRef.current = Math.max(...allIds);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLatestMessage = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messages/store/${storeId}/latest`);
      const latestMessage = response.data;
      
      // Skip if there's no data or no message_id
      if (!latestMessage || !latestMessage.message_id) return;
      
      // Check if this is a message we just sent (based on content)
      const isPending = pendingSentMessages.current.has(latestMessage.message);
      if (isPending) {
        // If this is a message we sent, remove it from pending set
        pendingSentMessages.current.delete(latestMessage.message);
        
        // Replace the temporary message with the real one from API
        setMessages(prevMessages => {
          // Find and replace the temporary message with the real one
          return prevMessages.map(msg => 
            // If this is a temp message with the same content, replace it
            (!msg.message_id && msg.message === latestMessage.message) 
              ? latestMessage 
              : msg
          );
        });
      } 
      // If it's a new message (not one we just sent) and newer than our latest
      else if (!latestMessageIdRef.current || latestMessage.message_id > latestMessageIdRef.current) {
        setMessages(prevMessages => [...prevMessages, latestMessage]);
        latestMessageIdRef.current = latestMessage.message_id;
      }
    } catch (error) {
      console.error('Error fetching latest message:', error);
    }
  };
  
  
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    
    // Optimistically add message to UI
    const tempMessage = {
      message: newMessage,
      user_id: userId,
      store_id: storeId,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      temp_id: `temp-${Date.now()}`
    };
    
    // Add to our messages state
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    // Save message content before clearing
    const messageToSend = newMessage;
    
    // Add to our pending set to track it
    pendingSentMessages.current.add(messageToSend);
    
    setNewMessage('');
    
    try {
      await axios.post('http://localhost:8000/messages/', {
        message: messageToSend,
        user_id: userId,
        store_id: storeId,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Message is sent, but we'll wait for the API to return it through polling
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove from pending since it failed
      pendingSentMessages.current.delete(messageToSend);
    } finally {
      setLoading(false);
    }
  };
  
  // Update sendDefaultMessage too
  const sendDefaultMessage = () => {
    if (!orderData.orderId) return;
    
    const formattedMessage = `
Hi, I'm inquiring about my order #${orderData.orderId || 'N/A'}:
Product: ${orderData.productName || 'N/A'}
Price: $${orderData.price || 'N/A'}
Order Date: ${orderData.orderDate ? new Date(orderData.orderDate).toLocaleDateString() : 'N/A'}
Status: ${orderData.status || 'N/A'}
Category: ${orderData.category || 'N/A'} / ${orderData.subcategory || 'N/A'}

I need assistance with this order. Please help.
    `.trim();
    
    // Add to pending messages set
    pendingSentMessages.current.add(formattedMessage);
    
    // Optimistically add to UI
    const tempMessage = {
      message: formattedMessage,
      user_id: userId,
      store_id: storeId,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      temp_id: `temp-${Date.now()}`
    };
    
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    // Actually send the message
    axios.post('http://localhost:8000/messages/', {
      message: formattedMessage,
      user_id: userId,
      store_id: storeId,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).catch(error => {
      console.error('Error sending default message:', error);
      // Remove from pending since it failed
      pendingSentMessages.current.delete(formattedMessage);
    });
  };
  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
      {/* Chat header */}
      <Paper elevation={2} sx={{ p: 2, backgroundColor: '#075E54', color: 'white', borderRadius: '0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={goBack} sx={{ color: 'white', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar alt="Store" src="/store-icon.png" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">Store #{storeId}</Typography>
              <Typography variant="body2">Online</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Messages container */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2, 
        backgroundColor: '#E5DDD5',
        backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-light_a4be8c63ff3dcea2074c9c6741d91ba6.png")',
        backgroundRepeat: 'repeat'
      }}>
        {messages.map((message, index) => (
          <Box 
            key={message.message_id || message.temp_id || `temp-${index}`}
            sx={{ 
              display: 'flex', 
              justifyContent: message.role === 'customer' || message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1.5, 
                maxWidth: '70%', 
                borderRadius: 2,
                backgroundColor: message.role === 'customer' || message.role === 'user' ? '#DCF8C6' : 'white'
              }}
            >
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{message.message}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'right', 
                  mt: 0.5, 
                  color: 'text.secondary' 
                }}
              >
                {formatTime(message.created_at)}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Order information card - only show if order data exists */}
      {orderData.orderId && (
        <Card variant="outlined" sx={{ mx: 1, mt: 1, mb: 0 }}>
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingBagIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Order #{orderData.orderId}
                </Typography>
              </Box>
              <Button 
                size="small" 
                variant="outlined"
                startIcon={<InfoOutlinedIcon />}
                onClick={sendDefaultMessage}
              >
                Send Order Info
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Message input */}
      <Paper 
        component="form" 
        onSubmit={sendMessage}
        sx={{ 
          p: 1, 
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: '0',
          backgroundColor: '#F0F0F0' 
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: 'white'
            }
          }}
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={loading}
          sx={{ ml: 1, backgroundColor: '#00A884', color: 'white', '&:hover': { backgroundColor: '#008C73' } }}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Container>
  );
};

export default UserChatComponent;