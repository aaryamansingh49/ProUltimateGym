import express from "express";
import {
  createWorkoutPlan,
  getWorkoutByDay,
} from "../controller/workoutController.js";

const router = express.Router();

// Admin
router.post("/admin/workout", createWorkoutPlan);

// User
router.get("/workout/:userId/:day", getWorkoutByDay);

export default router;
