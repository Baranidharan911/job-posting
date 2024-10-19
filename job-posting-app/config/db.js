const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load the .env file

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);  // No options needed here
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);  // Exit process with failure
    }
};  

module.exports = connectDB;
