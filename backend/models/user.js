const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Initialize dotenv for environment variables
dotenv.config();

// Connect to MongoDB (make sure to replace with your actual MongoDB URI)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON data

// User Schema (both admin and normal users)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Admin flag
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Route for normal user registration
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            email,
            password,
            // isAdmin will be false by default
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Route for admin registration
app.post("/register-admin", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const admin = new User({
            name,
            email,
            password,
            isAdmin: true, // Set isAdmin to true for admin users
        });

        await admin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering admin" });
    }
});

// Route for login (for both admin and normal users)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Route to check if the logged-in user is an admin
app.get("/admin-dashboard", async (req, res) => {
    const userId = req.query.userId; // In a real app, you would get the userId from a JWT or session

    try {
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ message: "Welcome to the admin dashboard" });
    } catch (err) {
        res.status(500).json({ message: "Error accessing admin dashboard" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


