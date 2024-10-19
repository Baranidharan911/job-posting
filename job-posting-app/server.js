const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

// No need for specific CORS configuration now, as the frontend and backend share the same domain on Vercel
// app.use(cors());  // CORS config can be removed or made generic

// Middleware to parse JSON bodies
app.use(express.json());

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);

// Start the server locally or in a serverless function
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;  // Export the app for deployment
