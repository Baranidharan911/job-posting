const express = require('express');
const { registerCompany, verifyEmailOTP, verifyMobileOTP } = require('../controllers/authController');
const router = express.Router();

// Register route
router.post('/register', registerCompany);

// OTP verification routes
router.post('/verify-email-otp', verifyEmailOTP);
router.post('/verify-mobile-otp', verifyMobileOTP);

module.exports = router;
