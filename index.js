const express = require("express");
const cors = require("cors");
const path = require("path");
const connectionDB = require("./src/config/Connection");
const apiRoutes = require("./src/routes/index");

// Only load .env in development - NOT in production
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment variables for debugging (remove after fix)
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

const startServer = async () => {
  try {
    await connectionDB();
    
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

    app.use("/api", apiRoutes);

    app.use((req, res) => {
      res.status(404).json({
        error: "Endpoint not found",
        message: `${req.method} ${req.originalUrl} not found`,
      });
    });

    app.listen(PORT, () => {
      console.log(`AI Lead Scoring API running on port ${PORT}`);
      console.log("MongoDB connected successfully");
    });
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
