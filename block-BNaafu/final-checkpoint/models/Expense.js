var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let expenseSchema = new Schema(
  {
    sources: { type: [String], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
expenseSchema.index({ sources: 1 });
expenseSchema.index({ date: 1 });
module.exports = mongoose.model("Expense", expenseSchema);
