const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // if nt already loaded at entry pointconst User = require("../Models/User");
const sendEmail = require("../utils/sendMail");
const User = require("../Models/User");

//user signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can Login",
        success: false,
      });
    }
    const userModel = await User({ name, email, password, role });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      message: "Signup Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal Server error, ${error}`,
      success: false,
    });
  }
};

//user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({
        message: "User is not exist, please signup",
        success: false,
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(403).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Successfully",
      success: true,
      jwtToken,
      email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal Server error, ${error}`,
      success: false,
    });
  }
};
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User updated", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const emailBody = `<p>Hi ${user.name},</p>
             <p>You requested a password reset.</p>
             <p><a href="${resetLink}">Click here</a> to reset your password.</p>
             <p>If you did not request this, please ignore this email.</p>`;

    await sendEmail(
      "janashahid999@gmail.com",
      user.email,
      "Reset Your Password - JANADRIVE",
      emailBody
    );

    res.json({
      success: true,
      message: "Password Reset link sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid token" });
  }
};
module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
