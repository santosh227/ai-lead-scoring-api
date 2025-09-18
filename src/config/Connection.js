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

    // AWAIT the connection
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("data base connected successfully");
    
    // Return success
    return true;
    
  } catch (error) {
    console.log("database connection issue", error);
    throw error; // Throw error so server startup fails
  }
};

// Export connection function
module.exports = connectionDB;
