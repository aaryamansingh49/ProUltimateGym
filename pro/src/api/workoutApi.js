// import axios from "axios";
// import BASE_URL from "./config";
import API from "./profileApi";

export const getWorkoutByDay = async (day) => {
  const res = await API.get(`/workout/${day}`);
  return res.data; // ✅ IMPORTANT
};

export const saveWorkoutProgress = async (data) => {
  const res = await API.post(`/workout/progress`, data);
  return res.data; // ✅ IMPORTANT
};

export const getUserWorkoutProgress = async (day) => {
  const res = await API.get(`/workout/progress/${day}`);
  return res.data; // ✅ IMPORTANT
};