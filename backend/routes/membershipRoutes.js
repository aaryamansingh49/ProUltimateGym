import express from "express";
import Membership from "../models/Membership.js";
import User from "../models/User.js";

const router = express.Router();

/* 🔹 PLAN → DURATION (days) */
const PLAN_DURATION_DAYS = {
  Basic: 30,
  Pro: 90,
  Premium: 365
};

/* 🔹 SAFE STRING → DATE PARSER */
const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

// 🟥 POST: Save membership & update user details
router.post("/membership", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      location,
      membershipPlan,
      startDate,
      selectedTrainer,
      selectedNutritionist,
      totalPrice,
      paymentId,
      purchasedBy
    } = req.body;

    // 🔹 Validate required fields
    if (
      !fullName || !email || !phone || !gender || !dob ||
      !location || !membershipPlan ||
      !totalPrice || !paymentId
    ) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // 🔥 START DATE VALIDATION
const today = new Date();
today.setHours(0,0,0,0);

const selectedDate = parseDateSafe(startDate);

if (!selectedDate) {
  return res.status(400).json({ message: "Invalid start date" });
}

// ❌ past date block
if (selectedDate < today) {
  return res.status(400).json({
    message: "Start date cannot be in the past"
  });
}

// ❌ max 2 months future
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);

if (selectedDate > maxDate) {
  return res.status(400).json({
    message: "Start date can be maximum 2 months ahead"
  });
}


    /* 🔥 CHECK: Already Active Membership (IMPROVED) */
const allMemberships = await Membership.find({ email });

for (let existingMembership of allMemberships) {

  const planDays = PLAN_DURATION_DAYS[existingMembership.membershipPlan];
  const start = parseDateSafe(existingMembership.startDate);

  if (start && planDays) {

    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + planDays);

    // 🔴 ACTIVE → BLOCK
    if (new Date() < endDate) {
      return res.status(400).json({
        success: false,
        message: `You already have an active membership till ${endDate.toDateString()}`
      });
    }
  }
}

    // 🔹 Logic for trainer/nutritionist requirement
    const trainerRequired = membershipPlan === "Pro" || membershipPlan === "Premium";
    const nutritionistRequired = membershipPlan === "Premium";

     /* 🔥 BACKEND FORCED START DATE (STRING) */
     const actualStartDate = new Date().toISOString();


    // 🔹 Create new membership
    const newMembership = new Membership({
      fullName,
      email,
      phone,
      gender,
      dob,
      location,
      membershipPlan,
      startDate: actualStartDate,
      selectedTrainer: trainerRequired ? selectedTrainer : "",
      selectedNutritionist: nutritionistRequired ? selectedNutritionist : "",
      trainerRequired,
      totalPrice,
      paymentId,
      purchasedBy: purchasedBy || "Admin"
    });

 

    await newMembership.save();

    // 🔹 Update user details if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      existingUser.membershipPlan = membershipPlan;
      existingUser.membershipStartDate = actualStartDate;
      existingUser.assignedCoach = trainerRequired ? (selectedTrainer || "No Coach") : "No Coach";
      existingUser.nutritionist = nutritionistRequired ? (selectedNutritionist || "No Nutritionist") : "No Nutritionist";
      await existingUser.save();
    }

    res.status(201).json({
      success: true,
      message: "Membership saved successfully!",
      membership: newMembership,
    });

  } catch (err) {
    console.error("❌ Membership Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});


//  ✅ GET all memberships (for admin dashboard)
router.get("/all-memberships", async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    console.error("❌ Error fetching memberships:", err);
    res.status(500).json({ message: "Server error fetching memberships" });
  }
});


// 🟢 GET: Fetch memberships by user email (NO DUPLICATES)
router.get("/membership-details", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔥 Step 1: Fetch all memberships (latest first)
    const memberships = await Membership.find({ email })
      .sort({ createdAt: -1 });

    if (!memberships.length) {
      return res.status(404).json({
        success: false,
        message: "No memberships found",
      });
    }

    // 🔥 Step 2: Remove duplicates (same plan → keep latest only)
    const uniqueMemberships = [];
    const seenPlans = new Set();

    for (let m of memberships) {
      if (!seenPlans.has(m.membershipPlan)) {
        uniqueMemberships.push(m);
        seenPlans.add(m.membershipPlan);
      }
    }

    // 🔥 Step 3: Send cleaned data
    res.status(200).json({
      success: true,
      count: uniqueMemberships.length,
      memberships: uniqueMemberships,
    });

  } catch (err) {
    console.error("❌ Fetch Membership Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});



// 🟢 CHECK ACTIVE MEMBERSHIP
router.get("/check-active-membership", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const memberships = await Membership.find({ email });

    const today = new Date();

    for (let m of memberships) {
      const start = new Date(m.startDate);

      let duration = 0;
      if (m.membershipPlan === "Basic") duration = 30;
      if (m.membershipPlan === "Pro") duration = 90;
      if (m.membershipPlan === "Premium") duration = 365;

      const end = new Date(start);
      end.setDate(end.getDate() + duration);

      if (today >= start && today < end) {
        return res.json({
          success: true,
          isActive: true,
          validTill: end,
        });
      }
    }

    return res.json({
      success: true,
      isActive: false,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});




export default router;
