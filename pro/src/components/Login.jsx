import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import BASE_URL from "../api/config.js";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/login`, formData);

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userKey", user._id);
      localStorage.setItem("userId", user._id);

      let userProfile = user;

      try {
        const profileRes = await axios.get(`${BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("PROFILE DATA:", profileRes.data.profile); // ⭐ DEBUG


        if (profileRes.data.profile) {
          userProfile = {
            ...user,
            ...profileRes.data.profile,
          };
        } else {
          userProfile = {
            ...user,
            profileCompleted: false, // ⭐ important flag
          };
        }
      } catch (err) {
        console.log("Profile fetch failed");
      }

      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      setSuccess(true);

      setTimeout(async () => {
        try {
          const checkRes = await axios.get(
            `${BASE_URL}/api/check-active-membership?email=${user.email}`
          );

          localStorage.setItem("isMember", checkRes.data.isActive);
      
          if (checkRes.data.isActive) {
            navigate("/dashboard"); // ✅ allowed
          } else {
            navigate("/membership"); // ❌ redirect here
          }
        } catch (err) {
          console.log("Membership check failed");
          navigate("/membership"); // fallback
        }
      }, 1200);
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

        {/* <h2 className="brand"><span>Pro Ultimate Gym</span></h2> */}

        <h1>Log In</h1>
        <p className="subtitle">
          Enter your member credentials to access your ultimate training portal.
        </p>

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
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <span className="forgot-link" onClick={handleForgotPassword}>
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={loading || success}>
            {loading ? (
              <span className="btn-loader"></span>
            ) : success ? (
              "✔ Success"
            ) : (
              "Log in"
            )}
          </button>

          <div className="divider">or</div>

          <button
            type="button"
            className="otp-btn"
            onClick={() => navigate("/otp-login")}
          >
            Log in via OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;