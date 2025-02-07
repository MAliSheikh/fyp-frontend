import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Rating,
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";

// Banner component
const BannerSection = () => {
  return (
    <Box
      sx={{
        height: "400px",
        backgroundImage: `url('/images/stores-banner.jpg')`, // Add a default banner image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        mb: 4,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Independent Stores
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Discover Unique Shopping Experiences
        </Typography>
      </Box>
    </Box>
  );
};

// Store Card Component
const StoreCard = ({ store }) => {
  const navigate = useNavigate();

  const handleViewStore = () => {
    navigate(`/store/${store.store_id}/products`);
  };

  return (
    <Card
      sx={{
        maxWidth: "auto",
        margin: "auto",
        height: 350,
        borderRadius: "20px 20px 0 0",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={handleViewStore}
    >
      <CardMedia
        component="img"
        height="220"
        image={store.image}
        alt={store.name}
        sx={{
          borderRadius: "20px 20px 0 0",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            height: 30,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {store.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {store.shop_type}
        </Typography>
        <Rating
          name="store-rating"
          value={store.rating || 4}
          precision={0.5}
          readOnly
          sx={{ mb: 1 }}
        />
      </CardContent>
    </Card>
  );
};

const IndependentStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await axiosInstance.get("/store/independent-stores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStores(response.data.stores || []);
      } catch (error) {
        console.error("Error fetching independent stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      {/* Banner Section */}
      {/* <BannerSection /> */}

      {/* Stores Grid */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Available Stores
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography>Loading stores...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stores.map((store) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={store.store_id}>
              <StoreCard store={store} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default IndependentStores; 