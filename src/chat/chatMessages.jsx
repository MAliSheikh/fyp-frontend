// Chat Messages Component
import React, { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";

const ChatMessages = ({ messages, loggedInUserId }) => {
  const messageEndRef = React.useRef(null);
  const userRole = localStorage.getItem("userRole");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMessageFromCurrentUser = (messageRole) => {
    if (userRole === "seller") {
      return messageRole === "seller";
    } else {
      return messageRole === "customer";
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      {messages.map((msg, index) => {
        const isFromCurrentUser = isMessageFromCurrentUser(msg.role);

        return (
          <Box
            key={msg.message_id || index}
            sx={{
              display: "flex",
              justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: "70%",
                borderRadius: 2,
                bgcolor: isFromCurrentUser ? "#dcf8c6" : "white",
                position: "relative",
              }}
            >
              <Typography variant="body1">{msg.message}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  color: "text.secondary",
                  mt: 0.5,
                  fontSize: "0.7rem",
                }}
              >
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        );
      })}
      <div ref={messageEndRef} />
    </Box>
  );
};

export default ChatMessages;
