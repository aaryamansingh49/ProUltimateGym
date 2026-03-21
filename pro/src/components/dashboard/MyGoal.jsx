import React, { useEffect, useRef, useState } from "react";
import "../../styles/dashboard/myGoal.css";

const MyGoal = ({ profile }) => {

  if (!profile) {
    return (
      <div className="mygoal-container">
        <h2 className="mygoal-title">🎯 My Goals</h2>
        <p>Loading goal data...</p>
      </div>
    );
  }

  const weight = Number(profile.weight);
  const targetWeight = Number(profile.targetWeight);

  /* ===== USER BASED PROGRESS ===== */

const userKey = localStorage.getItem("userKey");

const progress =
  Number(localStorage.getItem(`goalProgress_${userKey}`)) || 0;

  const remaining = targetWeight - weight;

  /* ===== STATUS ===== */

  let statusText = "";
  let statusClass = "";

  if (progress < 40) {
    statusText = "Behind Schedule ⚠️";
    statusClass = "status-red";
  } 
  else if (progress < 80) {
    statusText = "On Track 👍";
    statusClass = "status-yellow";
  } 
  else {
    statusText = "Ahead of Target 🔥";
    statusClass = "status-green";
  }

  /* ===== ANIMATION ===== */

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const prevProgress = useRef(0);

  useEffect(() => {

    let start = prevProgress.current;

    const duration = 800;
    const increment = (progress - start) / (duration / 16);

    const timer = setInterval(() => {

      start += increment;

      if (
        (increment > 0 && start >= progress) ||
        (increment < 0 && start <= progress)
      ) {
        start = progress;
        clearInterval(timer);
      }

      setAnimatedProgress(start);

    }, 16);

    prevProgress.current = progress;

    return () => clearInterval(timer);

  }, [progress]);

  /* ===== COLOR ===== */

  let progressClass = "";

  if (progress < 40) progressClass = "progress-red";
  else if (progress < 80) progressClass = "progress-yellow";
  else progressClass = "progress-green";

  return (

    <div className="mygoal-container">

      <h2 className="mygoal-title">🎯 My Goals</h2>

      <div className="goal-card">

        {/* PROGRESS SECTION */}

        <div className="progress-section">

          <div className="progress-header">

            <span className={`goal-status ${statusClass}`}>
              {statusText}
            </span>

            <span>{Math.round(animatedProgress)}%</span>

          </div>

          <div className="progress-bar">

            <div
              className={`progress-fill ${progressClass}`}
              style={{ width: `${animatedProgress}%` }}
            ></div>

          </div>

          <div className="goal-remaining">
            {remaining > 0
              ? `💪 ${remaining} kg more to reach your goal`
              : "🔥 Goal Achieved!"}
          </div>

        </div>

        {/* USER DETAILS */}

        <div className="goal-item">
          <span className="goal-label">Age</span>
          <span className="goal-value">{profile.age}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Height</span>
          <span className="goal-value">{profile.height} cm</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Weight</span>
          <span className="goal-value">{weight} kg</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Fitness Goal</span>
          <span className="goal-value">{profile.goal}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Target Weight</span>
          <span className="goal-value">{targetWeight || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Goal Duration</span>
          <span className="goal-value">{profile.goalDuration || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Activity Level</span>
          <span className="goal-value">{profile.activityLevel || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Workout Preference</span>
          <span className="goal-value">{profile.workoutPreference || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Diet Preference</span>
          <span className="goal-value">{profile.dietPreference || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Focus Area</span>
          <span className="goal-value">{profile.focusArea || "-"}</span>
        </div>

        <div className="goal-item">
          <span className="goal-label">Fitness Level</span>
          <span className="goal-value">{profile.level}</span>
        </div>

      </div>

    </div>

  );

};

export default MyGoal;