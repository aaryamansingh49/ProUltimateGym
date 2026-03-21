import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import BASE_URL from "../api/config.js";



const API_BASE = BASE_URL;

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAdminAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/admin/payments`, {
          headers: {
            "Content-Type": "application/json",
            ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          },
        });

        if (res.status === 401) {
          throw new Error("Unauthorized – please login as admin.");
        }

        const data = await res.json().catch(() => null);

        if (!Array.isArray(data)) {
          console.error("Payments API returned non-array:", data);
          throw new Error("Invalid response from server");
        }

        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [adminToken]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-10">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent tracking-wide">
         Payment Management
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 text-lg mt-20">
          Loading payments...
        </div>
      ) : error ? (
        <div className="text-center text-red-400 text-lg mt-20">
          {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center text-gray-400 text-lg mt-20">
          No payments available yet. 💳
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {payments.map((p, idx) => {
            const base = p.totalPrice || 0;
            const renew = p.renewalRevenue || 0;
            const totalCollected = p.totalCollected ?? base + renew;
            const renewCount = p.renewalCount ?? 0;

            return (
              <div
                key={idx}
                className="relative group bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 
                           shadow-md shadow-red-900/30 transition-all duration-500 hover:scale-[1.03] 
                           hover:shadow-red-600/50 hover:border-red-500 overflow-hidden"
              >
              
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-2xl opacity-20 transition-all duration-500"></div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-red-400">
                    {p.fullName}
                  </h3>
                  <span className="text-xs bg-gradient-to-r from-red-600 to-red-500 px-3 py-1 rounded-full text-white font-medium">
                    {p.membershipPlan}
                  </span>
                </div>

                <div className="space-y-2 text-md">
                  <p>
                    <span className="text-gray-400">Base Amount:</span>{" "}
                    <span className="font-semibold text-white">
                      ₹{base}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Renewal Revenue:</span>{" "}
                    <span className="font-semibold text-white">
                      ₹{renew}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Total Collected:</span>{" "}
                    <span className="font-semibold text-green-400">
                      ₹{totalCollected}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Renewals:</span>{" "}
                    {renewCount}
                  </p>
                  <p>
                    <span className="text-gray-400">Payment ID:</span>{" "}
                    {p.paymentId || "N/A"}
                  </p>
                  <p>
                    <span className="text-gray-400">Start Date:</span>{" "}
                    {p.startDate}
                  </p>
                </div>

                <div className="flex justify-end mt-5">
                  <span className="text-xs text-green-400 font-semibold bg-green-900/30 px-3 py-1 rounded-md border border-green-700">
                    SUCCESS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
