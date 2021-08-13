var express = require("express");
var router = express.Router();
var Income = require("../models/Income");
var moment = require("moment");
var Expense = require("../models/Expense");

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.user;
  let id = req.user._id;
  Income.find({ userId: id }, (err, incomes) => {
    if (err) return next(err);
    incomeSum = incomes.reduce((acc, cv) => {
      acc += cv.amount;
      return acc;
    }, 0);
    Expense.find({ userId: id }, (err, expenses) => {
      if (err) return next(err);
      expenseSum = expenses.reduce((acc, cv) => {
        acc += cv.amount;
        return acc;
      }, 0);
      let savings = incomeSum - expenseSum;
      res.render("dashboard", { user, incomes, expenses, savings });
    });
  });
});
router.get("/income/add", function (req, res, next) {
  res.render("incomeAdd");
});
router.post("/income/add", function (req, res, next) {
  let source = req.body.sources.split(",");
  source = source.map((item) => {
    return item.trim().toUpperCase();
  });
  req.body.sources = source;
  req.body.userId = req.user._id;
  Income.create(req.body, (err, income) => {
    res.redirect("/dashboard");
  });
});
router.get("/expense/add", function (req, res, next) {
  res.render("expenseAdd");
});
router.post("/expense/add", function (req, res, next) {
  let source = req.body.sources.split(",");
  source = source.map((item) => {
    return item.trim().toUpperCase();
  });
  console.log(source);
  req.body.sources = source;
  req.body.userId = req.user._id;
  Expense.create(req.body, (err, expense) => {
    if (err) return next(err);
    res.redirect("/dashboard");
  });
});

module.exports = router;
