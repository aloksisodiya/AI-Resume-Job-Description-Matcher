import axios from "axios";

// Ollama API configuration - Use 127.0.0.1 instead of localhost to force IPv4
const OLLAMA_API_URL = process.env.OLLAMA_API_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

/**
 * Generate KEYWORD-FOCUSED suggestions for ATS optimization using Ollama
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

  try {
    const startTime = Date.now();

    // Optimized short prompt for faster response
    const prompt = `ATS optimization. Score: ${matchPercentage}%
Missing: ${missingKeywords.slice(0, 5).join(", ")}
Skills needed: ${missingSkills.slice(0, 3).join(", ")}

Give 5 tips to add these keywords. JSON only:
{"suggestions":["tip1","tip2","tip3","tip4","tip5"],"insights":"brief note"}`;

    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.4, 
          num_predict: 150, 
          top_p: 0.8,
          top_k: 20,
        },
      },
      {
        timeout: 15000, 
      }
    );

    console.log(`⚡ Ollama ATS suggestions: ${Date.now() - startTime}ms`);

    // Parse Ollama response with aggressive cleaning
    let result;
    try {
      let responseText = response.data.response.trim();

      // Remove markdown code blocks
      responseText = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .replace(/^json\s*/i, "");

      // Remove any text before first {
      const firstBrace = responseText.indexOf("{");
      if (firstBrace > 0) {
        responseText = responseText.substring(firstBrace);
      }

      // Remove any text after last }
      const lastBrace = responseText.lastIndexOf("}");
      if (lastBrace > 0) {
        responseText = responseText.substring(0, lastBrace + 1);
      }

      // Fix common JSON issues
      responseText = responseText
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/\n/g, " ")
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

      console.log(
        "📝 Cleaned Ollama response:",
        responseText.substring(0, 200)
      );

      result = JSON.parse(responseText);

      // Validate structure
      if (!result.suggestions || !Array.isArray(result.suggestions)) {
        throw new Error("Invalid suggestions format");
      }

      result.suggestions = result.suggestions.filter(
        (s) => typeof s === "string" && s.length > 10
      );

      if (result.suggestions.length < 3) {
        throw new Error("Not enough suggestions");
      }

      if (!result.insights || typeof result.insights !== "string") {
        result.insights = `ATS Score: ${matchPercentage}%. Focus on adding missing keywords for better matching.`;
      }
    } catch (parseError) {
      console.warn(
        "⚠️ Ollama parsing failed, using keyword-focused fallback:",
        parseError.message
      );

      // Keyword-focused fallback
      result = {
        suggestions: [
          `Add keywords: ${missingKeywords.slice(0, 3).join(", ")}`,
          `Include "${
            missingSkills[0] || missingKeywords[0]
          }" in skills section`,
          `Mention "${missingSkills[1] || missingKeywords[1]}" with examples`,
          `Use exact terms: ${missingKeywords.slice(3, 5).join(", ")}`,
          `Optimize summary with: ${matchedKeywords.slice(0, 2).join(", ")}`,
        ].filter((s) => !s.includes("undefined")),
        insights: `ATS: ${matchPercentage}% match. Missing ${missingKeywords.length} keywords. Add them to improve score.`,
      };
    }

    return {
      suggestions: result.suggestions.slice(0, 5),
      insights: result.insights,
    };
  } catch (error) {
    console.error("Ollama API error:", error.message);

    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      console.error("❌ Ollama not running. Start with: ollama serve");
    }

    // Fast keyword-based fallback
    return {
      suggestions: [
        `Add keywords: ${missingKeywords.slice(0, 3).join(", ")}`,
        `Include skills: ${missingSkills.slice(0, 3).join(", ")}`,
        `Use exact terms from job description`,
        `Add "${missingKeywords[0] || "keywords"}" to summary`,
        `Naturally include: ${missingKeywords.slice(3, 5).join(", ")}`,
      ].filter((s) => !s.includes("undefined")),
      insights: `ATS: ${matchPercentage}%. Missing ${
        missingKeywords.length
      } keywords. Add them for +${Math.min(
        30,
        missingKeywords.length * 3
      )}% score.`,
    };
  }
}

/**
 * Check if Ollama is running and available
 * @returns {Promise<boolean>}
 */
export async function checkOllamaStatus() {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`, {
      timeout: 10000,
      validateStatus: (status) => status === 200,
    });

    const models = response.data.models || [];
    const hasModel = models.some(
      (m) => m.name && m.name.includes(OLLAMA_MODEL)
    );

    if (!hasModel) {
      console.warn(
        `⚠️  Model "${OLLAMA_MODEL}" not found. Available models:`,
        models.map((m) => m.name).join(", ")
      );
      console.warn(`   Run: ollama pull ${OLLAMA_MODEL}`);
    } else {
      console.log(`✓ Ollama running with model: ${OLLAMA_MODEL}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Ollama is not running or not accessible");
    console.error(`   URL: ${OLLAMA_API_URL}`);
    console.error(`   Error: ${error.message}`);
    if (error.code === "ECONNREFUSED") {
      console.error("   Please start Ollama with: ollama serve");
    }
    return false;
  }
}
