import fs from "fs/promises";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import { generateKeywordSuggestions } from "../services/llamaService.js";

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

    // Perform analysis with hybrid approach (keyword + embeddings)
    const analysisStartTime = Date.now();
    console.log("⏱️  Starting analysis...");

    const analysisResults = await performAnalysis(resumeText, jdText);

    console.log(
      `⚡ Core analysis completed in ${Date.now() - analysisStartTime}ms`
    );

    // Generate keyword-based AI suggestions using Ollama (always enabled)
    let aiResults;
    try {
      const aiStartTime = Date.now();
      aiResults = await generateKeywordSuggestions({
        matchPercentage: analysisResults.matchPercentage,
        matchedKeywords: analysisResults.matchedKeywords,
        missingKeywords: analysisResults.missingKeywords,
        matchedSkills: analysisResults.matchedSkills || [],
        missingSkills: analysisResults.missingSkills || [],
        resumeText: resumeText,
        jdText: jdText,
      });
      console.log(
        `⚡ Ollama keyword suggestions completed in ${
          Date.now() - aiStartTime
        }ms`
      );
    } catch (error) {
      console.error("Ollama error, using fallback:", error.message);
      aiResults = generateFallbackSuggestions(analysisResults);
    }

    // Combine basic analysis with AI suggestions
    const finalResults = {
      ...analysisResults,
      suggestions: aiResults.suggestions,
      insights: aiResults.insights,
    };

    // Clean up uploaded files
    await cleanupFiles(filesToCleanup);

    return res.status(200).json({
      message: "Analysis completed successfully",
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
 * Core analysis logic - compares resume with job description
 * Uses KEYWORD MATCHING ONLY (like real ATS systems)
 */
async function performAnalysis(resumeText, jobDescriptionText) {
  // Normalize texts to lowercase for comparison
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescriptionText.toLowerCase();

  // Extract keywords from job description
  const jdKeywords = extractKeywords(jdLower);
  const resumeKeywords = extractKeywords(resumeLower);

  console.log(
    `📊 ATS Analysis: ${jdKeywords.length} keywords in JD, ${resumeKeywords.length} in resume`
  );

  // ===== 1. KEYWORD MATCHING (Like Real ATS) =====
  const matchedKeywords = jdKeywords.filter((keyword) =>
    resumeLower.includes(keyword)
  );

  const missingKeywords = jdKeywords.filter(
    (keyword) => !resumeLower.includes(keyword)
  );

  console.log(`✓ ATS Matched: ${matchedKeywords.length} keywords`);
  console.log(`✗ ATS Missing: ${missingKeywords.length} keywords`);

  // Calculate keyword-based match percentage (primary ATS score)
  const keywordMatchScore =
    jdKeywords.length > 0
      ? (matchedKeywords.length / jdKeywords.length) * 100
      : 0;

  // ===== 2. SKILLS KEYWORD MATCHING (ATS-Style) =====
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
    "c++",
    "c#",
    "ruby",
    "go",
    "rust",
    "php",
    "swift",
    "kotlin",
    "flutter",
    "react native",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "data analysis",
    "pandas",
    "numpy",
    "azure",
    "gcp",
    "firebase",
    "figma",
    "sketch",
    "jira",
    "confluence",
  ];

  // Simple keyword-based skill matching (like ATS)
  const jdSkills = commonSkills.filter((skill) => jdLower.includes(skill));
  const resumeSkills = commonSkills.filter((skill) =>
    resumeLower.includes(skill)
  );
  const matchedSkills = jdSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );
  const missingSkills = jdSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const skillsMatchScore =
    jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 100 : 50;

  console.log(`✓ Skills Matched: ${matchedSkills.length}/${jdSkills.length}`);
  console.log(`✗ Skills Missing: ${missingSkills.length}`);

  // ===== 3. EXPERIENCE & EDUCATION KEYWORDS (ATS Checks) =====
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
    "launched",
    "delivered",
  ];
  const hasExperience = experienceKeywords.some((keyword) =>
    resumeLower.includes(keyword)
  );
  const experienceMatchScore = hasExperience ? 75 : 40;

  const educationKeywords = [
    "bachelor",
    "master",
    "phd",
    "degree",
    "university",
    "college",
    "computer science",
    "engineering",
    "certification",
  ];
  const hasEducation = educationKeywords.some((keyword) =>
    resumeLower.includes(keyword)
  );
  const educationMatchScore = hasEducation ? 80 : 50;

  // ===== 4. ATS MATCH SCORE (Keyword-Based Like Real ATS) =====
  // Weighted: 50% keywords + 35% skills + 10% experience + 5% education
  // Real ATS systems heavily weight keyword matching
  const matchPercentage = Math.round(
    keywordMatchScore * 0.5 +
      skillsMatchScore * 0.35 +
      experienceMatchScore * 0.1 +
      educationMatchScore * 0.05
  );

  console.log(`📊 ATS Score Breakdown:
    - Keyword Match: ${Math.round(keywordMatchScore)}% (Weight: 50%)
    - Skills Match: ${Math.round(skillsMatchScore)}% (Weight: 35%)
    - Experience: ${Math.round(experienceMatchScore)}% (Weight: 10%)
    - Education: ${Math.round(educationMatchScore)}% (Weight: 5%)
    - FINAL ATS SCORE: ${matchPercentage}%`);

  // Generate suggestions
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these keywords to your resume: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`
    );
  }

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

  // ===== FINAL VALIDATION: Ensure no duplicates =====
  // Remove any keywords that appear in both matched and missing
  const matchedSet = new Set(matchedKeywords.map((k) => k.toLowerCase()));
  const finalMissingKeywords = missingKeywords.filter(
    (keyword) => !matchedSet.has(keyword.toLowerCase())
  );

  const matchedSkillsSet = new Set(matchedSkills.map((s) => s.toLowerCase()));
  const finalMissingSkills = missingSkills.filter(
    (skill) => !matchedSkillsSet.has(skill.toLowerCase())
  );

  return {
    matchPercentage: Math.min(100, Math.max(0, matchPercentage)),
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: finalMissingKeywords.slice(0, 20),
    matchedSkills: matchedSkills,
    missingSkills: finalMissingSkills,
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

/**
 * Generate fast fallback suggestions (instant, no AI)
 */
function generateFallbackSuggestions(analysisResults) {
  const { matchPercentage, missingKeywords, missingSkills, matchedSkills } =
    analysisResults;

  const suggestions = [];

  // Suggestion 1: Missing keywords
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Add these keywords: ${missingKeywords.slice(0, 5).join(", ")}`
    );
  }

  // Suggestion 2: Missing skills
  if (missingSkills.length > 0) {
    suggestions.push(
      `Highlight these skills if you have them: ${missingSkills
        .slice(0, 3)
        .join(", ")}`
    );
  }

  // Suggestion 3: Based on match percentage
  if (matchPercentage < 50) {
    suggestions.push(
      "Tailor your resume more closely to match the job requirements"
    );
  } else if (matchPercentage < 70) {
    suggestions.push(
      "Strengthen your resume by incorporating more relevant keywords"
    );
  } else {
    suggestions.push(
      "Your resume is well-aligned. Consider quantifying achievements with metrics"
    );
  }

  // Suggestion 4: Action verbs
  suggestions.push(
    "Use strong action verbs like 'developed', 'led', 'implemented', 'designed'"
  );

  // Suggestion 5: Metrics
  suggestions.push(
    "Add specific metrics and numbers to demonstrate impact (e.g., '30% improvement')"
  );

  // Generate insights
  let insights = `Your resume has a ${matchPercentage}% match with the job description. `;

  if (matchPercentage >= 80) {
    insights +=
      "Excellent alignment! Focus on showcasing your achievements with specific examples.";
  } else if (matchPercentage >= 60) {
    insights +=
      "Good foundation. Incorporate missing skills and keywords to strengthen your application.";
  } else {
    insights +=
      "Significant improvements needed. Focus on adding relevant keywords and highlighting matching skills.";
  }

  return { suggestions, insights };
}
