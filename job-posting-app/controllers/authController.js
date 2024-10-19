const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Twilio configuration (use your own credentials)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Make sure this is defined in .env

// Register a company or login if it already exists
exports.registerCompany = async (req, res) => {
  const { name, phone, companyName, companyEmail, employeeSize } = req.body;

  try {
    // Check if the company already exists
    let company = await Company.findOne({ companyEmail });

    if (company) {
      if (company.isVerified) {
        // If the company exists and is already verified, generate a JWT token
        const payload = {
          company: {
            id: company.id,
            name: company.name
          }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, msg: 'Company already registered. Redirecting to dashboard.' });
      } else {
        return res.status(400).json({ msg: 'Company exists but is not verified. Please verify OTP.' });
      }
    }

    // If the company does not exist, register it
    const emailOtp = Math.floor(100000 + Math.random() * 900000); // Generate Email OTP

    company = new Company({
      name,
      phone,
      companyName,
      companyEmail,
      employeeSize,
      emailOtp,
      isVerified: false,
    });

    // Save the company to the DB
    await company.save();

    // Send OTP to email
    await sendOTPEmail(companyEmail, emailOtp);

    // Send OTP to mobile via Twilio
    await sendOTPMobile(phone);

    res.status(200).json({ msg: 'Company registered. Verify OTP to continue.', companyEmail });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to send OTP email
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

// Helper function to send OTP to mobile via Twilio
const sendOTPMobile = async (phoneNumber) => {
  const formattedPhone = `+91${phoneNumber}`; // Append country code manually
  await client.verify.v2.services(twilioServiceSid)
    .verifications
    .create({ to: formattedPhone, channel: 'sms' });
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
      company.isVerified = true;
      await company.save();
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
          name: company.name
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
