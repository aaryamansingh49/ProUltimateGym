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
  Cell,
} from "recharts";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config.js";
import "../styles/AdminCharts.css";

const API_BASE = BASE_URL;

/* 🔥 COLOR LOGIC */
const getBarColor = (value) => {
  if (value <= 10000) return "#ef4444";  
  if (value <= 30000) return "#f59e0b";  
  return "#22c55e";                      
};

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

/* ================= REVENUE ================= */
export function RevenueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const json = await fetchChartData(
          adminToken || localStorage.getItem("adminToken")
        );
        if (!mounted) return;
        setData(json.revenue || []);
      } catch (err) {
        console.error(err);
        if (err.status === 401) {
          alert("Login required");
          navigate("/admin-login");
          return;
        }
        setError("Failed to fetch revenue");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [adminToken, navigate]);

  return (
    <div className="chart-box-dark">
      <h3 className="chart-title">Monthly Revenue</h3>

      <div className="chart-container">
        {loading ? (
          <p className="chart-text">Loading...</p>
        ) : error ? (
          <p className="chart-error">{error}</p>
        ) : data.length === 0 ? (
          <p className="chart-text">No data available</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />

              <Bar dataKey="revenue" barSize={22}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.revenue)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* ================= GROWTH ================= */
export function GrowthChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const json = await fetchChartData(
          adminToken || localStorage.getItem("adminToken")
        );
        if (!mounted) return;
        setData(json.growth || []);
      } catch (err) {
        console.error(err);
        if (err.status === 401) {
          alert("Login required");
          navigate("/admin-login");
          return;
        }
        setError("Failed to fetch growth");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [adminToken, navigate]);

  return (
    <div className="chart-box-dark">
      <h3 className="chart-title">Member Growth Trend</h3>

      <div className="chart-container">
        {loading ? (
          <p className="chart-text">Loading...</p>
        ) : error ? (
          <p className="chart-error">{error}</p>
        ) : data.length === 0 ? (
          <p className="chart-text">No data available</p>
        ) : (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}