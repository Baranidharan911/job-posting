import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Dashboard.css';
import homeImage from '../assets/home.png'; // Import the image file

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle the home icon click to navigate to the dashboard
  const handleHomeClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  // Function to handle Create Interview button click
  const handleCreateInterview = () => {
    navigate('/job-posting'); // Navigate to the job posting page
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="home-icon" onClick={handleHomeClick}>
          <img src={homeImage} alt="Home" className="home-image" /> {/* Use image instead of icon */}
        </div>
      </aside>
      <main className="main-content">
        <button className="btn-create" onClick={handleCreateInterview}>
          Create Interview
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
