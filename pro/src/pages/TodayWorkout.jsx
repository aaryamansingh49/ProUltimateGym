import { useEffect, useState } from "react";
import API from "../api/profileApi";
import getCurrentDay from "../utils/getCurrentDay";
import { updateGoalProgress } from "../utils/goalProgress";
import { getWorkoutByDay } from "../api/workoutApi";
// import BASE_URL from "../api/config.js";
import { useNavigate } from "react-router-dom";

import "../styles/dashboard/todayWorkout.css";

const TodayWorkout = () => {

  

  const [workout, setWorkout] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userKey");
  const day = getCurrentDay();
  const isSunday = day.toLowerCase() === "sunday";
  const navigate = useNavigate();

  if (!userId) {
    return <p>Please login again</p>;
  }

  /* ================= FETCH WORKOUT ================= */

  useEffect(() => {

    const fetchWorkout = async () => {
  
      try {
        setLoading(true);
  
        // ✅ FIXED (API function use kar)
        const workoutRes = await getWorkoutByDay(day);
        const workoutData = workoutRes.data;
        setWorkout(workoutData);
  
        // ✅ Progress (same rahega)
        const progressRes = await API.get(`/workout/progress/${day}`);
  
        const initialCompleted = workoutData.exercises.map((ex, index) => {
  
          const saved = progressRes.data?.completedExercises?.[index];
  
          return {
            name: ex.name,
            calories: ex.calories,
            done: saved?.done || false
          };
  
        });
  
        setCompleted(initialCompleted);
  
      } catch (error) {
  
        console.error("FETCH WORKOUT ERROR:", error);
  
        alert(
          error.response?.data?.message ||
          "Failed to load workout"
        );
  
      } finally {
        setLoading(false);
      }
  
    };
  
    fetchWorkout();
  
  }, [day]);

  /* ================= TOGGLE EXERCISE ================= */

  const toggleExercise = (index) => {

    setCompleted(prev => {

      const updated = [...prev];

      if (!updated[index]) return prev;

      updated[index] = {
        ...updated[index],
        done: !updated[index].done
      };

      return updated;

    });

  };

  /* ================= CALORIES ================= */

  const totalCalories = completed.reduce(
    (sum, ex) => sum + (ex.done ? ex.calories : 0),
    0
  );

  /* ================= SAVE PROGRESS ================= */

  const saveProgress = async () => {

    try {
  
      setLoading(true);
  
      const token = localStorage.getItem("token");

      await API.post(
        `/workout/progress`,
        {
          day,
          type: workout.muscleGroup,
          completedExercises: completed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
     
  
      const userKey = localStorage.getItem("userKey");
  
      const todayName = new Date().toLocaleDateString("en-US",{weekday:"short"});
  
      localStorage.setItem(`workoutCompleted_${todayName}_${userKey}`, true);
  
      /* ===== UPDATE GOAL PROGRESS ===== */
  
      updateGoalProgress();
      /* 🔥 Trigger dashboard refresh */
window.dispatchEvent(new Event("workoutUpdated"));
  
      navigate("/dashboard");
  
    } catch (error) {
  
      alert(
        error.response?.data?.message ||
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
        <p>
          Today is Sunday. Your body needs recovery. 
          Take proper rest and come back stronger 💪
        </p>
      </div>
    );
  }
  
  if (!workout) {
    return (
      <div className="no-workout-container">
        <h2>No Workout Available</h2>
        <p>Please check your plan or try again later.</p>
      </div>
    );
  }

  return (

    <div className="workout-page">

      <h2>
        {workout.day} – {workout.muscleGroup} Workout
      </h2>

      {workout.exercises.map((ex, index) => (

        <div key={ex.name} className="exercise-row">

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

      <button onClick={saveProgress}>Done</button>

    </div>

  );

};

export default TodayWorkout;