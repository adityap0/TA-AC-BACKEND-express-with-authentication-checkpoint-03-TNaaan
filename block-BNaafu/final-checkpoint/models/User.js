var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  age: { type: Number, default: 22 },
  phone: { type: Number, default: 9650361738 },
  country: { type: String, default: "India" },
});
//encrypting password
userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 12, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      next();
    });
  } else {
    next();
  }
});
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
module.exports = mongoose.model("User", userSchema);
