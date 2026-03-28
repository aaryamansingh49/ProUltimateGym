import express from "express";
import { createWorkoutPlan } from "../controller/workoutController.js";

const router = express.Router();

/* ADMIN ONLY */
router.post("/admin/workout", createWorkoutPlan);

export default router;