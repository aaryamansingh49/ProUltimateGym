import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaDumbbell } from "react-icons/fa";
import { MdAttachMoney, MdEventNote } from "react-icons/md";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { StatCard } from "../components/AdminCards";
import { RevenueChart, GrowthChart } from "../components/AdminCharts";
import "../styles/AdminDashboard.css";
import { useAdminAuth } from "../context/AdminAuthContext";
import BASE_URL from "../api/config.js";

const PLAN_DURATION_MONTHS = {
  Basic: 1,
  Pro: 3,
  Premium: 6,
};

function computeEndDateFromPlan(startDateStr, membershipPlan) {
  if (!startDateStr) return null;
  const start = new Date(startDateStr);
  if (isNaN(start)) return null;
  const months = PLAN_DURATION_MONTHS[membershipPlan] ?? 0;
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  return end;
}

export default function AdminDashboard() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();

  // Fetch all memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/all-memberships`, {
          headers: {
            "Content-Type": "application/json",
            ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Failed to fetch memberships");

        const data = await res.json();
        setMemberships(data);
      } catch (err) {
        console.error("Error fetching memberships:", err);
        setError("Unable to load data from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [adminToken]);

  // Calculations
  const totalMembers = memberships.length;

  const totalRevenue = memberships.reduce((sum, m) => {
    return sum + (m.totalPrice || 0) + (m.renewalRevenue || 0);
  }, 0);

  const activeTrainers = new Set(
    memberships
      .filter((m) => m.selectedTrainer?.trim())
      .map((m) => m.selectedTrainer)
  ).size;

  const today = new Date();

  const pendingRenewals = memberships.filter((m) => {
    const end = computeEndDateFromPlan(m.startDate, m.membershipPlan);
    return end && end <= today;
  }).length;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <AdminNavbar />

        {loading ? (
          <div className="text-center text-gray-400 mt-20 text-lg">
            Loading data...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 mt-20 text-lg">{error}</div>
        ) : (
          <>
            <section className="admin-stats-grid">
              {/* Total Members */}
              <Link to="/admin/members" className="admin-stat-card">
                <div>
                  <p className="admin-card-title">Total Members</p>
                  <h2> {totalMembers} </h2>
                  <span className="admin-card-sub">+8% this month</span>
                </div>
                <FaUsers className="admin-card-icon" />
              </Link>

              {/* Trainers */}
              <div className="admin-stat-card">
                <div>
                  <p className="admin-card-title">Active Trainers</p>
                  <h2>{activeTrainers}</h2>
                </div>
                <FaDumbbell className="admin-card-icon" />
              </div>

              {/* Revenue */}
              <div className="admin-stat-card">
                <div>
                  <p className="admin-card-title">Total Membership Revenue</p>
                  <h2>Rs {totalRevenue.toLocaleString()}</h2>
                </div>
                <MdAttachMoney className="admin-card-icon orange" />
              </div>

              {/* Pending */}
              <div className="admin-stat-card special">
                <div>
                  <p className="admin-card-title">Pending Renewals</p>
                  <h2>{pendingRenewals}</h2>
                </div>

                <MdEventNote className="admin-card-icon" />

                <Link to="/admin/pending-renewals" className="admin-card-btn">
                  View Details
                </Link>
              </div>
            </section>

            {/* 📊 Charts */}
            <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <GrowthChart />
            </section>

            {/* 📦 Info Boxes */}
            <section className="admin-info-grid">
              {/* Membership Plans */}
              <div className="admin-info-card">
                <h3>Membership Plans</h3>

                <div className="admin-plan-row">
                  <span>Basic: Rs 6k/3mo</span>
                  <span>Pro: Rs 10k/9mo</span>
                  <span>Premium: Rs 20k/12mo</span>
                </div>

                <ul>
                  <li>• Key features</li>
                  <li>• Pro feature</li>
                  <li>• Premium</li>
                </ul>
              </div>

              {/* Equipment */}
              <div className="admin-info-card">
                <h3>Equipment Status</h3>

                <ul className="admin-equipment-list">
                  <li>
                    {/* 🏃 Treadmills: <span className="good">Good</span>,{" "} */}
                    🏃 Treadmills:{" "}
                    <span className="bad">Out of Order</span>
                  </li>
                  <li>
                    🏋️ Dumbbells:{" "}
                    <span className="good">All Good (20 sets)</span>
                  </li>
                  <li>
                    🏋️ Bench Press:{" "}
                    <span className="warn">1 Needs Maintenance</span>
                  </li>
                </ul>
              </div>

              {/* Announcements */}
              <div className="admin-info-card">
                <h3>Announcements</h3>

                <ul className="admin-announcement-list">
                  <li>New Yoga Class starting Monday</li>
                  <li>Holiday Hours: Closed Dec 25th</li>
                  {/* <li>Trainer Spotlight: Welcome Mark!</li> */}
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
