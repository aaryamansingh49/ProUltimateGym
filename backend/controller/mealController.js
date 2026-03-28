import Meal from "../models/Meal.js";
import UserModel from "../models/userSchema.js";
import User from "../models/User.js"; 

/* 🔥 Admin Create Meal */
export const createMealPlan = async (req, res) => {
  try {

    const mealData = {
      ...req.body,
      goal: req.body.goal.toLowerCase(),
      level: req.body.level.toLowerCase(),
    };

    const meal = new Meal(mealData);
    await meal.save();

    res.status(201).json(meal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMeals = async (req, res) => {
  try {

    const meals = await Meal.find().lean();

    res.json(meals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* 🔥 User Fetch Meal (WITH MEMBERSHIP CHECK) */
export const getMealByGoalLevel = async (req, res) => {
  try {

    const { goal, level, dietPreference } = req.params;

    // 🔥 GET USER ID (frontend se bhejna padega agar nahi bhej raha)
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    // 🔥 FETCH USER
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 DUAL MODEL MEMBERSHIP CHECK
    let membershipPlan = user?.membershipPlan;

    // 🔥 fallback check
    if (!membershipPlan) {
      const membershipUser = await User.findOne({ email: user.email });
      membershipPlan = membershipUser?.membershipPlan;
    }
    
    console.log("👤 FINAL MEMBERSHIP:", membershipPlan);
    
    // 🔥 FINAL SAFE CHECK
    if (
      !membershipPlan ||
      membershipPlan.toLowerCase() === "none"
    ) {
      return res.status(403).json({
        message: "Only for active members",
      });
    }
    // ================= NORMAL LOGIC =================

    let formattedGoal = goal?.toLowerCase().trim();
    let formattedLevel = level?.toLowerCase().trim();
    let formattedDiet = dietPreference?.toLowerCase().trim();

    const allowedDiets = ["veg", "non-veg", "keto", "vegan", "balanced"];

    if (!allowedDiets.includes(formattedDiet)) {
      return res.status(400).json({ message: "Invalid diet preference" });
    }

    console.log("QUERY:", formattedGoal, formattedLevel, formattedDiet);

    let meal = await Meal.findOne({
      goal: formattedGoal,
      level: formattedLevel,
      dietPreference: formattedDiet
    }).lean();

    if (!meal) {
      console.log("Exact meal not found, trying fallback...");

      meal = await Meal.findOne({
        goal: formattedGoal,
        dietPreference: formattedDiet
      }).lean();
    }

    if (!meal) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    res.json(meal);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};