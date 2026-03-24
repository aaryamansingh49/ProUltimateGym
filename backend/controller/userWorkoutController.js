import UserWorkoutLog from "../models/UserWorkoutLog.js";
import UserModel from "../models/userSchema.js";
import User from "../models/User.js"; 
import mongoose from "mongoose";



import Workout from "../models/Workout.js";

export const getWorkoutByDay = async (req, res) => {
  try {
    const { day } = req.params;

    console.log("DAY RECEIVED 👉", day); // debug

    const workout = await Workout.findOne({ day });

    if (!workout) {
      return res.status(404).json({
        message: "No workout found for this day",
      });
    }

    res.status(200).json(workout);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/* =========================
   ✅ SAVE WORKOUT PROGRESS
========================= */
export const saveWorkoutProgress = async (req, res) => {
  try {
    const { day, type, completedExercises } = req.body;
    const userId = req.userId; // ✅ JWT se

    console.log("USER ID 👉", userId);
    console.log("TYPE RECEIVED:", type);

    /* 🔥 FETCH USER */
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* 🔥 MEMBERSHIP CHECK (FIXED LOGIC) */
    let isMember = false;

    // 1️⃣ Direct check (login model)
    if (user.membershipPlan && user.membershipPlan !== "None") {
      isMember = true;
    }

    // 2️⃣ Secondary check (membership collection)
    if (!isMember) {
      const membershipUser = await User.findOne({ email: user.email });

      if (membershipUser && membershipUser.membershipPlan && membershipUser.membershipPlan !== "None") {
        isMember = true;
      }
    }

    // ❌ FINAL BLOCK
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only for active members",
      });
    }

    /* 🔥 CALCULATE CALORIES */
    const totalCalories = completedExercises.reduce(
      (sum, ex) => sum + (ex.done ? ex.calories : 0),
      0
    );

    /* 🔥 SAVE / UPDATE LOG */
    const log = await UserWorkoutLog.findOneAndUpdate(
      { userId, day },
      {
        userId,
        day,
        type,
        completedExercises,
        totalCalories,
        date: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Workout saved successfully",
      log,
    });

  } catch (error) {
    console.error("SAVE WORKOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ✅ GET WORKOUT (PREFILL)
   🔥 FIX: JWT USER ONLY
========================= */
export const getUserWorkoutByDay = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIX
    const { day } = req.params;

    const log = await UserWorkoutLog.findOne({ userId, day });

    res.status(200).json(log || {});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✅ GET ALL WORKOUTS
   🔥 FIX: JWT USER ONLY
========================= */
export const getAllUserWorkouts = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FIX

    const workouts = await UserWorkoutLog.find({ userId });

    res.status(200).json({
      success: true,
      workouts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};