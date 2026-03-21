import React, { useEffect, useState } from "react";
import "../../styles/dashboard/cards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/config";
import getCurrentDay from "../../utils/getCurrentDay";

const ExerciseCard = () => {

  const navigate = useNavigate();

  const [totalExercises, setTotalExercises] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  const userId = localStorage.getItem("userKey");
  const day = getCurrentDay();

  useEffect(() => {

    const fetchData = async () => {

      try {

        if (!userId) return;

        /* ================= WORKOUT PLAN ================= */

        const workoutRes = await axios.get(
          `${BASE_URL}/api/workout/${userId}/${day}`
        );

        const exercises = workoutRes.data?.exercises || [];

        setTotalExercises(exercises.length);

        /* ================= USER PROGRESS ================= */

        const progressRes = await axios.get(
          `${BASE_URL}/api/workout/progress/${userId}/${day}`
        );

        const completedExercises = progressRes.data?.completedExercises || [];

        const doneCount = completedExercises.filter(ex => ex.done).length;

        setCompletedCount(doneCount);

        setTotalCalories(progressRes.data?.totalCalories || 0);

      } catch (err) {

        console.log("Exercise card error:", err);

      }

    };

    /* ===== Initial fetch ===== */

    fetchData();

    /* ===== Listen for workout update ===== */

    const handleWorkoutUpdate = () => {
      fetchData();
    };

    window.addEventListener("workoutUpdated", handleWorkoutUpdate);

    return () => {
      window.removeEventListener("workoutUpdated", handleWorkoutUpdate);
    };

  }, [userId, day]);

  return (

    <div
      className="fitness-card blue"
      onClick={() => navigate("/workout/today")}
      style={{ cursor: "pointer" }}
    >

      <div className="card-left">

        <div className="card-icon">🏋️</div>

        <h3>{totalExercises} Exercises</h3>

        <p>{totalCalories} kcal burned</p>

      </div>

      <div className="progress-circle">

        <span>{completedCount}/{totalExercises}</span>

      </div>

    </div>

  );

};

export default ExerciseCard;