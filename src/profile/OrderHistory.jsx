import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Stack, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import Reviews from './Reviews';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { useNavigate } from "react-router-dom"

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        const response = await axiosInstance.get(`/orders/user/${user_id}`);
        setOrders(response.data);

        // Fetch reviewed products
        const reviewsResponse = await axiosInstance.get(`/reviews/user/${user_id}`);
        const reviewedProductIds = new Set(reviewsResponse.data.map(review => review.product_id));
        setReviewedProducts(reviewedProductIds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, []);

  const handleReview = (productId, storeId) => {
    setSelectedProductId(productId);
    setSelectedStoreId(storeId);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedProductId(null);
    setSelectedStoreId(null);
  };

  const openWhatsApp = (
    orderId,
    productId,
    productName,
    image,
    price,
    storeId,
    status,
    orderDate,
    category,
    subcategory,
    phoneNumber
  ) => {
    const message = `Order ID: ${orderId}\nProduct ID: ${productId}\nProduct Name: ${productName}\nImage: ${image}\nPrice: Rs.${price}\nStore ID: ${storeId}\nStatus: ${status}\nOrder Date: ${orderDate}\nCategory: ${category}\nSubcategory: ${subcategory}`;

    // Correct WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    // const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ); // Loader while fetching orders
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="center">Price</TableCell>
              {/* <TableCell align="right">Store Phone</TableCell> */}
              <TableCell align="center">Status</TableCell>
              <TableCell align="left">Chat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.flatMap(order =>
              Object.values(order.order_items).map(item => {
                const isReviewed = reviewedProducts.has(item.product_id); // Check if the product has been reviewed
                // console.log('isReviewed', isReviewed)
                return (
                  <TableRow
                    key={item.product_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <img src={item.product.images[0]} alt={item.product_name} style={{ width: '50px', height: '50px' }} />
                      {item.product_name}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">Rs.{item.price}</TableCell>
                    {/* <TableCell align="right">{item.store.phone_number}</TableCell> */}
                    <TableCell align="right">
                      {item.status === "delivered" && (
                        <>
                          {isReviewed === true ? (
                            <Typography>Reviewed</Typography> // Show "Reviewed" if the product has been reviewed
                          ) : (
                            <Button
                              sx={{
                                bgcolor: "#009688",
                                "&:hover": { bgcolor: "#00796b" },
                              }}
                              variant="contained"
                              onClick={() => handleReview(item.product_id, item.store_id)}
                            >
                              Review
                            </Button>
                          )}
                        </>
                      )}
                      {item.status !== "delivered" && (
                        <Typography sx={{ textTransform: 'capitalize' }}>{item.status}</Typography>

                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Button
                          onClick={() => openWhatsApp(
                            order.order_id,
                            item.product_id,
                            item.product_name,
                            item.product.images[0],
                            item.price,
                            item.store_id,
                            item.status,
                            order.order_date,
                            item.product.category,
                            item.product.subcategory,
                            item.store.phone_number
                          )}
                        >
                          <WhatsAppIcon />
                        </Button>
                      <IconButton
                        onClick={() => {
                          navigate(`/chat/${order.user_id}/${item.store_id}`, { 
                            state: {
                              orderId: order.order_id,
                              productId: item.product_id,
                              productName: item.product_name,
                              image: item.product.images[0],
                              price: item.price,
                              storeId: item.store_id,
                              userId: item.user_id,
                              status: item.status,
                              orderDate: order.order_date,
                              category: item.product.category,
                              subcategory: item.product.subcategory,
                              phoneNumber: item.store.phone_number
                            }
                          });
                        }}
                      >
                        <CommentOutlinedIcon />
                      </IconButton>
                      </Box>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={reviewModalOpen}
        onClose={handleCloseReviewModal}
        aria-labelledby="review-modal"
        aria-describedby="review-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Reviews productId={selectedProductId} storeId={selectedStoreId} reviews={orders.flatMap(order =>
            Object.values(order.order_items)
              .filter(item => item.product_id === selectedProductId)
              .map(item => ({
                product_id: item.product_id,
                store_id: item.store_id,
              }))
          )} />
          <Button
            variant="contained"
            onClick={handleCloseReviewModal}
            sx={{
              bgcolor: "#009688",
              "&:hover": { bgcolor: "#00796b" },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderHistory;