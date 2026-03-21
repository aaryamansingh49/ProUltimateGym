import React, { useEffect, useState } from "react";
import "../../styles/dashboard/statistics.css";
import { getUserWorkouts } from "../../api/profileApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaChartLine } from "react-icons/fa";
import { MdLocalFireDepartment } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";


// 🔥 TYPE COLORS
const TYPE_COLORS = {
  Arms: "#ff6b6b",
  Shoulders: "#4dabf7",
  "Full Body": "#51cf66",
  Chest: "#f59f00",
  Legs: "#845ef7",
  Back: "#20c997",
  Other: "#adb5bd",
};

const Statistics = ({ profile }) => {
  const [workouts, setWorkouts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [calorieTrend, setCalorieTrend] = useState([]);
  const [consistency, setConsistency] = useState(0);
  const [viewType, setViewType] = useState("weekly");

  const [mostActiveDay, setMostActiveDay] = useState("");
  const [weeklyComparison, setWeeklyComparison] = useState({
    current: 0,
    previous: 0,
  });

  const [workoutTypeData, setWorkoutTypeData] = useState([]);

  const [calorieView, setCalorieView] = useState("avg");
  const [calorieStats, setCalorieStats] = useState({ avg: 0, max: 0, min: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getUserWorkouts(profile.userId);
      if (!res.success) return;

      const data = res.workouts || [];
      setWorkouts(data);

      // calories trend
      setCalorieTrend(
        data.map((w) => ({
          date: new Date(w.date).toLocaleDateString(),
          calories: w.totalCalories || 0,
        }))
      );

      // consistency
      if (data.length) {
        const firstDay = new Date(data[0].date);
        const today = new Date();
        const totalDays = Math.ceil((today - firstDay) / (1000 * 60 * 60 * 24));

        setConsistency(
          Math.min(Math.round((data.length / totalDays) * 100), 100)
        );
      }

      // most active day
      const dayMap = {};

      data.forEach((w) => {
        const day = new Date(w.date).toLocaleString("default", {
          weekday: "long",
        });

        dayMap[day] = (dayMap[day] || 0) + 1;
      });

      const mostDay = Object.keys(dayMap).reduce(
        (a, b) => (dayMap[a] > dayMap[b] ? a : b),
        ""
      );

      setMostActiveDay(mostDay);

      // WEEKLY COMPARISON

      const now = new Date();

      const startOfCurrentWeek = new Date(now);
      startOfCurrentWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfCurrentWeek.setHours(0, 0, 0, 0);

      const startOfPrevWeek = new Date(startOfCurrentWeek);
      startOfPrevWeek.setDate(startOfCurrentWeek.getDate() - 7);

      const endOfPrevWeek = new Date(startOfCurrentWeek);
      endOfPrevWeek.setMilliseconds(-1);

      const currentWeek = data.filter((w) => {
        const d = new Date(w.date);
        return d >= startOfCurrentWeek;
      });

      const prevWeek = data.filter((w) => {
        const d = new Date(w.date);
        return d >= startOfPrevWeek && d <= endOfPrevWeek;
      });

      setWeeklyComparison({
        current: currentWeek.length,
        previous: prevWeek.length,
      });

      // workout type distribution
      const typeMap = {};

      data.forEach((w) => {
        let t = w.type?.trim() || "Other";

        // 🔥 MAIN FIX
        if (t.toLowerCase() === "general") {
          t = "Full Body";
        }

        if (t === "FullBody") {
          t = "Full Body";
        }

        typeMap[t] = (typeMap[t] || 0) + 1;
      });

      setWorkoutTypeData(
        Object.keys(typeMap).map((k) => ({
          name: k,
          value: typeMap[k],
        }))
      );

      // calorie stats

      const dailyMap = {};

      data.forEach((w) => {
        const d = new Date(w.date).toLocaleDateString();
        dailyMap[d] = (dailyMap[d] || 0) + (w.totalCalories || 0);
      });

      const values = Object.values(dailyMap);

      const avg = values.length
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;

      const max = values.length ? Math.max(...values) : 0;
      const min = values.length ? Math.min(...values) : 0;

      setCalorieStats({ avg, max, min });
    };

    if (profile?.userId) fetchStats();
  }, [profile]);

  // 🔥 WEEKLY PROGRESS MESSAGE (component level)

  const difference = weeklyComparison.current - weeklyComparison.previous;

  let progressMessage = "";
  let progressIcon = "";

  if (difference > 0) {
    progressIcon = "⬆";
    progressMessage = `+${difference} workouts — Great progress! Keep it up 🔥`;
  } else if (difference < 0) {
    progressIcon = "⬇";
    progressMessage = `${difference} workouts — Try to stay consistent this week 💪`;
  } else {
    progressIcon = "→";
    progressMessage = "Same as last week — Maintain the momentum 👍";
  }

  // chart grouping

  useEffect(() => {
    if (!workouts.length) return;

    let result = [];

    if (viewType === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const weekly = days.map((d) => ({
        period: d,
        workouts: 0,
      }));

      workouts.forEach((w) => {
        weekly[new Date(w.date).getDay()].workouts++;
      });

      result = weekly;
    }

    if (viewType === "monthly") {
      const map = {};

      workouts.forEach((w) => {
        const key = new Date(w.date).toLocaleString("default", {
          month: "short",
        });

        map[key] = (map[key] || 0) + 1;
      });

      result = Object.keys(map).map((k) => ({
        period: k,
        workouts: map[k],
      }));
    }

    if (viewType === "quarterly") {
      const map = {};

      workouts.forEach((w) => {
        const q = "Q" + (Math.floor(new Date(w.date).getMonth() / 3) + 1);

        map[q] = (map[q] || 0) + 1;
      });

      result = Object.keys(map).map((k) => ({
        period: k,
        workouts: map[k],
      }));
    }

    if (viewType === "yearly") {
      const map = {};

      workouts.forEach((w) => {
        const y = new Date(w.date).getFullYear();

        map[y] = (map[y] || 0) + 1;
      });

      result = Object.keys(map).map((k) => ({
        period: k,
        workouts: map[k],
      }));
    }

    setChartData(result);
  }, [viewType, workouts]);

  return (
    <div className="statistics-container">
      <h2>Statistics</h2>

      <div className="stat-tabs">
        {["weekly", "monthly", "quarterly", "yearly"].map((v) => (
          <button
            key={v}
            className={viewType === v ? "active" : ""}
            onClick={() => setViewType(v)}
          >
            {v}
          </button>
        ))}
      </div>

      {/* BAR */}
      <div className="stat-card">
        <h3>{viewType.toUpperCase()} Workouts</h3>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="workouts"
              fill="#ff2e4d"
              radius={[12, 12, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE */}
      <div className="stat-card">
        <h3>Workout Distribution</h3>

        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={workoutTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              animationDuration={1200}
            >
              {workoutTypeData.map((e, i) => (
                <Cell key={i} fill={TYPE_COLORS[e.name] || "#ccc"} />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LINE */}
      <div className="stat-card">
        <h3> Calories Trend</h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={calorieTrend}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#e60023"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SMALL STATS */}

      <div className="stat-row">
        {/* Weekly Comparison */}
        <div className="stat-card small-card">
          <h4>
            <FaChartLine className="stat-icon" />
            Weekly Comparison
          </h4>

          <div className="card-content">
            <p>This Week: {weeklyComparison.current}</p>
            <p>Last Week: {weeklyComparison.previous}</p>

            <p className="progress-text">
              {progressIcon} {progressMessage}
            </p>
          </div>
        </div>

        {/* Most Active Day */}
        <div className="stat-card small-card">
          <h4>
            <BsCalendarCheck className="stat-icon" />
            Most Active Day
          </h4>

          <div className="card-content">
            <h2>{mostActiveDay}</h2>
          </div>
        </div>

        {/* Calories */}
        <div className="stat-card small-card">
          <div className="calorie-header">
            <h4>
              <MdLocalFireDepartment className="stat-icon" />
              Calories Stats
            </h4>

            <select
              className="calorie-select"
              value={calorieView}
              onChange={(e) => setCalorieView(e.target.value)}
            >
              <option value="avg">Average</option>
              <option value="max">Highest</option>
              <option value="min">Lowest</option>
            </select>
          </div>

          <div className="card-content">
            <h1>
              {calorieView === "avg"
                ? calorieStats.avg
                : calorieView === "max"
                ? calorieStats.max
                : calorieStats.min}{" "}
              kcal
            </h1>
          </div>
        </div>

        {/* Consistency */}
        <div className="stat-card small-card">
          <h4>
            <AiOutlineRise className="stat-icon" />
            Consistency Score
          </h4>

          <div className="card-content">
            <h1>{consistency}%</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
