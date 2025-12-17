import express from "express";
import { uploadResume } from "../controllers/resume.controller.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Upload and process resume
router.post(
  "/upload",
  authenticateToken,
  upload.single("resume"),
  uploadResume
);

// Get user's resume
router.get("/my-resume", authenticateToken, async (req, res) => {
  try {
    const Resume = (await import("../models/Resume.model.js")).default;
    const resume = await Resume.findOne({
      userId: req.user.id,
      processingStatus: "PROCESSED",
    }).sort({ updatedAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    return res.status(200).json({
      resumeId: resume._id,
      fileMeta: resume.fileMeta,
      preview: resume.rawText.substring(0, 500),
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(500).json({
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
});

export default router;
