import express from "express";
import { 
  getMealByGoalLevel,
  createMealPlan,
  getAllMeals
} from "../controller/mealController.js";

const router = express.Router();

// create meal
router.post("/meal", createMealPlan);

// get all meals
router.get("/meal", getAllMeals);

// ✅ correct route
router.get("/meal/:goal/:level/:dietPreference", getMealByGoalLevel);

export default router;