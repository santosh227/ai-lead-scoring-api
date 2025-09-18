const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


// MongoDB DataBase Conection 
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("data base connected successfully");
  } catch (error) {
    console.log("database connection isssue", error);
  }
};
//exporting the file 
module.exports = connectionDB;
