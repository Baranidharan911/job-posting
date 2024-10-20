import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineUsergroupAdd, AiOutlineTeam } from 'react-icons/ai';
import axios from 'axios';
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
    companyEmail: '',
    employeeSize: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Use your deployed backend URL
      const res = await axios.post('/api/auth/register', formData);
  
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        alert('Login successful. Redirecting to dashboard.');
        navigate('/dashboard');
      } else {
        alert(res.data.msg);
        navigate('/otp-verification', {
          state: { companyEmail: formData.companyEmail, phoneNumber: formData.phone }
        });
      }
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <p className="signup-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up / Login</h2>
        <p>Lorem Ipsum is simply dummy text</p>

        <div className="input-field">
          <div className="input-icon-wrapper">
            <AiOutlineUser className="icon" />
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="input-field">
          <div className="input-icon-wrapper">
            <AiOutlinePhone className="icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number (e.g., 9876543210)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-field">
          <div className="input-icon-wrapper">
            <AiOutlineUsergroupAdd className="icon" />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-field">
          <div className="input-icon-wrapper">
            <AiOutlineMail className="icon" />
            <input
              type="email"
              name="companyEmail"
              placeholder="Company Email"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-field">
          <div className="input-icon-wrapper">
            <AiOutlineTeam className="icon" />
            <input
              type="text"
              name="employeeSize"
              placeholder="Employee Size"
              value={formData.employeeSize}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">Proceed</button>
        <p className="terms">
          By clicking on proceed you will accept our{' '}
          <a href="#">Terms & Conditions</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
