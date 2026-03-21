import React, { useState } from "react";
import "../../styles/dashboard/search.css";

const MealSearch = () => {
  const [meals] = useState([
    "Chicken & Rice",
    "Oats & Eggs",
    "Paneer Salad",
  ]);

  return (
    <div className="search-box">
      {meals.map((meal, i) => (
        <div key={i} className="search-item">
          <span>{meal}</span>
          <button>Consumed</button>
        </div>
      ))}
    </div>
  );
};

export default MealSearch;
