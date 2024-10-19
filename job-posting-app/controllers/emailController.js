const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');

// Send OTP for email
exports.sendEmailOTP = async (req, res) => {
  const { companyEmail } = req.body;
  
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP

  try {
    // Send email logic using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: companyEmail,
      subject: 'OTP for Email Verification',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Save OTP to the EmailLog database
    const emailLog = new EmailLog({
      companyEmail,
      otp,
    });
    await emailLog.save();

    // Optionally, save OTP in the session (or other secure storage mechanism)
    req.session.otp = otp;

    res.status(200).json({ msg: 'OTP sent to email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyEmailOTP = async (req, res) => {
  const { otp } = req.body;

  if (req.session.otp === otp) {
    req.session.otp = null; // Clear OTP after verification
    res.status(200).json({ msg: 'Email verified successfully' });
  } else {
    res.status(400).json({ msg: 'Invalid OTP' });
  }
};
