import React, { useEffect, useState } from "react";
import "../../styles/dashboard/schedule.css";
import { getWorkoutPlanByDay, getUserWorkouts } from "../../api/profileApi";

const Schedule = ({ profile }) => {
  const [workouts, setWorkouts] = useState([]);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [missedDays, setMissedDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showMissedBadge, setShowMissedBadge] = useState(false);

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

      /* TODAY WORKOUT */

      const todayData = data.find((w) => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);

        return workoutDate.getTime() === todayDate.getTime();
      });

      if (todayData) {
        setTodayWorkout({
          muscle: todayData.day || "Workout",
          dayName: new Date(todayData.date).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          exerciseCount: todayData.completedExercises?.length || 0,
          calories: todayData.totalCalories || 0,
        });
      } else {
        setTodayWorkout(null);
      }

      /* COMPLETED DAYS */

      const completedSet = new Set();

      data.forEach((w) => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
          (todayDate - workoutDate) / (1000 * 60 * 60 * 24)
        );

        // Only this week's workouts
        if (diffDays >= 0 && diffDays < 7) {
          completedSet.add(displayDays[workoutDate.getDay()]);
        }
      });

      /* LOCAL STORAGE CHECK (instant update) */

      const todayCompleted = localStorage.getItem(
        `workoutCompleted_${todayName}_${userKey}`
      );

      if (todayCompleted) {
        completedSet.add(todayName);
      }

      /* MISSED DAYS (Sunday is Rest Day) */

      const missedSet = new Set();

      displayDays.forEach((d, index) => {
        // Sunday = Rest Day
        if (d === "Sun") return;

        if (index < todayIndex && !completedSet.has(d)) {
          missedSet.add(d);
        }
      });

      setCompletedDays([...completedSet]);
      setMissedDays([...missedSet]);

      /* MISSED BADGE */

      const yesterdayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
      const yesterdayName = displayDays[yesterdayIndex];

      if (missedSet.has(yesterdayName)) {
        setShowMissedBadge(true);
      } else {
        setShowMissedBadge(false);
      }
    };

    fetchSchedule();
  }, [profile]);

  const getWorkoutStatus = (day) => {
    if (day === todayName && completedDays.includes(day)) return "done";

    if (day === todayName) return "today";

    if (completedDays.includes(day)) return "done";

    if (missedDays.includes(day)) return "missed";

    return "upcoming";
  };

  const handleDayClick = async (index) => {
    const clickedDay = displayDays[index];

    if (selectedDay === clickedDay) {
      setSelectedDay(null);
      setSelectedWorkout(null);

      return;
    }

    setSelectedDay(clickedDay);

    const res = await getWorkoutPlanByDay(profile.userId, apiDays[index]);

    if (res) {
      setSelectedWorkout(res);
    } else {
      setSelectedWorkout(null);
    }
  };

  return (
    <div className="schedule-container">
      {showMissedBadge && (
        <div className="missed-reminder">
          ⚠️ You missed yesterday's workout!
        </div>
      )}

      {/* TODAY CARD */}

      <div className="today-focus-card">
        <h3>🔥 Today’s Workout</h3>

        <div className="today-info">
          <h2>
            {todayName === "Sun"
              ? "Sunday Rest Day"
              : todayWorkout
              ? `${todayWorkout.dayName} Workout`
              : `${todayName} Workout`}
          </h2>

          <p>Exercises: {todayWorkout?.exerciseCount || 0}</p>
          <p>Target Calories: {todayWorkout?.calories || 0} kcal</p>
        </div>
      </div>

      {/* WEEK CALENDAR */}

      <div className="weekly-calendar">
        {displayDays.map((d, index) => {
          const status = getWorkoutStatus(d);

          return (
            <div
              key={d}
              className={`day-card ${status}`}
              onClick={() => handleDayClick(index)}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* WORKOUT DETAIL */}

      {selectedDay && (
        <div className="workout-detail-card">
          <div className="workout-header">
            <h3>
              📅 {selectedDay} • {selectedWorkout?.muscleGroup || "Rest"} Day
            </h3>
          </div>

          {selectedWorkout?.exercises?.length > 0 ? (
            <div className="exercise-list">
              {selectedWorkout.exercises.map((ex, i) => (
                <div className="exercise-item" key={i}>
                  <div className="exercise-name">🏋️ {ex.name}</div>

                  <div className="exercise-badge">
                    {ex.sets} x {ex.reps}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rest-text">😴 It's a Rest Day</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
