import express from "express";
import {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
} from "../controllers/analysis.controller.js";
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

// Get analysis history for user
router.get("/history", authenticateToken, getAnalysisHistory);

// Get specific analysis by ID
router.get("/:id", authenticateToken, getAnalysisById);

export default router;
