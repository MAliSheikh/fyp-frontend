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
  PieChart,
  Pie,
  Cell,
  LabelList
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
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get("http://localhost:8000/admin/adminDashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Convert object data to array format for charts
  const formatChartData = (data) => {
    return Object.entries(data).map(([name, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (value.total_sales !== undefined) {
          return { name, value: value.total_sales };
        }
        return { name, value: value.total_items || value };
      }
      return { name, value };
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 1.5 }}>
      <Grid container spacing={1.5}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Paper elevation={3} sx={{ p: '12px 16px 8px 16px', borderRadius: 2, textAlign: "center", flex: 1, maxWidth: '200px' }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>Total Users</Typography>
              <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>{dashboardData.total_users}</Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: '12px 16px 8px 16px', borderRadius: 2, textAlign: "center", flex: 1, maxWidth: '200px' }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>Total Orders</Typography>
              <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>{dashboardData.total_orders}</Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Charts Grid */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Monthly Users */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Monthly Users
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formatChartData(dashboardData.month_wise_users)}>
                    <XAxis dataKey="name" axisLine={false} tick={false} />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF6B6B" radius={[5, 5, 0, 0]} barSize="4%">
                      <LabelList
                        dataKey="value"
                        position="bottom"
                        offset={5}
                        style={{ fill: "#333", fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Weekly Sales */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Weekly Sales
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formatChartData(dashboardData.weekly_sales)}>
                    <XAxis dataKey="name" axisLine={false} tick={false} />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" radius={[5, 5, 0, 0]} barSize="4%">
                      <LabelList
                        dataKey="value"
                        position="bottom"
                        offset={5}
                        style={{ fill: "#333", fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Weekly Orders */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Weekly Orders
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={formatChartData(dashboardData.weekly_orders)}>
                    <XAxis dataKey="name" axisLine={false} tick={false} />
                    <YAxis hide={true} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFD166" radius={[5, 5, 0, 0]} barSize="4%">
                      <LabelList
                        dataKey="value"
                        position="bottom"
                        offset={5}
                        style={{ fill: "#333", fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Monthly Sales Line Chart */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Monthly Sales
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={formatChartData(dashboardData.monthly_sales)}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="black" fontSize={12} />
                    <YAxis hide={true} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                    <Line type="monotone" dataKey="value" stroke="#9C27B0" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Total Sales Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 1, borderRadius: 3, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
                  Total Sales
                </Typography>
                {formatChartData(dashboardData.total_sales_last_4_months).length > 0 &&
                formatChartData(dashboardData.total_sales_last_4_months).some(item => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={formatChartData(dashboardData.total_sales_last_4_months)}
                        cx="50%"
                        cy="55%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: PKR ${value}`}
                      >
                        {formatChartData(dashboardData.total_sales_last_4_months).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`PKR ${value}`, 'Sales']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ textAlign: "center", mt: 6 }}>
                    No sales data available
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
