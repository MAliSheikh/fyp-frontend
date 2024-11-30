import React, { useState } from "react"; 
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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

  const states = ["Sindh", "Punjab", "Khyber Pakhtunkhwa", "Balochistan"];
  const citiesByState = {
    Sindh: ["Karachi", "Hyderabad", "Sukkur"],
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad"],
    Balochistan: ["Quetta", "Gwadar", "Turbat"],
  };

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
    } catch (error) {
      console.error("Error submitting address:", error);
      alert("Failed to submit address. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 4,
        boxShadow: 4,
        borderRadius: 2,
        bgcolor: "#f9f9f9",
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
        Enter Your Address
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
        Submit
      </Button>
    </Box>
  );
};

export default AddressInputPage;
