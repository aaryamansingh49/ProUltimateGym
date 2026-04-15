import { useEffect, useState } from "react";
import getCurrentDay from "../utils/getCurrentDay";
import { updateGoalProgress } from "../utils/goalProgress";
import { FaFireAlt } from "react-icons/fa";
import {
  getWorkoutByDay,
  getUserWorkoutProgress,
  saveWorkoutProgress,
} from "../api/workoutApi";
import { useNavigate } from "react-router-dom";

import "../styles/dashboard/todayWorkout.css";

const TodayWorkout = () => {
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  const [workout, setWorkout] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  const userId = localStorage.getItem("userKey");

  const day = getCurrentDay();
  const dayLower = day.toLowerCase();

  const isSunday = dayLower === "sunday";
  const navigate = useNavigate();

  // if (!userId) {
  //   return <p>Please login again</p>;
  // }

  useEffect(() => {
    const userId = localStorage.getItem("userKey");

    if (!userId) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));

    if (!userProfile) {
      console.log("User profile not found yet");
      return;
    }

    if (!userProfile.profileCompleted) {
      setProfileIncomplete(true);
    }
  }, []);

  /* ================= FETCH WORKOUT ================= */
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);

        const workoutData = await getWorkoutByDay(dayLower);
        // console.log("🧠 DAY VALUE:", dayLower);
        // const workoutData = workoutRes.data;

        setWorkout(workoutData);

        const progressRes = await getUserWorkoutProgress(dayLower);

        const exercises = workoutData?.exercises || [];

        const initialCompleted = exercises.map((ex, index) => {
          const saved = progressRes?.completedExercises?.[index];

          return {
            name: ex.name,
            calories: ex.calories,
            done: saved?.done || false,
          };
        });

        setCompleted(initialCompleted);
      } catch (error) {
        console.error("FETCH WORKOUT ERROR:", error);
        // alert(error.response?.data?.message || "Failed to load workout");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [dayLower]);

  /* ================= TOGGLE ================= */
  const toggleExercise = (index) => {
    setCompleted((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, done: !ex.done } : ex))
    );
  };

  /* ================= CALORIES ================= */
  const totalCalories = completed.reduce(
    (sum, ex) => sum + (ex.done ? ex.calories : 0),
    0
  );

  /* ================= SAVE ================= */
  const saveProgress = async () => {
    if (loading) return; // 🔥 FIX

    try {
      setLoading(true);

      const res = await saveWorkoutProgress({
        day: dayLower,
        type: workout.muscleGroup,
        completedExercises: completed,
      });

      // console.log("✅ SAVE RESPONSE:", res);

      if (!res || res.success === false) {
        throw new Error(res?.message || "Save failed");
      }

      const todayName = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });

      localStorage.setItem(`workoutCompleted_${todayName}_${userId}`, true);

      updateGoalProgress();

      window.dispatchEvent(new Event("workoutUpdated"));

      setTimeout(() => {
        navigate("/dashboard");
      }, 800); // 🔥 delay
    } catch (error) {
      if (error.response?.data?.message === "Only for active members") {
        console.log("⚠️ Ignored duplicate call error");
        return;
      }

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save workout"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (profileIncomplete) {
    return (
      <div className="profile-warning-wrapper">
        <div className="profile-warning-card">
          <h2>⚠️ Complete Your Profile</h2>
          <p>Unlock your personalized workouts by completing your profile.</p>

          <button onClick={() => navigate("/profile-edit")}>
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;

  if (isSunday) {
    return (
      <div className="rest-day-container">
        <h2>🛌 Rest Day</h2>
        <p>Recovery day </p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="no-workout-container">
        <h2>No Workout Available</h2>
      </div>
    );
  }
  return (
    <div className="workout-wrapper">
      <div className="workout-card">
  
        {/* Header */}
        <header className="workout-header">
          <h2>{workout.day} – {workout.muscleGroup} Workout</h2>
         <p className="workout-date">{todayDate}</p>
        </header>
  
        {/* Exercise Grid */}
        <div className="exercise-grid">
          {workout.exercises.map((ex, index) => (
            <div
              key={index}
              className={`exercise-item ${
                completed[index]?.done ? "checked" : ""
              }`}
              onClick={() => toggleExercise(index)}
            >
              <div className="exercise-left">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={completed[index]?.done || false}
                    readOnly
                  />
                </div>
  
                <div className="exercise-info">
                  <h4>{ex.name}</h4>
                  <p>{ex.sets} sets × {ex.reps} reps</p>
                </div>
              </div>
  
              <div className="exercise-right">
                {/* <FaFireAlt className="cal-icon" /> */}
                <span className="cal-value">{ex.calories} kcal</span>
              </div>
            </div>
          ))}
        </div>
  
        {/* Summary */}
        <footer className="workout-footer">
          <div className="calories-summary">
            <div className="summary-box">
              <p>Active Burn</p>
              <h4>{totalCalories} kcal</h4>
            </div>
            <div className="summary-box">
              <p>Remaining</p>
              <h4>
                {workout.exercises
                  .filter((_, i) => !completed[i]?.done)
                  .reduce((acc, ex) => acc + ex.calories, 0)} kcal
              </h4>
            </div>
          </div>
  
          <div className="total-display">
            <p>TOTAL PROGRESS</p>
            <h1>{totalCalories} <span>kcal</span></h1>
          </div>
  
          <button 
            className="done-btn" 
            onClick={saveProgress} 
            disabled={loading}
          >
            {loading ? "SAVING..." : "DONE"}
          </button>
        </footer>
  
      </div>
    </div>
  );
};

export default TodayWorkout;
