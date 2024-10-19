const nodemailer = require('nodemailer');
const Job = require('../models/Job'); // Import the Job model

// Create a job posting
exports.createJob = async (req, res) => {
  const { title, description, experienceLevel, candidates, endDate } = req.body;

  try {
    // Create new job object (candidates stored as an array)
    const newJob = new Job({
      title,
      description,
      experienceLevel,
      candidates, // Storing the array as it is
      endDate,
      company: req.company.id, // Assuming the authenticated company's ID is available in req.company from authMiddleware
    });

    // Save the job in the database
    const job = await newJob.save();

    // Send emails to candidates
    await sendJobAlertEmails(candidates, job);

    res.json({ msg: 'Job posted and emails sent successfully!', job });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Helper function to send emails to candidates
const sendJobAlertEmails = async (candidates, job) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password
      },
    });

    // Prepare email options
    const mailOptions = (email) => ({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Job Posting Alert',
      text: `A new job titled "${job.title}" has been posted. Job Description: ${job.description}. End Date: ${job.endDate}`,
    });

    // Send email to each candidate using Promise.all() for parallel email sending
    await Promise.all(
      candidates.map((email) => transporter.sendMail(mailOptions(email)))
    );

    console.log('Emails sent to all candidates successfully.');
  } catch (error) {
    console.error('Error sending job alert emails:', error);
  }
};
