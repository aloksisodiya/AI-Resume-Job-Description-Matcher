import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API endpoints
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const response = await api.post("/auth/logout");
      return { success: true, ...response.data };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Logout failed",
      };
    }
  },

  sendResetOtp: async (email) => {
    try {
      const response = await api.post("/auth/send-pass-otp", { email });
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to send OTP",
      };
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.post("/auth/reset-password", data);
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to reset password",
      };
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/update-profile", profileData);
      if (response.data.success && response.data.user) {
        // Update user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      };
    }
  },
};

// Analysis API endpoints
export const analysisAPI = {
  /**
   * Analyze resume against job description
   * @param {Object} data - Analysis data
   * @param {File} data.resume - Resume file (required)
   * @param {File} data.jobDescription - JD file (optional)
   * @param {string} data.jobDescriptionText - JD text (optional)
   * @param {string} data.jobTitle - Job title (optional)
   * @param {string} data.company - Company name (optional)
   */
  analyzeResume: async (data) => {
    try {
      const formData = new FormData();

      // Add resume file
      if (data.resume) {
        formData.append("resume", data.resume);
      }

      // Add job description (file or text)
      if (data.jobDescription) {
        formData.append("jobDescription", data.jobDescription);
      } else if (data.jobDescriptionText) {
        formData.append("jobDescriptionText", data.jobDescriptionText);
      }

      // Add optional fields
      if (data.jobTitle) {
        formData.append("jobTitle", data.jobTitle);
      }
      if (data.company) {
        formData.append("company", data.company);
      }

      const response = await api.post("/analysis/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Analysis failed",
        error: error.response?.data?.error,
      };
    }
  },

  /**
   * Get analysis history for current user
   */
  getHistory: async () => {
    try {
      const response = await api.get("/analysis/history");
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch history",
      };
    }
  },

  /**
   * Get specific analysis by ID
   * @param {string} id - Analysis ID
   */
  getAnalysisById: async (id) => {
    try {
      const response = await api.get(`/analysis/${id}`);
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch analysis",
      };
    }
  },
};

export default api;
