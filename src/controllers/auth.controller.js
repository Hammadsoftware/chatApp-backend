import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Controller
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (user) {
      const { password, ...userData } = user.toObject();
      return res.status(201).json({ message: "User created successfully", user: userData });
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "7d" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info (without password)
    const { password: pwd, ...userData } = user.toObject();
    res.status(200).json({
      message: "Login successful",
      user: userData,
      token, // optional, for client-side storage if needed
    });
  // Update user online status
    user.online = true; // Set online status
    await user.save(); // Save updated user status
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logout Controller
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  // assuming user is authenticated and ID is in token
  const { username, email, _id, picture } = req.body;
  if (!username || !email || !_id) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username;
    user.email = email;
    if (picture) {
      user.profilePicture = picture; // <-- update the correct field!
    }
    const updatedUser = await user.save();
    const { password, ...userData } = updatedUser.toObject();
    res.status(200).json({ message: "Profile updated successfully", user: userData });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getAllUserProfile = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    if (!users) return res.status(404).json({ message: "No users found" });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
  export const getUsersForSidebar = async (req, res) => {
  try {
    const loginUser = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loginUser } });
    res.status(200).json(filterUser);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};