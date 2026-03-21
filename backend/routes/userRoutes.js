import express from "express";
import UserController from "../controller/userController.js";


const router = express.Router();

// Signup route
router.post("/signup", UserController.createUserDoc);

// Login route
router.post("/login", UserController.verifyLogin);

router.post("/send-otp", UserController.sendLoginOtp);
router.post("/verify-otp", UserController.verifyLoginOtp);


export default router;
