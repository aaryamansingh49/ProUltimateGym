import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

import "../../styles/dashboard/ProgressChart.css";
import { getUserWorkoutProgress } from "../../api/workoutApi";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const ProgressChart = ({ profile }) => {

  const [exerciseData, setExerciseData] = useState([0,0,0,0,0,0,0]);

  const days = [
    "Sunday","Monday","Tuesday",
    "Wednesday","Thursday","Friday","Saturday"
  ];

  /* 🔥 LOAD DATA */
  useEffect(() => {

    if (!profile) return;

    fetchWorkoutData();

  }, [profile]);

  /* 🔥 FETCH DATA */
  const fetchWorkoutData = async () => {
    try {
  
      let dataArr = [];
  
      for (let day of days) {
  
        try {
  
          const res = await getUserWorkoutProgress(day.toLowerCase());
  
          const calories = res?.totalCalories || 0;
  
          console.log(`📅 ${day} → Calories:`, calories);
  
          dataArr.push(calories);
  
        } catch (err) {
  
          console.log(`❌ Error for ${day}:`, err?.response?.data || err.message);
  
          dataArr.push(0);
        }
  
      }
  
      console.log("✅ FINAL WEEK DATA:", dataArr);
  
      setExerciseData(dataArr);
  
    } catch (error) {
  
      console.log("❌ Main fetch error:", error);
  
      setExerciseData([0,0,0,0,0,0,0]);
    }
  };

  
  /* 🔥 CHART DATA */
  const data = {
    labels: days,
    datasets: [
      {
        label: "Calories Burned",
        data: exerciseData,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4, // smooth curve
        fill: false
      }
    ]
  };

  /* 🔥 OPTIONS FIX */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="progress-chart-card" style={{ height: "300px" }}>

      <h3>Statistics (Last Week)</h3>

      {/* 🔥 FORCE RERENDER */}
      <Line 
        key={exerciseData.join(",")} 
        data={data} 
        options={options} 
      />

      <div className="progress-legend">
        <span className="progress-dot blue"></span> Calories Burned
      </div>

    </div>
  );
};

export default ProgressChart;