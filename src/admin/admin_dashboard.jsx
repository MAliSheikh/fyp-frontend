import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box, Grid } from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    total_orders: 0,
    month_wise_users: {},
    weekly_sales: {},
    weekly_orders: {},
    total_sales_last_4_months: {},
    monthly_sales: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/adminDashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Convert object data to array format for charts
  const formatChartData = (data) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value: typeof value === 'object' ? value.total_sales || value.total_items : value
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Summary Cards on Left */}
        <Grid item xs={12} md={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Paper elevation={3} sx={{ 
              p: 1, 
              borderRadius: 3,
              textAlign: "center"
            }}>
              <Typography variant="subtitle1">Total Users</Typography>
              <Typography variant="h6">{dashboardData.total_users}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ 
              p: 1, 
              borderRadius: 3,
              textAlign: "center"
            }}>
              <Typography variant="subtitle1">Total Orders</Typography>
              <Typography variant="h6">{dashboardData.total_orders}</Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Charts Grid */}
        <Grid item xs={12} md={10}>
          <Grid container spacing={3}>
            {/* First Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Monthly Users
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formatChartData(dashboardData.month_wise_users)}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="black"
                      fontSize={12}
                    />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#2196F3"
                      stroke="black"
                      strokeWidth={1}
                      radius={[5, 5, 0, 0]}
                      barSize="8%"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Weekly Sales
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={formatChartData(dashboardData.weekly_sales)}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="black"
                      fontSize={12}
                    />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4CAF50"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Second Row */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Weekly Orders
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formatChartData(dashboardData.weekly_orders)}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="black"
                      fontSize={12}
                    />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#FFA726"
                      stroke="black"
                      strokeWidth={1}
                      radius={[5, 5, 0, 0]}
                      barSize="8%"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Monthly Sales
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={formatChartData(dashboardData.monthly_sales)}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      stroke="black"
                      fontSize={12}
                    />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9C27B0"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;




