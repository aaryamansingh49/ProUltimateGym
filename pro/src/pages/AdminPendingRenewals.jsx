// src/pages/AdminPendingRenewals.jsx
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import BASE_URL from "../api/config.js";

const API_BASE = BASE_URL;

export default function AdminPendingRenewals() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
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

      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        throw new Error("Unauthorized – please login as admin again.");
      }

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text.slice(0, 200));
        throw new Error("Server returned non-JSON response");
      }

      if (!res.ok) throw new Error("Failed to fetch pending renewals");

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Pending renewals error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this membership as renewed (startDate = today)?"
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/mark-renewed/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response (renew):", text.slice(0, 200));
        throw new Error("Server returned non-JSON response");
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Renew failed");

      await fetchData();
      alert("Renewed successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (m.fullName || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.membershipPlan || "").toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 w-full min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Pending Renewals (Expired Members)
          </h1>
          <div className="flex gap-2 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name / email / plan"
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={() => fetchData()}
              className="px-3 py-2 border rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">End</th>
                <th className="px-3 py-2">Days Since Expired</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No expired memberships found.
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-3 py-2">{m.fullName}</td>
                  <td className="px-3 py-2">{m.email}</td>
                  <td className="px-3 py-2">{m.phone || "-"}</td>
                  <td className="px-3 py-2">{m.membershipPlan}</td>
                  <td className="px-3 py-2">{m.startDate}</td>
                  <td className="px-3 py-2">{m.endDate}</td>
                  <td className="px-3 py-2">{m.daysSinceExpired}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleRenew(m.id)}
                      className="px-3 py-1 rounded bg-green-600 text-white"
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
  );
}
