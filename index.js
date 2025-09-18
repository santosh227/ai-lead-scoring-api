const express = require("express");
const cors = require("cors");
const path = require("path");
const connectionDB = require("./src/config/Connection");
const apiRoutes = require("./src/routes/index");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectionDB();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API info
app.get("/", (req, res) => {
  res.json({
    message: " Lead Scoring API",
    endpoints: {
      "POST /api/offer": "Submit product/offer information",
      "POST /api/leads/upload": "Upload CSV with leads",
      "POST /api/score": "Run AI scoring",
      "GET /api/results": "Get results",
      "GET /api/results/csv": "Export CSV",
    },
    status: "ready",
  });
});

// API routes--> routes/api/offer
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Lead Scoring API running on port ${PORT}`);
  console.log("mongoDB connected successfully");
});
