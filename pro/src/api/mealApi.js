import axios from "axios";
import BASE_URL from "./config";


// Get meal by goal + level

export const getMealByGoalLevel = (goal, level, dietPreference) => {

  return axios.get(
    `${BASE_URL}/api/meal/${encodeURIComponent(goal)}/${encodeURIComponent(level)}/${encodeURIComponent(dietPreference)}`
  );

};
