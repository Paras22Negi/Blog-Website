import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axios from "axios";

// Simple signup form
function Signup() {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mailVerified, setMailVerified] = useState(false);
  const [sendOtp, setsendOtp] = useState(false);
  const [inputOtp, setIOtp] = useState("");
  const [loading, setLoading] = useState(false);



  const reset= async()=>{
    setMailVerified(false);
    setOtp("");
    setIOtp("");
  }



  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Send signup request
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    console.log(data);
    // Handle errors)
    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }
    // Success:redirect to login
    navigate("/login");
    reset();
  }

  const handleSendOtp = async () => {
    try {
      setLoading(true)
      console.log("Sending OTP to email:", email);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/otp-send`,
        { email }
      );
      if (response.data.message === "Email sent successfully"){
        setsendOtp(true);
        console.log("respose", response.data.message);
      }
    }catch(error){
      console.error("Error sending OTP: ", error);
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    try {
      console.log("Verifying OTP:", inputOtp);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify-otp`,{email, otp: inputOtp}
      );
      console.log("response!!!!!!", response.data);
      if (response.data.message === "OTP verified successfully"){
        setMailVerified(true);
        
        console.log("verified");
        setsendOtp(false)
      }
    }catch (error){
      console.error("Error verifying OTP: ", error);
    }
  }

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="signup-group">
          <label className="signup-label">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="enter your Full Name"
            className="signup-input"
          />
        </div>
        <div className="signup-group">
          <label className="signup-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="enter your email"
            className="signup-input"
          />
          <button
            type="button"
            disabled={loading}
            className="mt-2 px-3 py-1.5 bg-blue-600 text-white font-medium rounded-md text-sm cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center"
            onClick={handleSendOtp}
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-9 9h4l-3 3-3-3h4z"
                ></path>
              </svg>
            ) : (
              "send otp"
            )}
          </button>
        </div>
        {sendOtp && (
          <div className="signup-group">
            <label className="signup-label">OTP:</label>
            <input
              type="text"
              value={inputOtp}
              name="otp"
              onChange={(e) => setIOtp(e.target.value)}
              required
              placeholder="enter your otp"
              className="signup-input"
            />
            <button
              type="button"
              className="mt-2 px-3 py-1.5 bg-blue-600 text-white font-medium rounded-md text-sm cursor-pointer transition-colors duration-200 hover:bg-blue-700 "
              onClick={() => handleVerifyOtp()}
            >
              verify
            </button>
          </div>
        )}
        <div className="signup-group relative w-full">
          <label className="signup-label">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base outline-none"
          />
          <button
            type="button"
            className="absolute right-2 top-11 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="signup-error">{error}</div>}
        {mailVerified ? (
          <button
            type="submit"
            className="w-full p-2.5 bg-green-600 text-white font-semibold border-none rounded-md text-base cursor-pointer transition-colors duration-200 hover:bg-green-900"
          >
            Signup
          </button>
        ) : (
          <button
            type="submit"
            disabled
            className="w-full p-2.5 bg-green-700 text-white font-semibold rounded-md text-base cursor-pointer transition-colors duration-200 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Sign Up
          </button>
        )}
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>{" "}
        </p>
      </form>
    </div>
  );
}

export default Signup;