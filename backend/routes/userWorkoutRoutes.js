import express from "express";
import {
  saveWorkoutProgress,
  getUserWorkoutByDay,
  getAllUserWorkouts,
} from "../controller/userWorkoutController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";



const router = express.Router();

// ✅ save workout
router.post("/workout/progress", userAuthMiddleware, saveWorkoutProgress);

// ✅ get workout (prefill)
router.get("/workout/progress/:userId/:day", getUserWorkoutByDay);

// ✅ get all workouts (Achievements use karega)
router.get("/workouts", getAllUserWorkouts);

export default router;
