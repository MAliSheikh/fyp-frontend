// Message Input Component
import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
        size="small"
      />
      <IconButton
        color="primary"
        type="submit"
        disabled={!message.trim()}
        sx={{ ml: 1 }}
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
