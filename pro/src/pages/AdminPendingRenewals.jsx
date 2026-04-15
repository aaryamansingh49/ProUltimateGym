// src/pages/AdminPendingRenewals.jsx
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import BASE_URL from "../api/config.js";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/PendingRenewals.css";

const API_BASE = BASE_URL;

export default function AdminPendingRenewals() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState("");
  // const [location, setLocation] = useState("");

  const { adminToken } = useAdminAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/pending-renewals`, {
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
      });

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id) => {
    if (!window.confirm("Renew membership?")) return;

    await fetch(`${API_BASE}/api/admin/mark-renewed/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      },
    });

    fetchData();
  };

  const handleRefresh = () => {
    setQuery("");
    setPlan("");
    fetchData();
  };

  const filtered = members.filter((m) => {
    return (
      (m.fullName || "").toLowerCase().includes(query.toLowerCase()) &&
      (plan ? m.membershipPlan === plan : true)
      // (location
      //   ? (m.location || "").toLowerCase().includes(location.toLowerCase())
      //   : true)
    );
  });

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      
      {/* ✅ Sidebar */}
      <AdminSidebar />
  
      {/* ✅ Main Content */}
      <main className="flex-1 p-6">
        
        {/* ✅ Navbar */}
        <AdminNavbar />
  
        {/* ===== ORIGINAL CONTENT START ===== */}
        <div className="renewals-container">
          <div className="renewals-card">
  
            {/* HEADER */}
            <div className="renewal-top-bar">
              <h1>Expired Memberships</h1>
            </div>
  
            {/* FILTER ROW */}
            <div className="renewal-filter-row">
              <div className="renewal-filter-box">
                <label>Filter</label>
                <input
                  placeholder="Search name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
  
              <div className="renewal-filter-box">
                <label>Membership Plans</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="">Select Plan</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
  
              <div className="renewal-filter-box refresh-box">
                <button className="refresh-btn" onClick={handleRefresh}>
                  Refresh
                </button>
              </div>
            </div>
  
            {/* TABLE */}
            <div className="renewal-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Expired Since</th>
                    <th>Action</th>
                  </tr>
                </thead>
  
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id}>
                      <td className="renewal-name-cell">
                        <div className="renewal-avatar"></div>
                        {m.fullName}
                      </td>
  
                      <td>{m.email}</td>
  
                      <td>
                        <span className={`badge ${m.membershipPlan?.toLowerCase()}`}>
                          {m.membershipPlan}
                        </span>
                      </td>
  
                      <td>{m.daysSinceExpired} days</td>
  
                      <td>
                        <button
                          className="renew-btn"
                          onClick={() => handleRenew(m.id)}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
          </div>
        </div>
        {/* ===== ORIGINAL CONTENT END ===== */}
  
      </main>
    </div>
  );
}
