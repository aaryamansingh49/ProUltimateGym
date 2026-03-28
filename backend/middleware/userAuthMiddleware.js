import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const userAuthMiddleware = (req, res, next) => {
  console.log("📩 AUTH HEADER:", req.headers.authorization);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ IMPORTANT FIX (jwt malformed prevent)
    if (!token || token === "undefined" || token === "null") {
      console.log("❌ INVALID TOKEN RECEIVED:", token);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔍 DECODED 👉", decoded);

    let userId = decoded._id || decoded.id;

    if (userId && typeof userId !== "string") {
      userId = userId.toString();
    }

    console.log("✅ USER ID FINAL 👉", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ INVALID USER ID:", userId);

      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    req.userId = userId;
    req.user = decoded;

    next();
  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default userAuthMiddleware;