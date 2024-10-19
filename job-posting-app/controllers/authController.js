const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Twilio configuration (use your own credentials)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Make sure this is correctly defined in your .env file

// Register a company and send OTPs (both email and mobile)
exports.registerCompany = async (req, res) => {
  const { name, phone, companyName, companyEmail, employeeSize, password } = req.body;

  try {
    let company = await Company.findOne({ companyEmail });
    if (company) {
      return res.status(400).json({ msg: 'Company already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company in the DB
    company = new Company({
      name,
      phone, // Storing raw phone number without prefix
      companyName,
      companyEmail,
      employeeSize,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate Email OTP
    const emailOtp = Math.floor(100000 + Math.random() * 900000);
    company.emailOtp = emailOtp;

    // Save company to DB with email OTP
    await company.save();

    // Send OTP to email
    await sendOTPEmail(companyEmail, emailOtp);

    // Send mobile OTP via Twilio
    await sendOTPMobile(phone);

    res.status(200).json({ msg: 'Company registered. Verify OTP to continue.', companyEmail });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to send email OTP
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send mobile OTP via Twilio
const sendOTPMobile = async (phoneNumber) => {
  try {
    // Log the phone number before sending the OTP to ensure it's correct
    console.log('Sending OTP to mobile:', phoneNumber);

    const formattedPhone = `+91${phoneNumber}`; // Append country code manually
    const result = await client.verify.v2.services(twilioServiceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });

    console.log('OTP sent via Twilio to mobile:', formattedPhone);
    return result;
  } catch (error) {
    console.error('Error sending OTP to mobile via Twilio:', error);
    throw new Error('Failed to send OTP to mobile');
  }
};

// Verify email OTP
exports.verifyEmailOTP = async (req, res) => {
  const { companyEmail, emailOtp } = req.body;

  try {
    let company = await Company.findOne({ companyEmail });
    if (!company) {
      return res.status(400).json({ msg: 'Invalid company email' });
    }

    if (company.emailOtp == emailOtp) {
      res.json({ msg: 'Email OTP verified successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid Email OTP' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify mobile OTP via Twilio
exports.verifyMobileOTP = async (req, res) => {
  const { companyEmail, mobileOtp } = req.body;

  try {
    let company = await Company.findOne({ companyEmail });
    if (!company) {
      return res.status(400).json({ msg: 'Invalid company email' });
    }

    // Log the phone number and OTP being verified to help debug
    console.log('Verifying mobile OTP for:', company.phone, 'OTP entered:', mobileOtp);

    // Make sure phone number format is consistent for Twilio verification
    const formattedPhone = `+91${company.phone}`;

    // Verify Twilio OTP
    const result = await client.verify.v2.services(twilioServiceSid)
      .verificationChecks
      .create({ to: formattedPhone, code: mobileOtp });

    if (result.status === 'approved') {
      company.isVerified = true;
      await company.save();

      // Generate JWT with both company id and name
      const payload = {
        company: {
          id: company.id,
          name: company.name // Include company name in the token
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, msg: 'Mobile OTP verified successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid Mobile OTP' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
