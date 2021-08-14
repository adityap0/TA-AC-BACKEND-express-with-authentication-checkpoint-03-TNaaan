var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var moment = require("moment");

let incomeSchema = new Schema(
  {
    sources: { type: [String], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
incomeSchema.index({ sources: 1 });
incomeSchema.index({ date: 1 });

module.exports = mongoose.model("Income", incomeSchema);
