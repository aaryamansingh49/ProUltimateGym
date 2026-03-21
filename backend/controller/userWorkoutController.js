import UserWorkoutLog from "../models/UserWorkoutLog.js";
import mongoose from "mongoose";

// ✅ SAVE workout
export const saveWorkoutProgress = async (req, res) => {
  try {
    const { userId, day, type, completedExercises } = req.body;
    console.log("TYPE RECEIVED:", type);

    const totalCalories = completedExercises.reduce(
      (sum, ex) => sum + (ex.done ? ex.calories : 0),
      0
    );

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

    res.status(200).json(log); // null bhi ho sakta hai
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserWorkouts = async (req, res) => {

  try {

    const { userId } = req.query; // ⭐ frontend se aayega

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

