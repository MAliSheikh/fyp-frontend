import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { SideBar } from "./sidebar";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import axios from "axios";

const COLORS = [
  "#FF6B6B", // Coral Red
  "#FFD166", // Soft Yellow
  "#06D6A0", // Mint Green
  "#118AB2", // Deep Sky Blue
  "#EF476F", // Vivid Pink
  "#073B4C", // Navy Blue
  "#F4A261", // Sandy Orange
  "#2A9D8F", // Teal
  "#E76F51", // Terracotta
  "#A8DADC", // Powder Blue
  "#1D3557", // Prussian Blue
  "#B5838D", // Dusty Mauve
];

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchSalesData = async () => {
      const storeId = localStorage.getItem("store_id");
      if (!storeId) {
        return;
      }
      try {
        const weeklyResponse = await axios.get(
          `http://localhost:8000/sales/sales/weekly?store_id=${storeId}`
        );
        const monthlyResponse = await axios.get(
          `http://localhost:8000/sales/sales/monthly?store_id=${storeId}`
        );

        setSalesData(weeklyResponse.data.weekly_sales);
        setOrdersData(weeklyResponse.data.weekly_orders);
        setMonthlySalesData(monthlyResponse.data.monthly_sales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <Box display="flex" sx={{ p: 2 }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1200,
            bgcolor: "#119994",
            color: "white",
            "&:hover": {
              bgcolor: "#0d7b76",
            },
          }}
        >
          <MenuOpenIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      {isMobile ? (
        isSidebarOpen && (
          <SideBar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
        )
      ) : (
        <Box
          sx={{
            width: "250px",
            display: { xs: "none", md: "block" },
          }}
        >
          <SideBar isMobile={false} />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          width: { xs: "100%", md: "75%" },
          ml: { xs: 0, md: 1 },
          maxWidth: "1200px",
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Paper
                elevation={3}
                sx={{
                  p: "12px 16px 8px 16px",
                  borderRadius: 2,
                  textAlign: "center",
                  flex: 1,
                  minWidth: 180,
                  maxWidth: 220,
                  mb: { xs: 1, md: 0 },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
                  {monthlySalesData.reduce(
                    (sum, item) => sum + (item.sales_amount || 0),
                    0
                  )}
                </Typography>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  p: "12px 16px 8px 16px",
                  borderRadius: 2,
                  textAlign: "center",
                  flex: 1,
                  minWidth: 180,
                  maxWidth: 220,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                  Total Sales (All Months)
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
                  {monthlySalesData
                    .reduce(
                      (sum, item) => sum + (parseFloat(item.sales) || 0),
                      0
                    )
                    .toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                      maximumFractionDigits: 0,
                    })}
                </Typography>
              </Paper>
            </Box>
          </Grid>
          {/* Weekly Sales Chart */}
          <Grid item xs={12} md={6} sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5, height: "100%" }}>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Weekly Sales
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="black"
                    tickFormatter={(value) => value.replace("Week", "w")}
                  />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    fill="#FFA726"
                    // stroke="black"
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                    minPointSize={3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Purchase Orders Chart */}
          <Grid item xs={12} md={6} sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5, height: "100%" }}>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Purchase Orders
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ordersData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="black"
                    tickFormatter={(value) => value.replace("Week", "w")}
                  />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar
                    dataKey="orders"
                    fill="#4CAF50"
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                    minPointSize={3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Total Sales Pie Chart */}
          <Grid item xs={12} md={6} sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5, height: "100%" }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", mb: 1, mt: 0.5 }}
              >
                Monthly Amount
              </Typography>
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [`Rs. ${value}`, name]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  />
                  <Pie
                    data={monthlySalesData.map((item) => ({
                      name: item.month,
                      value: item.sales_amount,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    // label={({ value }) => value}
                    label={({ value }) =>
                      `Rs. ${value.toLocaleString("en-PK")}`
                    }
                    outerRadius={100}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {monthlySalesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Monthly Sales Chart */}
          <Grid item xs={12} md={6} sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5, height: "100%" }}>
              <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
                Monthly Sales
              </Typography>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={monthlySalesData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    stroke="black"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis hide={true} />
                  <Tooltip
                    formatter={(value) => [`${value} sales`, "Sales"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#FFA726"
                    barSize="7%"
                    radius={[10, 10, 0, 0]}
                    minPointSize={3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SalesChart;
