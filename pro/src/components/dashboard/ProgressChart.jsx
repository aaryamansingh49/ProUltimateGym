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

  /*  FETCH DATA */
  const fetchWorkoutData = async () => {
    try {
  
      let dataArr = [];
  
      for (let day of days) {
  
        try {
  
          const res = await getUserWorkoutProgress(day.toLowerCase());
  
          const calories = res?.totalCalories || 0;
  
          // console.log(`📅 ${day} → Calories:`, calories);
  
          dataArr.push(calories);
  
        } catch (err) {
  
          // console.log(`❌ Error for ${day}:`, err?.response?.data || err.message);
  
          dataArr.push(0);
        }
  
      }
  
      // console.log(" FINAL WEEK DATA:", dataArr);
  
      setExerciseData(dataArr);
  
    } catch (error) {
  
      // console.log(" Main fetch error:", error);
  
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
  
        borderWidth: 4,
        pointRadius: 0,
        tension: 0.5,
        fill: true,
  
        borderColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas } = chart;
          const gradient = canvas.createLinearGradient(0, 0, chart.width, 0);
  
          gradient.addColorStop(0, "#ef4444"); // red
          gradient.addColorStop(0.5, "#f97316"); // orange
          gradient.addColorStop(1, "#facc15"); // yellow
  
          return gradient;
        },
  
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvas } = chart;
          const gradient = canvas.createLinearGradient(0, 0, 0, 300);
  
          gradient.addColorStop(0, "rgba(249,115,22,0.4)");
          gradient.addColorStop(0.5, "rgba(239,68,68,0.25)");
          gradient.addColorStop(1, "rgba(250,204,21,0.15)");
  
          return gradient;
        }
      }
    ]
  };

  /* 🔥 OPTIONS FIX */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  
    plugins: {
      legend: {
        display: false
      }
    },
  
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.08)"
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.08)"
        }
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