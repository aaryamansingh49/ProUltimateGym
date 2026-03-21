import { useEffect, useState, useMemo } from "react";
import { getMealByGoalLevel } from "../api/mealApi";
import { searchFood } from "../api/foodApi";
import { calculateNutritionTargets } from "../utils/calculateNutri";
import { updateGoalProgress } from "../utils/goalProgress";
import "../styles/dashboard/meal.css";
import { useNavigate } from "react-router-dom";
const Meal = () => {
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);

  const [macroTargets, setMacroTargets] = useState(null);
  const [microTargets, setMicroTargets] = useState(null);
  const [recommendationFoods, setRecommendationFoods] = useState([]);
  const [recommendationUsedSections, setRecommendationUsedSections] = useState(
    []
  );
  // ⭐ NEW - track specific suggested foods
  const [usedSuggestedFoods, setUsedSuggestedFoods] = useState([]);
  const [suggestionsLocked, setSuggestionsLocked] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tempGrams, setTempGrams] = useState(100);

  /* ================= LOAD ================= */

  useEffect(() => {
    const userKey = localStorage.getItem("userKey");
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    if (!userKey || !userProfile?._id) return;

    // const userKey = userProfile.email;
    const dateKey = `mealDate_${userKey}`;
    const suggestionKey = `suggestionsLocked_${userKey}`;

    const today = new Date().toISOString().split("T")[0];
    const lastSavedDate = localStorage.getItem(dateKey);

    // ⭐ reset states when user changes
    setSelectedFoods([]);
    setUsedSuggestedFoods([]);
    setSuggestionsLocked(false);

    if (lastSavedDate !== today) {
      localStorage.removeItem(`savedMealSelection_${userKey}`);
      localStorage.removeItem(suggestionKey);

      localStorage.setItem(dateKey, today);
    }

    const targets = calculateNutritionTargets(userProfile);

    setMacroTargets(targets);

    setMicroTargets({
      iron: targets?.iron || 18,
      calcium: targets?.calcium || 1000,
      vitaminC: targets?.vitaminC || 90,
    });

    const goal = userProfile?.goal?.toString().toLowerCase().trim();
    const level = userProfile?.level?.toString().toLowerCase().trim();
    const dietPreference = userProfile?.dietPreference
      ?.toString()
      .toLowerCase()
      .trim();

    // profile validation
    if (!goal || !level || !dietPreference) {
      console.warn("User profile incomplete:", userProfile);
      return;
    }

    // fetch meal plan
    console.log("Fetching meal:", goal, level, dietPreference);

    getMealByGoalLevel(goal, level, dietPreference)
      .then((res) => {
        setMeal(res.data);
      })
      .catch((err) => {
        console.error("Meal fetch error:", err);
      });

    searchFood("").then((res) => {
      setRecommendationFoods(res.data);
    });

    const saved = JSON.parse(
      localStorage.getItem(`savedMealSelection_${userKey}`)
    );

    if (saved) setSelectedFoods(saved);

    const savedLock = localStorage.getItem(suggestionKey);

    if (savedLock === "true") {
      setSuggestionsLocked(true);
    }
  }, []);
  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      searchFood(searchQuery).then((res) => {
        setSearchResults(res.data);
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const isMacrosCompleted = (totals) => {
    return (
      totals.calories >= macroTargets.calories &&
      totals.protein >= macroTargets.protein &&
      totals.carbs >= macroTargets.carbs &&
      totals.fats >= macroTargets.fats
    );
  };
  const isCaloriesProteinCompleted = (totals) => {
    return (
      totals.calories >= macroTargets.calories &&
      totals.protein >= macroTargets.protein
    );
  };

  /* ================= SCALE ================= */

  const scale = (food) => {
    const grams = food.grams || food.quantity || 100;
    const factor = grams / 100;
  
    // 🔥 DEBUG (ek baar check kar)
    console.log("FOOD DATA 👉", food);
  
    const getVal = (...keys) => {
      for (let key of keys) {
        if (key !== undefined && key !== null) return key;
      }
      return 0;
    };
  
    return {
      calories: getVal(food.calories, food.caloriesPer100g) * factor,
  
      protein: getVal(
        food.protein,
        food.proteinPer100g,
        food.proteins
      ) * factor,
  
      carbs: getVal(
        food.carbs,
        food.carbsPer100g,
        food.carbohydrates
      ) * factor,
  
      fats: getVal(
        food.fats,
        food.fatsPer100g,
        food.fat
      ) * factor,
  
      iron: getVal(
        food.iron,
        food.ironPer100g,
        food.minerals?.iron
      ) * factor,
  
      calcium: getVal(
        food.calcium,
        food.calciumPer100g,
        food.minerals?.calcium
      ) * factor,
  
      vitaminC: getVal(
        food.vitaminC,
        food.vitaminCPer100g,
        food.vitamins?.vitaminC,
        food.vitamin_c
      ) * factor,
    };
  };

  /* ================= TOTAL NUTRITION ================= */

  const totalNutrition = useMemo(() => {
    return selectedFoods.reduce(
      (acc, food) => {
        const s = scale(food);
        acc.calories += s.calories;
        acc.protein += s.protein;
        acc.carbs += s.carbs;
        acc.fats += s.fats;
        acc.iron += s.iron;
        acc.calcium += s.calcium;
        acc.vitaminC += s.vitaminC;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        iron: 0,
        calcium: 0,
        vitaminC: 0,
      }
    );
  }, [selectedFoods]);

  useEffect(() => {
    if (!meal || !macroTargets) return;

    const sections = [
      { key: "breakfast" },
      { key: "morningSnacks" },
      { key: "lunch" },
      { key: "eveningSnacks" },
      { key: "dinner" },
    ];

    const totalMeals = sections.length;

    const mealsCompleted = sections.filter((section) =>
      selectedFoods.some((f) => f.sectionKey === section.key)
    ).length;

    let level = "low";

    const percent = (totalNutrition.calories / macroTargets.calories) * 100;

    if (percent > 80) level = "high";
    else if (percent > 50) level = "medium";

    const data = {
      mealsCompleted,
      totalMeals,
      calories: Math.round(totalNutrition.calories),
      level,
    };

    const userKey = localStorage.getItem("userKey");

    if (userKey) {
      localStorage.setItem(`dailyNutrition_${userKey}`, JSON.stringify(data));

      // dashboard card update
      window.dispatchEvent(new Event("storage"));
    }
  }, [selectedFoods, totalNutrition, meal, macroTargets]);

  /* ================= DEFICIT ================= */

  const nutritionDeficit = useMemo(() => {
    if (!macroTargets || !microTargets) return null;
    return {
      calories: Math.max(0, macroTargets.calories - totalNutrition.calories),
      protein: Math.max(0, macroTargets.protein - totalNutrition.protein),
      carbs: Math.max(0, macroTargets.carbs - totalNutrition.carbs),
      fats: Math.max(0, macroTargets.fats - totalNutrition.fats),
      iron: Math.max(0, microTargets.iron - totalNutrition.iron),
      calcium: Math.max(0, microTargets.calcium - totalNutrition.calcium),
      vitaminC: Math.max(0, microTargets.vitaminC - totalNutrition.vitaminC),
    };
  }, [totalNutrition, macroTargets, microTargets]);

  //Nutrition Percent

  const nutritionPercent = useMemo(() => {
    if (!macroTargets || !microTargets) return null;

    return {
      calories: (totalNutrition.calories / macroTargets.calories) * 100,
      protein: (totalNutrition.protein / macroTargets.protein) * 100,
      carbs: (totalNutrition.carbs / macroTargets.carbs) * 100,
      fats: (totalNutrition.fats / macroTargets.fats) * 100,

      iron: (totalNutrition.iron / microTargets.iron) * 100,
      calcium: (totalNutrition.calcium / microTargets.calcium) * 100,
      vitaminC: (totalNutrition.vitaminC / microTargets.vitaminC) * 100,
    };
  }, [totalNutrition, macroTargets, microTargets]);

  /* ================= NUTRITION PROGRESS SAVE ================= */

  useEffect(() => {
    if (!macroTargets || !totalNutrition) return;

    const calorieProgress = totalNutrition.calories / macroTargets.calories;

    const proteinProgress = totalNutrition.protein / macroTargets.protein;

    const nutritionProgress = Math.min(
      (calorieProgress + proteinProgress) / 2,
      1
    );

    const userKey = localStorage.getItem("userKey");

    if (userKey) {
      localStorage.setItem(`nutritionPercent_${userKey}`, nutritionProgress);
    }
  }, [totalNutrition, macroTargets]);

  /* ================= ADD FOOD (FIXED) ================= */

  const addFoodToSection = (food, sectionKey = null) => {
    const finalSection = sectionKey || activeSection;
  
    const newFoodItem = {
      ...food,
      grams: Number(tempGrams),
      sectionKey: finalSection,
      instanceId: Date.now() + Math.random(),
      isCustom: true,
    };
  
    setSelectedFoods((prev) => {
      const updatedFoods = [...prev, newFoodItem];
    
      const newTotals = updatedFoods.reduce(
        (acc, f) => {
          const s = scale(f);
          acc.calories += s.calories;
          acc.protein += s.protein;
          acc.carbs += s.carbs;
          acc.fats += s.fats;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );
    
      if (isMacrosCompleted(newTotals)) {
        const allIds = recommendationFoods.map((f) => f._id);
        setUsedSuggestedFoods(allIds);
      } else {
        if (food?._id) {
          setUsedSuggestedFoods((prevUsed) => [...prevUsed, food._id]);
        }
      }
    
      return updatedFoods;
    });
  
    // ⭐ OLD logic (optional - rehne de)
    if (finalSection && !recommendationUsedSections.includes(finalSection)) {
      setRecommendationUsedSections((prev) => [...prev, finalSection]);
    }
  
    setShowPopup(false);
    setSearchQuery("");
    setTempGrams(100);
  };

  const updateGrams = (id, val) => {
    const grams = Number(val);
    if (grams < 1) return;

    setSelectedFoods((prev) =>
      prev.map((f) => (f.instanceId === id ? { ...f, grams } : f))
    );
  };

  //Remove Food
  const removeFood = (id) => {
    setSelectedFoods((prev) => {
      const foodToRemove = prev.find((f) => f.instanceId === id);
  
      const updatedFoods = prev.filter((f) => f.instanceId !== id);
  
      if (foodToRemove?._id) {
        const newTotals = updatedFoods.reduce(
          (acc, food) => {
            const s = scale(food);
            acc.calories += s.calories;
            acc.protein += s.protein;
            acc.carbs += s.carbs;
            acc.fats += s.fats;
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
  
        const macrosCompleted = isMacrosCompleted(newTotals);
  
        if (!macrosCompleted) {
          setUsedSuggestedFoods((prevUsed) =>
            prevUsed.filter((fid) => fid !== foodToRemove._id)
          );
        } else {
          setUsedSuggestedFoods(recommendationFoods.map((f) => f._id));
        }
      }
  
      const userKey = localStorage.getItem("userKey");
  
      if (userKey) {
        localStorage.removeItem(`suggestionsLocked_${userKey}`);
      }
  
      setSuggestionsLocked(false);
  
      return updatedFoods;
    });
  };

  const toggleDefaultFood = (item, sectionKey) => {
    const selected = selectedFoods.find(
      (f) => !f.isCustom && f.sectionKey === sectionKey && f.name === item.name
    );
  
    if (selected) {
      removeFood(selected.instanceId);
    } else {
      setSelectedFoods((prev) => [
        ...prev,
        {
          ...item,
  
          // 🔥 FIX: fallback nutrition values (jab API me 0 aaye)
          carbs:
            item.carbs ||
            item.carbsPer100g ||
            item.carbohydrates ||
            0,
  
          fats:
            item.fats ||
            item.fatsPer100g ||
            item.fat ||
            0,
  
          iron:
            item.iron ||
            item.ironPer100g ||
            item.minerals?.iron ||
            0,
  
          calcium:
            item.calcium ||
            item.calciumPer100g ||
            item.minerals?.calcium ||
            0,
  
          vitaminC:
            item.vitaminC ||
            item.vitaminCPer100g ||
            item.vitamins?.vitaminC ||
            item.vitamin_c ||
            0,
  
          grams: item.quantity || 100,
          sectionKey,
          instanceId: Date.now() + Math.random(),
          isCustom: false,
        },
      ]);
    }
  };

  const handleSubmit = () => {
    const userKey = localStorage.getItem("userKey");
    const suggestionKey = `suggestionsLocked_${userKey}`;
  
    localStorage.setItem(
      `savedMealSelection_${userKey}`,
      JSON.stringify(selectedFoods)
    );
  
    localStorage.setItem(suggestionKey, "true");
  
    updateGoalProgress();
  
    setSuggestionsLocked(true);
  
    if (isMacrosCompleted(totalNutrition)) {
      const allSuggestedIds = recommendationFoods.map((f) => f._id);
      setUsedSuggestedFoods(allSuggestedIds);
    }
  
    alert("Meal Saved ✅");
    navigate("/dashboard");
  };

  const handleReset = () => {
    setSelectedFoods([]);
    setRecommendationUsedSections([]);
    setUsedSuggestedFoods([]);

    const userKey = localStorage.getItem("userKey");

    localStorage.removeItem(`savedMealSelection_${userKey}`);
    localStorage.removeItem(`suggestionsLocked_${userKey}`);

    setSuggestionsLocked(false);
  };

  /* ================= GLOBAL MEAL COMPLETION CHECK ================= */

  const isAllMealsCompleted = () => {
    if (!meal) return false;

    const sections = [
      { key: "breakfast", data: meal.breakfast },
      { key: "morningSnacks", data: meal.morningSnacks },
      { key: "lunch", data: meal.lunch },
      { key: "eveningSnacks", data: meal.eveningSnacks },
      { key: "dinner", data: meal.dinner },
    ];

    return sections.every((section) => {
      if (!section.data || section.data.length === 0) return false;

      const selectedDefaultCount = selectedFoods.filter(
        (f) => !f.isCustom && f.sectionKey === section.key
      ).length;

      return selectedDefaultCount === section.data.length;
    });
  };

  /* ================= MEAL CALORIES ================= */

  const getMealCalories = (sectionKey) => {
    return selectedFoods
      .filter((f) => f.sectionKey === sectionKey)
      .reduce((acc, f) => acc + scale(f).calories, 0);
  };

  /* ================= PRIORITY NUTRIENT ================= */

  const getPriorityNutrient = () => {
    if (!nutritionPercent) return null;

    // ⭐ calories high but protein low
    if (nutritionPercent.calories > 70 && nutritionPercent.protein < 70)
      return "protein";

    if (nutritionPercent.protein < 60) return "protein";

    if (nutritionPercent.carbs < 60) return "carbs";

    if (nutritionPercent.fats < 60) return "fats";

    if (nutritionPercent.iron < 60) return "iron";

    if (nutritionPercent.calcium < 60) return "calcium";

    if (nutritionPercent.vitaminC < 60) return "vitaminC";

    return "balanced";
  };

  /* ================= SECTION BASED RECOMMEND ================= */

  //  SAME CODE AS YOURS — ONLY FIX APPLIED

const getSectionRecommendations = (sectionKey, foods) => {
  if (suggestionsLocked) return [];

  if (!nutritionDeficit || !macroTargets || !microTargets) return [];

  if (!isAllMealsCompleted()) return [];

  //  FIXED LINE
  if (isCaloriesProteinCompleted(totalNutrition)) return [];

  const mealCalories = getMealCalories(sectionKey);

  if (mealCalories > 800) return [];

  const priority = getPriorityNutrient();

  return foods
    .map((food) => {
      if (usedSuggestedFoods.includes(food._id)) return null;

      const protein = food.protein ?? food.proteinPer100g ?? 0;
      const carbs = food.carbs ?? food.carbsPer100g ?? 0;
      const fats = food.fats ?? food.fatsPer100g ?? 0;
      const calories = food.calories ?? food.caloriesPer100g ?? 0;
      const iron = food.iron ?? food.ironPer100g ?? 0;
      const calcium = food.calcium ?? food.calciumPer100g ?? 0;
      const vitaminC = food.vitaminC ?? food.vitaminCPer100g ?? 0;

      let score = 0;

      if (priority === "protein" && nutritionDeficit.protein > 0)
        score += protein * 6;

      if (priority === "carbs" && nutritionDeficit.carbs > 0)
        score += carbs * 4;

      if (priority === "fats" && nutritionDeficit.fats > 0)
        score += fats * 4;

      if (priority === "iron" && nutritionDeficit.iron > 0)
        score += iron * 3;

      if (priority === "calcium" && nutritionDeficit.calcium > 0)
        score += calcium * 3;

      if (priority === "vitaminC" && nutritionDeficit.vitaminC > 0)
        score += vitaminC * 3;

      if (nutritionDeficit.protein > 0) score += protein * 1.5;
      if (nutritionDeficit.carbs > 0) score += carbs * 0.5;
      if (nutritionDeficit.fats > 0) score += fats * 0.3;

      if (nutritionDeficit.calories > 0)
        score += Math.min(calories, nutritionDeficit.calories) * 0.05;

      return { ...food, score };
    })
    .filter((food) => food && food.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
};

  /* ================= SMART GRAMS ================= */

  const calculateSmartGrams = (food) => {
    if (!nutritionDeficit) return 0;

    let grams = 250;

    if (food.protein > 0 && nutritionDeficit.protein > 0)
      grams = Math.min(grams, (nutritionDeficit.protein / food.protein) * 100);

    if (food.iron > 0 && nutritionDeficit.iron > 0)
      grams = Math.min(grams, (nutritionDeficit.iron / food.iron) * 100);

    if (food.vitaminC > 0 && nutritionDeficit.vitaminC > 0)
      grams = Math.min(
        grams,
        (nutritionDeficit.vitaminC / food.vitaminC) * 100
      );

    if (food.calcium > 0 && nutritionDeficit.calcium > 0)
      grams = Math.min(grams, (nutritionDeficit.calcium / food.calcium) * 100);

    if (!isFinite(grams) || grams <= 0) return 0;

    return Math.max(10, Math.min(Math.round(grams), 250));
  };

  if (!meal || !macroTargets) return null;

  const sections = [
    { title: "Breakfast", key: "breakfast", data: meal.breakfast },
    { title: "Morning Snacks", key: "morningSnacks", data: meal.morningSnacks },
    { title: "Lunch", key: "lunch", data: meal.lunch },
    { title: "Evening Snacks", key: "eveningSnacks", data: meal.eveningSnacks },
    { title: "Dinner", key: "dinner", data: meal.dinner },
  ];

  return (
    <div className="meal-wrapper">
      <h1>Daily Meal Plan</h1>

      {sections.map((section) => {
        const recommendations = getSectionRecommendations(
          section.key,
          recommendationFoods
        );

        return (
          <div key={section.key} className="meal-section">
            <div className="meal-header-row">
              <h3>{section.title}</h3>

              <button
                className="add-food-btn"
                onClick={() => {
                  setActiveSection(section.key);
                  setShowPopup(true);
                }}
              >
                + Add
              </button>
            </div>

            {/* DEFAULT FOODS */}

            {section.data?.map((item, index) => {
              const selected = selectedFoods.find(
                (f) =>
                  !f.isCustom &&
                  f.sectionKey === section.key &&
                  f.name === item.name
              );

              return (
                <div
  key={index}
  className="meal-box"
  onClick={() => toggleDefaultFood(item, section.key)}
>
  <input
    type="checkbox"
    checked={!!selected}
    onChange={() => toggleDefaultFood(item, section.key)}
    onClick={(e) => e.stopPropagation()}  // 🔥 IMPORTANT
  />

                  <div>
                    <strong>{item.name}</strong>

                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {/* Iron: {item.iron ?? 0} |
                      Calcium: {item.calcium ?? 0} |
                      Vitamin C: {item.vitaminC ?? 0} */}
                    </div>
                  </div>

                  {selected && (
                    <div className="qty-pill">
                      <button
                        onClick={() =>
                          updateGrams(selected.instanceId, selected.grams - 10)
                        }
                      >
                        −
                      </button>

                      <span>{selected.grams}g</span>

                      <button
                        onClick={() =>
                          updateGrams(selected.instanceId, selected.grams + 10)
                        }
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* CUSTOM FOODS */}

            {selectedFoods
              .filter((f) => f.sectionKey === section.key && f.isCustom)
              .map((item) => (
                <div key={item.instanceId} className="meal-box">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => removeFood(item.instanceId)}
                  />

                  <div>
                    <strong>{item.name}</strong>

                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {/* Iron: {item.iron ?? 0} |
                      Calcium: {item.calcium ?? 0} |
                      Vitamin C: {item.vitaminC ?? 0} */}
                    </div>
                  </div>

                  <div className="qty-pill">
                    <button
                      onClick={() =>
                        updateGrams(item.instanceId, item.grams - 10)
                      }
                    >
                      −
                    </button>

                    <span>{item.grams}g</span>

                    <button
                      onClick={() =>
                        updateGrams(item.instanceId, item.grams + 10)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

            {/* SECTION RECOMMENDATION */}

            {recommendations.length > 0 && (
              <div className="section-recommend">
                <h4>Suggested for {section.title}</h4>

                {recommendations.map((food) => {
                  const grams = calculateSmartGrams(food);

                  return (
                    <div key={food._id} className="meal-box">
                      <strong>{food.name}</strong>

                      <span style={{ marginLeft: "10px" }}>
                        {grams}g recommended
                      </span>

                      <button
                        onClick={() => {
                          setTempGrams(grams);
                          addFoodToSection(food, section.key);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* POPUP */}

      {showPopup && (
        <div className="food-popup">
          <input
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <input
            type="number"
            value={tempGrams}
            onChange={(e) => setTempGrams(e.target.value)}
            placeholder="grams"
          />

          {searchResults.map((food) => (
            <div key={food._id} className="meal-box">
              {food.name}

              <button onClick={() => addFoodToSection(food)}>Add</button>
            </div>
          ))}

          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}

      {/* BUTTONS */}

      <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Meal
        </button>

        <button
          className="submit-btn"
          style={{ background: "#333" }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* NUTRITION SUMMARY */}

      <div className="nutrition">
        <p>
          Calories: {totalNutrition.calories.toFixed(1)} /{" "}
          {macroTargets.calories}
        </p>

        <p>
          Protein: {totalNutrition.protein.toFixed(1)} / {macroTargets.protein}
        </p>

        <p>
          Carbs: {totalNutrition.carbs.toFixed(1)} / {macroTargets.carbs}
        </p>

        <p>
          Fats: {totalNutrition.fats.toFixed(1)} / {macroTargets.fats}
        </p>

        {microTargets && (
          <>
            <p>
              Iron: {totalNutrition.iron.toFixed(1)} / {microTargets.iron}
            </p>

            <p>
              Calcium: {totalNutrition.calcium.toFixed(1)} /{" "}
              {microTargets.calcium}
            </p>

            <p>
              Vitamin C: {totalNutrition.vitaminC.toFixed(1)} /{" "}
              {microTargets.vitaminC}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Meal;
