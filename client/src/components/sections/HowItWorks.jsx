import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      icon: "⚡",
      title: "Instant Analysis",
      description:
        "Get feedback in under 5 seconds with our advanced AI processing engine. No waiting, just results.",
    },
    {
      icon: "📊",
      title: "Keyword Matching",
      description:
        "See exactly which skills you are missing compared to the job description to boost your match score.",
    },
    {
      icon: "✅",
      title: "ATS Friendly",
      description:
        "Ensure your resume passes the bot filter before a human ever sees it. We support all major ATS formats.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-blue-400 text-sm sm:text-base uppercase tracking-wider font-semibold mb-2 sm:mb-4">
            HOW IT WORKS
          </h2>
          <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Optimize in 3 Simple Steps
          </h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Our process is designed to be fast, accurate, and effective for job
            seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-dark-blue-light/50 rounded-lg p-6 sm:p-8 border border-dark-blue hover:border-blue-500 transition-colors"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">
                {step.icon}
              </div>
              <h4 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {step.title}
              </h4>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
