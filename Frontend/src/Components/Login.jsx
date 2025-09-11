import React, { useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email,
          password,
        }
      );
      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Navigate("/Blog"); // Redirect to Blog page after successful login
    } catch (error) {
      setError("Server error. Please try again later.");
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-group">
          <label className="login-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="enter your email"
            className="login-input"
          />
        </div>
        <div className="login-group relative w-full">
          <label className="login-label">Password:</label>
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
        {error && <div className="login-error">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2.5 bg-green-600 text-white font-semibold border-none rounded-md text-base cursor-pointer transition-colors duration-200 hover:bg-green-900"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;