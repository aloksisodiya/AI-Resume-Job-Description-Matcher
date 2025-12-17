import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadBox from "../ui/UploadBox";
import JobDescriptionBox from "../ui/JobDescriptionBox";
import { analysisAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResumeSelect = (file) => {
    setResumeFile(file);
    setError(null);
  };

  const handleJobDescriptionSelect = (file) => {
    setJobDescriptionFile(file);
    setJobDescriptionText(""); // Clear text when file is selected
    setError(null);
  };

  const handleJobDescriptionTextChange = (text) => {
    setJobDescriptionText(text);
    setJobDescriptionFile(null); // Clear file when text is entered
    setError(null);
  };

  const handleStartAnalysis = async () => {
    // Validation
    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }

    if (!jobDescriptionFile && !jobDescriptionText.trim()) {
      setError("Please provide a job description (file or text)");
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      setError("Please login to continue");
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysisData = {
        resume: resumeFile,
        jobDescription: jobDescriptionFile,
        jobDescriptionText: jobDescriptionText,
      };

      const result = await analysisAPI.analyzeResume(analysisData);

      if (result.success) {
        // Navigate to results page with analysis data
        navigate("/analysis-results", {
          state: {
            results: result.results,
            analysisId: result.analysisId,
          },
        });
      } else {
        setError(result.message || "Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="home"
      className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Land Your Dream Job with <span className="text-blue-500">AI</span>{" "}
            <span className="text-blue-500">Precision</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Stop guessing. Our AI analyzes your resume against job descriptions
            to give you a match score and optimization tips in seconds.
          </p>
        </div>

        {/* Upload Modules */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 justify-center">
          <UploadBox
            icon={
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            }
            title="Upload Resume"
            formats="PDF, DOCX (Max 2MB)"
            onFileSelect={handleResumeSelect}
            selectedFile={resumeFile}
          />
          <JobDescriptionBox
            onFileSelect={handleJobDescriptionSelect}
            onTextChange={handleJobDescriptionTextChange}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
          <button
            onClick={handleStartAnalysis}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-500 text-white px-8 py-3 sm:px-12 sm:py-4 rounded-md font-bold text-base sm:text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Start Analysis"
            )}
          </button>
        </div>

        {/* Trusted By Section */}
        <div className="text-center">
          <p className="text-gray-400 text-sm sm:text-base mb-4">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12">
            {["Google", "SpaceX", "Stripe", "Amazon"].map((company) => (
              <div
                key={company}
                className="text-gray-400 text-sm sm:text-base font-medium hover:text-gray-300 transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
