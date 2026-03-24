import axios from "axios";
import BASE_URL from "./config";


// Get meal by goal + level

export const getMealByGoalLevel = (goal, level, dietPreference) => {
  const userId = localStorage.getItem("userKey");
  return axios.get(
    `${BASE_URL}/api/meal/${encodeURIComponent(goal)}/${encodeURIComponent(level)}/${encodeURIComponent(dietPreference)}`,
    {
      headers: {
        userId: userId   // 🔥 IMPORTANT
      }
    }
  );

};
