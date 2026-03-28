  import axios from "axios";
  import BASE_URL from "./config";

  const API = axios.create({
    baseURL: `${BASE_URL}/api`,
  });

  /* 🔐 Automatically attach token */
  API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    console.log("🚀 INTERCEPTOR TOKEN:", token);   // 🔥 ADD THIS


    if (token && token !== "undefined" && token !== "null") {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  });

  /* ✅ SAVE PROFILE */
  export const saveProfile = async (data) => {
    const res = await API.post("/profile", data);
    return res.data;
  };

  /* ✅ GET PROFILE */
  export const getProfile = async () => {
    const res = await API.get("/profile");
    return res.data;
  };

  export const getUserWorkouts = async () => {
    const res = await API.get(`/workouts`);
    return res.data;
  };

  /* ✅ FIXED */
  export const getWorkoutPlanByDay = async (day) => {
    try {
      const res = await API.get(`/workout/${day}`);
      return res.data;
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };

  export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await API.post("/upload-profile-photo", formData);

    return res.data;
  };

  export default API;