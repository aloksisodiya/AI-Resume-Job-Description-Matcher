import OpenAI from "openai";

// Initializing OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI-powered suggestions for resume improvement
 * @param {Object} analysisData - Contains matchPercentage, missingKeywords, missingSkills, resumeText, jdText
 * @returns {Promise<Object>} - { suggestions: string[], insights: string }
 */
export async function generateAISuggestions(analysisData) {
  const {
    matchPercentage,
    missingKeywords,
    missingSkills,
    matchedSkills,
    resumeText,
    jdText,
  } = analysisData;

  try {
    const prompt = `You are an expert resume optimization assistant. Analyze the following data and provide actionable suggestions:

**Match Percentage:** ${matchPercentage}%
**Matched Skills:** ${matchedSkills.join(", ") || "None"}
**Missing Skills:** ${missingSkills.join(", ") || "None"}
**Missing Keywords:** ${missingKeywords.slice(0, 10).join(", ") || "None"}

**Job Description Summary:**
${jdText.substring(0, 500)}...

**Resume Summary:**
${resumeText.substring(0, 500)}...

Provide:
1. **5 specific, actionable suggestions** to improve the resume match score (as a JSON array of strings)
2. **A 2-3 sentence natural language insight** about overall resume quality

Format your response as valid JSON only (no markdown, no code blocks):
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "insights": "your insight here"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume coach. Provide specific, actionable advice in JSON format only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      suggestions: result.suggestions || [
        "Tailor your resume more closely to the job requirements",
      ],
      insights:
        result.insights ||
        "Your resume shows potential but needs optimization for this role.",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Fallback to basic suggestions if API fails
    return {
      suggestions: [
        `Add these keywords: ${missingKeywords.slice(0, 5).join(", ")}`,
        `Highlight these skills if you have them: ${missingSkills
          .slice(0, 3)
          .join(", ")}`,
        "Quantify your achievements with specific metrics and numbers",
        "Use action verbs to describe your responsibilities",
        "Align your experience section with the job requirements",
      ],
      insights: `Your resume has a ${matchPercentage}% match. Focus on incorporating missing technical skills and relevant keywords to improve your chances.`,
    };
  }
}

/**
 * Generate keyword recommendations using AI
 * @param {string} resumeText - The resume content
 * @param {string} jdText - The job description content
 * @param {Array} missingKeywords - Keywords missing from resume
 * @returns {Promise<Array>} - Array of keyword suggestions with context
 */
export async function generateKeywordSuggestions(
  resumeText,
  jdText,
  missingKeywords
) {
  try {
    const prompt = `Based on this job description and resume, suggest the top 10 most important keywords the candidate should add to increase their match score.

**Job Description:**
${jdText.substring(0, 600)}

**Current Missing Keywords:**
${missingKeywords.slice(0, 15).join(", ")}

Return valid JSON only (no markdown, no code blocks) - an object with a "keywords" array.
Format: {"keywords": [{"keyword": "word", "context": "how to use it"}, ...]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a resume keyword optimization expert. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.keywords || [];
  } catch (error) {
    console.error("OpenAI keyword generation error:", error);
    // Fallback
    return missingKeywords.slice(0, 10).map((keyword) => ({
      keyword,
      context:
        "Add this keyword naturally in your experience or skills section",
    }));
  }
}
