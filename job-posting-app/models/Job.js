// models/Job.js

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Junior', 'Mid', 'Senior'], // This restricts the values to one of these options
  },
  candidates: {
    type: String,
    required: true, // Candidate email (can be multiple, but for simplicity keeping as a string)
  },
  endDate: {
    type: Date,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the company that posted the job
    ref: 'Company',
  },
  datePosted: {
    type: Date,
    default: Date.now, // Automatically set the posting date to current date
  },
});

module.exports = mongoose.model('Job', JobSchema);
