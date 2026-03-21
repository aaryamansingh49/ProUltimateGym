import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard/cards.css";

const MealCard = () => {

  const navigate = useNavigate();

  const [nutrition, setNutrition] = useState({
    mealsCompleted: 0,
    totalMeals: 8,
    calories: 0,
    level: "low"
  });

  useEffect(() => {

    const loadNutrition = () => {

      const userKey = localStorage.getItem("userKey");
      if (!userKey) return;

      const saved = localStorage.getItem(`dailyNutrition_${userKey}`);

      if (saved) {
        setNutrition(JSON.parse(saved));
      } else {
        setNutrition({
          mealsCompleted: 0,
          totalMeals: 8,
          calories: 0,
          level: "low"
        });
      }

    };

    loadNutrition();

    // listen for updates from Meal page
    window.addEventListener("storage", loadNutrition);

    return () => {
      window.removeEventListener("storage", loadNutrition);
    };

  }, []);

  const goToMealPage = () => {
    navigate("/meal");
  };

  return (

    <div
      className={`fitness-card pink ${nutrition.level}`}
      onClick={goToMealPage}
    >

      <div className="card-left">

        <div className="card-icon">🍽️</div>

        <h3>{nutrition.totalMeals} Meals</h3>

        <p>{nutrition.calories} kcal</p>

      </div>

      <div className="progress-circle">

        <span>
          {nutrition.mealsCompleted}/{nutrition.totalMeals}
        </span>

      </div>

    </div>

  );

};

export default MealCard;