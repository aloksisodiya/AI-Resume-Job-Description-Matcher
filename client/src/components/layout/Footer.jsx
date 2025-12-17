import React from "react";

const Footer = () => {
  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-dark-blue">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
          {/* Logo and Mission */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 grid grid-cols-2 gap-1">
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
              </div>
              <span className="text-white text-xl sm:text-2xl font-bold">
                ResumeAI
              </span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Empowering job seekers with AI technology to bridge the gap
              between talent and opportunity.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 sm:pt-8 border-t border-dark-blue">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
