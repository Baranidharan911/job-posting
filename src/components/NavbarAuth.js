import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../components/Navbar.css';
import logo from '../assets/logo.png'; // Adjust this if necessary

const NavbarAuth = () => {
  const [username, setUsername] = useState('Your Name');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const companyName = decoded.company?.name || 'Your Name';
        setUsername(companyName);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Cuvette Logo" />
      </div>
      <div className="navbar-contact">
        <Link to="#">Contact</Link>
        <div className="user-dropdown" onClick={toggleDropdown}>
          <div className="user-profile">
            <span className="profile-avatar"></span>
            <span className="user-name">{username}</span>
            <i className={`fa fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
          </div>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarAuth;
