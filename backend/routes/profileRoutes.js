import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import upload from "../middleware/uploadPhoto.js";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", userAuthMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId });

    const user = await User.findById(req.userId).select(
      "firstName lastName profilePhoto"
    );

    res.json({
      success: true,
      profile, // height, weight, bmi
      user: {
        name: `${user.firstName} ${user.lastName}`,
        profilePhoto: user.profilePhoto, // 🔥 PHOTO
      },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.post("/", userAuthMiddleware, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const user = await User.findById(req.userId);
    const profileImage = req.file ? req.file.path : null;

    let name = req.body.name;

    if (!name) {
      name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    const {
      age,
      height,
      weight,
      goal,
      gender,
      level,
      targetWeight,
      goalDuration,
      activityLevel,
      workoutPreference,
      dietPreference,
      focusArea,
    } = req.body;

    if (!age || !height || !weight || !goal) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const bmi = (weight / (height / 100) ** 2).toFixed(2);

    let profile = await UserProfile.findOne({ userId: req.userId });

    if (profile) {
      //Update existing profile
      profile.profileImage = profileImage;
      profile.name = name;
      profile.age = age;
      profile.height = height;
      profile.weight = weight;
      profile.goal = goal;
      profile.gender = gender;
      profile.level = level;
      profile.bmi = bmi;
      profile.targetWeight = targetWeight;
      profile.goalDuration = goalDuration;
      profile.activityLevel = activityLevel;
      profile.workoutPreference = workoutPreference;
      profile.dietPreference = dietPreference;
      profile.focusArea = focusArea;

      await profile.save();
    } else {
      // 🆕 Create new profile (order maintained)
      profile = new UserProfile({
        userId: req.userId,
        profileImage,
        name,
        age,
        height,
        weight,
        bmi,
        goal,
        gender,
        level,
        targetWeight,
        goalDuration,
        activityLevel,
        workoutPreference,
        dietPreference,
        focusArea,
      });

      await profile.save();
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Profile save failed",
    });
  }
});

export default router;
