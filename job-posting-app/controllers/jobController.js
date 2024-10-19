const Job = require('../models/Job'); // Import the Job model

// Create a job posting
exports.createJob = async (req, res) => {
  const { title, description, experienceLevel, candidates, endDate } = req.body;

  try {
    // Create new job object
    const newJob = new Job({
      title,
      description,
      experienceLevel,
      candidates,
      endDate,
      company: req.company.id, // Assuming the authenticated company's ID is available in req.company from the authMiddleware
    });

    // Save the job in the database
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
