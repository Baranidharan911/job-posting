const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Job Routes
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Updated CORS configuration for multiple origins (local and Vercel)
app.use(cors({
  origin: ['http://localhost:3000', 'https://job-posting-omega.vercel.app'], // Add Vercel domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Include credentials if needed
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes); // Job-related routes

// Define Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
