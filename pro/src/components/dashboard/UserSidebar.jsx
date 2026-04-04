import React, { useRef } from "react";
import "../../styles/dashboard/sidebar.css";
import { saveProfile } from "../../api/profileApi";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiTarget,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiUser,
  FiSmile,
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
      const form = new FormData();
      form.append("profileImage", file);

      Object.keys(profile || {}).forEach((key) => {
        if (profile[key]) {
          form.append(key, profile[key]);
        }
      });

      const res = await saveProfile(form);

      if (res.success) {
        setProfile((prev) => ({
          ...prev,
          profileImage: res.profile.profileImage,
        }));
      }
    } catch (err) {
      alert("Photo upload failed ❌");
      console.error(err);
    }
  };

  const getBmiStatus = (bmi) => {
    if (!bmi) return { text: "-", color: "#64748b" };

    if (bmi < 18.5) return { text: "Underweight", color: "#3498db" };
    if (bmi >= 18.5 && bmi < 24.9) return { text: "Normal", color: "#2ecc71" };
    if (bmi >= 25 && bmi < 29.9) return { text: "Overweight", color: "#f39c12" };

    return { text: "Obese", color: "#e74c3c" };
  };

  const bmiStatus = getBmiStatus(profile?.bmi);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => {
          setSidebarOpen(false);
          document.body.classList.remove("sidebar-open");
        }}
      ></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* PROFILE SECTION */}
        <div className="profile-section">
          <div className="avatar-wrapper" onClick={openGallery}>
            <img
              src={
                profile?.profileImage
                  ? `http://localhost:5001${profile.profileImage}?t=${Date.now()}`
                  : "https://i.pravatar.cc/120"
              }
              alt="Profile"
              className="avatar-img"
            />
            <span className="edit-badge">EDIT</span>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <h3 className="username">{name || "Aaryaman Singh"}</h3>
          <p className="user-meta">
            {profile?.gender || "Male"}, {profile?.age || "21"} years
          </p>
        </div>

        {/* USER STATS */}
        <div className="stats-container">

{/* HEIGHT */}
<div className="stat-row">
  <div className="stat-icon-bg light-red">
    <FiTrendingUp size={14} />
  </div>
  <span className="stat-label">Height:</span>
  <span className="stat-value">{profile?.height || "180"} cm</span>
</div>

{/* WEIGHT */}
<div className="stat-row">
  <div className="stat-icon-bg light-orange">
    <FiTarget size={14} />
  </div>
  <span className="stat-label">Weight:</span>
  <span className="stat-value">{profile?.weight || "72"} kg</span>
</div>

{/* BMI */}
<div className="stat-row">
  <div className="stat-icon-bg light-yellow">
    <span className="bmi-badge">BMI</span>
  </div>
  <span className="stat-label">BMI:</span>

  <span className="stat-value">
    {profile?.bmi ? profile.bmi.toFixed(1) : "22.2"}
    <span className="bmi-text">
      {" "}
      ({profile?.bmi ? bmiStatus.text : "Normal"})
    </span>
  </span>
</div>

</div>

        {/* NAVIGATION MENU */}
        <ul className="nav-menu">
          <li
            onClick={() => onSelect("dashboard")}
            className={activeTab === "dashboard" ? "active" : ""}
          >
            <FiHome size={20} />
            <span>Home</span>
          </li>

          <li
            onClick={() => onSelect("goals")}
            className={activeTab === "goals" ? "active" : ""}
          >
            <FiTarget size={20} />
            <span>My Goals</span>
          </li>

          <li
            onClick={() => onSelect("schedule")}
            className={activeTab === "schedule" ? "active" : ""}
          >
            <FiCalendar size={20} />
            <span>Schedule</span>
          </li>

          <li
            onClick={() => onSelect("achievements")}
            className={activeTab === "achievements" ? "active" : ""}
          >
            <FiAward size={20} />
            <span>Achievements</span>
          </li>

          <li
            onClick={() => onSelect("statistics")}
            className={activeTab === "statistics" ? "active" : ""}
          >
            <FiTrendingUp size={20} />
            <span>Statistics</span>
          </li>

          <li
            onClick={() => onSelect("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            <FiSettings size={20} />
            <span>Edit Profile</span>
          </li>

          <li className="logout-item" onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>Logout</span>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default UserSidebar;