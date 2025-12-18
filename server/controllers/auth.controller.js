import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import emailService from "../services/emailService.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Required Details",
      });
    }

    const user_exists = await userModel.findOne({ email });

    if (user_exists) {
      return res.json({
        success: false,
        message: "User Registered Already, Try Logging in",
      });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashed_password,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        professionalTitle: user.professionalTitle || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        professionalTitle: user.professionalTitle || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const sendResetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Send password reset OTP email using dedicated template
    const emailResult = await emailService.sendPasswordResetOTP(
      email,
      otp,
      user.name
    );

    if (!emailResult.success) {
      return res.json({
        success: false,
        message: "Failed to send password reset email",
      });
    }

    return res.json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occurred, try again",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP is valid and not expired
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear OTP fields
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occurred, try again",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, professionalTitle, phone, location, linkedinUrl, userId } =
      req.body;

    // Validate required fields
    if (!name) {
      return res.json({
        success: false,
        message: "Name is required",
      });
    }

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found. Please login again.",
      });
    }

    // Find and update user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    user.name = name;
    user.professionalTitle = professionalTitle || "";
    user.phone = phone || "";
    user.location = location || "";
    user.linkedinUrl = linkedinUrl || "";

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        professionalTitle: user.professionalTitle,
        phone: user.phone,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Google OAuth callback handler
const googleCallback = async (req, res) => {
  try {
    // User is authenticated via Passport
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth?error=Authentication failed`
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to client with token and user data
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        professionalTitle: user.professionalTitle || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
      })
    );

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/google/success?token=${token}&user=${userData}`
    );
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/auth?error=${error.message}`
    );
  }
};

export {
  register,
  login,
  logout,
  sendResetPasswordOtp,
  resetPassword,
  updateProfile,
  googleCallback,
};
