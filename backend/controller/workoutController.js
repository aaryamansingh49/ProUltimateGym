import WorkoutPlan from "../models/WorkoutPlan.js";
import UserProfile from "../models/UserProfile.js"; // ⭐ NEW IMPORT
import mongoose from "mongoose";


// Admin – Create workout plan
export const createWorkoutPlan = async (req, res) => {
  try {
    const workout = await WorkoutPlan.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User – Get workout by day (LEVEL BASED)
export const getWorkoutByDay = async (req, res) => {
  try {

    const { day, userId } = req.params; //  userId bhi lena

    // STEP 1 — user profile find karo
    const userProfile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    console.log("USER PROFILE:", userProfile);

    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not completed"
      });
    }

    // STEP 2 — level nikalo
    const level = userProfile.level;

    // STEP 3 — workout fetch based on level + day
    console.log("DAY:", day);
console.log("LEVEL FROM USERPROFILE:", level);
    const workout = await WorkoutPlan.findOne({
      day,
      level
    });
    console.log("FOUND WORKOUT:", workout);
    if (!workout) {
      return res.status(404).json({
        message: "Workout not found for this level"
      });
    }

    res.status(200).json(workout);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
