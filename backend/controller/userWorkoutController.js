import UserWorkoutLog from "../models/UserWorkoutLog.js";
import UserModel from "../models/userSchema.js";
import User from "../models/User.js"; 
import mongoose from "mongoose";

// ✅ SAVE workout

export const saveWorkoutProgress = async (req, res) => {
  try {
    const { day, type, completedExercises } = req.body;
    const userId = req.userId; // 🔥 JWT se aa raha hai

    console.log("USER ID 👉", userId);
    console.log("TYPE RECEIVED:", type);

    // 🔥 FETCH USER (LOGIN MODEL)
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 DUAL MODEL MEMBERSHIP CHECK
    let isMember = user?.membershipPlan;

    if (!isMember) {
      const membershipUser = await User.findOne({ email: user.email });
      isMember = membershipUser?.membershipPlan;
    }

    if (!isMember) {
      return res.status(403).json({
        message: "Only for active members",
      });
    }

    // 🔥 CALCULATE CALORIES
    const totalCalories = completedExercises.reduce(
      (sum, ex) => sum + (ex.done ? ex.calories : 0),
      0
    );

    // 🔥 SAVE LOG
    const log = await UserWorkoutLog.findOneAndUpdate(
      { userId, day },
      {
        type,
        completedExercises,
        totalCalories,
        date: new Date(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json(log);

  } catch (error) {
    console.error("SAVE WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ PREFILL workout
export const getUserWorkoutByDay = async (req, res) => {
  try {
    const { userId, day } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const log = await UserWorkoutLog.findOne({ userId, day });

    res.status(200).json(log);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL WORKOUTS
export const getAllUserWorkouts = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

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