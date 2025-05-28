import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { base_URL } from '../utils';
import axios from "axios";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
    '&:hover': {
      background: '#555',
    },
  },
};

const EditProductModal = ({ open, handleClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    images: product?.images || [],
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    brand: product?.brand || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        store_id: parseInt(product.store_id),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images,
        category: formData.category,
        subcategory: formData.subcategory,
        colors: formData.colors,
        sizes: formData.sizes,
        brand: formData.brand,
        total_rating: product.total_rating || 0,
        rating_count: product.rating_count || 0,
        average_rating: product.average_rating || 0
      };

      const response = await axios.put(`http://localhost:8000/products/${product.product_id}`, submitData);
      onProductUpdated(response.data);
      handleClose();
    } catch (err) {
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail.map(detail => detail.msg).join(', '));
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError('Failed to update product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-product-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2,
        mb: 2
      }}
    >
      <Box sx={style}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
          pb: 1,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography id="edit-product-modal" variant="h6" component="h2">
            Edit Product
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Colors (comma-separated)"
                value={formData.colors.join(', ')}
                onChange={(e) => handleArrayChange('colors', e.target.value)}
                helperText="Enter colors separated by commas"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Sizes (comma-separated)"
                value={formData.sizes.join(', ')}
                onChange={(e) => handleArrayChange('sizes', e.target.value)}
                helperText="Enter sizes separated by commas"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Image
                </Typography>
                {formData.images[0] && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={formData.images[0]}
                      alt="Product"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                )}
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    Change Image
                  </Button>
                </label>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error" sx={{ 
                  bgcolor: '#ffebee', 
                  p: 1, 
                  borderRadius: 1,
                  border: '1px solid #ffcdd2'
                }}>
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 2,
                  position: 'sticky',
                  bottom: 0,
                  bgcolor: '#119994',
                  pt: 1,
                  borderTop: '1px solid #e0e0e0'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal; 