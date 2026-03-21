import Meal from "../models/Meal.js";

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


/* 🔥 User Fetch Meal */
export const getMealByGoalLevel = async (req, res) => {
  try {

    const { goal, level, dietPreference } = req.params;

    let formattedGoal = goal?.toLowerCase().trim();
    let formattedLevel = level?.toLowerCase().trim();
    let formattedDiet = dietPreference?.toLowerCase().trim();

    // 🔥 NORMALIZATION FIX
    const allowedDiets = ["veg", "non-veg", "keto", "vegan", "balanced"];

    if (!allowedDiets.includes(formattedDiet)) {
      return res.status(400).json({ message: "Invalid diet preference" });
    }

    console.log("QUERY:", formattedGoal, formattedLevel, formattedDiet);

    /* 🔥 FIRST TRY EXACT MATCH */

    let meal = await Meal.findOne({
      goal: formattedGoal,
      level: formattedLevel,
      dietPreference: formattedDiet
    }).lean();


    /* 🔥 FALLBACK (ignore level) */

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