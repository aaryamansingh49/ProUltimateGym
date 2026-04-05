import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const userAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Invalid token
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 🔐 Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⭐ ONLY id use (MAIN FIX)
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token payload invalid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    // ✅ Attach
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