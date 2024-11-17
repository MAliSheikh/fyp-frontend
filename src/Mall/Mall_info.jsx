import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper} from '@mui/material';
// import { label } from '@mui/icons-material';

const ProductUploadPage = () => {
  const [mallName, setmallName] = useState('');
  const [shopName, setshopName] = useState('');
  const [shopType, setshopType] = useState('');
  const [floorNo, setfloorNo] = useState('');
  const [shopNo, setshopNo] = useState('');
  const [description, setdescription] = useState('');
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
                height: 50, 
                backgroundColor: '#ffffff', 
                color: 'grey', 
                '&:hover': { backgroundColor: '#0d7b76', color: '#ffffff' }, 
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
            height: 50, // Customize height
            backgroundColor: '#119994', // Customize filled color
            '&:hover': { backgroundColor: '#0d7b76' }, // Darker shade on hover
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
          <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add Mall Information
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'row', // Align items in a row
                gap: 2,
              }}
            >
              {/* Left Side: Text Fields */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Mall Name"
                  value={mallName}
                  onChange={(e) => setmallName(e.target.value)}
                  required
                  sx={{ width: '600px' }}
                />
                <TextField
                  label="Shop Name"
                  value={shopName}
                  onChange={(e) => setshopName(e.target.value)}
                  required
                  sx={{ width: '600px' }}
                />
                <TextField
                  label="Shop Type"
                  value={shopType}
                  onChange={(e) => setshopType(e.target.value)}
                  required
                  sx={{ width: '300px' }}
                />
                <TextField
                  label="Floor No"
                  value={floorNo}
                  onChange={(e) => setfloorNo(e.target.value)}
                  type="number"
                  required
                  sx={{ width: '300px' }}
                />
                <TextField
                  label="Shop No"
                  value={shopNo}
                  onChange={(e) => setshopNo(e.target.value)}
                  type="number"
                  required
                  sx={{ width: '300px' }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  multiline
                  rows={4}
                  required
                  sx={{ width: '600px' }}
                />
              </Box>

              {/* Right Side: Upload Box */}
              <Box
                sx={{
                  border: '2px dashed gray',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 270,
                  width: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  flexShrink: 0, // because of this shrink nai hogga box
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
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      backgroundColor: '#119994',
                      '&:hover': { backgroundColor: '#0d7b76' },
                    }}
                  >
                    {image ? image.name : 'Upload Image'}
                  </Button>
                </label>
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#119994',
                color: '#ffffff',
                marginTop: '20px',
                width: '100%',
                '&:hover': {
                  backgroundColor: '#0d7b76',
                },
              }}
            >
              Submit
            </Button>
          </Paper>
        </Box>
    </Box>
  );
};

export default ProductUploadPage;
