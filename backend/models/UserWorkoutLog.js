import mongoose from "mongoose";

const completedExerciseSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  done: {
    type: Boolean,
    default: false,
  },
});

const userWorkoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },

    type: {                 // ⭐ ADD THIS
      type: String,
      default: "General"
    },
    
    date: {
      type: Date,
      default: Date.now,
    },
    completedExercises: [completedExerciseSchema],
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserWorkoutLog", userWorkoutLogSchema);
