import Groq from "groq-sdk";

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

/**
 * Generate KEYWORD-FOCUSED suggestions for ATS optimization using Groq AI
 * @param {Object} analysisData - Contains ATS analysis results
 * @returns {Promise<Object>} - { suggestions: string[], insights: string }
 */
export async function generateKeywordSuggestions(analysisData) {
  const {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    resumeText,
    jdText,
  } = analysisData;

  // Try Groq AI (cloud-based, production-ready)
  if (groq) {
    try {
      const startTime = Date.now();

      const prompt = `You are an ATS optimization expert. Based on this analysis:
- Current Match Score: ${matchPercentage}%
- Missing Keywords: ${missingKeywords.slice(0, 8).join(", ")}
- Missing Skills: ${missingSkills.slice(0, 5).join(", ")}

Provide 5 specific, actionable tips to improve the resume for ATS. Return ONLY valid JSON in this exact format:
{"suggestions":["tip1","tip2","tip3","tip4","tip5"],"insights":"one sentence summary"}`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.4,
        max_tokens: 300,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      console.log(`⚡ Groq ATS suggestions: ${Date.now() - startTime}ms`);

      // Parse JSON response
      const result = parseAIResponse(responseText, analysisData);
      return result;
    } catch (error) {
      console.warn(
        "⚠️ Groq API failed, using fallback suggestions:",
        error.message,
      );
      return generateFallbackSuggestions(analysisData);
    }
  }

  // If no Groq API key, use keyword-based suggestions
  console.warn("⚠️ No Groq API key found, using keyword-based suggestions");
  return generateFallbackSuggestions(analysisData);
}

/**
 * Parse AI response (from Groq) with robust error handling
 */
function parseAIResponse(responseText, analysisData) {
  try {
    let cleanedText = responseText.trim();

    // Remove markdown code blocks
    cleanedText = cleanedText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .replace(/^json\s*/i, "");

    // Extract JSON from text
    const firstBrace = cleanedText.indexOf("{");
    const lastBrace = cleanedText.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }

    // Clean up JSON formatting issues
    cleanedText = cleanedText
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/\n/g, " ")
      .replace(/\r/g, "")
      .replace(/\t/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    const result = JSON.parse(cleanedText);

    // Validate structure
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      throw new Error("Invalid suggestions format");
    }

    result.suggestions = result.suggestions
      .filter((s) => typeof s === "string" && s.length > 10)
      .slice(0, 5);

    if (result.suggestions.length < 3) {
      throw new Error("Not enough suggestions");
    }

    if (!result.insights || typeof result.insights !== "string") {
      result.insights = `ATS Score: ${analysisData.matchPercentage}%. Focus on adding missing keywords for better matching.`;
    }

    return {
      suggestions: result.suggestions,
      insights: result.insights,
    };
  } catch (parseError) {
    console.warn(
      "⚠️ AI response parsing failed, using fallback:",
      parseError.message,
    );
    return generateFallbackSuggestions(analysisData);
  }
}

/**
 * Generate keyword-based fallback suggestions (no AI required)
 */
function generateFallbackSuggestions(analysisData) {
  const { matchPercentage, missingKeywords, missingSkills } = analysisData;

  return {
    suggestions: [
      `Add missing keywords: ${missingKeywords.slice(0, 3).join(", ")}`,
      `Include "${missingSkills[0] || missingKeywords[0]}" in your skills section with examples`,
      `Mention "${missingSkills[1] || missingKeywords[1]}" with specific achievements`,
      `Use exact terms from job description: ${missingKeywords.slice(3, 5).join(", ")}`,
      `Strengthen your summary with: ${missingKeywords.slice(0, 2).join(", ")}`,
    ].filter((s) => !s.includes("undefined")),
    insights: `ATS Score: ${matchPercentage}%. Add ${
      missingKeywords.length
    } missing keywords to improve by up to +${Math.min(
      30,
      missingKeywords.length * 3,
    )}%.`,
  };
}
