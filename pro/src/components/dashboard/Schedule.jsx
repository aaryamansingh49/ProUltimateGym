import React, { useEffect, useState } from "react";
import "../../styles/dashboard/schedule.css";
import { getWorkoutPlanByDay, getUserWorkouts } from "../../api/profileApi";
import { FiAlertTriangle } from "react-icons/fi";
import { GiFire } from "react-icons/gi";
import { IoBarbellOutline } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { GiBiceps, GiChestArmor, GiShoulderArmor } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import sleepAnimation from "../../assets/sleep.json";


const Schedule = ({ profile }) => {
  const [workouts, setWorkouts] = useState([]);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [missedDays, setMissedDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showMissedBadge, setShowMissedBadge] = useState(false);
  const navigate = useNavigate();

  const displayDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const apiDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();
  const todayIndex = today.getDay();
  const todayName = displayDays[todayIndex];

  useEffect(() => {
    const fetchSchedule = async () => {
      const userKey = localStorage.getItem("userKey");

      const res = await getUserWorkouts(userKey);
      if (!res?.success) return;

      const data = res.workouts || [];
      setWorkouts(data);

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const todayIndex = todayDate.getDay();
      const todayName = displayDays[todayIndex];

      /* ================= TODAY WORKOUT ================= */

      const todayData = data.find((w) => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);

        return workoutDate.getTime() === todayDate.getTime();
      });

      let finalTodayWorkout = null;

      if (todayData) {
        finalTodayWorkout = {
          muscle: todayData.day || "Workout",
          dayName: new Date(todayData.date).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          exerciseCount: todayData.completedExercises?.length || 0,
          calories: todayData.totalCalories || 0,
        };
      }

      /* 🔥 LOCAL STORAGE FALLBACK */

      const localData = localStorage.getItem(
        `todayWorkoutData_${todayName}_${userKey}`
      );

      if (localData) {
        const parsed = JSON.parse(localData);

        finalTodayWorkout = {
          muscle: "Workout",
          dayName: todayName,
          exerciseCount: parsed.exerciseCount,
          calories: parsed.calories,
        };
      }

      setTodayWorkout(finalTodayWorkout);

      /* ================= COMPLETED ================= */

      const completedSet = new Set();

      data.forEach((w) => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
          (todayDate - workoutDate) / (1000 * 60 * 60 * 24)
        );

        if (diffDays >= 0 && diffDays < 7) {
          completedSet.add(displayDays[workoutDate.getDay()]);
        }
      });

      const todayCompleted = localStorage.getItem(
        `workoutCompleted_${todayName}_${userKey}`
      );

      if (todayCompleted) {
        completedSet.add(todayName);
      }

      /* ================= MISSED ================= */

      const missedSet = new Set();

      displayDays.forEach((d, index) => {
        if (d === "Sun") return;

        if (index < todayIndex && !completedSet.has(d)) {
          missedSet.add(d);
        }
      });

      setCompletedDays([...completedSet]);
      setMissedDays([...missedSet]);

      /* ================= 🔥 YESTERDAY WARNING LOGIC ================= */

      const yesterdayIndex = todayIndex - 1;

      if (yesterdayIndex >= 0) {
        const yesterday = displayDays[yesterdayIndex];

        if (!completedSet.has(yesterday)) {
          setShowMissedBadge(true);
        } else {
          setShowMissedBadge(false);
        }
      } else {
        setShowMissedBadge(false);
      }
    };

    // 🔥 CALL
    fetchSchedule();

    // 🔥 EVENT LISTENER
    const handleUpdate = () => {
      fetchSchedule();
    };

    window.addEventListener("workoutUpdated", handleUpdate);

    return () => {
      window.removeEventListener("workoutUpdated", handleUpdate);
    };
  }, [profile]);

  const getWorkoutStatus = (day) => {
    const dayIndex = displayDays.indexOf(day);

    // ⭐ TODAY
    if (dayIndex === todayIndex) {
      if (completedDays.includes(day)) return "done";
      return "today";
    }

    // FUTURE
    if (dayIndex > todayIndex) {
      return "future";
    }

    // DONE
    if (completedDays.includes(day)) {
      return "done";
    }

    // MISSED
    if (missedDays.includes(day)) {
      return "missed";
    }

    return "white";
  };

  const handleDayClick = async (index) => {
    const getMuscleIcon = (name) => {
      const n = name.toLowerCase();

      if (n.includes("bench") || n.includes("chest") || n.includes("fly")) {
        return <GiChestArmor />;
      }

      if (n.includes("row") || n.includes("pull") || n.includes("back")) {
        return <GiBackPain />;
      }

      if (n.includes("shoulder") || n.includes("press")) {
        return <GiShoulderArmor />;
      }

      if (n.includes("curl") || n.includes("bicep")) {
        return <GiBiceps />;
      }

      return <GiBiceps />;
    };

    const clickedDay = displayDays[index];

    if (selectedDay === clickedDay) {
      setSelectedDay(null);
      setSelectedWorkout(null);
      return;
    }

    setSelectedDay(clickedDay);

    const res = await getWorkoutPlanByDay(apiDays[index].toLowerCase());

    if (res) {
      setSelectedWorkout(res);
    } else {
      setSelectedWorkout(null);
    }
  };

  return (
    <div className="schedule-container">
      {/* ================= TODAY CARD ================= */}

      <div className="today-focus-card">
        {/* 🔥 WARNING */}
        {showMissedBadge && (
          <div className="today-header">
            <FiAlertTriangle />
            <span>
              You missed yesterday's workout! Check your schedule and stay on
              track today.
            </span>
          </div>
        )}

        {/* 🔥 TITLE (MISSING IN YOUR UI) */}
        <div className="today-title">🔥 Today’s Workout</div>

        <div className="today-card-main">
          {/* LEFT ICON */}
          <div className="today-icon">
            <IoBarbellOutline />
          </div>

          {/* CENTER */}
          <div className="today-center">
            <div className="today-top-row">
              <h2>
                <GiFire className="fire-icon" />
                {todayName === "Sun"
                  ? "Sunday Rest Day"
                  : todayWorkout
                  ? `${todayWorkout.dayName} Workout`
                  : `${todayName} Workout`}
                <GiFire className="fire-icon" />
              </h2>

              <div className="today-stats">
                <span>
                  <IoBarbellOutline /> {todayWorkout?.exerciseCount || 0}{" "}
                  Exercises
                </span>

                <span>
                  <GiFire /> {todayWorkout?.calories || 0} kcal
                </span>
              </div>
            </div>

            <div className="today-bottom-row">
              <button
                className="start-workout-btn"
                onClick={() => navigate("/workout/today")}
              >
                START TODAY'S WORKOUT
              </button>

              <div className="today-timer">
                <FiClock />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WEEKLY ================= */}

      <div className="weekly-calendar">
        {displayDays.map((d, index) => {
          const status = getWorkoutStatus(d);

          const today = new Date();
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay());

          const currentDayDate = new Date(firstDayOfWeek);
          currentDayDate.setDate(firstDayOfWeek.getDate() + index);

          const dateNumber = currentDayDate.getDate();

          return (
            <div
              key={d}
              className={`day-card ${status}`}
              onClick={() => handleDayClick(index)}
            >
              <div className="day-top">
                <span className="day-name">{d}</span>

                {status === "missed" && (
                  <div className="status-icon missed">
                    <FiAlertTriangle />
                  </div>
                )}

                {status === "today" && (
                  <div className="status-icon today">●</div>
                )}

                {status === "done" && <div className="status-icon done">✓</div>}
              </div>

              <div className="day-date">{dateNumber}</div>

              <div className="day-status">
                {status === "missed" && "Missed"}
                {status === "today" && "Today"}
                {status === "future" && "Future"}
                {status === "done" && "Completed"}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DETAILS ================= */}

      {selectedDay && (
        <div className="workout-detail-card">
          <div className="workout-header">
            <h2>Workout Details</h2>

            <div className="workout-subheader">
              <FiCalendar /> {selectedDay} •{" "}
              {selectedWorkout?.muscleGroup || "Rest"} Day
            </div>
          </div>

          {selectedWorkout?.exercises?.length > 0 ? (
            <div className="exercise-grid">
              {selectedWorkout.exercises.map((ex, i) => (
                <div className="exercise-card" key={i}>
                  {/* TOP RIGHT ICONS */}
                  <div className="exercise-icons">
                    <GiBiceps />
                    <GiChestArmor />
                    <GiShoulderArmor />
                  </div>
                  <div className="exercise-img">
                    <IoBarbellOutline />
                  </div>

                  <div className="exercise-middle">
                    <div className="exercise-title">{ex.name}</div>
                    <div className="exercise-sub">
                      {ex.sets} x {ex.reps}
                    </div>

                    <div className="progress-bars">
                      {[...Array(ex.sets)].map((_, i) => (
                        <span key={i}></span>
                      ))}
                    </div>
                  </div>

                  <div className="exercise-right">
                    {/* <button className="guide-btn">VIEW GUIDE</button> */}
                    {/* <button className="log-btn">LOG SETS</button> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rest-day-card">
  <div className="rest-animation-box">
    <Lottie animationData={sleepAnimation} style={{ height: 220 }} />
  </div>

  <h2>Rest Day 😴</h2>

  <p className="rest-msg">
    Muscles grow when you rest, not when you lift
  </p>

  <div className="rest-badge">Recovery Mode ON</div>
</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
