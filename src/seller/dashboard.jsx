import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { SideBar } from "./sidebar";
import { PieChart, Pie, Cell } from "recharts";

const salesData = [
  { name: "Week 1", sales: 12 },
  { name: "Week 2", sales: 100 },
  { name: "Week 3", sales: 62 },
  { name: "Week 4", sales: 12 },
  { name: "Week 5", sales: 95 },
  { name: "Week 6", sales: 64 },
  { name: "Week 7", sales: 99 },
];

const ordersData = [
  { name: "Week 1", orders: 15 },
  { name: "Week 2", orders: 85 },
  { name: "Week 3", orders: 55 },
  { name: "Week 4", orders: 20 },
  { name: "Week 5", orders: 90 },
  { name: "Week 6", orders: 70 },
  { name: "Week 7", orders: 95 },
];

const COLORS = ["#FD8744", "#FFB95A", "#D05759", "#0B8FD9"];

const totao_sales_data = [
  { name: "Lahore", value: 300 },
  { name: "Peshawar", value: 200 },
  { name: "Karachi", value: 400 },
  { name: "Islamabad", value: 300 },
];

const monhtly_sales_data = [
  { month: "Jan", sales: 24, percentage: "4.0%" },
  { month: "Feb", sales: 95, percentage: "15.8%" },
  { month: "Mar", sales: 8, percentage: "1.7%" },
  { month: "Apr", sales: 43, percentage: "6.2%" },
  { month: "May", sales: 23, percentage: "3.9%" },
  { month: "Jun", sales: 20, percentage: "3.4%" },
  { month: "Jul", sales: 60, percentage: "10.0%" },
  { month: "Aug", sales: 29, percentage: "4.8%" },
  { month: "Sep", sales: 53, percentage: "8.8%" },
  { month: "Oct", sales: 90, percentage: "15.0%" },
  { month: "Nov", sales: 76, percentage: "12.7%" },
  { month: "Dec", sales: 61, percentage: "10.2%" },
];

const SalesChart = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: { xs: 1, sm: 2 },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {/* Sidebar */}
      <Box sx={{ width: { xs: "100%", md: "auto" } }}>
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { md: "1200px" },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Box>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Weekly Sales
              </Typography>
              <ResponsiveContainer width={300} height={200}>
                <BarChart data={salesData}>
                  <XAxis dataKey="sales" axisLine={false} tickLine={false} stroke="black" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    fill="#FFA726"
                    stroke="blackck"
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                    // label={{ position: 'top' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Box>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Purchase Orders
              </Typography>
              <ResponsiveContainer width={300} height={200}>
                <BarChart data={ordersData}>
                  <XAxis dataKey="orders" axisLine={false} tickLine={false} stroke="black" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar
                    dataKey="orders"
                    fill="#4CAF50"
                    // stroke="black" 
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 5 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
            <Typography variant="h5" sx={{ textAlign: "center", mb: 1, mt: 0.5 }}>
              Total Sales
            </Typography>
            <ResponsiveContainer width={300} height={245}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={totao_sales_data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => value}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {totao_sales_data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Box>
            <Paper
              elevation={3}
              style={{ padding: "16px", textAlign: "center", borderRadius: 15 }}
            >
              <Typography variant="h5">Monthly Sales</Typography>
              <ResponsiveContainer width={480} height={250}>
                <BarChart data={monhtly_sales_data}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="black" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    fill="#FFA726"
                    barSize="7%"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
                {/* {monhtly_sales_data.map((item) => (
                  <>
                    <Typography>{item.sales}</Typography>
                    <Typography>{item.percentage}</Typography>
                  </>
                ))} */}
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SalesChart;
