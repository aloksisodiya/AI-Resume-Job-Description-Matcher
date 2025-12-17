import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AnalysisResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Get analysis results from navigation state
    if (location.state?.results) {
      setAnalysisData(location.state.results);
    } else {
      // If no data, redirect to home
      navigate("/");
    }
  }, [location, navigate]);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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

  // Category breakdown from scores
  const categoryBreakdown = [
    {
      name: "Hard Skills",
      percentage: scores.skillsMatch || 0,
      color: "bg-blue-500",
    },
    {
      name: "Experience",
      percentage: scores.experienceMatch || 0,
      color: "bg-blue-500",
    },
    {
      name: "Education",
      percentage: scores.educationMatch || 0,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-blue">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-dark-blue-light border-b border-dark-blue">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 grid grid-cols-2 gap-1">
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
            </div>
            <span className="text-white text-xl font-bold">
              ResumeMatcher AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Job Search
            </Link>
            <Link to="#" className="text-blue-400 font-medium">
              Resume Builder
            </Link>
            <Link
              to="/profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <Link
              to="/profile"
              className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              AJ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-400 hover:text-white">
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">Matcher</span>
          <span className="text-gray-600">/</span>
          <span className="text-white">Analysis Results</span>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Analysis Results
            </h1>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-dark-blue-light border border-dark-blue rounded-md text-white hover:border-blue-500 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Resume
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Report
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Overall Match Score */}
            <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
              <h3 className="text-gray-400 text-sm font-medium mb-6 text-center">
                Overall Match Score
              </h3>
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#1e293b"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 70 * (1 - matchPercentage / 100)
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {matchPercentage}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-400 text-sm">
                <span className="text-white font-medium">
                  {matchPercentage >= 70
                    ? "Strong candidate."
                    : matchPercentage >= 50
                    ? "Good match."
                    : "Needs improvement."}
                </span>{" "}
                {matchPercentage < 95 &&
                  "Optimize the missing keywords to improve your score."}
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
              <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Category Breakdown
              </h3>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">
                        {category.name}
                      </span>
                      <span className="text-white font-bold text-sm">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-blue-lighter rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Missing Information */}
            <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Missing Keywords ({missingKeywords.length})
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Add these keywords to improve your match score
              </p>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.slice(0, 15).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Great! No critical keywords missing.
                </p>
              )}
            </div>

            {/* Matched Keywords */}
            <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Matched Keywords ({matchedKeywords.length})
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Keywords found in your resume
              </p>
              {matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.slice(0, 15).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-md text-green-400 text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No keywords matched yet.
                </p>
              )}
            </div>

            {/* AI Suggestions */}
            <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  AI Suggestions ({suggestions.length})
                </h3>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">
                  AI-Powered
                </span>
              </div>

              {/* AI Insights */}
              {insights && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-blue-200 text-sm italic">{insights}</p>
                  </div>
                </div>
              )}

              <p className="text-gray-400 text-sm mb-6">
                Personalized tips to improve your resume
              </p>
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="shrink-0">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">{suggestion}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No specific suggestions at this time.
                  </p>
                )}
              </div>
            </div>

            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Strengths
                </h3>
                <div className="space-y-3">
                  {strengths.map((strength, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-300 text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {weaknesses.length > 0 && (
              <div className="bg-dark-blue-light rounded-lg p-6 border border-dark-blue">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Areas to Improve
                </h3>
                <div className="space-y-3">
                  {weaknesses.map((weakness, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <svg
                        className="w-5 h-5 text-orange-500 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-300 text-sm">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResultsPage;
