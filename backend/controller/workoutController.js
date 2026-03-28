import WorkoutPlan from "../models/WorkoutPlan.js";
import UserProfile from "../models/UserProfile.js";
import Membership from "../models/Membership.js";
import User from "../models/User.js";

/* HELPER: CHECK ACTIVE MEMBERSHIP */
const getActiveMembership = async (email) => {
  const memberships = await Membership.find({
    email: email.trim().toLowerCase(),
  });

  const today = new Date();

  for (let m of memberships) {
    const start = new Date(m.startDate);

    let duration = 0;
    if (m.membershipPlan === "Basic") duration = 30;
    if (m.membershipPlan === "Pro") duration = 90;
    if (m.membershipPlan === "Premium") duration = 365;

    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    if (today >= start && today <= end) {
      return m;
    }
  }

  return null;
};

/*  ADMIN – CREATE WORKOUT */
export const createWorkoutPlan = async (req, res) => {
  try {
    const data = {
      ...req.body,
      day: req.body.day?.trim(),
      level: req.body.level?.trim().toLowerCase(), 
    };

    const workout = await WorkoutPlan.create(data);

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* USER – GET WORKOUT */
export const getWorkoutByDay = async (req, res) => {
  try {
    let { day } = req.params;
    const userId = req.userId;

    // console.log(" RAW DAY:", day);

    /* VALID DAY CHECK */
    const validDays = [
      "monday","tuesday","wednesday",
      "thursday","friday","saturday","sunday"
    ];

    if (!day || !validDays.includes(day.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid day value",
      });
    }

    /*  NORMALIZE DAY */
    day = day.trim();

    // console.log(" NORMALIZED DAY:", day);

    /*  GET USER */
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* MEMBERSHIP CHECK */
    const activeMembership = await getActiveMembership(user.email);

    if (!activeMembership) {
      return res.status(403).json({
        message: "Only for active members",
      });
    }

    /* PROFILE CHECK */
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not completed",
      });
    }

    /* NORMALIZE LEVEL */
    const level = userProfile.level?.trim().toLowerCase();

    // console.log("FINAL LEVEL:", level);

    if (!level) {
      return res.status(400).json({
        message: "User level missing",
      });
    }

    /* FINAL QUERY (CASE INSENSITIVE SAFE) */
    const workout = await WorkoutPlan.findOne({
      day: { $regex: new RegExp(`^${day}$`, "i") },
      level: { $regex: new RegExp(`^${level}$`, "i") },
    });

    // console.log("WORKOUT FOUND:", workout);

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found for this level",
      });
    }

    res.status(200).json(workout);

  } catch (error) {
    console.error("GET WORKOUT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};