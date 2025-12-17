import express from "express";
import userAuth from "../middleware/auth.js";

import {
  login,
  logout,
  register,
  resetPassword,
  sendResetPasswordOtp,
  updateProfile,
} from "../controllers/auth.controller.js";

const auth_router = express.Router();

// Public routes (no authentication required)
auth_router.post("/register", register);
auth_router.post("/login", login);
auth_router.post("/send-pass-otp", sendResetPasswordOtp);
auth_router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
auth_router.post("/logout", userAuth, logout);
auth_router.put("/update-profile", userAuth, updateProfile);

export default auth_router;
