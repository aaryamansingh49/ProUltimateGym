import React from "react";
import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { LayoutDashboard, CreditCard,Users, RefreshCcw, LogOut } from "lucide-react";
import "../styles/AdminSidebar.css";

const menu = [
  {
    name: "Dashboard",
    path: "/admin-dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Total Members",
    path: "/admin/members",  
    icon: <Users size={18} />,
  },
  {
    name: "Pending Renewals",
    path: "/admin/pending-renewals", 
    icon: <RefreshCcw size={18} />,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: <CreditCard size={18} />,
  },
];

export default function AdminSidebar() {
  const { logout } = useAdminAuth();

  return (
    <aside className="admin-sidebar">
      {/* TOP */}
      <div>
        <div className="admin-sidebar-header">
        <h1 className="logo-text">
  <span>Pro</span> <span>Ultimate Gyms</span>
</h1>
          {/* <p>Admin Panel</p> */}
        </div>

        <nav className="admin-sidebar-menu">
          {menu.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              {m.icon}
              {m.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT */}
      <button onClick={logout} className="admin-logout-btn">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}