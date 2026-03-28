import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import connectDB from "./db/connectDB.js";

import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import userDashboardRouter from "./routes/user-dashboard.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import uploadRoutes from "./routes/uploadPhoto.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
//workout dashboard
import workoutRoutes from "./routes/workoutRoutes.js";
import userWorkoutRoutes from "./routes/userWorkoutRoutes.js";
//meal
import mealRoutes from "./routes/mealRoutes.js";
//food library
import foodRoutes from "./routes/foodRoutes.js";
import Stripe from "stripe";

dotenv.config();

const app = express();

/* MIDDLEWARES */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://proultimategym-by-aaryaman.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* DATABASE*/
connectDB();

/*STRIPE */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
});

/* =======================
   ROUTES
======================= */
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", membershipRoutes);
app.use("/api", userDashboardRouter);
app.use("/api", chatbotRoutes);
app.use("/api", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api", workoutRoutes);
app.use("/api", userWorkoutRoutes);
app.use("/api", mealRoutes);
app.use("/api", foodRoutes);


/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
