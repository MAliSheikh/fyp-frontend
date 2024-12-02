import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Container, Grid } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { fetchMalls } from './fetchMalls';
import { useNavigate } from 'react-router-dom';
// import MallStores from './mall_stores';

const MallListingPage = () => {
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls(setMalls, setLoading, setError);
  }, []);

  const handleMallClick = (mall) => {
    navigate(`/mall/${mall.mall_name_id}/stores`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" color="error.main">
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            mb: 4,
            color: 'Black',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Our Shopping Destinations
        </Typography>

        <Grid container spacing={3} sx={{ px: 2 }}>
          {malls.map((mall) => (
            <Grid item xs={12} sm={6} md={4} key={mall.id}>
              <Card
                onClick={() => handleMallClick(mall)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  },
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  display: {
                    xs: 'block', // Stack layout on mobile
                    sm: 'flex'   // Side by side on larger screens
                  }
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: '100%',  // Full width on mobile
                      sm: 80      // Fixed width on larger screens
                    },
                    height: {
                      xs: 200,    // Taller on mobile
                      sm: 80      // Fixed height on larger screens
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: {
                      xs: 2,      // Add margin bottom on mobile
                      sm: 0       // No margin on larger screens
                    }
                  }}
                >
                  {mall.image ? (
                    <img
                      src={`data:image/jpeg;base64,${mall.image}`}
                      alt={mall.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <BusinessIcon sx={{ fontSize: 40, color: 'white' }} />
                  )}
                </Box>

                <Box sx={{ 
                  ml: { xs: 0, sm: 2 },  // No margin on mobile, margin on larger screens
                  flex: 1,
                  textAlign: { xs: 'center', sm: 'left' } // Center text on mobile, left align on larger screens
                }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    {mall.name}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 0.5,
                    justifyContent: { xs: 'center', sm: 'flex-start' } // Center on mobile, left align on larger screens
                  }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {mall.location}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' } // Center on mobile, left align on larger screens
                  }}>
                    <ApartmentIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Floors: {mall.floors}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MallListingPage;