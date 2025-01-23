
import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobilenumber: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: Number, required: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();

  userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
});

const User = mongoose.model("User", userSchema);

// Routes

// Register User
app.post("/signup", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    mobilenumber,
    gender,
    address,
    city,
    pincode,
  } = req.body;

  // Validate input fields
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !confirmPassword ||
    !mobilenumber ||
    !gender ||
    !address ||
    !city ||
    !pincode
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      firstname,
      lastname,
      email,
      password,
      mobilenumber,
      gender,
      address,
      city,
      pincode,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});


// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input fields
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Create JWT token
//     const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.firstname, // or `user.username` if you have it
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


export default User;
