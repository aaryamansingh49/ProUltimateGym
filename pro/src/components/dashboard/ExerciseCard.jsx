import React, { useEffect, useState } from "react";
import "../../styles/dashboard/cards.css";
import { Dumbbell, Flame, CheckCircle, Utensils, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getWorkoutByDay,
  getUserWorkoutProgress
} from "../../api/workoutApi";
import getCurrentDay from "../../utils/getCurrentDay";

const ExerciseCard = () => {
  const navigate = useNavigate();
  const [totalExercises, setTotalExercises] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const userId = localStorage.getItem("userKey");
  const token = localStorage.getItem("token");
  const day = getCurrentDay();
  const dayLower = day.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;
        const workoutRes = await getWorkoutByDay(dayLower);
        const exercises = workoutRes?.exercises || [];
        setTotalExercises(exercises.length);
        const progressRes = await getUserWorkoutProgress(dayLower);
        const completedExercises = progressRes?.completedExercises || [];
        const doneCount = completedExercises.filter(ex => ex.done).length;
        setCompletedCount(doneCount);
        setTotalCalories(progressRes?.totalCalories || 0);
      } catch (err) {
        console.log("Exercise card error:", err);
      }
    };
    fetchData();
    const handleWorkoutUpdate = () => {
      fetchData();
    };
    window.addEventListener("workoutUpdated", handleWorkoutUpdate);
    return () => {
      window.removeEventListener("workoutUpdated", handleWorkoutUpdate);
    };
  }, [userId, dayLower]);

  return (
    <div className="simple-card" onClick={() => navigate("/workout/today")}>
  
      <div className="card-header">
        <div className="pg-badge">UF</div>
        <span className="sub">ULTIMATE FITNESS CLUB</span>
        <h2>Exercises</h2>
      </div>
  
      <div className="card-box">
  
        <div className="row">
          <div className="left">
            <div className="icon red">
              <Dumbbell size={16} />
            </div>
            <span>Total Exercises</span>
          </div>
          <span className="right">{totalExercises} Exercises</span>
        </div>
  
        <div className="row">
          <div className="left">
            <div className="icon orange">
              <Flame size={16} />
            </div>
            <span>kcal burned</span>
          </div>
          <span className="right red-text">{totalCalories} kcal</span>
        </div>
  
        <div className="row">
          <div className="left">
            <div className="icon gray">
              <CheckCircle size={16} />
            </div>
            <span>Exercises Completed</span>
          </div>
          <span className="right">
            {completedCount}/{totalExercises}
          </span>
        </div>
  
      </div>
    </div>
  );
};

export default ExerciseCard;