import axios from "axios";
import BASE_URL from "./config";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

/* 🔐 Automatically attach token */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ✅ SAVE PROFILE */
export const saveProfile = async (data) => {
  const res = await API.post("/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return res.data;
};


/* ✅ GET PROFILE */
export const getProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};

export const getUserWorkouts = async (userId) => {
  const res = await API.get(`/workouts?userId=${userId}`);
  return res.data;
};

export const getWorkoutPlanByDay = async (userId, day) => {
  try {
    const res = await API.get(`/workout/${userId}/${day}`);

    return res.data;
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file); // ✅ FIXED

  const res = await API.post("/upload-profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
