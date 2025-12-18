import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AnalysisResultsPage from "./pages/AnalysisResultsPage";
import ProfilePage from "./pages/ProfilePage";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/analysis-results" element={<AnalysisResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
