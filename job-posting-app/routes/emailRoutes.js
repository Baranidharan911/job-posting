const express = require('express');
const { sendEmailOTP, verifyEmailOTP } = require('../controllers/emailController');
const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendEmailOTP);

// Route to verify OTP
router.post('/verify', verifyEmailOTP);

module.exports = router;
