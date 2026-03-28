import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import upload from "../middleware/uploadPhoto.js";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";

const router = express.Router();


// ✅ GET PROFILE
router.get("/", userAuthMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId });

    const user = await User.findById(req.userId).select(
      "firstName lastName"
    );

    res.json({
      success: true,
      profile,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        profileImage: profile?.profileImage || null, // ✅ FIXED
      },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// CREATE / UPDATE PROFILE (WITH IMAGE)
router.post(
  "/",
  userAuthMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      // console.log("BODY:", req.body);
      // console.log("FILE:", req.file);

      const user = await User.findById(req.userId);

      // SAFE NUMBER CONVERSION
      const safeNumber = (val) => {
        return val && val !== "NaN" ? Number(val) : undefined;
      };

      const age = safeNumber(req.body.age);
      const height = safeNumber(req.body.height);
      const weight = safeNumber(req.body.weight);
      const targetWeight = safeNumber(req.body.targetWeight);

      const {
        goal,
        gender,
        level,
        goalDuration,
        activityLevel,
        workoutPreference,
        dietPreference,
        focusArea,
      } = req.body;

      //  IMAGE PATH
      const profileImage = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      //  NAME HANDLE
      let name = req.body.name;
      if (!name) {
        name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      }

      // PROFILE FIND (IMPORTANT - pehle karo)
      let profile = await UserProfile.findOne({ userId: req.userId });

      //  VALIDATION (only for new profile)
      if (!profile && (!age || !height || !weight || !goal)) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      //  BMI SAFE CALCULATION
      let bmi = profile?.bmi || 0;
      if (height && weight) {
        bmi = (weight / (height / 100) ** 2).toFixed(2);
      }

      // UPDATE PROFILE
      if (profile) {
        if (profileImage) profile.profileImage = profileImage;

        if (name) profile.name = name;
        if (age) profile.age = age;
        if (height) profile.height = height;
        if (weight) profile.weight = weight;
        if (goal) profile.goal = goal;
        if (gender) profile.gender = gender;
        if (level) profile.level = level;
        if (bmi) profile.bmi = bmi;
        if (targetWeight) profile.targetWeight = targetWeight;
        if (goalDuration) profile.goalDuration = goalDuration;
        if (activityLevel) profile.activityLevel = activityLevel;
        if (workoutPreference)
          profile.workoutPreference = workoutPreference;
        if (dietPreference) profile.dietPreference = dietPreference;
        if (focusArea) profile.focusArea = focusArea;

        await profile.save();
      }

     
      //  CREATE PROFILE

      else {
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
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Profile save failed",
      });
    }
  }
);

export default router;