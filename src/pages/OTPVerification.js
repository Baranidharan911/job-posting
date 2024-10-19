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
            const res = await axios.post('http://localhost:5000/api/auth/verify-email-otp', {
                companyEmail,
                emailOtp: otpData.emailOtp,
            });
            alert(res.data.msg);
        } catch (err) {
            console.error("Error during email OTP verification:", err); // Debugging error
            alert('Email OTP verification failed: ' + err.response.data.msg);
        }
    };

    // Handle Mobile OTP verification
    const handleMobileVerify = async () => {
        try {
            console.log("Verifying Mobile OTP:", mobileOTPInput); // Debugging mobile OTP
            const res = await axios.post('http://localhost:5000/api/auth/verify-mobile-otp', {
                companyEmail,  // Ensure that company email is passed correctly
                mobileOtp: mobileOTPInput,
            });
            console.log("Mobile OTP verification response:", res.data); // Debugging success response
            alert(res.data.msg);

            // Save the token in local storage
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
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
                    <button type="button" onClick={handleEmailVerify}>Verify Email OTP</button>
                </div>

                {/* Mobile OTP field */}
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
                    <button type="button" onClick={handleMobileVerify}>Verify Mobile OTP</button>
                </div>
            </form>
        </div>
    );
};

export default OTPVerification;
