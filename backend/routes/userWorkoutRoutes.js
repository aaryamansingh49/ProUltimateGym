import express from "express";
import {
  saveWorkoutProgress,
  getUserWorkoutByDay,
  getAllUserWorkouts,
} from "../controller/userWorkoutController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

/* SAVE */
router.post("/workout/progress", userAuthMiddleware, saveWorkoutProgress);

/* PREFILL */
router.get("/workout/progress/:day", userAuthMiddleware, getUserWorkoutByDay);

/* ALL */
router.get("/workouts", userAuthMiddleware, getAllUserWorkouts);

export default router;