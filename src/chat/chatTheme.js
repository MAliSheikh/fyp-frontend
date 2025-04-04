// chatTheme.js - Custom theme for chat-style UI
import { createTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia'

// chat-like colors
const chatGreen = '#128C7E';
const lightGreen = '#DCF8C6';
const chatLightGreen = '#25D366';
const chatTeal = '#075E54';
const chatBackground = '#E5DDD5';

// Custom theme with chat styling
const ChatTheme = createTheme({
  palette: {
    primary: {
      main: chatGreen,
      dark: chatTeal,
      light: chatLightGreen,
      contrastText: '#fff',
    },
    secondary: {
      main: '#34B7F1',
    },
    background: {
      default: '#f0f2f5',
      paper: '#fff',
      chat: chatBackground,
      message: {
        sent: lightGreen,
        received: '#fff',
      },
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#f0f2f5',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f0f2f5',
          color: '#000',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

export default ChatTheme;