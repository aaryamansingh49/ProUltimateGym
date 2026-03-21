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
      const res = await getProfile();

      if (res.success) {
        const mergedProfile = {
          ...res.profile,
          profilePhoto: res.user?.profilePhoto,
        };

        setProfile(mergedProfile);

        // ⭐ FIXED
        setUserName(res.profile?.name || "Athlete");

        fetchLastMonthStats(mergedProfile.userId);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 LAST MONTH STATS FETCH

  const fetchLastMonthStats = async (userId) => {
    try {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      let workoutCount = 0;
      let calories = 0;

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const dayName = days[date.getDay()];

        try {
          const res = await getUserWorkoutProgress(userId, dayName);

          if (res.data) {
            workoutCount += 1;
            calories += res.data?.totalCalories || 0;
          }
        } catch (err) {
          // ignore missing progress
        }
      }

      setLastMonthStats({
        workouts: workoutCount,
        calories: calories,
      });
    } catch (err) {
      console.log("Stats fetch error", err);
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
