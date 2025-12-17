import Analysis from "../models/Analysis.model.js";
import fs from "fs/promises";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import { generateAISuggestions } from "../services/openaiService.js";

/**
 * Extract text from uploaded file (resume or JD)
 */
async function extractTextFromFile(file) {
  let extractedText = "";

  try {
    // PDF parsing
    if (file.mimetype === "application/pdf") {
      const dataBuffer = await fs.readFile(file.path);
      const uint8Array = new Uint8Array(dataBuffer);
      const { text } = await extractText(uint8Array);
      extractedText = String(text || "");
    }
    // DOC / DOCX parsing
    else if (
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    }
    // TXT parsing
    else if (file.mimetype === "text/plain") {
      extractedText = await fs.readFile(file.path, "utf-8");
    }

    return String(extractedText || "").trim();
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}

/**
 * Analyze resume against job description
 * Accepts resume file + JD (text or file), compares, returns results, deletes files
 */
export const analyzeResume = async (req, res) => {
  const filesToCleanup = [];

  try {
    const { jobDescriptionText, jobTitle, company } = req.body;

    // Validate resume file
    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const resumeFile = req.files.resume[0];
    filesToCleanup.push(resumeFile.path);

    // Extract resume text
    const resumeText = await extractTextFromFile(resumeFile);

    if (!resumeText || resumeText.length === 0) {
      await cleanupFiles(filesToCleanup);
      return res.status(400).json({
        message:
          "Could not extract text from resume. File may be empty or corrupted.",
      });
    }

    // Get JD text - either from file or text input
    let jdText = "";

    if (req.files && req.files.jobDescription) {
      // JD provided as file
      const jdFile = req.files.jobDescription[0];
      filesToCleanup.push(jdFile.path);
      jdText = await extractTextFromFile(jdFile);
    } else if (jobDescriptionText) {
      // JD provided as text
      jdText = jobDescriptionText.trim();
    } else {
      await cleanupFiles(filesToCleanup);
      return res.status(400).json({
        message: "Job description (text or file) is required",
      });
    }

    if (!jdText || jdText.length === 0) {
      await cleanupFiles(filesToCleanup);
      return res.status(400).json({
        message:
          "Could not extract text from job description. It may be empty or corrupted.",
      });
    }

    // Perform analysis
    const analysisResults = performAnalysis(resumeText, jdText);

    // Generate AI-powered suggestions and insights
    const missingSkills = analysisResults.missingSkills || [];
    const aiResults = await generateAISuggestions({
      matchPercentage: analysisResults.matchPercentage,
      missingKeywords: analysisResults.missingKeywords,
      missingSkills: missingSkills,
      matchedSkills: analysisResults.matchedSkills || [],
      resumeText: resumeText,
      jdText: jdText,
    });

    // Combine basic analysis with AI suggestions
    const finalResults = {
      ...analysisResults,
      suggestions: aiResults.suggestions,
      insights: aiResults.insights,
    };

    // Optionally save analysis results (without full text) for history
    let analysisId = null;
    if (req.user && req.user.id) {
      const analysis = await Analysis.create({
        userId: req.user.id,
        jobDescription: {
          title: jobTitle || "Untitled Position",
          company: company || "",
        },
        matchPercentage: finalResults.matchPercentage,
        matchedKeywords: finalResults.matchedKeywords,
        missingKeywords: finalResults.missingKeywords,
        scores: finalResults.scores,
        suggestions: finalResults.suggestions,
        strengths: finalResults.strengths,
        weaknesses: finalResults.weaknesses,
        status: "COMPLETED",
      });
      analysisId = analysis._id;
    }

    // Clean up uploaded files
    await cleanupFiles(filesToCleanup);

    return res.status(200).json({
      message: "Analysis completed successfully",
      analysisId: analysisId,
      results: {
        matchPercentage: finalResults.matchPercentage,
        matchedKeywords: finalResults.matchedKeywords,
        missingKeywords: finalResults.missingKeywords,
        scores: finalResults.scores,
        suggestions: finalResults.suggestions,
        insights: finalResults.insights,
        strengths: finalResults.strengths,
        weaknesses: finalResults.weaknesses,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);

    // Clean up files on error
    await cleanupFiles(filesToCleanup);

    return res.status(500).json({
      message: "Analysis failed",
      error: error.message,
    });
  }
};

/**
 * Clean up uploaded files
 */
async function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
}

/**
 * Get analysis history for a user
 */
export const getAnalysisHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { resumeId } = req.query;

    const filter = { userId: req.user.id };
    if (resumeId) {
      filter.resumeId = resumeId;
    }

    const analyses = await Analysis.find(filter)
      .populate("resumeId", "fileMeta createdAt")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      count: analyses.length,
      analyses: analyses,
    });
  } catch (error) {
    console.error("Get analysis history error:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis history",
      error: error.message,
    });
  }
};

/**
 * Get specific analysis by ID
 */
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const analysis = await Analysis.findOne({
      _id: id,
      userId: req.user.id,
    }).populate("resumeId", "fileMeta rawText");

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found or you don't have permission to access it",
      });
    }

    return res.status(200).json({
      analysis: analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis",
      error: error.message,
    });
  }
};

/**
 * Core analysis logic - compares resume with job description
 */
function performAnalysis(resumeText, jobDescriptionText) {
  // Normalize texts to lowercase for comparison
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescriptionText.toLowerCase();

  // Extract keywords from job description
  const jdKeywords = extractKeywords(jdLower);
  const resumeKeywords = extractKeywords(resumeLower);

  // Find matched and missing keywords
  const matchedKeywords = jdKeywords.filter((keyword) =>
    resumeLower.includes(keyword)
  );

  const missingKeywords = jdKeywords.filter(
    (keyword) => !resumeLower.includes(keyword)
  );

  // Calculate match percentage
  const keywordMatchScore =
    jdKeywords.length > 0
      ? (matchedKeywords.length / jdKeywords.length) * 100
      : 0;

  // Skills analysis
  const commonSkills = [
    "javascript",
    "python",
    "java",
    "react",
    "node",
    "angular",
    "vue",
    "typescript",
    "sql",
    "mongodb",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "agile",
    "scrum",
    "ci/cd",
    "rest api",
    "graphql",
    "html",
    "css",
    "sass",
    "tailwind",
    "bootstrap",
    "redux",
    "express",
    "django",
    "flask",
    "spring",
    "postgresql",
    "mysql",
    "redis",
    "elasticsearch",
    "jenkins",
    "terraform",
    "ansible",
    "linux",
    "bash",
    "powershell",
  ];

  const jdSkills = commonSkills.filter((skill) => jdLower.includes(skill));
  const resumeSkills = commonSkills.filter((skill) =>
    resumeLower.includes(skill)
  );
  const matchedSkills = jdSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const skillsMatchScore =
    jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 100 : 50;

  // Experience keywords
  const experienceKeywords = [
    "years",
    "experience",
    "led",
    "managed",
    "developed",
    "built",
    "created",
    "designed",
    "implemented",
    "architected",
  ];
  const hasExperience = experienceKeywords.some((keyword) =>
    resumeLower.includes(keyword)
  );
  const experienceMatchScore = hasExperience ? 70 : 40;

  // Education keywords
  const educationKeywords = [
    "bachelor",
    "master",
    "phd",
    "degree",
    "university",
    "college",
    "computer science",
    "engineering",
  ];
  const hasEducation = educationKeywords.some((keyword) =>
    resumeLower.includes(keyword)
  );
  const educationMatchScore = hasEducation ? 80 : 50;

  // Overall match percentage (weighted average)
  const matchPercentage = Math.round(
    keywordMatchScore * 0.4 +
      skillsMatchScore * 0.4 +
      experienceMatchScore * 0.1 +
      educationMatchScore * 0.1
  );

  // Generate suggestions
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these keywords to your resume: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`
    );
  }

  const missingSkills = jdSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );
  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider highlighting these skills if you have them: ${missingSkills
        .slice(0, 5)
        .join(", ")}`
    );
  }

  if (matchPercentage < 50) {
    suggestions.push(
      "Your resume needs significant improvements to match this job description"
    );
  } else if (matchPercentage < 70) {
    suggestions.push("Tailor your resume more closely to the job requirements");
  }

  if (!hasExperience) {
    suggestions.push(
      "Add more details about your work experience and achievements"
    );
  }

  // Identify strengths
  const strengths = [];
  if (matchedSkills.length > 3) {
    strengths.push(
      `Strong technical skills match: ${matchedSkills.slice(0, 5).join(", ")}`
    );
  }
  if (matchPercentage > 70) {
    strengths.push("Good overall alignment with job requirements");
  }
  if (hasEducation) {
    strengths.push("Relevant educational background");
  }

  // Identify weaknesses
  const weaknesses = [];
  if (missingSkills.length > 5) {
    weaknesses.push(
      `Missing key technical skills: ${missingSkills.slice(0, 5).join(", ")}`
    );
  }
  if (matchPercentage < 50) {
    weaknesses.push("Low overall match with job requirements");
  }
  if (missingKeywords.length > 10) {
    weaknesses.push("Many important keywords missing from resume");
  }

  return {
    matchPercentage: Math.min(100, Math.max(0, matchPercentage)),
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    matchedSkills: matchedSkills,
    missingSkills: missingSkills,
    scores: {
      skillsMatch: Math.round(skillsMatchScore),
      experienceMatch: Math.round(experienceMatchScore),
      educationMatch: Math.round(educationMatchScore),
    },
    suggestions:
      suggestions.length > 0 ? suggestions : ["Your resume looks good!"],
    strengths:
      strengths.length > 0 ? strengths : ["Resume submitted successfully"],
    weaknesses:
      weaknesses.length > 0 ? weaknesses : ["No major weaknesses identified"],
  };
}

/**
 * Extract meaningful keywords from text
 */
function extractKeywords(text) {
  // Remove common stop words
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "we",
    "you",
    "your",
    "our",
  ]);

  // Split into words and filter
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const frequency = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Get top keywords (appear more than once)
  const keywords = Object.keys(frequency)
    .filter((word) => frequency[word] > 1)
    .sort((a, b) => frequency[b] - frequency[a])
    .slice(0, 30);

  return keywords;
}
