const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// MongoDB Database Connection
const connectionDB = async () => {
  try {
    // Connect to MongoDB using environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log("data base connected successfully");
  } catch (error) {
    console.log("database connection isssue", error);
  }
};

// Export connection function
module.exports = connectionDB;
