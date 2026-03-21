import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String
    },
    

    age: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    bmi: {
      type: Number,
      required: true,
    },

    goal: {
      type: String,
      enum: ["Fat Loss", "Muscle Gain", "Bulking"],
      required: true,
    },

    
    
    targetWeight: {
      type: Number
    },
    
    goalDuration: {
      type: String
    },

    activityLevel: {
      type: String
    },

    workoutPreference: {
      type: String
    },

    dietPreference: {
      type: String,
      enum: ["veg", "non-veg", "keto", "balanced", "vegan"],
      required: true
    },
    focusArea: {
      type: String
    },
    
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },


    // ⭐ NEW FIELD (IMPORTANT)
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    profileCompleted: {
      type: Boolean,
      default: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
