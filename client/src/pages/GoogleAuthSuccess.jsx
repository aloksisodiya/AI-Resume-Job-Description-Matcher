import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      navigate("/auth");
      return;
    }

    if (token && userData) {
      try {
        // Save token and user data
        localStorage.setItem("token", token);
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("user", JSON.stringify(user));

        // Update auth context if setUser is available
        if (setUser) {
          setUser(user);
        }

        toast.success("Successfully logged in with Google!");
        navigate("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/auth");
      }
    } else {
      toast.error("Authentication failed. Please try again.");
      navigate("/auth");
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-dark-blue flex items-center justify-center">
      <div className="text-white text-xl">Processing authentication...</div>
    </div>
  );
};

export default GoogleAuthSuccess;
