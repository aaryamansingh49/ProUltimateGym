import { useEffect, useState } from "react";
import getCurrentDay from "../utils/getCurrentDay";
import { updateGoalProgress } from "../utils/goalProgress";
import {
  getWorkoutByDay,
  getUserWorkoutProgress,
  saveWorkoutProgress,
} from "../api/workoutApi";
import { useNavigate } from "react-router-dom";

import "../styles/dashboard/todayWorkout.css";

const TodayWorkout = () => {
  const [workout, setWorkout] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userKey");

  const day = getCurrentDay();
  const dayLower = day.toLowerCase();

  const isSunday = dayLower === "sunday";
  const navigate = useNavigate();

  if (!userId) {
    return <p>Please login again</p>;
  }

  /* ================= FETCH WORKOUT ================= */
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);

        const workoutData = await getWorkoutByDay(dayLower);
        console.log("🧠 DAY VALUE:", dayLower);
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
        alert(error.response?.data?.message || "Failed to load workout");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [dayLower]);

  /* ================= TOGGLE ================= */
  const toggleExercise = (index) => {
    setCompleted((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, done: !ex.done } : ex
      )
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
  
      console.log("✅ SAVE RESPONSE:", res);
  
      if (!res || res.success === false) {
        throw new Error(res?.message || "Save failed");
      }
  
      const todayName = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });
  
      localStorage.setItem(
        `workoutCompleted_${todayName}_${userId}`,
        true
      );
  
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

  if (isSunday) {
    return (
      <div className="rest-day-container">
        <h2>🛌 Rest Day</h2>
        <p>Recovery day 💪</p>
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
    <div className="workout-page">
      <h2>
        {workout.day} – {workout.muscleGroup} Workout
      </h2>

      {workout.exercises.map((ex, index) => (
        <div key={index} className="exercise-row">
          <input
            type="checkbox"
            checked={completed[index]?.done || false}
            onChange={() => toggleExercise(index)}
          />

          <span>
            {ex.name} – {ex.sets}x{ex.reps}
          </span>

          <strong>{ex.calories} kcal</strong>
        </div>
      ))}

      <h3>🔥 Total Calories Burned: {totalCalories}</h3>

      <button onClick={saveProgress} disabled={loading}>
  {loading ? "Saving..." : "Done"}
</button>
    </div>
  );
};

export default TodayWorkout;