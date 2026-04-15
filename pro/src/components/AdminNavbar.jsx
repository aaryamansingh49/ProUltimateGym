import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/AdminNavbar.css";

export default function AdminNavbar() {
  const { adminToken } = useAdminAuth();

  return (
    <header className="admin-navbar">
      
      {/* LEFT */}
      <div className="navbar-left">
        <h2>ADMIN PANEL</h2>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {adminToken && (
          <div className="admin-info">
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              className="admin-avatar"
            />
            <span>ADMIN</span>
          </div>
        )}
      </div>

    </header>
  );
}