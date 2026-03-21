import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import bgImage from "../assets/signup.png";



export default function AdminLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     
      const success = await login(userId, password);
      if (success) {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-96 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-white text-3xl font-semibold mb-6 text-center drop-shadow-md">
          Admin Login
        </h2>

        <label className="block text-gray-200 mb-2">Admin ID</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter user ID"
        />

        <label className="block text-gray-200 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
