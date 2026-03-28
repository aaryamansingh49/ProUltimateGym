import React, { useEffect, useState } from "react";
import UserSidebar from "../components/dashboard/UserSidebar";
import UserTopbar from "../components/dashboard/UserTopbar";
import ExerciseCard from "../components/dashboard/ExerciseCard";
import MealCard from "../components/dashboard/MealCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import ProfileSetup from "../components/dashboard/ProfileSetup";
import MyGoal from "../components/dashboard/MyGoal";
import Schedule from "../components/dashboard/Schedule";
import Achievements from "../components/dashboard/Achievements";
import Statistics from "../components/dashboard/Statistics";

import "../styles/dashboard/dashboard.css";

import { saveProfile, getProfile } from "../api/profileApi";
import { getUserWorkoutProgress } from "../api/workoutApi";



const UserDashboard = ({ sidebarOpen, setSidebarOpen }) => {

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 last month stats
  const [lastMonthStats, setLastMonthStats] = useState({
    workouts: 0,
    calories: 0,
  });

  // PROFILE FETCH
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
  
        if (res.success && res.profile) {
  
          // ✅ FIX: correct field name
          const mergedProfile = {
            ...res.profile,
            profileImage: res.user?.profileImage || null,
          };
  
          // ✅ state update
          setProfile(mergedProfile);
  
          // ✅ username fix
          setUserName(mergedProfile?.name || "Athlete");
  
          // 🔥 HYBRID: localStorage update (IMPORTANT)
          localStorage.setItem("userProfile", JSON.stringify(mergedProfile));
  
          // ✅ stats
          fetchLastMonthStats();
  
        } else {
          console.warn("Profile fetch failed");
        }
  
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
  
    fetchProfile();
  }, []);

  // 🔥 LAST MONTH STATS FETCH

  const fetchLastMonthStats = async () => {
    try {
      const today = new Date();
  
      const dayName = today
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
  
      let workoutCount = 0;
      let calories = 0;
  
      try {
        const res = await getUserWorkoutProgress(dayName);
  
        // ✅ SAFE RESPONSE HANDLE
        if (res && Array.isArray(res.completedExercises)) {
          workoutCount = res.completedExercises.length > 0 ? 1 : 0;
          calories = res.totalCalories || 0;
        }
  
      } catch (innerErr) {
  
        // 🔥 MEMBERSHIP ERROR IGNORE
        if (
          innerErr?.response?.data?.message === "Only for active members"
        ) {
          console.log("⚠️ Membership check ignored (dashboard)");
        } else {
          console.log("⚠️ Workout stats fetch error:", innerErr);
        }
      }
  
      setLastMonthStats({
        workouts: workoutCount,
        calories: calories,
      });
  
    } catch (err) {
      console.log("❌ Stats fetch error:", err);
  
      setLastMonthStats({
        workouts: 0,
        calories: 0,
      });
    }
  };
      

  // PROFILE SAVE
  const handleProfileSave = async (data) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),

        goal: data.goal,
        gender: data.gender,
        level: data.level,

        targetWeight: Number(data.targetWeight),
        goalDuration: data.goalDuration,
        activityLevel: data.activityLevel,
        workoutPreference: data.workoutPreference,
        dietPreference: data.dietPreference,
        focusArea: data.focusArea,
      };

      const res = await saveProfile(payload);

      setProfile(res.profile);
      setUserName(res.profile?.name || data.name || "Athlete");

      localStorage.setItem("userProfile", JSON.stringify(res.profile));

      setActiveSection("dashboard");
    } catch (err) {
      alert("Profile save failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <UserSidebar
        onSelect={(tab) => {
          setActiveSection(tab);
          setSidebarOpen(false); // click pe auto close
        }}
        activeTab={activeSection}
        profile={profile}
        setProfile={setProfile}
        name={userName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="dashboard-main">
        {activeSection === "dashboard" && (
          <UserTopbar setSidebarOpen={setSidebarOpen} />
        )}

        {activeSection === "dashboard" && (
          <>
            <div className="stats-cards">
              {/* 🔥 PASS LAST MONTH STATS */}

              <ExerciseCard stats={lastMonthStats} />
              <MealCard stats={lastMonthStats} />
            </div>

            <ProgressChart profile={profile} />
          </>
        )}

        {activeSection === "profile" && (
          <ProfileSetup
            profile={profile}
            onSubmit={handleProfileSave}
            onClose={() => setActiveSection("dashboard")}
          />
        )}

        {activeSection === "goals" && <MyGoal profile={profile} />}

        {activeSection === "schedule" && <Schedule profile={profile} />}

        {activeSection === "achievements" && <Achievements profile={profile} />}

        {activeSection === "statistics" && <Statistics profile={profile} />}

        {loading && <p>Saving profile...</p>}
      </div>
    </div>
  );
};

export default UserDashboard;
