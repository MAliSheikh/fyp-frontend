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

// Main Chat Component
const ChattingPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
  const loggedInUserId = localStorage.getItem("userId"); // Assuming the logged-in user is the seller with ID 1

  // Fetch chat data function
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

  // Filter chats based on search query
  const filteredChats = chatData.mergedChats.filter((chat) => {
    const username = chat.username || chat.store_name || "";
    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
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
        : activeChat.store_id; // Use the store_id from active chat for customers

      const payload = {
        message,
        user_id: parseInt(userId),
        store_id: parseInt(storeId),
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const response = await sendMessage(payload);

      if (response) {
        // Fetch latest data after sending message
        fetchChatData();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchChatData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", py: 2 }}>
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
            <Box
              sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Chats
              </Typography>
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
                <IconButton onClick={fetchChatData} disabled={loading}>
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

                // Check if there are any unread messages (for highlighting)
                const hasUnread =
                  chat.messages &&
                  chat.messages.some(
                    (msg) => !msg.read && msg.role !== "seller"
                  );

                return (
                  <React.Fragment
                    key={`${chat.user_id}-${chat.store_id}-${index}`}
                  >
                    <ListItem
                      button
                      onClick={() => handleChatSelect(chat)}
                      sx={{
                        bgcolor: hasUnread ? "action.hover" : "inherit",
                        "&:hover": { bgcolor: "action.selected" },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="secondary"
                          variant="dot"
                          invisible={!hasUnread}
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
                          fontWeight: hasUnread ? "bold" : "normal",
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
