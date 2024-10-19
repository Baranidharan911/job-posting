const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Job Routes
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// CORS configuration to allow multiple origins (local development and Vercel)
app.use(cors({
  origin: ['http://localhost:3000', 'https://job-posting-omega.vercel.app'], // Allow local and Vercel frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // Allow cookies and other credentials
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define API Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/job', jobRoutes);    // Job-related routes

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
