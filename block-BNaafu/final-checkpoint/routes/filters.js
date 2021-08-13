var express = require("express");
var router = express.Router();
var Income = require("../models/Income");
var moment = require("moment");
var Expense = require("../models/Expense");

router.post("/filter-1", (req, res, next) => {
  let user = req.user;
  let { from, to } = req.body;
  Income.find(
    {
      userId: req.user.id,
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    },
    (err, incomes) => {
      if (err) return next(err);
      Expense.find(
        {
          userId: req.user.id,
          date: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
        (err, expenses) => {
          if (err) return next(err);
          let sumOfExpenses = expenses.reduce(
            (acc, curr) => acc + Number(curr.amount),
            0
          );
          let sumOfIncomes = incomes.reduce(
            (acc, curr) => acc + Number(curr.amount),
            0
          );
          let savings = sumOfIncomes - sumOfExpenses;
          console.log(incomes, expenses);
          res.render("dashboard", { user, incomes, expenses, savings });
        }
      );
    }
  );
});
//filter by income source
router.post("/filter-2", (req, res, next) => {
  let user = req.user;
  let incomes = [];
  let { isource } = req.body;
  let savings = null;
  isource = isource.toUpperCase();
  Income.find({ userId: req.user.id }, (err, i) => {
    if (err) return next(err);
    i.forEach((income) => {
      income.sources.forEach((source) => {
        if (isource === source) {
          incomes.push(income);
        }
      });
    });
    Expense.find({ userId: req.user.id }, (err, expenses) => {
      if (err) return next(err);
      res.render("dashboard", { user, incomes, expenses, savings });
    });
  });
});
//filter by expense source
router.post("/filter-3", (req, res, next) => {
  let user = req.user;
  let expenses = [];
  let { esource } = req.body;
  let savings = null;
  esource = esource.toUpperCase();
  Expense.find({ userId: req.user.id }, (err, e) => {
    if (err) return next(err);
    e.forEach((expense) => {
      expense.sources.forEach((source) => {
        if (esource === source) {
          expenses.push(expense);
        }
      });
    });
    Income.find({ userId: req.user.id }, (err, incomes) => {
      if (err) return next(err);
      res.render("dashboard", { user, incomes, expenses, savings });
    });
  });
});
module.exports = router;
