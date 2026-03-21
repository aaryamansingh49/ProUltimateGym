import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import BASE_URL from "../api/config.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Login request
      const res = await axios.post(`${BASE_URL}/api/login`, formData);

      const user = res.data.user;
      const token = res.data.token;

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("userKey", user._id);
      localStorage.setItem("userId", user._id);

      let userProfile = user;

      try {
        // ✅ Get profile using token
        const profileRes = await axios.get(`${BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        userProfile = {
          ...user,
          ...profileRes.data.profile,
        };
      } catch (err) {
        console.log("Profile fetch failed or not created yet");
      }

      // Save full profile
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-section">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/otp-login")}
          >
            Login via OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
