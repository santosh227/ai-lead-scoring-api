const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI provided:', !!process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("data base connected successfully");
    return true;
    
  } catch (error) {
    console.log("database connection issue", error);
    throw error;
  }
};

module.exports = connectionDB;
