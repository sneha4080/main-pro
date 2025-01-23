
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"; // Importing JWT
import bcrypt from "bcrypt";
import { config } from "dotenv";


// Register User
export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword, mobilenumber, gender, address, city, pincode } = req.body;

  // Validate required fields
  const requiredFields = ["firstname", "lastname", "email", "password", "confirmPassword", "mobilenumber", "gender", "address", "city", "pincode"];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
  }

  // Validate passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate mobile number
  if (!/^\d{10}$/.test(mobilenumber)) {
    return res.status(400).json({ message: "Mobile number must be 10 digits" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword, // Store hashed password
      mobilenumber,
      gender,
      address,
      city,
      pincode,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_USER_PASSWORD || config.JWT_USER_PASSWORD, // Ensure the secret is correctly referenced
        { expiresIn: "7d" } // Token expires in 7 days
      );
  
      // Set token in cookie
      res.cookie("jwt", token, {
        httpOnly: true, // Prevent access from client-side scripts
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      // Send success response
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Error logging in user:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const logoutUser = (req, res) => {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  