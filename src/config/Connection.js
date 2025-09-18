const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// MongoDB Database Connection with simple timeout fix
const connectionDB = async () => {
  try {
    // Simple connection options to fix Render timeout
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Don't buffer commands
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("data base connected successfully");
  } catch (error) {
    console.log("database connection issue", error);
  }
};

// Export connection function
module.exports = connectionDB;
