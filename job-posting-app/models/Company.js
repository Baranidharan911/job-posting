const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  employeeSize: { type: String, required: true },
  emailOtp: { type: String }, // Adding OTP fields
  isVerified: { type: Boolean, default: false }, // Optional field to track whether the company is verified
});

module.exports = mongoose.model('Company', CompanySchema);
