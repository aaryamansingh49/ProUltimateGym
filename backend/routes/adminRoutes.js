import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Membership from "../models/Membership.js";
import authMiddleware from "../middleware/userMiddleware.js"; 

dotenv.config();
const router = express.Router();

//  Dummy admin credentials
const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = "yeah!yeah";

//  Admin Login Route
router.post("/login", (req, res) => {
  // console.log(" /api/admin/login route hit");
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "2h" }
    );
    return res.json({ success: true, token });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

//  Fetch all memberships for Admin Dashboard
router.get("/all-memberships", authMiddleware, async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    console.error(" Error fetching memberships:", error);
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
});

//  Dynamic Chart Data Route
router.get("/chart-data", authMiddleware, async (req, res) => {
  try {
    //  Monthly Revenue from Membership totalPrice
    const revenueData = await Membership.aggregate([
      {
        $group: {
          _id: { $substr: ["$startDate", 5, 2] }, // month
          revenue: {
            $sum: {
              $add: [
                { $ifNull: ["$totalPrice", 0] },
                { $ifNull: ["$renewalRevenue", 0] },
              ],
            },
          },
        },
      },
      { $sort: { "_id": 1 } },
    ]);
    

    // Member Growth (count of users by month)
    const growthData = await Membership.aggregate([
      {
        $group: {
          _id: { $substr: ["$startDate", 5, 2] },
          users: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Convert month numbers to names
    const monthNames = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
      "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
      "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };

    const revenue = revenueData.map(item => ({
      month: monthNames[item._id] || item._id,
      revenue: item.revenue,
    }));

    const growth = growthData.map(item => ({
      month: monthNames[item._id] || item._id,
      users: item.users,
    }));

    res.json({ revenue, growth });

  } catch (error) {
    console.error(" Error fetching chart data:", error);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
});

//  Fetch All Payments (Admin)
router.get("/payments", authMiddleware, async (req, res) => {
  try {
    const payments = await Membership.find(
      {},
      "fullName email membershipPlan totalPrice paymentId startDate renewalRevenue renewalCount"
    )
      .sort({ startDate: -1 })
      .lean();

    const mapped = payments.map((p) => ({
      ...p,
      totalCollected: (p.totalPrice || 0) + (p.renewalRevenue || 0),
    }));

    res.json(mapped);
  } catch (error) {
    console.error(" Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});


//  Pending renewals & renew actions 

// helper: plan -> months 
const PLAN_DURATION_MONTHS = {
  Basic: 1,
  Pro: 3,
  Premium: 6,
};

// compute endDate from startDate and plan
function computeEndDateFromPlan(startDateStr, membershipPlan) {
  if (!startDateStr) return null;
  const start = new Date(startDateStr);
  if (isNaN(start)) return null;
  const months = PLAN_DURATION_MONTHS[membershipPlan] ?? 0;
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  return end;
}

function daysSince(date) {
  if (!date) return null;
  const now = new Date();
  const diffMs = now - date;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// GET: pending renewals (expired memberships)
router.get('/pending-renewals', authMiddleware, async (req, res) => {
  try {
    // fetch only needed fields for speed
    const raw = await Membership.find({}, 'fullName email phone membershipPlan startDate').lean();

    const today = new Date();

    const expired = raw
      .map(m => {
        const computedEnd = computeEndDateFromPlan(m.startDate, m.membershipPlan);
        return {
          ...m,
          computedEnd,
          daysSinceExpired: computedEnd ? daysSince(computedEnd) : null,
        };
      })
      .filter(m => m.computedEnd && m.computedEnd <= today)
      .sort((a, b) => b.computedEnd - a.computedEnd); 

    // respond with cleaned objects
    const payload = expired.map(m => ({
      id: m._id,
      fullName: m.fullName || '',
      email: m.email || '',
      phone: m.phone || '',
      membershipPlan: m.membershipPlan || '',
      startDate: m.startDate ? new Date(m.startDate).toISOString().slice(0,10) : '',
      endDate: m.computedEnd ? m.computedEnd.toISOString().slice(0,10) : '',
      daysSinceExpired: m.daysSinceExpired,
    }));

    return res.json(payload);
  } catch (err) {
    console.error('Error /api/admin/pending-renewals:', err);
    return res.status(500).json({ error: 'Failed to fetch pending renewals' });
  }
});

// Renew
router.post('/mark-renewed/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ success: false, message: "Membership not found" });
    }

    const todayISO = new Date().toISOString();

    // 1) New cycle
    membership.startDate = todayISO;

    // 2) Renewal revenue update
    const price = membership.totalPrice || 0;
    membership.renewalCount = (membership.renewalCount || 0) + 1;
    membership.renewalRevenue = (membership.renewalRevenue || 0) + price;

    await membership.save();

    return res.json({
      success: true,
      message: "Membership renewed, revenue updated",
      membershipId: id,
      renewalCount: membership.renewalCount,
      renewalRevenue: membership.renewalRevenue,
    });
  } catch (err) {
    console.error("Error /api/admin/mark-renewed/:id", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});




export default router;
