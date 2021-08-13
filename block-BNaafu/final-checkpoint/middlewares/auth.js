var User = require("../models/User");
module.exports = {
  loggedInUser: (req, res, next) => {
    console.log(req.session, "in loggedInUser fn");
    if (req.session && req.session.userId) {
      next();
    } else if (req.session && req.session.passport) {
      console.log(req.session, "Here session is created by GitHub user");
      next();
    } else {
      res.redirect("/users/login");
    }
  },
  userInfo: (req, res, next) => {
    var userId =
      (req.session && req.session.userId) || req.session.passport.user;
    if (userId) {
      User.findById(userId, "name email", (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        console.log(req.user, "GitHub user details");
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
