import React, { useRef } from "react";
import "../../styles/dashboard/sidebar.css";
import { uploadProfilePhoto } from "../../api/profileApi";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiTarget,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const UserSidebar = ({
  onSelect,
  profile,
  name,
  setProfile,
  activeTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* OPEN GALLERY */
  const openGallery = () => {
    fileInputRef.current.click();
  };

  /* LOGOUT */
  const handleLogout = () => {
    // session clear
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("activeTab");

    setProfile(null);

    navigate("/login");
  };

  /* IMAGE UPLOAD */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const res = await uploadProfilePhoto(file);

      if (res.success) {
        setProfile((prev) => ({
          ...prev,
          profilePhoto: res.profilePhoto,
        }));
      }
    } catch (err) {
      alert("Photo upload failed ❌");
      console.error(err);
    }
  };

  const getBmiStatus = (bmi) => {
    if (!bmi) return { text: "-", color: "#aaa" };

    if (bmi < 18.5) return { text: "Underweight", color: "#3498db" };
    if (bmi >= 18.5 && bmi < 24.9) return { text: "Normal", color: "#2ecc71" };
    if (bmi >= 25 && bmi < 29.9)
      return { text: "Overweight", color: "#f39c12" };

    return { text: "Obese", color: "#e74c3c" };
  };

  const bmiStatus = getBmiStatus(profile?.bmi);

  return (
    <>
      {/* 🔥 OVERLAY (mobile ke liye) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => {
          setSidebarOpen(false);
          document.body.classList.remove("sidebar-open"); // 🔥 add this
        }}
      ></div>

      {/* 🔥 SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="avatar" onClick={openGallery}>
            <img
              src={
                profile?.profilePhoto
                  ? `http://localhost:5001${profile.profilePhoto}`
                  : "https://i.pravatar.cc/120"
              }
              alt="Profile"
            />
            <span className="edit-btn">EDIT</span>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <h3 className="username">{name || "User"}</h3>

          <p className="user-meta">
            {profile?.gender || "Male"}, {profile?.age || "--"} years
          </p>

          {profile && (
            <div className="stats-row">
              <div className="stat">
                <span className="stat-title">HEIGHT</span>
                <span className="stat-number">{profile.height} cm</span>
                <span className="stat-placeholder"></span>
              </div>

              <div className="divider" />

              <div className="stat">
                <span className="stat-title">WEIGHT</span>
                <span className="stat-number">{profile.weight} kg</span>
                <span className="stat-placeholder"></span>
              </div>

              <div className="divider" />

              <div className="stat">
                <span className="stat-title">BMI</span>

                <span className="stat-number">{profile?.bmi?.toFixed(1)}</span>

                <span
                  className="bmi-indicator"
                  style={{ color: bmiStatus.color }}
                >
                  {bmiStatus.text}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* MENU */}
        <ul className="menu">
          <li
            onClick={() => onSelect("dashboard")}
            className={activeTab === "dashboard" ? "active" : ""}
          >
            <FiHome size={18} />
            <span>Home</span>
          </li>

          <li
            onClick={() => onSelect("goals")}
            className={activeTab === "goals" ? "active" : ""}
          >
            <FiTarget size={18} />
            <span>My goals</span>
          </li>

          <li
            onClick={() => onSelect("schedule")}
            className={activeTab === "schedule" ? "active" : ""}
          >
            <FiCalendar size={18} />
            <span>Schedule</span>
          </li>

          <li
            onClick={() => onSelect("achievements")}
            className={activeTab === "achievements" ? "active" : ""}
          >
            <FiAward size={18} />
            <span>Achievements</span>
          </li>

          <li
            onClick={() => onSelect("statistics")}
            className={activeTab === "statistics" ? "active" : ""}
          >
            <FiTrendingUp size={18} />
            <span>Statistics</span>
          </li>

          <li
            onClick={() => onSelect("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            <FiSettings size={18} />
            <span>Edit Profile</span>
          </li>

          {/* LOGOUT */}
          <li className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default UserSidebar;
