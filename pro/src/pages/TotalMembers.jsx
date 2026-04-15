import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import BASE_URL from "../api/config";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/TotalMembers.css";

export default function TotalMembers() {
  const { adminToken } = useAdminAuth();

  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/all-memberships`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const data = await res.json();
        setMembers(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminToken]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/delete-membership/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // 🔥 state update (safe way)
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setFiltered((prev) => prev.filter((m) => m._id !== id));

      alert("Deleted successfully ✅");
    } catch (err) {
      console.error("Delete Error:", err.message);
      alert(err.message || "Server error ❌");
    }
  };

  useEffect(() => {
    let data = members;

    if (search) {
      data = data.filter(
        (m) =>
          m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (plan) {
      data = data.filter((m) => m.membershipPlan === plan);
    }

    if (location) {
      data = data.filter((m) =>
        m.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, plan, location, members]);

  const getBadgeClass = (plan) => {
    if (plan === "Basic") return "badge basic-ba";
    if (plan === "Pro") return "badge pro-pr";
    if (plan === "Premium") return "badge premium-pre";
    return "badge";
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 total-members-container">
        <AdminNavbar />

        {/* HEADER */}
        <div className="page-header">
          <h2 className="page-title">All Members</h2>
          {/* <button className="add-btn">Add Member</button> */}
        </div>

        {/* FILTERS */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search name or email..."
            className="input-box"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select-box"
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="">Select Plan</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Premium">Premium</option>
          </select>

          <input
            type="text"
            placeholder="Filter by location"
            className="input-box"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Plan</th>
                <th>Trainer</th>
                <th>Price (₹)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No members found
                  </td>
                </tr>
              ) : (
                filtered.map((m, i) => (
                  <tr key={i}>
                    <td className="member-info">
                      <img
                        src={`https://randomuser.me/api/portraits/${
                          i % 2 === 0 ? "men" : "women"
                        }/${i + 10}.jpg`}
                        alt="avatar"
                        className="member-avatar"
                      />
                      <span>{m.fullName}</span>
                    </td>

                    <td>{m.email}</td>
                    <td>{m.location || "N/A"}</td>

                    <td>
                      <span className={getBadgeClass(m.membershipPlan)}>
                        {m.membershipPlan}
                      </span>
                    </td>

                    <td>{m.selectedTrainer || "N/A"}</td>
                    <td>₹ {m.totalPrice}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(m._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
