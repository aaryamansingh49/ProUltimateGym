import mongoose from "mongoose";

/* 🔥 reusable meal item schema */

const mealItemSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  calories: {
    type: Number,
    default: 0
  },

  protein: {
    type: Number,
    default: 0
  },

  fats: {
    type: Number,
    default: 0
  },

  carbs: {
    type: Number,
    default: 0
  },

  iron: {
    type: Number,
    default: 0
  },

  calcium: {
    type: Number,
    default: 0
  },

  vitaminC: {
    type: Number,
    default: 0
  },

  quantity: {
    type: Number,
    default: 100   // grams
  }

}, { _id: false });


/* 🔥 main meal schema */

const mealSchema = new mongoose.Schema({

  goal: {
    type: String,
    enum: ["fat loss", "muscle gain", "bulking"],
    required: true,
    lowercase: true,
    trim: true
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
    lowercase: true,
    trim: true
  },

  dietPreference: {
    type: String,
    enum: ["veg", "non-veg", "keto", "balanced", "vegan"],
    required: true,
    lowercase: true,
    trim: true
  },

  breakfast: {
    type: [mealItemSchema],
    default: []
  },

  morningSnacks: {
    type: [mealItemSchema],
    default: []
  },

  lunch: {
    type: [mealItemSchema],
    default: []
  },

  eveningSnacks: {
    type: [mealItemSchema],
    default: []
  },

  dinner: {
    type: [mealItemSchema],
    default: []
  }

}, {
  timestamps: true
});


/* 🔥 Prevent duplicate meal plans */

mealSchema.index(
  { goal: 1, level: 1, dietPreference: 1 },
  { unique: true }
);


export default mongoose.model("Meal", mealSchema);