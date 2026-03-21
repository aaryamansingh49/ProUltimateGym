import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
});

const workoutPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true, 
  },
  muscleGroup: {
    type: String,
    required: true, 
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  exercises: [exerciseSchema],
}, { timestamps: true });

// ⭐ IMPORTANT — prevent duplicate day + level
workoutPlanSchema.index(
  { day: 1, level: 1 },
  { unique: true }
);

export default mongoose.model("WorkoutPlan", workoutPlanSchema);
