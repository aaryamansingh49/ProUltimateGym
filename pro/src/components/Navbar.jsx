import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useLocation } from "react-router-dom";

const Navbar = ({ setSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ CHECK LOGIN STATUS
  const isLoggedIn = !!localStorage.getItem("token");

  const toggleNav = () => {
    setIsOpen(!isOpen);
    if (isOpen) setDropdownOpen(false);
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE (ONLY MOBILE) */}
      {location.pathname === "/dashboard" && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
      )}

      {/* LOGO */}
      <div className="logo-wrapper">
        <div className="logo">
          <span className="pro">PRO</span>&nbsp;
          <span className="ultimate">ULTIMATE</span>&nbsp;
          <span className="gyms">GYMS</span>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link to="/services" onClick={() => setIsOpen(false)}>
          Services
        </Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>
          Contact
        </Link>

        {!isLoggedIn && (
          <>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              SignUp
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="logout-btn"
            style={{
              background: "red",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "5px",
              marginLeft: "10px"
            }}
          >
            Logout
          </button>
        )}

        <div
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
        >
          <span
            className="dropdown-title"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            More ▼
          </span>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link
                to="/dashboard"
                onClick={() => {
                  setIsOpen(false);
                  setDropdownOpen(false);
                }}
              >
                Profile
              </Link>
              <Link
                to="/membership"
                onClick={() => {
                  setIsOpen(false);
                  setDropdownOpen(false);
                }}
              >
                Membership
              </Link>
              <Link
                to="/account"
                onClick={() => {
                  setIsOpen(false);
                  setDropdownOpen(false);
                }}
              >
                Account Statement
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MENU */}
      <div className="menu-icon" onClick={toggleNav}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;