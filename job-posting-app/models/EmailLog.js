const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  companyEmail: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailLog', EmailLogSchema);
