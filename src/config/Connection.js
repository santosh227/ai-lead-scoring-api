const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// MongoDB Database Connection with timeout fix
const connectionDB = async () => {
  try {
    // Connection options WITHOUT bufferCommands = false
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      // REMOVED: bufferCommands: false, // This was causing the issue
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("data base connected successfully");
    return true;
    
  } catch (error) {
    console.log("database connection issue", error);
    throw error;
  }
};

// Export connection function
module.exports = connectionDB;
