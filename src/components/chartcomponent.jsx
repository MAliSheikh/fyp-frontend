import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Weekly Sales Bar Chart (Orange color)
export const BarChartWeeklySales = () => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1500, 1700, 1300, 1900],
        backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange color for Weekly Sales
        borderColor: "rgba(255, 159, 64, 1)", // Darker shade of orange
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false }, // Remove grid lines on x-axis
        barThickness: 30,
      },
      y: {
        grid: { display: false }, // Remove grid lines on y-axis
        ticks: { stepSize: 500 },
      },
    },
  };

  return <Bar data={data} options={options} height={200} width={300} />;
};

// Monthly Sales Bar Chart (Orange color)
export const BarChartMonthlySales = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Sales",
        data: [4000, 4200, 5500, 4800, 5200, 6000, 6800, 7000],
        backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange color for Monthly Sales
        borderColor: "rgba(255, 159, 64, 1)", // Darker shade of orange
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false }, // Remove grid lines on x-axis
        barThickness: 30,
      },
      y: {
        grid: { display: false }, // Remove grid lines on y-axis
        ticks: { stepSize: 2000 },
      },
    },
  };

  return <Bar data={data} options={options} height={200} width={300} />;
};

// New Users Bar Chart (Green color)
export const BarChartNewUsers = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Users",
        data: [65, 59, 80, 81, 56, 55, 40, 75],
        backgroundColor: "rgba(42, 187, 141, 0.6)", // Green color for New Users
        borderColor: "rgba(42, 187, 141, 1)", // Darker green for emphasis
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false }, // Remove grid lines on x-axis
        barThickness: 30,
      },
      y: {
        grid: { display: false }, // Remove grid lines on y-axis
        ticks: { stepSize: 20 },
      },
    },
  };

  return <Bar data={data} options={options} height={200} width={300} />;
};

// Total Users Pie Chart (Colors remain the same as previously)
export const PieChartTotalUsers = () => {
  const data = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#e91e63"], // Colors from Material Design (Green, Orange, Blue, Pink)
        hoverBackgroundColor: ["#388e3c", "#f57c00", "#1976d2", "#d81b60"], // Darker shades for hover effect
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  const containerStyle = {
    width: "100%",
    height: "200px", // Reduced height to make it smaller
  };

  return (
    <div style={containerStyle}>
      <Pie data={data} options={options} />
    </div>
  );
};
