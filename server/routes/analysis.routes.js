import express from "express";
import { analyzeResume } from "../controllers/analysis.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Analyze resume against job description
// Accepts: resume file (required) + jobDescription file or text (required)
router.post(
  "/analyze",
  authenticateToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescription", maxCount: 1 },
  ]),
  analyzeResume
);

export default router;
