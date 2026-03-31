import express from "express";
import UserController from "../controller/userController.js";


const router = express.Router();

// Signup route
router.post("/signup", UserController.createUserDoc);

// Login route
router.post("/login", UserController.verifyLogin);

router.post("/send-otp", UserController.sendLoginOtp);
router.post("/verify-otp", UserController.verifyLoginOtp);


// ✅ ADD THESE
router.post("/send-reset-otp", UserController.sendResetOtp);
router.post("/verify-reset-otp", UserController.verifyResetOtp);
router.post("/reset-password", UserController.resetPassword);

export default router;
