export const calculateNutritionTargets = ({
    goal,
    weight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight
  }) => {
  
    let bmr;
  
    // 🔥 BMR formula
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      athlete: 1.9
    };
  
    const tdee = bmr * (activityMap[activityLevel] || 1.55);
  
    let calories = tdee;
  
    // 🔥 Goal adjustment
    if (goal === "Muscle Gain") calories += 400;
    if (goal === "Fat Loss") calories -= 400;
  
    // 🔥 Target weight adjustment (advanced logic)
    const weightDiff = targetWeight - weight;
  
    if (weightDiff > 0) calories += 150;
    if (weightDiff < 0) calories -= 150;
  
    const protein = weight * 2;
    const fats = weight * 0.8;
    const carbs = (calories - (protein * 4 + fats * 9)) / 4;
  
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fats: Math.round(fats),
      carbs: Math.round(carbs)
    };
  };