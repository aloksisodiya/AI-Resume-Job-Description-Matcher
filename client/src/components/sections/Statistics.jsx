import React from "react";

const Statistics = () => {
  const stats = [
    { value: "150k+", label: "Resumes Analyzed" },
    { value: "10k+", label: "Successful Matches" },
    { value: "50+", label: "ATS Systems Supported" },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-dark-blue-light/50 rounded-lg p-6 sm:p-8 text-center border border-dark-blue hover:border-blue-500 transition-colors"
            >
              <div className="text-blue-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                {stat.value}
              </div>
              <div className="text-white text-base sm:text-lg md:text-xl">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
