const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// router.post("/register", registerUser);
// router.post("/login", loginUser);

const passport = require("passport");
const User = require("../models/User");


// Signup Route
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Log the user in automatically after registration
    passport.authenticate("local", { session: true }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json(info);

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ message: "User registered and logged in", user });
      });
    })(req, res, next);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Login Route (for manual login)
router.post("/login", passport.authenticate("local", { session: true }), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

module.exports = router;

