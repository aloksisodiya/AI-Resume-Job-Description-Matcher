import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    // Resume owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // File metadata (file itself is NOT stored)
    fileMeta: {
      originalName: String,
      mimeType: String,
      size: Number,
    },

    // Extracted resume text
    rawText: {
      type: String,
      required: true,
    },

    // Structured parsed data (optional)
    parsedData: {
      name: String,
      email: String,
      phone: String,

      skills: [String],

      experience: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
        },
      ],

      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
    },

    // AI extracted keywords
    keywords: {
      technical: [String],
      soft: [String],
      tools: [String],
    },

    // Processing state
    processingStatus: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Optional performance index
resumeSchema.index({ userId: 1, createdAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
