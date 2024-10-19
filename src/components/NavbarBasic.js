import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Navbar.css';
import logo from '../assets/logo.png';

const NavbarBasic = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Cuvette Logo" />
      </div>
      <div className="navbar-contact">
        <Link to="#">Contact</Link>
      </div>
    </nav>
  );
};

export default NavbarBasic;
