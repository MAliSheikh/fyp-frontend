import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  // CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { SideBar } from "./sidebar";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#FD8744", "#FFB95A", "#D05759", "#0B8FD9"];

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  // const [totalSalesData, setTotalSalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);

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
        // const totalResponse = await axios.get(
        //   `http://localhost:8000/sales/sales/total?store_id=${storeId}`
        // );

        setSalesData(weeklyResponse.data.weekly_sales);
        setOrdersData(weeklyResponse.data.weekly_orders);
        // setTotalSalesData(totalResponse.data.total_sales);
        setMonthlySalesData(monthlyResponse.data.monthly_sales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

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
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
              <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
                Weekly Sales
              </Typography>
              <ResponsiveContainer width={390} height={200}>
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
                    stroke="blackck"
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                    minPointSize={3}
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
              <ResponsiveContainer width={390} height={200}>
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
                    // stroke="black"
                    strokeWidth={1}
                    radius={[10, 10, 0, 0]}
                    barSize="8%"
                    tickFormatter={(value) => value.replace("Week", "w")}
                    minPointSize={3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
        {/* 
<Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
            <Typography variant="h5" sx={{ textAlign: "center", mb: 1, mt: 0.5 }}>
              Total Sales
            </Typography>
            <ResponsiveContainer width={300} height={270}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={monthlySalesData}
                  // data={totalSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => value}
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {monthlySalesData.map((entry, index) => (
                  // {totalSalesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
           */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 5 }}>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", mb: 1, mt: 0.5 }}
            >
              Total Sales
            </Typography>
            <ResponsiveContainer width={300} height={270}>
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
                    value: item.sales,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // Remove the label prop to hide permanent labels
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
          <Paper
            elevation={3}
            style={{ padding: "16px", textAlign: "center", borderRadius: 15 }}
          >
            <Typography variant="h5">Monthly Sales</Typography>
            <ResponsiveContainer width={480} height={270}>
              <BarChart data={monthlySalesData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  stroke="black"
                />
                <YAxis hide={true} />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="#FFA726"
                  barSize="7%"
                  radius={[10, 10, 0, 0]}
                  minPointSize={3}
                />
              </BarChart>
              {/* {monthlySalesData.map((item) => (
                    <Typography>{item.sales}</Typography>
                  ))} */}
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SalesChart;
