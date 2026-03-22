import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ setSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleNav = () => {
    setIsOpen(!isOpen);
    if (isOpen) setDropdownOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LEFT SIDE (ONLY MOBILE) */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        ☰
      </button>

      {/* LOGO (UNCHANGED) */}
      <div className="logo-wrapper">
        <div className="logo">
          <span className="pro">PRO</span>&nbsp;
          <span className="ultimate">ULTIMATE</span>&nbsp;
          <span className="gyms">GYMS</span>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        <Link to="/signup" onClick={() => setIsOpen(false)}>SignUp</Link>
        <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>

        <div className={`dropdown ${dropdownOpen ? "open" : ""}`} ref={dropdownRef}>
          <span
            className="dropdown-title"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            More ▼
          </span>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/dashboard" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>Profile</Link>
              <Link to="/membership" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>Membership</Link>
              <Link to="/account" onClick={() => { setIsOpen(false); setDropdownOpen(false); }}>Account Statement</Link>
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