import React, { useState, useEffect } from "react"; 
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddressInputPage = () => {
  const [address, setAddress] = useState({
    state: "",
    city: "", 
    full_address: "",
    zip_code: "",
    phone_no: "",
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Added to track form submission status
  const [isLoading, setIsLoading] = useState(true);

  const states = ["Sindh", "Punjab", "Khyber Pakhtunkhwa", "Balochistan"];
  const citiesByState = {
    Sindh: ["Karachi", "Hyderabad", "Sukkur"],
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad"],
    Balochistan: ["Quetta", "Gwadar", "Turbat"],
  };

  useEffect(() => {
    const fetchAddress = async () => {
      setIsLoading(true);
      try {
        const userId = parseInt(localStorage.getItem("userId"))
        const response = await axios.get(`http://localhost:8000/address/user/${userId}`);
        if (response.data && response.data.addresses && response.data.addresses.length > 0) {
          setAddress(response.data.addresses[0]);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}), // Reset city when state changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation 
    if (!address.state || !address.city || !address.full_address || !address.zip_code || !address.phone_no) {
      alert("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const userId = parseInt(localStorage.getItem("userId"));
      const addressData = {
        ...address,
        user_id: userId,
        phone_no: parseInt(address.phone_no)
      };
      const response = await axios.post(`http://localhost:8000/address`, addressData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Address submitted successfully:", response.data);
      navigate("/profile", { state: address });
      setIsSubmitted(true); // Set submission status to true
    } catch (error) {
      console.error("Error submitting address:", error);
      alert("Failed to submit address. Please try again.");
    }
  };

  // Add a function to handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Add a function to handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : !isEditing && address?.state ? (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            sx={{ color: "black" }}
          >
            Your Address
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>State:</strong> {address.state}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>City:</strong> {address.city}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Full Address:</strong> {address.full_address}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Zip Code:</strong> {address.zip_code}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Phone:</strong> {address.phone_no}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#009688",
                "&:hover": {
                  bgcolor: "#00796b",
                },
              }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            sx={{ color: "black" }}
          >
            Address Information
          </Typography>

          {/* State Dropdown */}
          <Box sx={{ marginTop: 2 }}>
            <FormControl fullWidth required sx={{ minWidth: 200 }}>
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={address.state}
                onChange={handleChange}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* City Dropdown */}
          <FormControl fullWidth required disabled={!address.state}>
            <InputLabel>City</InputLabel>
            <Select
              name="city"
              value={address.city}
              onChange={handleChange}
            >
              {address.state &&
                citiesByState[address.state].map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Zip Code */}
          <TextField
            label="Zip Code"
            name="zip_code"
            value={address.zip_code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setAddress((prev) => ({ ...prev, zip_code: value }));
            }}
            fullWidth
            required
            variant="outlined"
            type="number"
            sx={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />

          {/* Full Address */}
          <TextField
            label="Full Address"
            name="full_address"
            value={address.full_address}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />

          {/* Phone Number */}
          <TextField
            label="Phone Number"
            name="phone_no"
            value={address.phone_no}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              if (value.length <= 11) {
                setAddress((prev) => ({ ...prev, phone_no: value }));
              }
            }}
            fullWidth
            required
            variant="outlined"
            type="number"
            sx={{
              inputMode: "numeric",
              maxLength: 11,
            }} 
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
              Submit
            </Button>
            {address.state && (
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  color: "#009688",
                  borderColor: "#009688",
                  "&:hover": {
                    borderColor: "#00796b",
                  },
                }}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      )}
      {isSubmitted && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ color: "green" }}>
            Address submitted successfully!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AddressInputPage;
