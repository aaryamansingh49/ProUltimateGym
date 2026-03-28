import mongoose from "mongoose";
import UserWorkoutLog from "../models/UserWorkoutLog.js";
import User from "../models/User.js";
import Membership from "../models/Membership.js";

/* HELPER: VALID DAY CHECK */
const isValidDay = (day) => {
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return validDays.includes(day?.toLowerCase());
};

/* SAVE WORKOUT PROGRESS*/
export const saveWorkoutProgress = async (req, res) => {
  try {
    const { day, type, completedExercises } = req.body;
    const userId = req.userId;

    // console.log(" SAVE WORKOUT DAY:", day);

    /* VALIDATE USER ID */
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    /* 🔥 VALIDATE DAY */
    if (!isValidDay(day)) {
      // console.log("INVALID DAY (SAVE):", day);
      return res.status(400).json({
        success: false,
        message: "Invalid day value",
      });
    }

    const user = await User.findById(userId);
    const requestId = Math.random().toString(36).substring(7);

    // console.log(`🚀 REQUEST ID: ${requestId}`);
    // console.log("👉 BODY:", req.body);
    // console.log("👉 USER ID:", req.userId);
    // console.log("👉 MEMBERSHIP:", user.membershipPlan);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*  MEMBERSHIP CHECK (SAFE) */
    // console.log(" USER EMAIL:", user.email);
    const membership = await Membership.findOne({
      email: user.email.trim().toLowerCase()
    });
    

    // console.log("MEMBERSHIP FOUND (SAVE):", membership);

    if (!membership) {
      return res.status(403).json({
        message: "Only for active members",
      });
    }
    
    /* ACTIVE CHECK */
    const startDate = new Date(membership.startDate);
    
    let duration = 0;
    if (membership.membershipPlan === "Basic") duration = 30;
    if (membership.membershipPlan === "Pro") duration = 90;
    if (membership.membershipPlan === "Premium") duration = 365;
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    
    const today = new Date();
    
    if (today > endDate) {
      return res.status(403).json({
        message: "Membership expired",
      });
    }

    const dayLower = day.toLowerCase();

    /*  SAFE CALORIE CALCULATION */
    const totalCalories = (completedExercises || []).reduce(
      (sum, ex) => sum + (ex.done ? ex.calories : 0),
      0
    );

    const log = await UserWorkoutLog.findOneAndUpdate(
      { userId, day: dayLower },
      {
        userId,
        day: dayLower,
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
    // console.error("SAVE WORKOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*  GET USER WORKOUT*/
export const getUserWorkoutByDay = async (req, res) => {
  try {
    const userId = req.userId;
    const { day } = req.params;

    // console.log("FINAL DAY RECEIVED (PROGRESS):", day);

    /* VALIDATE DAY */
    if (!isValidDay(day)) {
      // console.log("INVALID DAY (PROGRESS):", day);
      return res.status(400).json({
        message: "Invalid day value",
      });
    }

    const dayLower = day.toLowerCase();

    const log = await UserWorkoutLog.findOne({
      userId,
      day: dayLower,
    });

    if (!log) {
      return res.status(200).json({
        completedExercises: [],
        totalCalories: 0,
      });
    }

    res.status(200).json({
      completedExercises: log.completedExercises || [],
      totalCalories: log.totalCalories || 0,
    });
  } catch (error) {
    // console.error("GET PROGRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✅ GET ALL WORKOUTS
========================= */
export const getAllUserWorkouts = async (req, res) => {
  try {
    const userId = req.userId;

    const workouts = await UserWorkoutLog.find({ userId });

    res.status(200).json({
      success: true,
      workouts,
    });
  } catch (error) {
    // console.error("GET ALL WORKOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};