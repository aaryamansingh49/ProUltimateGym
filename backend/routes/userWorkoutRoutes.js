import express from "express";
import {
  saveWorkoutProgress,
  getUserWorkoutByDay,
  getAllUserWorkouts,
} from "../controller/userWorkoutController.js";

import { getWorkoutByDay } from "../controller/workoutController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

/* ✅ WORKOUT PLAN */
router.get("/workout/:day", userAuthMiddleware, getWorkoutByDay);

/* ✅ PROGRESS */
router.post("/workout/progress", userAuthMiddleware, saveWorkoutProgress);
router.get("/workout/progress/:day", userAuthMiddleware, getUserWorkoutByDay);

/* ✅ ALL */
router.get("/workouts", userAuthMiddleware, getAllUserWorkouts);

export default router;