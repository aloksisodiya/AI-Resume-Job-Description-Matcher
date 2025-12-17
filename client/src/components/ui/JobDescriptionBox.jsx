import React, { useState } from "react";

const JobDescriptionBox = ({ onTextChange, onFileSelect }) => {
  const [textValue, setTextValue] = useState("");

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextValue(value);
    if (onTextChange) {
      onTextChange(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      // Clear text when file is selected
      setTextValue("");
      if (onTextChange) {
        onTextChange("");
      }
    }
  };

  return (
    <div className="w-full sm:w-[48%] lg:w-[45%] border-2 border-dark-blue rounded-lg p-6 sm:p-8 bg-dark-blue-light/50">
      <div className="flex flex-col gap-4">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-blue-500">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white text-lg sm:text-xl font-bold">
              Job Description
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Paste text or upload a file
            </p>
          </div>
        </div>

        {/* Text Input Area - Always Visible */}
        <div className="mt-2">
          <textarea
            value={textValue}
            onChange={handleTextChange}
            placeholder="Paste the job description here..."
            className="w-full h-32 sm:h-40 bg-dark-blue border border-dark-blue rounded-md p-3 sm:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
          />
        </div>

        {/* OR Separator */}
        <div className="relative flex items-center my-2">
          <div className="flex-1 border-t border-dark-blue"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-dark-blue"></div>
        </div>

        {/* File Upload Button */}
        <label className="flex items-center gap-3 p-3 sm:p-4 bg-dark-blue border border-dark-blue rounded-md cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-blue-500">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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
          </div>
          <div className="flex-1">
            <span className="text-white font-medium text-sm sm:text-base">
              Upload File
            </span>
            <span className="text-gray-400 text-xs sm:text-sm ml-2">
              PDF, DOCX, TXT
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default JobDescriptionBox;
