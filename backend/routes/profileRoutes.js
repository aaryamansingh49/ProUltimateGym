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


// ✅ CREATE / UPDATE PROFILE (WITH IMAGE)
router.post(
  "/",
  userAuthMiddleware,
  upload.single("profileImage"), // 🔥 MULTER
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const user = await User.findById(req.userId);

      // ✅ IMAGE PATH
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

      // ✅ UPDATE PROFILE
      if (profile) {
        if (profileImage) {
          profile.profileImage = profileImage; // 🔥 only update if new image
        }

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
      } 
      
      // ✅ CREATE PROFILE
      else {
        profile = new UserProfile({
          userId: req.userId,
          profileImage, // 🔥 IMPORTANT
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