import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  // Dynamic calculations
  const totalMembers = memberships.length;
  const totalRevenue = memberships.reduce((sum, m) => {
    const base = m.totalPrice || 0;
    const renew = m.renewalRevenue || 0;
    return sum + base + renew;
  }, 0);
  
  const activeTrainers = new Set(
    memberships
      .filter((m) => m.selectedTrainer && m.selectedTrainer.trim() !== "")
      .map((m) => m.selectedTrainer)
  ).size;

  const today = new Date();
  const pendingRenewals = memberships.filter((m) => {
    const end = computeEndDateFromPlan(m.startDate, m.membershipPlan);
    if (!end) return false;
    return end <= today; // expired memberships
  }).length;

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <AdminNavbar />

        {loading ? (
          <div className="text-center text-gray-400 mt-20 text-lg">Loading data...</div>
        ) : error ? (
          <div className="text-center text-red-400 mt-20 text-lg">{error}</div>
        ) : (
          <>
            {/*Top Stat Cards */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <StatCard title="Total Members" value={totalMembers} />
              <StatCard title="Active Trainers" value={activeTrainers} />
              <StatCard
                title="Membership Revenue (Total)"
                value={`Rs ${totalRevenue.toLocaleString()}`}
              />
              {/* Pending Renewals stat card - includes link */}
              <div className="bg-gray-800 p-4 rounded-md flex flex-col justify-between">
                <div>
                  <h3 className="text-sm text-gray-300">Pending Renewals</h3>
                  <div className="text-2xl font-semibold mt-2">{pendingRenewals}</div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/admin/pending-renewals"
                    className="inline-block px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                  >
                    View Pending Renewals
                  </Link>
                </div>
              </div>
            </section>

            {/* Charts */}
            <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <GrowthChart />
            </section>

            {/* Info Boxes */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="text-white font-semibold mb-2">Membership Plans</h3>
                <div className="text-gray-300">
                  Basic - $50 / Pro - $120 / Premium - $220
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="text-white font-semibold mb-2">Equipment Status</h3>
                <div className="text-gray-300 text-sm">
                  Treadmill - Good, Dumbbells - Fair, Rowing Machine - Good
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="text-white font-semibold mb-2">Announcements</h3>
                <div className="text-gray-300 text-sm">No new announcements</div>
              </div>
            </section>

            
          </>
        )}
      </main>
    </div>
  );
}
