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

  useEffect(() => {

    if (!profile?.userId) return;

    fetchWorkoutData();

  }, [profile]);

  const fetchWorkoutData = async () => {

    try {

      let dataArr = [];

      for (let day of days) {

        try {

          const res = await getUserWorkoutProgress(profile.userId, day);

          if (res.data) {
            dataArr.push(res.data.totalCalories || 0);
          } else {
            dataArr.push(0);
          }

        } catch {
          dataArr.push(0);
        }

      }

      setExerciseData(dataArr);

    } catch (error) {
      console.log(error);
    }

  };

  const data = {
    labels: days,

    datasets: [
      {
        label: "Calories Burned",
        data: exerciseData,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="progress-chart-card">

  <h3>Statistics (Last Week)</h3>

  <Line data={data} options={options} />

  <div className="progress-legend">
    <span className="progress-dot blue"></span> Calories Burned
  </div>

</div>
  );
};

export default ProgressChart;