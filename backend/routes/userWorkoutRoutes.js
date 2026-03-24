import express from "express";
import {
  saveWorkoutProgress,
  getUserWorkoutByDay,
  getAllUserWorkouts,
} from "../controller/userWorkoutController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

/* =========================
   ✅ SAVE WORKOUT PROGRESS
  
========================= */
router.post(
  "/workout/progress",
  userAuthMiddleware,
  saveWorkoutProgress
);

/* =========================
   ✅ GET WORKOUT (PREFILL)
   FINAL URL → /api/workout/progress/:userId/:day
========================= */
router.get(
  "/workout/progress/:userId/:day",
  getUserWorkoutByDay
);

/* =========================
   ✅ GET ALL WORKOUTS
   FINAL URL → /api/workouts
========================= */
router.get(
  "/workouts",
  getAllUserWorkouts
);

export default router;