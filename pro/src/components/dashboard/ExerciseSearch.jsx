import React, { useState } from "react";
import "../../styles/dashboard/search.css";

const ExerciseSearch = () => {
  const [exercises] = useState([
    "Bench Press",
    "Squats",
    "Deadlift",
    "Shoulder Press",
  ]);

  return (
    <div className="search-box">
      {exercises.map((ex, i) => (
        <div key={i} className="search-item">
          <span>{ex}</span>
          <button>Done</button>
        </div>
      ))}
    </div>
  );
};

export default ExerciseSearch;
