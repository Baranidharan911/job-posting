const express = require('express');
const { createJob } = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware'); // Middleware to authenticate
const router = express.Router();

// Protected route for creating a job
router.post('/create', auth, createJob);

module.exports = router;
