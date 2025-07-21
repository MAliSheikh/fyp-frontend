import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  useMediaQuery,
  Container,
  AppBar,
  Toolbar,
  InputAdornment,
  Badge,
  CircularProgress,
} from "@mui/material";
import { Search, Refresh, Send, ArrowBack } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { fetchUserChatData, sendMessage } from "./chatApi";
import MessageInput from "./messageInput";
import ChatMessages from "./chatMessages";
import { useNavigate } from "react-router-dom";

// Main Chat Component
const ChattingPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // 'list' or 'chat'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatData, setChatData] = useState({
    customerChats: [],
    sellerChats: [],
    mergedChats: [],
  });

  // Simulating the logged-in user ID (would come from auth context in real app)
  const loggedInUserId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  // Fetch chat data function - only called on initial load and when refresh button is clicked
  const fetchChatData = async () => {
    const user_id = localStorage.getItem("userId");
    setLoading(true);
    try {
      const userResponse = await fetchUserChatData(user_id);
      
      // Process the response based on user role
      const role = localStorage.getItem("userRole");
      if (role === "seller") {
        // For seller, set the chat data directly
        setChatData({
          customerChats: [],
          sellerChats: userResponse.chats || [],
          mergedChats: userResponse.chats || []
        });
      } else {
        // For customer, set the chat data
        setChatData({
          customerChats: userResponse.chats || [],
          sellerChats: [],
          mergedChats: userResponse.chats || []
        });
      }

      // If there was an active chat, update it with new data
      if (activeChat) {
        const updatedActiveChat = userResponse.chats?.find(
          chat => chat.user_id === activeChat.user_id && chat.store_id === activeChat.store_id
        );
        if (updatedActiveChat) {
          setActiveChat(updatedActiveChat);
        }
      }

    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read - implemented locally without API
  const markMessagesAsRead = (chat) => {
    if (!chat || !chat.messages) return;
    
    // Create a new chat object with read messages
    const updatedChat = {
      ...chat,
      messages: chat.messages.map(msg => {
        // Only mark as read if the message is not from the current user
        if ((userRole === "seller" && msg.role === "customer") ||
            (userRole === "customer" && msg.role === "seller")) {
          return { ...msg, read: true };
        }
        return msg;
      })
    };
    
    // Update the chat data with the read messages
    setChatData(prevData => {
      // Create a new object to ensure state update triggers
      const newData = {
        ...prevData,
        mergedChats: prevData.mergedChats.map(c => 
          (c.user_id === chat.user_id && c.store_id === chat.store_id) ? updatedChat : c
        )
      };
      
      // Update the appropriate chat list based on user role
      if (userRole === "customer") {
        newData.customerChats = prevData.customerChats.map(c => 
          (c.user_id === chat.user_id && c.store_id === chat.store_id) ? updatedChat : c
        );
      } else {
        newData.sellerChats = prevData.sellerChats.map(c => 
          (c.user_id === chat.user_id && c.store_id === chat.store_id) ? updatedChat : c
        );
      }
      
      return newData;
    });
    
    // Update active chat if it's the current chat
    if (activeChat && activeChat.user_id === chat.user_id && activeChat.store_id === chat.store_id) {
      setActiveChat(updatedChat);
    }
  };

  // Filter chats based on search query
  const filteredChats = chatData.mergedChats.filter((chat) => {
    const username = chat.username || chat.store_name || "";
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    // Mark messages as read when a chat is selected
    markMessagesAsRead(chat);
    if (isMobile) {
      setMobileView("chat");
    }
  };

  // Handle back button in mobile view
  const handleBackToList = () => {
    setMobileView("list");
  };

  // Handle sending a new message
  const handleSendMessage = async (message) => {
    if (!activeChat) return;
    try {
      const role = localStorage.getItem("userRole");
      const userId = activeChat.user_id;
      const storeId = role === "seller" 
        ? localStorage.getItem("store_id")
        : activeChat.store_id;

      const payload = {
        message,
        user_id: parseInt(userId),
        store_id: parseInt(storeId),
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Optimistically update UI
      const newMessage = {
        ...payload,
        message_id: Date.now(), // Temporary ID
        read: true // Mark as read since it's our own message
      };

      // Update chat data with new message
      setChatData(prevData => {
        const updateChat = chat => {
          if (chat.user_id === userId && chat.store_id === storeId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), newMessage],
              lastMessageTime: new Date().toISOString() // Add timestamp for sorting
            };
          }
          return chat;
        };

        return {
          ...prevData,
          mergedChats: prevData.mergedChats.map(updateChat),
          customerChats: prevData.customerChats.map(updateChat),
          sellerChats: prevData.sellerChats.map(updateChat)
        };
      });

      // Update active chat
      setActiveChat(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage],
        lastMessageTime: new Date().toISOString()
      }));

      // Send message to server
      const response = await sendMessage(payload);

      if (response) {
        // We don't fetch new data after sending a message to avoid unnecessary API calls
        // The message is already added to the UI optimistically
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error message to user
    }
  };

  // Check if a chat has unread messages
  const hasUnreadMessages = (chat) => {
    if (!chat.messages) return false;
    
    return chat.messages.some(msg => {
      // For seller: check if there are unread customer messages
      // For customer: check if there are unread seller messages
      return !msg.read && (
        (userRole === "seller" && msg.role === "customer") ||
        (userRole === "customer" && msg.role === "seller")
      );
    });
  };

  // Count unread messages for a chat
  const countUnreadMessages = (chat) => {
    if (!chat.messages) return 0;
    
    return chat.messages.filter(msg => {
      return !msg.read && (
        (userRole === "seller" && msg.role === "customer") ||
        (userRole === "customer" && msg.role === "seller")
      );
    }).length;
  };

  // Fetch data only on component mount
  useEffect(() => {
    fetchChatData();
    // No dependencies to ensure it only runs once when component mounts
  }, []);

  // Effect to mark messages as read when viewing a chat
  useEffect(() => {
    if (activeChat) {
      markMessagesAsRead(activeChat);
    }
  }, [activeChat?.user_id, activeChat?.store_id]);

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", py: 2,mb:13 }}>
      <Paper
        elevation={3}
        sx={{ height: "90vh", display: "flex", overflow: "hidden" }}
      >
        {/* Chat List Panel */}
        {(!isMobile || (isMobile && mobileView === "list")) && (
          <Box
            sx={{
              width: isMobile ? "100%" : "30%",
              borderRight: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Chat List Header */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton 
                  edge="start" 
                  onClick={() => navigate(-1)}
                  sx={{ mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6">
                  Chats
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder="Search chats..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton 
                  onClick={fetchChatData} 
                  disabled={loading}
                  title="Refresh chats"
                >
                  {loading ? <CircularProgress size={24} /> : <Refresh />}
                </IconButton>
              </Box>
            </Box>

            {/* Chat List */}
            <List sx={{ overflow: "auto", flexGrow: 1 }}>
              {filteredChats.map((chat, index) => {
                // Get the latest message to display in the preview
                const latestMessage =
                  chat.messages && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].message
                    : "No messages";

                // Check if there are any unread messages
                const hasUnread = hasUnreadMessages(chat);
                const unreadCount = countUnreadMessages(chat);

                return (
                  <React.Fragment
                    key={`${chat.user_id}-${chat.store_id}-${index}`}
                  >
                    <ListItem
                      button
                      onClick={() => handleChatSelect(chat)}
                      sx={{
                        bgcolor: hasUnread 
                          ? 'rgba(25, 118, 210, 0.12)' // More WhatsApp-like blue tint for unread
                          : 'inherit',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={unreadCount > 0 ? unreadCount : null}
                          color="primary"
                        >
                          <Avatar>
                            {(chat.username ||
                              chat.store_name ||
                              "?")[0].toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.username || chat.store_name || "Unknown"}
                        secondary={
                          latestMessage.length > 30
                            ? `${latestMessage.substring(0, 30)}...`
                            : latestMessage
                        }
                        primaryTypographyProps={{
                          fontWeight: hasUnread ? 600 : 400,
                        }}
                        secondaryTypographyProps={{
                          fontWeight: hasUnread ? 500 : 400,
                          color: hasUnread ? 'text.primary' : 'text.secondary'
                        }}
                      />
                    </ListItem>
                    {index < filteredChats.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
              {filteredChats.length === 0 && (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">No chats found</Typography>
                </Box>
              )}
            </List>
          </Box>
        )}

        {/* Chat Content Panel */}
        {(!isMobile || (isMobile && mobileView === "chat")) && (
          <Box
            sx={{
              width: isMobile ? "100%" : "70%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <AppBar position="static" color="default" elevation={0}>
                  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {isMobile && (
                        <IconButton edge="start" onClick={handleBackToList}>
                          <ArrowBack />
                        </IconButton>
                      )}
                      <Avatar sx={{ mr: 2 }}>
                        {(activeChat.username ||
                          activeChat.store_name ||
                          "?")[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">
                        {activeChat.username ||
                          activeChat.store_name ||
                          "Unknown"}
                      </Typography>
                    </Box>
                    <IconButton onClick={fetchChatData} disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : <Refresh />}
                    </IconButton>
                  </Toolbar>
                </AppBar>

                {/* Messages Container */}
                <ChatMessages
                  messages={activeChat.messages || []}
                  loggedInUserId={loggedInUserId}
                />

                {/* Message Input */}
                <MessageInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  p: 3,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a chat to start messaging
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Click on a conversation from the list to view messages
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChattingPanel;