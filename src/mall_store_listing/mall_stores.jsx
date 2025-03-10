import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Rating,
  CircularProgress,
} from "@mui/material";
import { fetchMallStores, fetchMallInfo } from "./mallStoreApi";

const BannerSlider = ({ mallInfo }) => {
  return (
    <Box
      sx={{
        height: "400px",
        backgroundImage: mallInfo?.image
          ? `url(data:image/jpeg;base64,${mallInfo.image})`
          : "none",
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
          {mallInfo?.name || "Mall Stores"}
        </Typography>
        {mallInfo?.location && (
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {mallInfo.location}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

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
      }}
    >
      <CardMedia
        component="img"
        height="220"
        cursor="pointer"
        image={store.image}
        alt={store.name}
        sx={{
          borderRadius: "20px 20px 0 0",
          objectFit: "cover",
          cursor: "pointer"
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          onClick={handleViewStore}
          sx={{
            cursor: "pointer",
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, cursor: "pointer" }}
        >
          {store.shop_type}
        </Typography>
        <Rating
          name="store-rating"
          value={4}
          precision={0.5}
          readOnly
          sx={{ mb: 1 }}
        />
      </CardContent>
    </Card>
  );
};

const MallStores = () => {
  const [stores, setStores] = useState([]);
  const [selectedMallInfo, setSelectedMallInfo] = useState(null);
  const { mallId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storesData, mallData] = await Promise.all([
          fetchMallStores(mallId),
          fetchMallInfo(mallId),
        ]);

        setStores(storesData.stores || []);
        setSelectedMallInfo(mallData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mallId]);

  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      {/* Banner Section with passed mall info */}
      <BannerSlider mallInfo={selectedMallInfo} />

      {/* Mall Info Section */}
      {selectedMallInfo && (
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            {selectedMallInfo.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {selectedMallInfo.description}
          </Typography>
          {selectedMallInfo.floors && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Number of Floors: {selectedMallInfo.floors}
            </Typography>
          )}
          {selectedMallInfo.location && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {selectedMallInfo.location}
            </Typography>
          )}
        </Box>
      )}

      {/* Loader Section */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stores Grid */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Available Stores
          </Typography>

          <Grid container spacing={3}>
            {stores.map((store) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={store.store_id}>
                <StoreCard store={store} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MallStores;
