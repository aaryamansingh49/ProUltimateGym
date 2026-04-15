import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard/cards.css";
import { Dumbbell, Flame, CheckCircle, Utensils, BarChart3 } from "lucide-react";

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
    <div className="simple-card" onClick={goToMealPage}>
  
      <div className="card-header">
        <div className="pg-badge">PUG</div>
        <span className="sub">PRO ULTIMATE GYMS</span>
        <h2>Meals</h2>
      </div>
  
      <div className="card-box">
  
        <div className="row">
          <div className="left">
            <div className="icon red">
              <Utensils size={16} />
            </div>
            <span>{nutrition.totalMeals} Meals</span>
          </div>
          <span className="right">Daily Plan</span>
        </div>
  
        <div className="row">
          <div className="left">
            <div className="icon orange">
              <Flame size={16} />
            </div>
            <span>{nutrition.calories} kcal</span>
          </div>
          <span className="right red-text">
            {nutrition.calories} kcal
          </span>
        </div>
  
        <div className="row">
          <div className="left">
            <div className="icon gray">
              <BarChart3 size={16} />
            </div>
            <span>Meals Logged</span>
          </div>
          <span className="right">
            {nutrition.mealsCompleted}/{nutrition.totalMeals}
          </span>
        </div>
  
      </div>
    </div>
  );
};

export default MealCard;