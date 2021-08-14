var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  req.session.destroy();
  console.log(req.session);
  res.render("user-index");
});
router.get("/signup", function (req, res, next) {
  res.render("signup");
});
router.post("/signup", function (req, res, next) {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(user);
    res.redirect("/users/login");
  });
});
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post("/login", function (req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    console.log(`Email / Password is absent`);
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      console.log(`User not found !!`);
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        console.log(`Password incorrect !!`);
        return res.redirect("/users/login");
      }
      req.session.userId = user._id;
      res.redirect("/dashboard");
    });
  });
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
