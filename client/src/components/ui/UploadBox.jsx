import React from "react";

const UploadBox = ({ icon, title, formats, onFileSelect, selectedFile }) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `File size exceeds 2MB. Please upload a smaller file.\nCurrent size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        e.target.value = ""; // Reset file input
        return;
      }

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <label className="w-full sm:w-[48%] lg:w-[45%] border-2 border-dashed border-dark-blue rounded-lg p-6 sm:p-8 hover:border-blue-500 transition-colors cursor-pointer bg-dark-blue-light/50 block">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-blue-500">{icon}</div>
        <div className="text-center">
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
            {title}
          </h3>
          {selectedFile ? (
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">File Uploaded</span>
              </div>
              <p
                className="text-blue-400 text-sm truncate max-w-62.5 mx-auto"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm sm:text-base mb-3">
                {formats}
              </p>
              <p className="text-gray-500 text-xs mb-2">
                Maximum file size: 2MB
              </p>
              <span className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base">
                or browse files
              </span>
            </>
          )}
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />
    </label>
  );
};

export default UploadBox;
