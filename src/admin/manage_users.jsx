import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, Chip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../components/axiosInstance";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axiosInstance.get('/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (user_id) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axiosInstance.delete(`/admin/users/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== user_id)
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      } else {
        alert('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#f44336'; // red
      case 'seller':
        return '#2196f3'; // blue
      case 'customer':
        return '#4caf50'; // green
      default:
        return '#757575'; // grey
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh", p: 2, mb:10 }}>
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: "75%",
          ml: 1,
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Manage Users
        </Typography>

        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            maxWidth: { xs: "100%", sm: "75%", md: "50%" }
          }}
        />

        <Box sx={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#00897b",
              color: "white",
              p: 2,
              borderRadius: 3,
              mb: 2,
              fontWeight: "bold",
              minWidth: "900px",
              marginLeft: { xs: 0, md: 1 }
            }}
          >
            <Typography sx={{ flex: 1, textAlign: "left", pl: 2 }}>Name</Typography>
            <Typography sx={{ flex: 1.5, textAlign: "left", pl: 2 }}>Email</Typography>
            <Typography sx={{ flex: 0.8, textAlign: "left", pl: 2 }}>Role</Typography>
            <Typography sx={{ flex: 0.8, textAlign: "left", pl: 2 }}>Status</Typography>
            <Typography sx={{ flex: 0.8, textAlign: "center" }}>Actions</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              ml: 1,
              minWidth: "920px"
            }}
          >
            {filteredUsers.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Typography sx={{ flex: 1, textAlign: "left", pl: 2 }}>{user.name}</Typography>
                <Typography sx={{ flex: 1.5, textAlign: "left", pl: 2 }}>{user.email}</Typography>
                <Box sx={{ flex: 0.8, textAlign: "left", pl: 2 }}>
                  <Chip 
                    label={user.role}
                    size="small"
                    sx={{
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Box sx={{ flex: 0.8, textAlign: "left", pl: 2 }}>
                  <Chip 
                    label={user.is_active ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      backgroundColor: user.is_active ? '#4caf50' : '#757575',
                      color: 'white'
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 0.8,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2
                  }}
                >
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUsers;
