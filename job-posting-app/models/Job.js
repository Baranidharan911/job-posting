const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  endDate: { type: Date, required: true },
  candidates: [{ type: String }], // Array of candidate emails
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Job', JobSchema);
