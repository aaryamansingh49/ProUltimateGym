import axios from "axios";
import BASE_URL from "./config";

// ✅ Get today's workout (admin defined)
export const getWorkoutByDay = async (day) => {
  return axios.get(
    `${BASE_URL}/api/workout/${day}`
  );
};

// ✅ Save user's workout progress
export const saveWorkoutProgress = async (data) => {
  return axios.post(
    `${BASE_URL}/api/workout/progress`,
    data
  );
};

//workout progress
export const getUserWorkoutProgress = (userId, day) => {
    return axios.get(
      `${BASE_URL}/api/workout/progress/${userId}/${day}`
    );
  };
