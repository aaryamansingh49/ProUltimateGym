// src/components/AdminCharts.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config.js";


const API_BASE = BASE_URL;



async function fetchChartData(adminToken) {
  const headers = {
    "Content-Type": "application/json",
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  };

  const res = await fetch(`${API_BASE}/api/admin/chart-data`, { headers });
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function RevenueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const json = await fetchChartData(adminToken || localStorage.getItem("adminToken"));
        if (!mounted) return;
        setData(json.revenue || []);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        if (err.status === 401) {
          alert("Admin session required. Please login.");
          navigate("/admin-login");
          return;
        }
        setError(err.message || "Failed to fetch revenue data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // refetch when adminToken changes
  }, [adminToken, navigate]);

  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <div className="text-sm text-gray-300 mb-3">Monthly Revenue</div>
      <div style={{ width: "100%", height: 200 }} className="flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="revenue" barSize={18} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function GrowthChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const json = await fetchChartData(adminToken || localStorage.getItem("adminToken"));
        if (!mounted) return;
        setData(json.growth || []);
      } catch (err) {
        console.error("Error fetching growth data:", err);
        if (err.status === 401) {
          alert("Admin session required. Please login.");
          navigate("/admin-login");
          return;
        }
        setError(err.message || "Failed to fetch growth data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [adminToken, navigate]);

  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <div className="text-sm text-gray-300 mb-3">Member Growth Trend</div>
      <div style={{ width: "100%", height: 200 }} className="flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
