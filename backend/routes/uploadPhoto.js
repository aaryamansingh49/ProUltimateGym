// routes/uploadProfilePhoto.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

// Ensure uploads dir exists
const uploadDir = path.join(process.cwd(), "uploads", "profilePhotos");
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// POST /api/upload-profile-photo
router.post(
  "/upload-profile-photo",
  userAuthMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const photoPath = `/uploads/profilePhotos/${req.file.filename}`;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // delete old photo if exists
      if (user.profilePhoto) {
        const oldPath = path.join(process.cwd(), user.profilePhoto.replace("/", ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.profilePhoto = photoPath;
      await user.save();

      res.json({
        success: true,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

export default router;