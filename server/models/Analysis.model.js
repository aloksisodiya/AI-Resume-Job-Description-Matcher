import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    // User who requested the analysis
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Job description details
    jobDescription: {
      title: {
        type: String,
        required: true,
      },
      company: String,
    },

    // Analysis results
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    // Keyword analysis
    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    // Category-wise scores
    scores: {
      skillsMatch: {
        type: Number,
        min: 0,
        max: 100,
      },
      experienceMatch: {
        type: Number,
        min: 0,
        max: 100,
      },
      educationMatch: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    // AI-generated suggestions
    suggestions: {
      type: [String],
      default: [],
    },

    // Strengths & weaknesses
    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    // Overall analysis status
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Performance indexes
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
