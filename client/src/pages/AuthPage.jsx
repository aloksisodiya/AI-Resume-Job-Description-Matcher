import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (activeTab === "signup") {
      // Validation for signup
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters!");
        setIsLoading(false);
        return;
      }

      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error(response.message || "Registration failed!");
      }
    } else {
      // Login
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.message || "Login failed!");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-blue">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 grid grid-cols-2 gap-1">
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
            </div>
            <span className="text-white text-xl sm:text-2xl font-bold">
              ResumeAI
            </span>
          </Link>
          <Link
            to="/"
            className="text-white hover:text-blue-400 transition-colors text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Section - Informational Content */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                + AI-POWERED MATCHING
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                Unlock your full career potential.
              </h1>
              <p className="text-white text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl">
                Join thousands of professionals using our AI to perfectly tailor
                their resumes to job descriptions. Get hired faster with
                precision matching.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                    Smart Parsing
                  </h3>
                  <p className="text-white text-sm sm:text-base">
                    Instantly extract skills and experience from your CV.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900"
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
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                    Match Scoring
                  </h3>
                  <p className="text-white text-sm sm:text-base">
                    Get a compatibility score for any job description.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Authentication Form */}
          <div className="lg:col-span-1">
            <div className="bg-dark-blue-light/50 rounded-lg p-6 sm:p-8 border border-dark-blue">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 sm:mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    activeTab === "login"
                      ? "bg-dark-blue-light text-white"
                      : "bg-dark-blue-lighter text-gray-400 hover:bg-dark-blue-lighter/80"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    activeTab === "signup"
                      ? "bg-dark-blue-light text-white"
                      : "bg-dark-blue-lighter text-gray-400 hover:bg-dark-blue-lighter/80"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Welcome Message */}
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl sm:text-2xl mb-2">
                  {activeTab === "login"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {activeTab === "login"
                    ? "Enter your details to access your dashboard."
                    : "Start optimizing your resume today."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {activeTab === "signup" && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-dark-blue border border-dark-blue rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="John Doe"
                        required={activeTab === "signup"}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white text-sm font-medium">
                      Email Address
                    </label>
                    {activeTab === "login" && (
                      <Link
                        to="/reset-password"
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-dark-blue border border-dark-blue rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-dark-blue border border-dark-blue rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a9.97 9.97 0 013.029-1.563M6.29 6.29L12 12m-5.71-5.71L3 3m9 9l-5.71-5.71M12 12l5.71 5.71M12 12l3.29 3.29"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {activeTab === "signup" && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-dark-blue border border-dark-blue rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="••••••••"
                        required={activeTab === "signup"}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Processing..."
                    : activeTab === "login"
                    ? "Log In"
                    : "Sign Up"}
                </button>
              </form>

              {/* Separator */}
              <div className="relative flex items-center my-6 sm:my-8">
                <div className="flex-1 border-t border-dark-blue"></div>
                <span className="px-4 text-gray-400 text-xs sm:text-sm">
                  OR CONTINUE WITH
                </span>
                <div className="flex-1 border-t border-dark-blue"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Terms and Privacy */}
              <p className="text-gray-400 text-xs sm:text-sm text-center mt-6 sm:mt-8">
                By clicking continue, you agree to our{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </p>

              {/* Signup Prompt */}
              {activeTab === "login" && (
                <p className="text-gray-400 text-xs sm:text-sm text-center mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Sign up for free
                  </button>
                </p>
              )}

              {activeTab === "signup" && (
                <p className="text-gray-400 text-xs sm:text-sm text-center mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
