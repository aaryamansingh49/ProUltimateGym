import Food from "../models/Food.js";

/* 🔥 Add Custom Food */
export const addFood = async (req,res)=>{
    try{
      const food = new Food(req.body);
      await food.save();
      res.status(201).json(food);
    }catch(err){
      res.status(500).json({error:err.message});
    }
  };

/* 🔥 Search Food */
export const searchFood = async (req, res) => {
  try {
    const { query } = req.query;

    let foods;

    if (!query) {
      // ⭐ Return all foods for recommendation system
      foods = await Food.find().limit(100);
    } else {
      foods = await Food.find({
        name: { $regex: query, $options: "i" },
      }).limit(20);
    }

    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};