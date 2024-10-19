import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import '../styles/JobPosting.css'; // Import the CSS file for styling
import homeImage from '../assets/home.png';

const JobPosting = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experienceLevel: '',
    endDate: '',
  });

  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to post a job.');
      return;
    }

    const candidates = tags.map(tag => tag.text); // Collect candidate emails

    try {
      const response = await fetch('http://localhost:5000/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, 
        },
        body: JSON.stringify({ ...formData, candidates }), 
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Job posted successfully!');
        setFormData({
          title: '',
          description: '',
          experienceLevel: '',
          endDate: '',
        });
        setTags([]); 
      } else {
        setMessage(`Failed to post job: ${result.msg}`);
      }
    } catch (error) {
      setMessage('Error occurred while posting the job.');
      console.error('Error:', error);
    }
  };

  // React Tag Input Handlers
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  return (
    <div className="jobposting-container">
      <aside className="sidebar">
        <div className="home-icon" onClick={handleHomeClick}>
          <img src={homeImage} alt="Home" className="home-image" />
        </div>
      </aside>
      <main className="job-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <label htmlFor="experienceLevel">Experience Level</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Experience Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>

          <label htmlFor="candidates">Add Candidate</label>
          <ReactTags
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            placeholder="xyz@gmail.com"
          />

          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          <button type="submit">Send</button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
};

export default JobPosting;
