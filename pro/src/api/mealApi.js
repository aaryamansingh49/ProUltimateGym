import API from "./profileApi"; 

export const getMealByGoalLevel = (goal, level, dietPreference) => {
  return API.get(
    `/meal/${encodeURIComponent(goal)}/${encodeURIComponent(level)}/${encodeURIComponent(dietPreference)}`
  );
};