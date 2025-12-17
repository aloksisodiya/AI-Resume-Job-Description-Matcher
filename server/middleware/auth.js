import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware function
const userAuth = async (req, res, next) => {
  // Check if cookies exist, if not, create empty object
  const cookies = req.cookies || {};
  const { token } = cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorised. Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // Fetch user from database to get complete user info including role
      const user = await userModel.findById(tokenDecode.id).select("-password");

      if (!user) {
        return res.json({
          success: false,
          message: "User not found. Please login again",
        });
      }

      // Set user info for both req.user (for role middleware) and req.body.userId (for controllers)
      req.user = user;
      req.body = req.body || {};
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorised. Login Again",
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
export { userAuth as authenticateToken };
