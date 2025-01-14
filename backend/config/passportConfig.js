const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = function (passport) {
  // Serialize user (to store user info in session)
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize user (to retrieve user info from session)
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Local Strategy for login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // Use email as the username field
      },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "No user found with that email" });
          }

          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }

          // If user is found and password matches, return user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
