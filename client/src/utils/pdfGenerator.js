import { jsPDF } from "jspdf";

// Helper function to format date as DD/MM/YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const generateAnalysisPDF = (analysisData) => {
  try {
    console.log("Starting PDF generation...");

    const {
      matchPercentage = 0,
      matchedKeywords = [],
      missingKeywords = [],
      scores = {},
      suggestions = [],
      strengths = [],
      weaknesses = [],
      insights = "",
    } = analysisData;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text("Resume Analysis Report", pageWidth / 2, yPosition, {
      align: "center",
    });

    // Add date
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${formatDate(new Date())}`,
      pageWidth / 2,
      yPosition,
      {
        align: "center",
      }
    );

    // Add separator line
    yPosition += 5;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Overall Match Score
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Overall Match Score", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    doc.setFontSize(48);
    doc.setTextColor(59, 130, 246);
    doc.text(`${Math.round(matchPercentage)}%`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 20;

    // Category Scores
    yPosition = checkPageBreak(doc, yPosition, 40);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Category Breakdown", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    // Draw category boxes
    const categories = [
      { name: "Hard Skills", score: scores.skillsMatch || 0 },
      { name: "Experience", score: scores.experienceMatch || 0 },
      { name: "Education", score: scores.educationMatch || 0 },
    ];

    const boxWidth = (contentWidth - 10) / 3;
    let xPos = margin;

    categories.forEach((category) => {
      // Box background
      doc.setFillColor(248, 250, 252);
      doc.rect(xPos, yPosition, boxWidth, 20, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(xPos, yPosition, boxWidth, 20);

      // Category name
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(category.name, xPos + boxWidth / 2, yPosition + 8, {
        align: "center",
      });

      // Score
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text(`${category.score}%`, xPos + boxWidth / 2, yPosition + 16, {
        align: "center",
      });

      xPos += boxWidth + 5;
    });

    yPosition += 30;

    // Matched Keywords
    if (matchedKeywords.length > 0) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Matched Keywords (${matchedKeywords.length})`,
        margin,
        yPosition
      );
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(3, 105, 161);
      const keywordText = matchedKeywords.join(" • ");
      const splitKeywords = doc.splitTextToSize(keywordText, contentWidth);
      doc.text(splitKeywords, margin, yPosition);
      yPosition += splitKeywords.length * 5 + 10;
    }

    // Missing Keywords
    if (missingKeywords.length > 0) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Missing Keywords (${missingKeywords.length})`,
        margin,
        yPosition
      );
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(146, 64, 14);
      const keywordText = missingKeywords.join(" • ");
      const splitKeywords = doc.splitTextToSize(keywordText, contentWidth);
      doc.text(splitKeywords, margin, yPosition);
      yPosition += splitKeywords.length * 5 + 10;
    }

    // Strengths
    if (strengths.length > 0) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Strengths", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      strengths.forEach((strength, index) => {
        yPosition = checkPageBreak(doc, yPosition, 10);
        const bulletText = `${index + 1}. ${strength}`;
        const splitText = doc.splitTextToSize(bulletText, contentWidth - 10);
        doc.text(splitText, margin + 5, yPosition);
        yPosition += splitText.length * 5 + 3;
      });
      yPosition += 5;
    }

    // Weaknesses
    if (weaknesses.length > 0) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Areas for Improvement", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      weaknesses.forEach((weakness, index) => {
        yPosition = checkPageBreak(doc, yPosition, 10);
        const bulletText = `${index + 1}. ${weakness}`;
        const splitText = doc.splitTextToSize(bulletText, contentWidth - 10);
        doc.text(splitText, margin + 5, yPosition);
        yPosition += splitText.length * 5 + 3;
      });
      yPosition += 5;
    }

    // Recommendations
    if (suggestions.length > 0) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendations", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      suggestions.forEach((suggestion, index) => {
        yPosition = checkPageBreak(doc, yPosition, 10);
        const bulletText = `${index + 1}. ${suggestion}`;
        const splitText = doc.splitTextToSize(bulletText, contentWidth - 10);
        doc.text(splitText, margin + 5, yPosition);
        yPosition += splitText.length * 5 + 3;
      });
      yPosition += 5;
    }

    // AI Insights
    if (insights) {
      yPosition = checkPageBreak(doc, yPosition, 30);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("AI Insights", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const splitInsights = doc.splitTextToSize(insights, contentWidth);
      splitInsights.forEach((line) => {
        yPosition = checkPageBreak(doc, yPosition, 8);
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Generated by ResumeSync - AI-Powered Resume Analysis",
        pageWidth / 2,
        285,
        { align: "center" }
      );
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, {
        align: "center",
      });
    }

    // Save the PDF
    const filename = `Resume_Analysis_Report_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    console.log("Saving PDF as:", filename);
    doc.save(filename);
    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error;
  }
};

// Helper function to check if we need a page break
const checkPageBreak = (doc, yPosition, requiredSpace) => {
  if (yPosition + requiredSpace > 270) {
    doc.addPage();
    return 20;
  }
  return yPosition;
};
