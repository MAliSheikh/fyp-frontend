import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { BarChartWeeklySales, BarChartMonthlySales, BarChartNewUsers, PieChartTotalUsers } from "./chartcomponent";

const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#F5F5F5",
    minHeight: "100vh",
  },
  sidebarSpace: {
    width: "250px", // Reserved space for the future sidebar
    backgroundColor: "#E0E0E0",
  },
  contentArea: {
    flex: 1,
    padding: "20px",
  },
  chartPaper: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    height: "350px", // Fixed height for all charts
  },
  chartTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    fontWeight: "600",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "bold",
  },
};

const GraphPage = () => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.sidebarSpace}></div>
      <div style={styles.contentArea}>
      <Typography 
  variant="h2" 
  style={{
    fontSize: "36px", 
    fontWeight: "bold", 
    color: "black",  // Set the color to black
    textAlign: "center", 
    marginBottom: "40px", // Add space below the header
    paddingTop: "20px",   // Add some space at the top
  }}
>
  Hey There.....
</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper style={styles.chartPaper}>
              <Typography style={styles.chartTitle}>Weekly Sales</Typography>
              <BarChartWeeklySales />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={styles.chartPaper}>
              <Typography style={styles.chartTitle}>Monthly Sales</Typography>
              <BarChartMonthlySales />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={styles.chartPaper}>
              <Typography style={styles.chartTitle}>New Users</Typography>
              <BarChartNewUsers />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={styles.chartPaper}>
              <Typography style={styles.chartTitle}>Total Users</Typography>
              <PieChartTotalUsers />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GraphPage;
