import React from "react";

const SeeTheDifference = () => {
  const benefits = [
    "Increased keyword density",
    "Formatting fixed for ATS",
    "Action verbs enhanced",
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              See the Difference
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">
              Our AI highlights critical gaps. Left is your original resume,
              right is the optimized version tailored for the specific job
              description.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 sm:gap-4">
                  <span className="text-blue-500 text-xl sm:text-2xl flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-white text-base sm:text-lg">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Visual Comparison */}
          <div className="relative">
            <div className="bg-dark-blue-light/50 rounded-lg p-4 sm:p-6 border border-dark-blue">
              {/* Mock Resume Comparison */}
              <div className="flex gap-2 sm:gap-4">
                {/* Before Resume */}
                <div className="flex-1 bg-white rounded p-3 sm:p-4 min-h-[300px] sm:min-h-[400px]">
                  <div className="text-gray-900">
                    <div className="text-xs sm:text-sm font-semibold mb-2 text-gray-500">
                      BEFORE
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mt-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
                {/* After Resume */}
                <div className="flex-1 bg-white rounded p-3 sm:p-4 min-h-[300px] sm:min-h-[400px]">
                  <div className="text-gray-900">
                    <div className="text-xs sm:text-sm font-semibold mb-2 text-blue-600">
                      AFTER
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                      <div className="h-4 bg-blue-100 rounded w-full"></div>
                      <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                      <div className="h-4 bg-blue-100 rounded w-2/3 mt-4"></div>
                      <div className="h-4 bg-blue-100 rounded w-full"></div>
                      <div className="h-4 bg-blue-100 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeeTheDifference;
