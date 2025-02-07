import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentInputPage = () => {
    const [payment, setPayment] = useState({
        card_number: "",
        cvv: "",
        expiry_date: "",
    });
    const [paymentLoading, setPaymentLoading] = useState(true);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!payment.card_number || !payment.cvv || !payment.expiry_date) {
            alert("All fields are required.");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            const userId = parseInt(localStorage.getItem("userId"));
            const paymentData = {
                user_id: userId,
                ...payment,
                cvv: parseInt(payment.cvv),
            };

            const response = await axios.post(`http://localhost:8000/payment`, paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Payment submitted successfully:", response.data);
            alert("Payment submitted successfully!");
            navigate("/profile", { state: payment });
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert("Failed to submit payment. Please try again.");
        }
    };

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const userId = parseInt(localStorage.getItem("userId"));
                const response = await axios.get(`http://localhost:8000/payment/user/${userId}/payment`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.payment_info) {
                    setPayment({
                        card_number: response.data.payment_info.card_number || "",
                        cvv: response.data.payment_info.cvv || "",
                        expiry_date: response.data.payment_info.expiry_date || ""
                    });
                }
                setPaymentLoading(false);
            } catch (error) {
                console.error("Error fetching payment:", error);
                setPaymentLoading(false);
            }
        };

        fetchPayment();
    }, []);

    return (
        <Box
            sx={{
                maxWidth: 500,
                margin: "auto",
                padding: 4,
                boxShadow: 4,
                borderRadius: 2,
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                sx={{ color: "black" }}
            >
                Enter Payment Information
            </Typography>

            {/* Card Number */}
            <TextField
                label="Card Number"
                name="card_number"
                value={payment.card_number}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPayment((prev) => ({ ...prev, card_number: value }));
                }}
                fullWidth
                required
                variant="outlined"
                inputProps={{ maxLength: 16 }}
            />

            {/* CVV */}
            <TextField
                label="CVV"
                name="cvv"
                value={payment.cvv}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length <= 3) {
                        setPayment((prev) => ({ ...prev, cvv: value }));
                    }
                }}
                fullWidth
                required
                variant="outlined"
                inputProps={{ maxLength: 3 }}
            />

            {/* Expiry Date */}
            <TextField
                label="Expiry Date (MM/YY)"
                name="expiry_date"
                value={payment.expiry_date}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                placeholder="MM/YY"
            />

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    textTransform: "none",
                    bgcolor: "#009688",
                    "&:hover": {
                        bgcolor: "#00796b",
                    },
                }}
                onClick={handleSubmit}
            >
                Save
            </Button>
        </Box>
    );
};

export default PaymentInputPage;
