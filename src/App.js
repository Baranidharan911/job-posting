import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Signup from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import JobPosting from './pages/JobPosting';
import NavbarBasic from './components/NavbarBasic'; // New basic navbar
import NavbarAuth from './components/NavbarAuth';   // New auth navbar

// A utility function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if a token exists, otherwise false
};

// ProtectedRoute component to prevent unauthenticated access
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/signup" />;
};

// Choose which Navbar to display based on the route
const AppWithNavbar = ({ children }) => {
  const location = useLocation();

  // Show NavbarBasic for signup and otp-verification, NavbarAuth for other pages
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/otp-verification';
  return (
    <>
      {isAuthPage ? <NavbarBasic /> : <NavbarAuth />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithNavbar>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OTPVerification />} />

          {/* Only authenticated users can access the dashboard and job posting */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-posting"
            element={
              <ProtectedRoute>
                <JobPosting />
              </ProtectedRoute>
            }
          />

          {/* Redirect all other routes to signup for now */}
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </AppWithNavbar>
    </Router>
  );
};

export default App;
