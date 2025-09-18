const express = require("express");
const cors = require("cors");
const path = require("path");
const connectionDB = require("./src/config/Connection");
const apiRoutes = require("./src/routes/index");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
connectionDB();

// Middleware setup
app.use(express.json({ limit: "10mb" })); // Parse JSON requests with 10MB limit
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Root endpoint - API documentation
app.get("/", (req, res) => {
  res.json({
    message: "AI Lead Scoring API",
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

// Mount API routes under /api prefix
app.use("/api", apiRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AI Lead Scoring API running on port ${PORT}`);
  console.log("MongoDB connected successfully");
});
