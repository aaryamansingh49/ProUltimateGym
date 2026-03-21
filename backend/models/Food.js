import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  /* 🔥 MACROS PER 100g (IMPORTANT) */

  caloriesPer100g: {
    type: Number,
    default: 0
  },

  proteinPer100g: {
    type: Number,
    default: 0
  },

  fatsPer100g: {
    type: Number,
    default: 0
  },

  carbsPer100g: {
    type: Number,
    default: 0
  },

  /* 🔥 MICRO NUTRIENTS */

  ironPer100g: {
    type: Number,
    default: 0
  },

  calciumPer100g: {
    type: Number,
    default: 0
  },

  vitaminCPer100g: {
    type: Number,
    default: 0
  },

  /* 🔥 DEFAULT SERVING */

  defaultServingGrams: {
    type: Number,
    default: 100
  },

  category: {
    type: String,
    default: "general"
  },

  createdBy: {
    type: String,
    default: "admin"
  }

},{ timestamps:true });

export default mongoose.model("Food", foodSchema);