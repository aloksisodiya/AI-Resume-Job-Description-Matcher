import fs from "fs/promises";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import Resume from "../models/Resume.model.js";

export const uploadResume = async (req, res) => {
  let extractedText = "";

  try {
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // PDF parsing
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = await fs.readFile(req.file.path);
      const uint8Array = new Uint8Array(dataBuffer);
      const { text } = await extractText(uint8Array);
      extractedText = String(text || "");
    }
    // DOC / DOCX parsing
    else if (
      req.file.mimetype === "application/msword" ||
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        path: req.file.path,
      });
      extractedText = result.value;
    }
    // TXT parsing
    else if (req.file.mimetype === "text/plain") {
      extractedText = await fs.readFile(req.file.path, "utf-8");
    }
    // Unsupported file type
    else {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        message: "Unsupported file type",
        supported: ["PDF", "DOC", "DOCX", "TXT"],
      });
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        message:
          "Could not extract text from the file. The file may be empty or corrupted.",
      });
    }

    // Check for duplicate resume (optional - prevent uploading same content)
    const existingResume = await Resume.findOne({
      userId: req.user.id,
      processingStatus: "PROCESSED",
    }).sort({ createdAt: -1 });

    // If user already has a resume, update it instead of creating new one
    let resume;
    if (existingResume) {
      existingResume.fileMeta = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
      existingResume.rawText = extractedText;
      existingResume.updatedAt = new Date();
      resume = await existingResume.save();
    } else {
      // Create new resume
      resume = await Resume.create({
        userId: req.user.id,
        fileMeta: {
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        rawText: extractedText,
        processingStatus: "PROCESSED",
      });
    }

    // DELETE FILE AFTER SUCCESS
    await fs.unlink(req.file.path);

    return res.status(200).json({
      message: existingResume
        ? "Resume updated & processed successfully"
        : "Resume uploaded & processed successfully",
      resumeId: resume._id,
      preview: extractedText.substring(0, 300),
      wordCount: extractedText.split(/\s+/).filter((word) => word.length > 0)
        .length,
      isUpdate: !!existingResume,
    });
  } catch (error) {
    console.error("Resume processing error:", error);

    // CLEANUP IF ERROR OCCURS
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("File cleanup failed:", unlinkError);
      }
    }

    return res.status(500).json({
      message: "Resume processing failed",
      error: error.message,
    });
  }
};
