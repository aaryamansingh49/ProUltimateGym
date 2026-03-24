import express from "express";
import { 
  getMealByGoalLevel,
  createMealPlan,
  getAllMeals
} from "../controller/mealController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

// create meal
router.post("/meal", createMealPlan);

// get all meals
router.get("/meal", getAllMeals);

// ✅ correct route
router.get("/meal/:goal/:level/:dietPreference", userAuthMiddleware, getMealByGoalLevel);

export default router;