import UserModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendOtpMail from "../utils/sendOtp.js";
import otpStore from "../utils/otpStore.js";


dotenv.config();

class UserController {

  // ================= SIGNUP =================
  static createUserDoc = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        address,
        phone,
        state,
        city,
      } = req.body;

      if (!firstName || !lastName || !email || !password || !confirmPassword || !state || !city) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        phone,
        state,
        city,
      });

      const savedUser = await newUser.save();

      res.status(201).json({
        message: "Signup successful",
        user: {
          _id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
        },
      });

    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  // ================= PASSWORD LOGIN =================
  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });

    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

   // ================= SEND LOGIN OTP =================
   static sendLoginOtp = async (req, res) => {
    try {
      const { email } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log("LOGIN OTP:", otp);

      // ✅ MEMORY STORE
      otpStore.set(email + "_login", {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      const mailStatus = await sendOtpMail(email, otp);

      if (!mailStatus) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.json({ message: "OTP sent successfully" });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= VERIFY LOGIN OTP =================
  static verifyLoginOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;

      const data = otpStore.get(email + "_login");

      if (!data) {
        return res.status(400).json({ message: "OTP not found" });
      }

      if (data.otp !== otp.toString().trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (data.expiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      otpStore.delete(email + "_login");

      const user = await UserModel.findOne({ email });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user,
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // ================= SEND RESET OTP =================
  static sendResetOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log("RESET OTP:", otp);

      // ✅ MEMORY STORE
      otpStore.set(email + "_reset", {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      const mailStatus = await sendOtpMail(email, otp);

      if (!mailStatus) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.json({ message: "Reset OTP sent" });
  
    } catch (error) {
      res.status(500).json({ message: "Error sending OTP" });
    }
  };

  // ================= VERIFY RESET OTP =================
  static verifyResetOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;

      const data = otpStore.get(email + "_reset");

      if (!data) {
        return res.status(400).json({ message: "OTP not found" });
      }

      if (data.otp !== otp.toString().trim()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (data.expiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      otpStore.delete(email + "_reset");

      res.json({ message: "OTP verified" });

    } catch (error) {
      res.status(500).json({ message: "Error verifying OTP" });
    }
  };

  // ================= RESET PASSWORD =================
  static resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.password = hashedPassword;
  
      await user.save();
  
      res.json({ message: "Password reset successful" });
  
    } catch (error) {
      res.status(500).json({ message: "Error resetting password" });
    }
  };
}

export default UserController;