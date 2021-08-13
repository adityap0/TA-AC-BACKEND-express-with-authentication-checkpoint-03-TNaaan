var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../models/User");

//GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: "e49705d7367dcabcd169",
      clientSecret: "58913e049df8061e48645204598deea0e88471c6",
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        country: profile._json.location,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            console.log(`added user`, addedUser);
            return done(null, addedUser);
          });
        }
        done(null, user);
      });
    }
  )
);
//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "950971237068-9e589q9eird0952grvrscfjngnndn758.apps.googleusercontent.com",
      clientSecret: "kAo2eLp5kgw2eGxIiHm93bU_",
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        }
        done(null, user);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, "name email", function (err, user) {
    done(err, user);
  });
});
