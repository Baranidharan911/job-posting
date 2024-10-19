import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import axios from 'axios';
import '../styles/OTPVerification.css';

const OTPVerification = () => {
    const [otpData, setOtpData] = useState({
        emailOtp: '',
    });
    const [mobileOTPInput, setMobileOTPInput] = useState('');
    const [message, setMessage] = useState(''); // To show success or error messages

    const location = useLocation();
    const navigate = useNavigate();

    const { companyEmail, phoneNumber } = location.state; // Get phone number and email from SignUp

    console.log("Company Email:", companyEmail); // For debugging email
    console.log("Phone Number:", phoneNumber);   // For debugging phone number

    // Handle form changes
    const handleChange = (e) => {
        setOtpData({ ...otpData, [e.target.name]: e.target.value });
    };

    // Handle Email OTP verification
    const handleEmailVerify = async () => {
        try {
            console.log("Verifying Email OTP:", otpData.emailOtp); // Debugging email OTP
            const res = await axios.post('https://your-backend-url.vercel.app/api/auth/verify-email-otp', {
              companyEmail,
              emailOtp: otpData.emailOtp,
            });            

            // If OTP is valid and returns a token, redirect the user
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Store the JWT token
                alert('Email verified successfully. Redirecting to dashboard.');
                navigate('/dashboard');
            } else {
                setMessage(res.data.msg); // Show the message returned from the server
            }
        } catch (err) {
            console.error("Error during email OTP verification:", err); // Debugging error
            alert('Email OTP verification failed: ' + err.response.data.msg);
        }
    };

    // Handle Mobile OTP verification
    const handleMobileVerify = async () => {
        try {
            console.log("Verifying Mobile OTP:", mobileOTPInput); // Debugging mobile OTP
            const res = await axios.post('https://your-backend-url.vercel.app/api/auth/verify-email-otp', {
                companyEmail,  // Ensure that company email is passed correctly
                mobileOtp: mobileOTPInput,
            });

            // If OTP is valid and returns a token, redirect the user
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Store the JWT token
                alert('Mobile verified successfully. Redirecting to dashboard.');
                navigate('/dashboard');
            } else {
                setMessage(res.data.msg); // Show the message returned from the server
            }
        } catch (err) {
            console.error("Error during mobile OTP verification:", err); // Debugging error
            alert('Mobile OTP verification failed: ' + err.response.data.msg);
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-left">
                <p className="otp-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </p>
            </div>
            <form className="otp-form">
                <h2>OTP Verification</h2>

                {/* Email OTP field */}
                <div className="otp-field">
                    <div className="input-icon-wrapper">
                        <AiOutlineMail className="icon" />
                        <input
                            type="text"
                            name="emailOtp"
                            placeholder="Enter Email OTP"
                            value={otpData.emailOtp}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="button" className="verify-btn" onClick={handleEmailVerify}>
                        Verify Email OTP
                    </button>
                </div>

                {/* Mobile OTP field, shown conditionally */}
                {phoneNumber && (
                    <div className="otp-field">
                        <div className="input-icon-wrapper">
                            <AiOutlinePhone className="icon" />
                            <input
                                type="text"
                                placeholder="Enter Mobile OTP"
                                value={mobileOTPInput}
                                onChange={(e) => setMobileOTPInput(e.target.value)}
                            />
                        </div>
                        <button type="button" className="verify-btn" onClick={handleMobileVerify}>
                            Verify Mobile OTP
                        </button>
                    </div>
                )}

                {/* Display success or error messages */}
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default OTPVerification;
