import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
// import { Label } from '@mui/icons-material';

const ProductUploadPage = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 2, gap: 3 }}>
      {/* Sidebar */}
      <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, // Customize height
            backgroundColor: '#119994', // Customize filled color
            '&:hover': { backgroundColor: '#0d7b76' }, // Darker shade on hover
          }}
        >Upload Product</Button>

        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', // Change text color
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, // Change text color on hover
          }}
          >Manage Products</Button>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, 
          }}
          >Sales</Button>

        <Typography
          sx={{
            height: 50, 
            color: 'grey', 
            marginLeft: '30px',
            marginTop: '5px'
          }}
          >_____REGISTER STORE_____</Typography>
          
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' },
          }}
          >Mall</Button>
        <Button variant="contained" fullWidth
          sx={{
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, 
          }}
          >Independent Store</Button>
        <Button variant="contained" fullWidth
          sx={{
            marginTop: 'auto',
            height: 50, 
            backgroundColor: '#ffffff', 
            color: 'grey', 
            '&:hover': { backgroundColor: 'red', color: '#ffffff' }, 
          }}
          >Sign Out</Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ width: { xs: '100%', md: '100%' } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Upload New Product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box
              sx={{
                border: '2px dashed gray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <Button component="span" variant="contained"
                  sx={{
                    backgroundColor: '#119994', // Customize filled color
                    '&:hover': { backgroundColor: '#0d7b76' }, // Darker shade on hover
                  }}>
                  {image ? image.name : 'Upload Image'}
                </Button>
              </label>
            </Box>

            <TextField
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              fullWidth
              required
            />
            <TextField
              label="Available Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              fullWidth
              required
            />
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#119994',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#0d7b76',
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductUploadPage;
